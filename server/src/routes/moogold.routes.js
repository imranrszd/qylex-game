const express = require("express");
const router = express.Router();
const { createOrderDirect } = require("../controllers/moogold.controller");

// TODO: letak middleware admin auth kat sini
// router.use(requireAdmin);

router.post("/create-order", createOrderDirect);

module.exports = router;
