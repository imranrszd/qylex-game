const API_BASE = "http://localhost:5000/api";

export async function verifyAccount({ product_id, account_payload }) {
  const res = await fetch(`${API_BASE}/validate/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, account_payload }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to verify account");
  return json;
}