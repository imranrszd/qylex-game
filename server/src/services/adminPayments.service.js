const pool = require("../db/pool");

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
      `SELECT order_id, status FROM orders WHERE order_id=$1 FOR UPDATE`,
      [orderId]
    );
    if (ordRes.rows.length === 0) throw httpError(404, "Order not found");

    const current = ordRes.rows[0].status;

    // If already handled, just return
    if (["PAID", "CANCELLED", "FAILED", "REFUNDED", "COMPLETED"].includes(current)) {
      await client.query("COMMIT");
      return { order_id: orderId, status: current, already_done: true };
    }

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
    } else {
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
    }

    await client.query("COMMIT");
    return { order_id: orderId, status: action === "approve" ? "PAID" : "CANCELLED", already_done: false };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { setOrderPaymentStatus };
