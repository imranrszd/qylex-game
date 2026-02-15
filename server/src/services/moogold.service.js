const crypto = require("crypto");

const MOOGOLD_BASE = "https://moogold.com/wp-json/v1/api";

function makeBasicAuth(partnerId, secretKey) {
  const token = Buffer.from(`${partnerId}:${secretKey}`).toString("base64");
  return `Basic ${token}`;
}

function signRequest({ payloadString, timestamp, path, secretKey }) {
  // Per doc: hash_hmac('SHA256', Payload + Timestamp + Path, SECRET)
  const toSign = `${payloadString}${timestamp}${path}`;
  return crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");
}

async function productDetail(moogoldProductId) {
  const partnerId = process.env.MOOGOLD_PARTNER_ID;
  const secretKey = process.env.MOOGOLD_SECRET_KEY;

  if (!partnerId || !secretKey) {
    const err = new Error("MOOGOLD env not set (MOOGOLD_PARTNER_ID / MOOGOLD_SECRET_KEY)");
    err.status = 500;
    throw err;
  }

  const path = "product/product_detail";

  // Important: keep key order consistent (path first, then product_id)
  const body = { path, product_id: Number(moogoldProductId) };
  const payloadString = JSON.stringify(body); // no spaces by default
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const auth = signRequest({ payloadString, timestamp, path, secretKey });

  const res = await fetch(`${MOOGOLD_BASE}/${path}`, {
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
    const err = new Error(json?.message || "MooGold request failed");
    err.status = res.status;
    err.raw = json;
    throw err;
  }

  return json; // return full response first (senang debug)
}

function normalizeProductDetailToVariations(moogoldProductDetailJson) {
  // MooGold returns different key casing sometimes; handle both
  const variations = moogoldProductDetailJson?.Variation || moogoldProductDetailJson?.variation || [];

  return variations.map((v) => ({
    name: v.variation_name,
    provider_variation_id: String(v.variation_id),
    cost_price: Number(v.variation_price),
    stock_status: v.stock_status, // "instock" / "outofstock"
  }));
}

module.exports = { productDetail, normalizeProductDetailToVariations };
