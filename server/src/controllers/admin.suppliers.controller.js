const moogoldService = require("../services/moogold.service");

async function moogoldProductDetail(req, res, next) {
  try {
    const { product_id } = req.body;

    const pid = Number(product_id);
    if (!pid || Number.isNaN(pid)) {
      return res.status(400).json({ message: "product_id is required (number)" });
    }

    const data = await moogoldService.productDetail(pid);
    return res.status(200).json({ data });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message, error: err.raw });
    }
    next(err);
  }
}

module.exports = { moogoldProductDetail };
