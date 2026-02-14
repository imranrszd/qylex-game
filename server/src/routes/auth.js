const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db/pool');

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ bcrypt compare
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // log to terminal
    console.log("Login attempt:", { username: user.username, role: user.role });
    // ✅ send token + user info
    res.json({
      message: "Login success",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role.toUpperCase(),
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(error.status || 500).json({ message: "Server error" });
  }
});

module.exports = router;
