const axios = require("axios");
const crypto = require("crypto");

const pool = require("../db/pool");
const { sendOrderToTelegram  } = require("./telegram.service");

const MOO_BASE_URL = "https://moogold.com/wp-json/v1/api";
const PARTNER_ID = process.env.MOOGOLD_PARTNER_ID;
const SECRET_KEY = process.env.MOOGOLD_SECRET_KEY;

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

function safeJsonParse(value, fallback) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string") return value;
  const s = value.trim();
  if (!s) return fallback;
  return JSON.parse(s);
}

function pickContact(contactInfo) {
  const s = String(contactInfo || "").trim();
  if (!s) return { email: null, phone: null };
  if (s.includes("@")) return { email: s, phone: null };
  return { email: null, phone: s };
}

function buildPlayerId(accountPayload) {
  const userid = accountPayload?.userid ? String(accountPayload.userid) : "";
  const serverid = accountPayload?.serverid ? String(accountPayload.serverid) : "";
  if (userid && serverid) return `${userid} (${serverid})`;
  return userid || serverid || "UNKNOWN";
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function randomOrderCode() {
  // 8 chars from A-Z0-9 excluding confusing chars (O,0,I,1)
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = (n) =>
    Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");

  return `QX-${rand(4)}-${rand(4)}`;
}

exports.createOrder = async ({ body, file }) => {
  // -------------------------
  // 1) Validate input
  // -------------------------
  const productId = Number(body.product_id);
  if (!productId) throw httpError(400, "product_id is required");

  const accountPayload = safeJsonParse(body.account_payload, null);
  if (!accountPayload || typeof accountPayload !== "object") {
    throw httpError(400, "account_payload must be JSON object");
  }

  const cart = safeJsonParse(body.cart, []);
  if (!Array.isArray(cart) || cart.length === 0) {
    throw httpError(400, "cart must be non-empty JSON array");
  }

  if (!file) throw httpError(400, "receipt file is required (image/pdf)");

  const { email, phone } = pickContact(body.contact_info);
  if (!email && !phone) throw httpError(400, "contact_info is required (email or phone)");

  const normalizedCart = cart.map((x) => ({
    price_id: Number(x.price_id),
    qty: Number(x.qty),
  }));

  if (normalizedCart.some(i => !i.price_id || !Number.isFinite(i.qty) || i.qty <= 0)) {
    throw httpError(400, "cart items invalid (need price_id, qty > 0)");
  }

  // -------------------------
  // 2) DB Transaction
  // -------------------------
  const client = await pool.connect();
  let orderId;
  let amountDue;
  let product;
  let orderItemsPayload;

  try {
    await client.query("BEGIN");

    const prodRes = await client.query(
      `SELECT product_id, title FROM products WHERE product_id=$1 AND is_active=TRUE LIMIT 1`,
      [productId]
    );
    if (prodRes.rows.length === 0) throw httpError(404, "Product not found / inactive");
    product = prodRes.rows[0];

    const priceIds = normalizedCart.map(i => i.price_id);
    const uniquePriceIds = [...new Set(priceIds)];

    const priceRes = await client.query(
    `
    SELECT price_id, price, item_label
    FROM price_cards
    WHERE price_id = ANY($1::bigint[])
        AND product_id = $2
        AND is_active = TRUE
    `,
    [uniquePriceIds, productId]
    );

    const priceMap = new Map(priceRes.rows.map(r => [String(r.price_id), r]));

    // validate every cart line exists
    for (const it of normalizedCart) {
    if (!priceMap.has(String(it.price_id))) {
        throw httpError(400, "Some cart items invalid/inactive or not matching product");
    }
    }

    amountDue = 0;
    orderItemsPayload = normalizedCart.map((item) => {
      const p = priceMap.get(String(item.price_id));
      const unitPrice = parseFloat(p.price);
        if (!Number.isFinite(unitPrice)) throw httpError(500, "Invalid price in DB");
      const lineTotal = unitPrice * item.qty;
      amountDue += lineTotal;

      return {
        price_id: item.price_id,
        qty: item.qty,
        unit_price: unitPrice,
        line_total: Number(lineTotal.toFixed(2)),
        item_label: p.item_label || `price_id ${item.price_id}`,
      };
    });

    amountDue = Number(amountDue.toFixed(2));
    const playerId = buildPlayerId(accountPayload);

    const orderRes = await client.query(
      `
      INSERT INTO orders
        (user_id, player_id, customer_email, customer_phone, amount_due, currency, status, account_payload)
      VALUES
        (NULL, $1, $2, $3, $4, 'MYR', 'PENDING_PAYMENT', $5::jsonb)
      RETURNING order_id, status, created_at
      `,
      [playerId, email, phone, amountDue, JSON.stringify(accountPayload)]
    );

    orderId = orderRes.rows[0].order_id;

    let orderCode;
    for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = randomOrderCode();
    try {
        await client.query(
        `UPDATE orders SET order_code=$1 WHERE order_id=$2`,
        [candidate, orderId]
        );
        orderCode = candidate;
        break;
    } catch (e) {
        // 23505 = unique_violation
        if (e.code !== "23505") throw e;
    }
    }
    if (!orderCode) throw httpError(500, "Could not generate unique order code");

    for (const it of orderItemsPayload) {
      await client.query(
        `
        INSERT INTO order_items
          (order_id, price_id, qty, unit_price, line_total)
        VALUES
          ($1,$2,$3,$4,$5)
        `,
        [orderId, it.price_id, it.qty, it.unit_price, it.line_total]
      );
    }

    const payRes = await client.query(
      `
      INSERT INTO payments
        (order_id, gateway, amount, currency, status, payment_method, proof_url)
      VALUES
        ($1, 'manual', $2, 'MYR', 'PENDING', 'duitnow_qr', NULL)
      RETURNING payment_id, status
      `,
      [orderId, amountDue]
    );

    await client.query("COMMIT");

    // -------------------------
    // 3) Telegram send (after commit)
    // -------------------------
    const lines = [];
    lines.push(`<b>🧾 New Manual Order</b>`);
    lines.push(`Order ID: <b>${orderId}</b>`);
    lines.push(`Order Code: <b>${escapeHtml(orderCode)}</b>`);
    lines.push(`Product: <b>${escapeHtml(product.title)}</b>`);
    lines.push(`Player: <code>${escapeHtml(playerId)}</code>`);
    if (email) lines.push(`Email: <code>${escapeHtml(email)}</code>`);
    if (phone) lines.push(`Phone: <code>${escapeHtml(phone)}</code>`);
    lines.push(`Total: <b>RM ${amountDue.toFixed(2)}</b>`);
    lines.push("");
    lines.push(`<b>Items</b>`);
    for (const it of orderItemsPayload) {
      lines.push(`• ${escapeHtml(it.item_label)} x${it.qty} = RM ${it.line_total.toFixed(2)}`);
    }

    const inlineKeyboard = [
    [
        { text: "✅ Approve (Manual)", callback_data: `pay:approve:${orderId}` },
        { text: "✅ Approve (Auto)", callback_data: `pay:approve_auto:${orderId}` },
        { text: "❌ Reject",  callback_data: `pay:reject:${orderId}` },
    ]
    ];

    let tg = null;

    try {
    const tgMsg = await sendOrderToTelegram({
        text: lines.join("\n"),
        file,
        inlineKeyboard,
    });

    if (tgMsg?.message_id) {
        tg = { message_id: tgMsg.message_id };

        // Save telegram message id
        await pool.query(
        `UPDATE orders SET telegram_message_id=$1 WHERE order_id=$2`,
        [tgMsg.message_id, orderId]
        );

        // 🔥 SAVE ATTACHMENT METADATA HERE
        await pool.query(
        `
        INSERT INTO order_attachments
            (order_id, file_url, mime_type, original_name, file_size)
        VALUES
            ($1, $2, $3, $4, $5)
        `,
        [
            orderId,
            'telegram_only',        // you’re not storing locally
            file.mimetype,
            file.originalname,
            file.size
        ]
        );
    }

    } catch (e) {
    console.error("Telegram send failed:", e.message);
    }

    return {
      order_id: orderId,
      order_code: orderCode,
      amount_due: amountDue,
      payment: { payment_id: payRes.rows[0].payment_id, status: payRes.rows[0].status },
      telegram: tg,
    };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

exports.createSupplierOrder = async (payload) => {
  if (!payload?.category) throw httpError(400, "category is required");
  if (!payload?.product_id) throw httpError(400, "product_id is required");
  if (!payload?.quantity) throw httpError(400, "quantity is required");

  const path = "order/create_order";
  const timestamp = Math.floor(Date.now() / 1000);

  const body = {
    path,
    data: {
      category: Number(payload.category),
      "product-id": Number(payload.product_id),
      quantity: Number(payload.quantity),
      "User ID": String(payload.user_id || ""),
      Server: String(payload.server || ""),
    },
  };

  if (!PARTNER_ID || !SECRET_KEY) {
    throw httpError(500, "Supplier credentials not configured");
  }

  const basicAuth = Buffer.from(`${PARTNER_ID}:${SECRET_KEY}`).toString("base64");

  // IMPORTANT: MooGold requires EXACT string format
  const stringToSign = JSON.stringify(body) + timestamp + path;

  const authSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(stringToSign)
    .digest("hex");

  try {
    const response = await axios.post(
      `${MOO_BASE_URL}/${path}`,
      body,
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          auth: authSignature,
          timestamp: timestamp,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return response.data;

  } catch (error) {
    console.error("MooGold error:", error.response?.data || error.message);

    throw httpError(
      error.response?.status || 500,
      error.response?.data?.message || "MooGold API Error"
    );
  }
};
