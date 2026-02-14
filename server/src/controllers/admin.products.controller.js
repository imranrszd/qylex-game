const pool = require("../db/pool");

async function createProduct(req, res, next) {
  try {
    const {
      title,
      slug,
      image_url,
      publisher,
      category,
      type,
      platform
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ message: "title & slug wajib" });
    }

    const q = `
      INSERT INTO products (title, slug, image_url, publisher, category, type, platform, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE)
      RETURNING *;
    `;

    const values = [
      title.trim(),
      slug.trim(),
      image_url ?? null,
      publisher ?? null,
      category ?? "Game",
      type ?? "topup",
      platform ?? "mobile",
    ];

    const { rows } = await pool.query(q, values);
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "slug dah wujud" });
    }
    next(err);
  }
}

module.exports = { createProduct };
