const axios = require("axios")
const crypto = require("crypto");

const BASE_URL = "https://moogold.com/wp-json/v1/api";

function buildBasicAuth() {
    const raw = `${process.env.MOOGOLD_PARTNER_ID}:${process.env.MOOGOLD_SECRET_KEY}`;
    return Buffer.from(raw).toString("base64");
}

function signRequest(payloadString, timestamp, path) {
    // Signature: HMAC_SHA256(Payload + Timestamp + Path, SECRET)
    // as per docs :contentReference[oaicite:5]{index=5}
    const stringToSign = payloadString + String(timestamp) + path;

    return crypto
        .createHmac("sha256", process.env.MOOGOLD_SECRET_KEY)
        .update(stringToSign)
        .digest("hex");
}

function generateHeaders(path, payload) {
    const timestamp = Math.floor(Date.now() / 1000);
    const payloadString = JSON.stringify(payload);

    const stringToSign = payloadString + timestamp + path;

    const signature = crypto
        .createHmac("sha256", process.env.MOOGOLD_SECRET_KEY)
        .update(stringToSign)
        .digest("hex");

    const basicAuth = Buffer
        .from(`${process.env.MOOGOLD_PARTNER_ID}:${process.env.MOOGOLD_SECRET_KEY}`)
        .toString("base64");

    return {
    Authorization: `Basic ${basicAuth}`,
    auth: signature,
    timestamp: timestamp.toString(),
    "Content-Type": "application/json"
  };
}

async function moogoldPost(path, body) {
    const baseUrl = process.env.MOOGOLD_BASE_URL || "https://moogold.com/wp-json/v1/api";
    const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

    const timestamp = Math.floor(Date.now() / 1000);

    // IMPORTANT: payload string must match what you sign.
    // Keep object key order stable by constructing body in the final shape before stringify.
    const payloadString = JSON.stringify(body);

    const headers = {
        Authorization: `Basic ${buildBasicAuth()}`, // BasicAuth required :contentReference[oaicite:6]{index=6}
        auth: signRequest(payloadString, timestamp, body.path || path.replace(/^\//, "")), // auth header :contentReference[oaicite:7]{index=7}
        timestamp: String(timestamp), // timestamp header :contentReference[oaicite:8]{index=8}
        "Content-Type": "application/json",
    };

    const res = await axios.post(url, body, { headers, timeout: 30000 });
    return res.data;
}

async function createOrder({ category, variationId, quantity, userId, server, partnerOrderId }) {
    // Body schema based on create_order component:
    // path: order/create_order, data: { category, product-id, quantity, "User ID", "Server" } :contentReference[oaicite:9]{index=9}
    const body = {
        path: "order/create_order",
        data: {
        category,
        "product-id": variationId,
        quantity,
        "User ID": userId,
        ...(server ? { Server: server } : {}),
        },
        ...(partnerOrderId ? { partnerOrderId } : {}),
    };

    // Endpoint is /order/create_order :contentReference[oaicite:10]{index=10}
    return moogoldPost("/order/create_order", body);
}

module.exports = {createOrder};