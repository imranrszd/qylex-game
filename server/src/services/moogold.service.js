const crypto = require("crypto");

const MOOGOLD_BASE_URL = "https://moogold.com/wp-json/v1/api";

function makeBasicAuth(partnerId, secretKey) {
  const token = Buffer.from(`${partnerId}:${secretKey}`).toString("base64");
  return `Basic ${token}`;
}

function signRequest({ payloadString, timestamp, path, secretKey }) {
  // Doc: hash_hmac('SHA256', Payload + Timestamp + Path, SECRET)
  const toSign = `${payloadString}${timestamp}${path}`;
  return crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");
}

function getCreds() {
  const partnerId = process.env.MOOGOLD_PARTNER_ID;
  const secretKey = process.env.MOOGOLD_SECRET_KEY;


  if (!partnerId || !secretKey) {
    const err = new Error("MOOGOLD env not set (MOOGOLD_PARTNER_ID / MOOGOLD_SECRET_KEY)");
    err.status = 500;
    throw err;
  }

  return { partnerId, secretKey };
}

// Keep JSON deterministic to reduce signature mismatch risk
function stableStringify(obj) {
  const sorter = (x) => {
    if (Array.isArray(x)) return x.map(sorter);
    if (x && typeof x === "object") {
      return Object.keys(x)
        .sort()
        .reduce((acc, k) => {
          acc[k] = sorter(x[k]);
          return acc;
        }, {});
    }
    return x;
  };
  return JSON.stringify(sorter(obj));
}

async function moogoldPost(path, data) {
  const { partnerId, secretKey } = getCreds();

  const body = { path, ...data };
  const payloadString = stableStringify(body);
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const auth = signRequest({ payloadString, timestamp, path, secretKey });

  const res = await fetch(`${MOOGOLD_BASE_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: makeBasicAuth(partnerId, secretKey),
      timestamp,
      auth,
    },
    body: payloadString,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      json?.message ||
      json?.data?.err_message ||
      json?.data?.message ||
      "MooGold request failed";

    const err = new Error(msg);
    err.status = res.status;
    err.raw = json;
    throw err;
  }

  return json;
}

// ---- API wrappers ----

// Product detail (used to fetch variations)
async function productDetail(moogoldProductId) {
  const path = "product/product_detail";
  return moogoldPost(path, { product_id: Number(moogoldProductId) });
}

// Create order (used for Approve Auto)
async function createOrder({ variationId, quantity, fields = {} }) {
  const path = "order/create_order";

  // category: 1 = Direct Top Up (as per docs)
  const data = {
    category: 1,
    "product-id": Number(variationId),
    quantity: Number(quantity),
    ...fields, // dynamic fields: "User ID", "Server", etc.
  };

  return moogoldPost(path, data);
}

// Normalize variations list
function normalizeProductDetailToVariations(moogoldProductDetailJson) {
  const variations =
    moogoldProductDetailJson?.Variation ||
    moogoldProductDetailJson?.variation ||
    [];

  return variations.map((v) => ({
    item_label: v.variation_name,
    provider_variation_id: String(v.variation_id),
    cost_price: Number(v.variation_price),
    stock_status: v.stock_status,
  }));
}

module.exports = {
  productDetail,
  createOrder,
  normalizeProductDetailToVariations,
};
