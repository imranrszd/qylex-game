const express = require("express");
const { moogoldProductDetail } = require("../controllers/admin.suppliers.controller");

const router = express.Router();

// POST /api/admin/suppliers/moogold/product-detail
router.post("/moogold/product-detail", moogoldProductDetail);

module.exports = router;
