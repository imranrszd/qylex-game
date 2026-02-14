const API_BASE = "http://localhost:5000/api";

export async function createProduct(data) {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to create product");
  }

alert("Product added to database ✅");
  return json;
}

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const json = await res.json();
  return json.data;
}

//update product
export async function updateProduct(product_id, data) {
  const res = await fetch(`${API_BASE}/admin/products/${product_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to update product");
  }

  alert("Product updated successfully ✅");
  return json;
}

//disable product
export async function disableProduct(product_id) {
  const res = await fetch(`${API_BASE}/admin/products/${product_id}/disable`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to disable product");

  alert("Product disabled ✅");
  return json;
}

//delete product
export async function deleteProduct(product_id) {
  const res = await fetch(`${API_BASE}/admin/products/${product_id}`, {
    method: "DELETE",
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete product");

  alert("Product deleted ✅");
  return json;
}

//enable product
export async function enableProduct(product_id) {
  const res = await fetch(`${API_BASE}/admin/products/${product_id}/enable`, {
    method: "PATCH",
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to enable product");

  return json;
}

export async function getAdminProducts() {
  const res = await fetch(`${API_BASE}/admin/products`);
  const json = await res.json();
  return json.data;
}
