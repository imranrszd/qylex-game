const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

// GET /api/products
router.get("/products", productController.listProducts);

// GET /api/products/:slug
router.get("/products/:slug", productController.getProduct);

module.exports = router;
