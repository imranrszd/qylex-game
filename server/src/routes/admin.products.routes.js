const express = require("express");
const { createProduct, updateProduct, deleteProduct, disableProduct, enableProduct, listAllProductsAdmin } = require("../controllers/admin.products.controller");

const router = express.Router();

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.patch("/products/:id/disable", disableProduct);
router.patch("/products/:id/enable", enableProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products", listAllProductsAdmin);

module.exports = router;