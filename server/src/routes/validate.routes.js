const express = require("express");
const { validateMLBB } = require("../controllers/validate.controller");

const router = express.Router();

// POST /api/validate/mlbb
router.post("/mlbb", validateMLBB);

module.exports = router;
