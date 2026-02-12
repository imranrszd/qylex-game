require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json());

const productsRoutes = require("./routes/products.routes");

// serve uploaded proofs
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", ordersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", productsRoutes )

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", detail: err.message });
});

module.exports = app;