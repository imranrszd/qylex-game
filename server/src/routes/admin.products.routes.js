const express = require("express");
const { createProduct, updateProduct, deleteProduct, disableProduct, enableProduct, listAllProductsAdmin, syncSupplierPriceCards, syncSupplier, listProductPackages, updateProductPackages } = require("../controllers/admin.products.controller");

const router = express.Router();

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.patch("/products/:id/disable", disableProduct);
router.patch("/products/:id/enable", enableProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products", listAllProductsAdmin);
router.post("/products/:id/sync-supplier", syncSupplierPriceCards);
router.get("/products/:id/packages", listProductPackages);
router.put("/products/:id/packages", updateProductPackages);


module.exports = router;