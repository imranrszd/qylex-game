const express = require("express");
const router = express.Router();

const catalogController = require("../controllers/catalog.controller");

// GET /api/products
router.get("/products", catalogController.listProducts);

// GET /api/products/:slug
router.get("/products/:slug", catalogController.getProduct);

module.exports = router;
