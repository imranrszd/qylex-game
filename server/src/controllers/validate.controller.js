const strleya = require("../services/strleya.service");

async function validateMLBB(req, res, next) {
  try {
    const { userid, serverid } = req.body;
    if (!userid || !serverid) {
      return res.status(400).json({ message: "userid and serverid are required" });
    }

    const result = await strleya.checkIdMLBB({ userid, serverid });

    // normalize valid to boolean
    const isValid = String(result.valid).toLowerCase() === "valid";

    return res.status(200).json({
      data: {
        valid: isValid,
        name: result.name ?? null,
        region: result.region ?? null,
        raw: result,
      },
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message, error: err.raw });
    next(err);
  }
}

module.exports = { validateMLBB };
