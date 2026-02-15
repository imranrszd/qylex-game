const pool = require("../db/pool");

// GET /api/products
async function listProducts() {
  const { rows } = await pool.query(`
    SELECT product_id, title, slug, image_url, publisher, category, type, platform, is_active
    FROM products
    WHERE is_active = TRUE
    ORDER BY created_at DESC
  `);
  return rows;
}

// GET /api/products/:slug
async function getProductBySlug(slug) {
  const productRes = await pool.query(
    `
    SELECT product_id, title, slug, image_url, publisher, category, type, platform, is_active
    FROM products
    WHERE slug = $1 AND is_active = TRUE
    LIMIT 1
    `,
    [slug]
  );

  if (productRes.rows.length === 0) return null;

  const product = productRes.rows[0];

  const priceRes = await pool.query(
    `
    SELECT price_id, sku, item_amount, price, cost_price, provider, provider_category,
           provider_variation_id, requires_server, is_active
    FROM price_cards
    WHERE product_id = $1 AND is_active = TRUE
    ORDER BY price ASC
    `,
    [product.product_id]
  );

  return { ...product, price_cards: priceRes.rows };
}

async function createProduct(data) {
  const {
    title,
    slug,
    image_url = null,
    publisher,
    category,
    type,
    platform,
    is_active = true,
  } = data;

  if (!title || !slug || !publisher ) {
    const err = new Error("title, slug, publisher are required !");
    err.status = 400;
    throw err;
  }

  try {
    const {rows} = await pool.query(
      `
      INSERT INTO products (title, slug, image_url, publisher, category, type, platform, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING product_id, title, slug, image_url, publisher, category, type, platform, is_active
      `,
      [title, slug, image_url, publisher, category, type, platform, is_active]
    )

    return rows[0];
  } catch (err) {
    if (e.code === "23505") {
      const err = new Error("Slug already exists");
      err.status = 409;
      throw err;
    }
  }
  throw e;
}

async function updateProduct(id, data) {
  // First: check product exists
  const existingRes = await pool.query(
    `
    SELECT product_id, title, slug, image_url, publisher, category, type, platform, is_active
    FROM products
    WHERE product_id = $1
    LIMIT 1
    `,
    [id]
  );

  if (existingRes.rows.length === 0) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  const existing = existingRes.rows[0];

  // Keep old values if not provided (safe partial update)
  const updatedData = {
    title: data.title ?? existing.title,
    slug: data.slug ?? existing.slug,
    image_url: data.image_url ?? existing.image_url,
    publisher: data.publisher ?? existing.publisher,
    category: data.category ?? existing.category,
    type: data.type ?? existing.type,
    platform: data.platform ?? existing.platform,
    is_active: data.is_active ?? existing.is_active,
  };

  // Validate minimum fields (optional but recommended)
  if (!updatedData.title || !updatedData.slug || !updatedData.publisher) {
    const err = new Error("title, slug, publisher are required !");
    err.status = 400;
    throw err;
  }

  try {
    const { rows } = await pool.query(
      `
      UPDATE products
      SET title = $1,
          slug = $2,
          image_url = $3,
          publisher = $4,
          category = $5,
          type = $6,
          platform = $7,
          is_active = $8,
          updated_at = NOW()
      WHERE product_id = $9
      RETURNING product_id, title, slug, image_url, publisher, category, type, platform, is_active
      `,
      [
        updatedData.title,
        updatedData.slug,
        updatedData.image_url,
        updatedData.publisher,
        updatedData.category,
        updatedData.type,
        updatedData.platform,
        updatedData.is_active,
        id,
      ]
    );

    return rows[0];
  } catch (err) {
    if (err.code === "23505") {
      const e = new Error("Slug already exists");
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

async function disableProduct(id) {
  const { rows } = await pool.query(
    `
    UPDATE products
    SET is_active = FALSE,
        updated_at = NOW()
    WHERE product_id = $1
    RETURNING product_id, title, slug, image_url, publisher, category, type, platform, is_active
    `,
    [id]
  );

  if (rows.length === 0) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  return rows[0];
}

/**
 * DELETE /api/admin/products/:id
 * Permanent delete (only use if safe)
 */
async function deleteProduct(id) {
  const res = await pool.query(
    `
    DELETE FROM products
    WHERE product_id = $1
    `,
    [id]
  );

  if (res.rowCount === 0) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  return true;
}

async function enableProduct(id) {
  const { rows } = await pool.query(
    `
    UPDATE products
    SET is_active = TRUE,
        updated_at = NOW()
    WHERE product_id = $1
    RETURNING product_id, title, slug, image_url, publisher, category, type, platform, is_active
    `,
    [id]
  );

  if (rows.length === 0) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  return rows[0];
}

// list semua product sebab nak functionkan enable dgn disable
async function listAllProducts() {
  const { rows } = await pool.query(`
    SELECT product_id, title, slug, image_url, publisher, category, type, platform, is_active
    FROM products
    ORDER BY created_at DESC
  `);
  return rows;
}

module.exports = { listProducts, getProductBySlug, createProduct, updateProduct, disableProduct, deleteProduct, enableProduct, listAllProducts };
