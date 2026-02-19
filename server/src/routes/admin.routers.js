const express = require("express");
const pool = require("../db/pool");
const { createOrder } = require("../services/moogold.service");

const router = express.Router();

function requireAdmin(req, res, next) {
    // MVP: simple header secret
    if (req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

// Approve payment -> call MooGold -> update statuses
router.post("/orders/:orderId/approve", requireAdmin, async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { orderId } = req.params;
        const { serverId } = req.body; // if needed by certain games (optional)

        await client.query("BEGIN");

        // Lock order row to prevent double-fulfillment
        const orderQ = await client.query(
        `SELECT o.order_id, o.status, o.player_id, o.price_id,
                pc.provider, pc.provider_category, pc.provider_variation_id, pc.requires_server
        FROM orders o
        JOIN price_cards pc ON pc.price_id = o.price_id
        WHERE o.order_id = $1
        FOR UPDATE`,
        [orderId]
        );

        if (orderQ.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order not found" });
        }

        const order = orderQ.rows[0];

        // Must have proof uploaded
        const payQ = await client.query(
        `SELECT * FROM payments WHERE order_id=$1 ORDER BY payment_id DESC LIMIT 1`,
        [orderId]
        );
        if (payQ.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Payment not found" });
        }
        const payment = payQ.rows[0];
        if (!payment.proof_url) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "No proof uploaded yet" });
        }
        if (payment.status === "PAID" || order.status !== "PENDING_PAYMENT") {
        // already processed (idempotent-ish)
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Order already processed or not in pending state" });
        }

        // Mark as paid
        await client.query(
        `UPDATE payments SET status='PAID', paid_at=NOW(), verified_at=NOW(), verified_by=NULL
        WHERE payment_id=$1`,
        [payment.payment_id]
        );
        await client.query(`UPDATE orders SET status='PAID' WHERE order_id=$1`, [orderId]);

        // If this price_card is MooGold provider, trigger fulfillment
        if (order.provider === "moogold") {
        await client.query(`UPDATE orders SET status='PROCESSING' WHERE order_id=$1`, [orderId]);

        // Create fulfillment row first (audit)
        const fIns = await client.query(
            `INSERT INTO order_fulfillments (order_id, provider_id, status, attempt_count, created_at, updated_at, request_payload)
            VALUES ($1, NULL, 'SENT', 1, NOW(), NOW(), $2)
            RETURNING fulfillment_id`,
           [orderId, JSON.stringify({ provider: "moogold", playerId: order.player_id, serverId })]
        );

        const partnerOrderId = `QYLX-${orderId}`; // helps prevent duplicates; supported in docs :contentReference[oaicite:11]{index=11}

        // Call MooGold create order: /order/create_order :contentReference[oaicite:12]{index=12}
        const mooRes = await createOrder({
        category: order.provider_category,
        variationId: order.provider_variation_id,
        quantity: 1,
        partnerOrderId,
        fields: {
            "User ID": String(order.player_id).trim(),
            ...(order.requires_server ? { Server: String(serverId || "").trim() } : {}),
        },
        });

        // Save provider response
        await client.query(
            `UPDATE order_fulfillments
            SET response_payload=$2, updated_at=NOW(),
                provider_order_ref = COALESCE(provider_order_ref, ($3))
            WHERE fulfillment_id=$1`,
            [
            fIns.rows[0].fulfillment_id,
            JSON.stringify(mooRes),
            mooRes?.account_details?.order_id ? String(mooRes.account_details.order_id) : null, // response includes order_id :contentReference[oaicite:16]{index=16}
            ]
        );

        if (mooRes?.status === true) {
            // MooGold created order successfully :contentReference[oaicite:17]{index=17}
            // NOTE: delivery might complete later via callback; for MVP, mark as PROCESSING and rely on callback/poll later.
            await client.query(`UPDATE orders SET status='PROCESSING' WHERE order_id=$1`, [orderId]);
        } else {
            await client.query(`UPDATE orders SET status='FAILED' WHERE order_id=$1`, [orderId]);
        }
        }

        await client.query("COMMIT");

        res.json({ message: "Approved. Fulfillment triggered (if provider mapped).", orderId });
    } catch (e) {
        await client.query("ROLLBACK");
        next(e);
    } finally {
        client.release();
    }
});

module.exports = router;