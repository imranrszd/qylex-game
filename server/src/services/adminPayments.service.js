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

    if (["PAID", "CANCELLED", "FAILED", "REFUNDED", "COMPLETED"].includes(current)) {
      await client.query("COMMIT");
      return { order_id: orderId, status: current, already_done: true };
    }

    // =========================
    // APPROVE AUTO (MooGold)
    // =========================
    if (action === "approve_auto") {
      // get items + mapping
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
        if (!it.provider_category) throw httpError(400, "Missing provider_category (1/2)");
        if (Number(it.qty) > 10) throw httpError(400, "MooGold max quantity is 10 per order");
      }

      const ap = order.account_payload || {};
      const fields = {};
      if (ap.userid) fields["User ID"] = String(ap.userid);

      // ikut product detail kau: "Server ID"
      if (ap.serverid) {
        fields["Server ID"] = String(ap.serverid);
        fields["Server"] = String(ap.serverid); // letak sekali to be safe
      }

      // IMPORTANT: jangan hold DB tx lama-lama semasa call supplier.
      // Strategy cepat: commit dulu, call supplier, then update statuses.
      await client.query("COMMIT");

      const supplierResults = [];
      for (const it of itemsRes.rows) {
        const partnerOrderId = `QX-${orderId}-${it.order_item_id}`; // idempotent-ish

        const resp = await createOrder({
          variationId: it.provider_variation_id,
          quantity: it.qty,
          category: it.provider_category,  // 1 / 2
          partnerOrderId,
          fields,
        });

        supplierResults.push(resp);

        // Optional: store each supplier order in order_fulfillments
        // (kalau nak cepat, boleh skip. Tapi table dah ada, rugi tak guna.)
        await pool.query(
          `INSERT INTO order_fulfillments
             (order_id, provider_id, provider_order_ref, status, attempt_count, last_attempt_at, request_payload, response_payload)
           VALUES
             ($1, (SELECT provider_id FROM providers WHERE name='moogold' LIMIT 1), $2, 'SUCCESS', 1, NOW(), $3, $4)`,
          [
            orderId,
            resp?.order_id ? String(resp.order_id) : null,
            JSON.stringify({
              variation_id: it.provider_variation_id,
              qty: it.qty,
              category: it.provider_category,
              fields,
              partnerOrderId,
            }),
            JSON.stringify(resp),
          ]
        );
      }

      // mark paid + processing
      await pool.query(
        `UPDATE payments
         SET status='PAID', paid_at=NOW(), verified_by=$2, verified_at=NOW()
         WHERE order_id=$1`,
        [orderId, verifiedBy]
      );

      await pool.query(`UPDATE orders SET status='PROCESSING' WHERE order_id=$1`, [orderId]);

      return { order_id: orderId, status: "PROCESSING", already_done: false, supplier_results: supplierResults };
    }

    // =========================
    // APPROVE MANUAL
    // =========================
    if (action === "approve") {
      await client.query(
        `
        UPDATE payments
        SET status='PAID',
            paid_at=NOW(),
            verified_by=$2,
            verified_at=NOW()
        WHERE order_id=$1
        `,
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
        `
        UPDATE payments
        SET status='FAILED',
            verified_by=$2,
            verified_at=NOW()
        WHERE order_id=$1
        `,
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
