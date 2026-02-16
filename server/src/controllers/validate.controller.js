const crypto = require("crypto");
const pool = require("../db/pool"); // adjust import to your pool path
const strleya = require("../services/strleya.service");

async function verifyAccount(req, res, next) {
  try {
    const { product_id, account_payload } = req.body || {};
    if (!product_id || !account_payload) {
      return res.status(400).json({ message: "product_id and account_payload are required" });
    }

    // 1) read product config
    const p = await pool.query(
      `SELECT product_id, requires_validation, validation_provider, validation_game_code
       FROM products WHERE product_id = $1 LIMIT 1`,
      [product_id]
    );
    if (!p.rows.length) return res.status(404).json({ message: "Product not found" });

    const product = p.rows[0];
    const required = !!product.requires_validation;

    // 2) always mint token (even if not required)
    const token = `v_${crypto.randomUUID().replaceAll("-", "")}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let valid = true;
    let name = null;
    let region = null;
    let raw = null;

    if (required) {
      if (String(product.validation_provider || "").toLowerCase() !== "strleya") {
        return res.status(400).json({ message: "Unsupported validation provider" });
      }

      const gameCode = product.validation_game_code;
      if (!gameCode) return res.status(400).json({ message: "validation_game_code not set for this product" });

      const userid = account_payload.userid || account_payload.userId;
      const serverid = account_payload.serverid || account_payload.zoneId;

      if (!userid || !serverid) {
        return res.status(400).json({ message: "userid and serverid are required for this product" });
      }

      raw = await strleya.checkId({ game: gameCode, userid, serverid });
      valid = String(raw.valid).toLowerCase() === "valid";
      name = raw.name ?? null;
      region = raw.region ?? null;

      if (!valid) {
        return res.status(200).json({
          data: { required, valid: false, name, region, raw }
        });
      }
    }

    // 3) save verification
    await pool.query(
      `INSERT INTO account_verifications (product_id, token, account_payload, verified_name, expires_at)
       VALUES ($1,$2,$3,$4,$5)`,
      [product.product_id, token, account_payload, name, expiresAt]
    );

    return res.status(200).json({
      data: {
        required,
        valid,
        name,
        region,
        verification_token: token,
        expires_at: expiresAt,
        raw,
      },
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message, error: err.raw });
    next(err);
  }
}

module.exports = { verifyAccount };
