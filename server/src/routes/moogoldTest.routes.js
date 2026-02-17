const express = require("express");
const router = express.Router();
const { testCreateOrder } = require("../controllers/moogoldTest.controller");

// TEMP TEST ROUTE (remove later)
router.post("/create-order", testCreateOrder);

module.exports = router;
