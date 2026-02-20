const express = require("express");
const router = express.Router();
const { createOrderDirect } = require("../controllers/moogold.controller");
const { productDetail, normalizeProductDetailToVariations } = require("../services/moogold.service");

// TODO: letak middleware admin auth kat sini
// router.use(requireAdmin);

router.post("/create-order", createOrderDirect);

router.get("/product/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const raw = await productDetail(id);
    const variations = normalizeProductDetailToVariations(raw);

    return res.json({
      product_id: id,
      variations,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
