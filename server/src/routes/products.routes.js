const express = require("express")
const pool = require("../db/pool")

const router = express.Router();

router.get("/products", async (req, res, next) => {
  try {
    const q = await pool.query(`
      SELECT
        product_id,
        title AS name,
        image_url AS image,
        'Qylex'::text AS publisher,
        'Game'::text AS category,
        'topup'::text AS type,
        'mobile'::text AS platform,
        slug
      FROM products
      WHERE is_active = true
      ORDER BY created_at DESC
    `);

    res.json(q.rows);
  } catch (e) {
    next(e);
  }
});

module.exports = router;