const pool = require("../db/pool");
const { createOrder } = require("./moogold.service");

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

async function setOrderPaymentStatus({ orderId, action, verifiedBy = null }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const ordRes = await client.query(
      `SELECT order_id, status, account_payload
       FROM orders
       WHERE order_id=$1
       FOR UPDATE`,
      [orderId]
    );
    if (ordRes.rows.length === 0) throw httpError(404, "Order not found");

    const order = ordRes.rows[0];
    const current = order.status;

    // ✅ Stop duplicate runs (especially approve_auto retries)
    if (["PAID", "PROCESSING", "CANCELLED", "FAILED", "REFUNDED", "COMPLETED"].includes(current)) {
      await client.query("COMMIT");
      return { order_id: orderId, status: current, already_done: true };
    }

    // =========================
    // APPROVE AUTO (MooGold)
    // =========================
    if (action === "approve_auto") {
      const itemsRes = await client.query(
        `SELECT
          oi.order_item_id,
          oi.qty,
          pc.provider,
          pc.provider_category,
          pc.provider_variation_id
        FROM order_items oi
        JOIN price_cards pc ON pc.price_id = oi.price_id
        WHERE oi.order_id=$1
        ORDER BY oi.order_item_id ASC`,
        [orderId]
      );

      if (!itemsRes.rows.length) throw httpError(400, "Order has no items");

      // validate mapping
      for (const it of itemsRes.rows) {
        if (it.provider !== "moogold") throw httpError(400, "approve_auto only supports MooGold items");
        if (!it.provider_variation_id) throw httpError(400, "Missing provider_variation_id");
        if (!it.provider_category) it.provider_category = 1;
        if (Number(it.qty) > 20) throw httpError(400, "MooGold max quantity is 20 per order");
      }

      // Build MooGold required fields
        const ap = order.account_payload || {};
        const fields = {};
        if (ap.userid) fields["User ID"] = String(ap.userid);
        if (ap.serverid) {
          fields["Server ID"] = String(ap.serverid);
          fields["Server"] = String(ap.serverid);
        }

    
      // ✅ Reserve order state BEFORE releasing lock
      await client.query(
        `UPDATE payments
         SET status='PAID', paid_at=NOW(), verified_by=$2, verified_at=NOW()
         WHERE order_id=$1`,
        [orderId, verifiedBy]
      );

      await client.query(`UPDATE orders SET status='PROCESSING' WHERE order_id=$1`, [orderId]);

      await client.query("COMMIT"); // release lock fast

      const supplierResults = [];

      // Process each order_item once (idempotent via unique partner_order_id)
      for (const it of itemsRes.rows) {
        const qty = Number(it.qty) || 0;
        if (qty <= 0) continue;

        for (let unit = 1; unit <= qty; unit++) {
          const partnerOrderId = `QX-${orderId}-${it.order_item_id}-${unit}`;

          const ins = await pool.query(
            `INSERT INTO order_fulfillments
              (order_id, partner_order_id, provider_id, status, attempt_count, last_attempt_at, request_payload)
            VALUES
              ($1, $2, NULL, 'SENT', 1, NOW(), $3)
            ON CONFLICT (partner_order_id) DO NOTHING
            RETURNING fulfillment_id`,
            [
              orderId,
              partnerOrderId,
              JSON.stringify({
                provider: "moogold",
                variation_id: it.provider_variation_id,
                qty: 1,
                unit,
                original_qty: qty,
                category: it.provider_category,
                fields,
                partnerOrderId,
              }),
            ]
          );

          if (ins.rowCount === 0) {
            await pool.query(
              `UPDATE order_fulfillments
              SET attempt_count = attempt_count + 1,
                  last_attempt_at = NOW()
              WHERE partner_order_id=$1`,
              [partnerOrderId]
            );

            supplierResults.push({ skipped: true, partnerOrderId, reason: "DUPLICATE_PARTNER_ORDER_ID" });
            continue;
          }

            const fulfillmentId = ins.rows[0].fulfillment_id;

            try {
            const resp = await createOrder({
              variationId: it.provider_variation_id,
              quantity: 1,
              category: it.provider_category,
              partnerOrderId,
              fields,
            });

            supplierResults.push(resp);

            const ok =
              resp?.status === true ||
              resp?.status === "processing" ||
              resp?.status === "completed";

            await pool.query(
              `UPDATE order_fulfillments
              SET provider_order_ref=$2,
                  status=$3,
                  response_payload=$4,
                  last_attempt_at=NOW()
              WHERE fulfillment_id=$1`,
              [
                fulfillmentId,
                resp?.order_id ? String(resp.order_id) : null,
                ok ? "SUCCESS" : "FAILED",
                JSON.stringify(resp),
              ]
            );
          } catch (err) {
            await pool.query(
              `UPDATE order_fulfillments
              SET status='FAILED',
                  response_payload=$2,
                  last_attempt_at=NOW()
              WHERE fulfillment_id=$1`,
              [fulfillmentId, JSON.stringify({ message: err.message, raw: err.raw || null })]
            );

            supplierResults.push({ partnerOrderId, error: err.message });
          }
        }
      }

      return { order_id: orderId, status: "PROCESSING", already_done: false, supplier_results: supplierResults };
    }

    // =========================
    // APPROVE MANUAL
    // =========================
    if (action === "approve") {
      await client.query(
        `UPDATE payments
         SET status='PAID',
             paid_at=NOW(),
             verified_by=$2,
             verified_at=NOW()
         WHERE order_id=$1`,
        [orderId, verifiedBy]
      );

      await client.query(`UPDATE orders SET status='PAID' WHERE order_id=$1`, [orderId]);
      await client.query("COMMIT");
      return { order_id: orderId, status: "PAID", already_done: false };
    }

    // =========================
    // REJECT
    // =========================
    if (action === "reject") {
      await client.query(
        `UPDATE payments
         SET status='FAILED',
             verified_by=$2,
             verified_at=NOW()
         WHERE order_id=$1`,
        [orderId, verifiedBy]
      );

      await client.query(`UPDATE orders SET status='CANCELLED' WHERE order_id=$1`, [orderId]);
      await client.query("COMMIT");
      return { order_id: orderId, status: "CANCELLED", already_done: false };
    }

    throw httpError(400, "Invalid action");
  } catch (e) {
    try { await client.query("ROLLBACK"); } catch {}
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { setOrderPaymentStatus };
