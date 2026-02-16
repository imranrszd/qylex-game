const API_BASE = "http://localhost:5000/api";

export async function getProductBySlug(slug) {
  const res = await fetch(`${API_BASE}/products/${slug}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch product");
  return json.data;
}