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

export async function getPackages() {
  const res = await fetch(`${API_BASE}/admin/packages`);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch packages");
  }

  return json.data;
}

// Create packages for a product
export async function createPackages(product_id, packages) {
  const res = await fetch(`${API_BASE}/admin/products/${product_id}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(packages),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to create packages");
  }

  alert("Packages added to database ✅");
  return json;
}

// Update packages for a product
export async function updatePackages(product_id, packages) {
  const res = await fetch(`${API_BASE}/admin/products/${product_id}/packages`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(packages),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to update packages");
  }

  alert("Packages updated successfully ✅");
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

// Dapatkan Product untuk admin sahaja
export async function getAdminProducts() {
  const res = await fetch(`${API_BASE}/admin/products`);
  const json = await res.json();
  return json.data;
}

// Untuk Dapatkan Pricelist dari supplier
export async function syncSupplierPriceCards(product_id, markup_percent) {
  const res = await fetch(`${API_BASE}/admin/products/${product_id}/sync-supplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markup_percent: Number(markup_percent) }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to sync supplier");
  return json;
}

export async function getProductPackages(product_id) {
  const res = await fetch(`${API_BASE}/admin/products/${product_id}/packages`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch packages");
  return json.data;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    // Note: Do NOT set Content-Type header here. 
    // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Upload failed");

  return json; // Will return { success: true, url: "/images/..." }
}