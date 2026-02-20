const express = require('express');
const router = express.Router();
const adminProductsController = require('../controllers/adminProducts.controller');

// POST /api/admin/products/:productId/sync-supplier
router.post(
  '/products/:productId/sync-supplier',
  adminProductsController.syncSupplierPrices
);

module.exports = router;