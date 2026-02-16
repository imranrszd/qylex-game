const express = require("express");
const { verifyAccount } = require("../controllers/validate.controller");

const router = express.Router();

// POST /api/validate/mlbb
router.post("/verify", verifyAccount);

module.exports = router;
