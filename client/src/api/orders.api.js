const API_BASE = "http://localhost:5000/api";

async function parseJsonSafe(res) {
  const text = await res.text(); // read once
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response. HTTP ${res.status}. Body: ${text.slice(0, 200)}`);
  }
}

export async function createOrder({
  product_id,
  account_payload,
  cart,
  contact_info,
  receiptFile,
}) {
  const fd = new FormData();
  fd.append("product_id", String(product_id));
  fd.append("account_payload", JSON.stringify(account_payload));
  fd.append("cart", JSON.stringify(cart)); 
  fd.append("contact_info", contact_info);
  fd.append("receipt", receiptFile); 

  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    body: fd, 
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    throw new Error(json?.message || `Order failed (HTTP ${res.status})`);
  }

  return json;
}
