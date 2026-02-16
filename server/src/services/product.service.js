const pool = require("../db/pool");
const { productDetail, normalizeProductDetailToVariations } = require("./moogold.service");

// GET /api/products
async function listProducts() {
  const { rows } = await pool.query(`
    SELECT product_id, title, slug, image_url, publisher, category, type, platform, provider, provider_product_id, is_active
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
    provider = null,
    provider_product_id = null,
    is_active = true,
  } = data;

  if (!title || !slug || !publisher) {
    const e = new Error("title, slug, publisher are required !");
    e.status = 400;
    throw e;
  }

  try {

    const { rows } = await pool.query(
      `
      INSERT INTO products
        (title, slug, image_url, publisher, category, type, platform, provider, provider_product_id, is_active)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING
        product_id, title, slug, image_url, publisher, category, type, platform, provider, provider_product_id, is_active
      `,
      [title, slug, image_url, publisher, category, type, platform, provider, provider_product_id, is_active]
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

async function updateProduct(id, data) {
  const existingRes = await pool.query(
    `
    SELECT product_id, title, slug, image_url, publisher, category, type, platform,
           provider, provider_product_id, is_active
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

  const updatedData = {
    title: data.title ?? existing.title,
    slug: data.slug ?? existing.slug,
    image_url: data.image_url ?? existing.image_url,
    publisher: data.publisher ?? existing.publisher,
    category: data.category ?? existing.category,
    type: data.type ?? existing.type,
    platform: data.platform ?? existing.platform,
    provider: data.provider ?? existing.provider,
    provider_product_id: data.provider_product_id ?? existing.provider_product_id,

    is_active: data.is_active ?? existing.is_active,
  };

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
          provider = $8,
          provider_product_id = $9,
          is_active = $10,
          updated_at = NOW()
      WHERE product_id = $11
      RETURNING product_id, title, slug, image_url, publisher, category, type, platform,
                provider, provider_product_id, is_active
      `,
      [
        updatedData.title,
        updatedData.slug,
        updatedData.image_url,
        updatedData.publisher,
        updatedData.category,
        updatedData.type,
        updatedData.platform,
        updatedData.provider,
        updatedData.provider_product_id,
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
    SELECT product_id, title, slug, image_url, publisher, category, type, platform, provider, provider_product_id, is_active
    FROM products
    ORDER BY created_at DESC
  `);
  return rows;
}


// Setup Price Card
function extractItemAmount(name) {

  const m = String(name).match(/\d+/);
  return m ? parseInt(m[0], 10) : 1;
}

function calcSellingPrice(costPrice, markupPercent) {
  const cost = Number(costPrice || 0);
  const pct = Math.max(0, Number(markupPercent ?? 0));
  const selling = cost * (1 + pct / 100);
  return Number(selling.toFixed(2));
}

async function upsertPriceCard(productId, provider, variation, opts = {}) {
  const markupPercent = Number.isFinite(Number(opts.markupPercent))
    ? Number(opts.markupPercent)
    : 20;

  const existing = await pool.query(
    `
    SELECT price_id
    FROM price_cards
    WHERE product_id = $1
      AND provider = $2
      AND provider_variation_id = $3
    LIMIT 1
    `,
    [productId, provider, variation.provider_variation_id]
  );

  // ✅ UPDATE supplier fields only (protect manual price/original_price)
  if (existing.rows.length > 0) {
    const existingPriceId = existing.rows[0].price_id;

    const sellingPrice = calcSellingPrice(variation.cost_price, markupPercent);

    const { rows } = await pool.query(
      `
        UPDATE price_cards
        SET cost_price = $1,
            price = $2,
            is_active = $3,
            item_label = $4,
            updated_at = NOW()
        WHERE price_id = $5
        RETURNING *
        `,
      [
        Number(variation.cost_price),
        sellingPrice,
        variation.stock_status === "instock",
        variation.name,
        existingPriceId,
      ]
    );

    return { row: rows[0], action: "updated" };
  }

  // INSERT new variation (apply markup on first sync)
  const itemAmount = extractItemAmount(variation.name);
  const sellingPrice = calcSellingPrice(variation.cost_price, markupPercent);

  const { rows } = await pool.query(
    `
    INSERT INTO price_cards
      (product_id, sku, item_amount, item_label, price, original_price, cost_price,
       provider, provider_variation_id, is_active)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
    `,
    [
      productId,
      `${provider}_${variation.provider_variation_id}`, // safer SKU
      itemAmount,
      variation.name,
      sellingPrice,
      null,
      Number(variation.cost_price),
      provider,
      variation.provider_variation_id,
      variation.stock_status === "instock",
    ]
  );

  return { row: rows[0], action: "inserted" };
}

async function syncSupplierPriceCards(productId, opts = {}) {
  const productRes = await pool.query(
    `SELECT product_id, provider, provider_product_id 
     FROM products 
     WHERE product_id = $1 
     LIMIT 1`,
    [productId]
  );

  if (productRes.rows.length === 0) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  const product = productRes.rows[0];

  if (!product.provider || !product.provider_product_id) {
    const err = new Error("Supplier not configured (provider/provider_product_id missing)");
    err.status = 400;
    throw err;
  }

  const markupPercent = Number.isFinite(Number(opts.markup_percent))
    ? Number(opts.markup_percent)
    : 20;

  const preview = Boolean(opts.preview);   // ✅ get preview flag

  const provider = String(product.provider).toLowerCase();

  let variations = [];

  if (provider === "moogold") {
    const raw = await productDetail(product.provider_product_id);
    variations = normalizeProductDetailToVariations(raw);
  } else {
    const err = new Error(`Unsupported provider: ${product.provider}`);
    err.status = 400;
    throw err;
  }

  // ✅ BUILD preview rows (calculate markup but DO NOT write)
  const previewRows = variations.map(v => {
    const cost = Number(v.cost_price || 0);
    const price = cost + (cost * (markupPercent / 100));

    return {
      product_id: product.product_id,
      provider,
      sku: v.sku,
      item_label: v.item_label,
      cost_price: cost,
      price: price,
      original_price: price,
      provider_variation_id: v.provider_variation_id,
      is_active: true
    };
  });

  // 🚨 STOP HERE if preview
  if (preview) {
    return previewRows;
  }

  // ✅ REAL SAVE MODE
  const results = { inserted: 0, updated: 0, total: variations.length };

  for (const v of variations) {
    const r = await upsertPriceCard(product.product_id, provider, v, { markupPercent });
    if (r.action === "inserted") results.inserted += 1;
    if (r.action === "updated") results.updated += 1;
  }

  return results;
}


// nak hantar pricelist untuk product 
async function listProductPackages(productId) {
  const { rows } = await pool.query(
    `
    SELECT
      price_id,
      sku,
      item_amount,
      item_label,
      price,
      original_price,
      cost_price,
      provider,
      provider_variation_id,
      is_active
    FROM price_cards
    WHERE product_id = $1
    ORDER BY price ASC NULLS LAST
    `,
    [productId]
  );
  return rows;
}

// nak update
async function updateProductPackages(productId, packages) {
  // Ensure product exists
  const p = await pool.query(
    `SELECT product_id FROM products WHERE product_id = $1`,
    [productId]
  );

  if (p.rows.length === 0) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  const results = { inserted: 0, updated: 0, total: packages.length };

  for (const pkg of packages) {
    const rawId = pkg.price_id ?? pkg.priceId ?? pkg.id ?? null;
    const priceId = rawId && !isNaN(rawId) ? Number(rawId) : null;

    const payload = {
      sku: pkg.sku ?? null,
      item_amount: Number.isFinite(Number(pkg.item_amount))
        ? Number(pkg.item_amount)
        : 1,
      item_label: pkg.item_label ?? pkg.name ?? null,
      price: Number(pkg.price ?? 0),
      original_price: Number(pkg.original_price ?? pkg.original ?? 0),
      cost_price: Number(pkg.cost_price ?? 0),
      provider: pkg.provider ?? null,
      provider_variation_id: pkg.provider_variation_id ?? null,
      is_active: pkg.is_active !== false,
    };

    // ================= UPDATE BY ID =================
    if (priceId) {
      const { rowCount } = await pool.query(
        `
      UPDATE price_cards
      SET sku = $1,
          item_amount = $2,
          item_label = $3,
          price = $4,
          original_price = $5,
          cost_price = $6,
          is_active = $7,
          updated_at = NOW()
      WHERE price_id = $8 AND product_id = $9
      `,
        [
          payload.sku,
          payload.item_amount,
          payload.item_label,
          payload.price,
          payload.original_price,
          payload.cost_price,
          payload.is_active,
          priceId,
          productId,
        ]
      );

      if (rowCount > 0) {
        results.updated += 1;
        continue;
      }
    }

    // ================= UPDATE BY SKU =================
    if (payload.sku) {
      const { rowCount } = await pool.query(
        `
      UPDATE price_cards
      SET item_amount = $1,
          item_label = $2,
          price = $3,
          original_price = $4,
          cost_price = $5,
          is_active = $6,
          updated_at = NOW()
      WHERE sku = $7 AND product_id = $8
      `,
        [
          payload.item_amount,
          payload.item_label,
          payload.price,
          payload.original_price,
          payload.cost_price,
          payload.is_active,
          payload.sku,
          productId,
        ]
      );

      if (rowCount > 0) {
        results.updated += 1;
        continue;
      }
    }

    // ================= INSERT =================
    await pool.query(
      `
    INSERT INTO price_cards
      (product_id, sku, item_amount, item_label, price, original_price,
       cost_price, provider, provider_variation_id, is_active)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `,
      [
        productId,
        payload.sku,
        payload.item_amount,
        payload.item_label,
        payload.price,
        payload.original_price,
        payload.cost_price,
        payload.provider,
        payload.provider_variation_id,
        payload.is_active,
      ]
    );

    results.inserted += 1;
  }


  return results;
}


module.exports = { listProducts, getProductBySlug, createProduct, updateProduct, disableProduct, deleteProduct, enableProduct, listAllProducts, syncSupplierPriceCards, upsertPriceCard, listProductPackages, updateProductPackages };
