const express = require("express");
const controller = require("../controllers/adminPayments.controller");

const router = express.Router();

// POST /api/admin/orders/:orderId/verify
router.post("/orders/:orderId/verify", controller.verifyManualPayment);

module.exports = router;
