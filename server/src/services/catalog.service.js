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

module.exports = { listProducts, getProductBySlug };
