const express = require("express");
const cors = require("cors");
const path = require("path");

const ordersRoutes = require("./routes/orders.routes"); // semua api/order
const productsRoutes = require("./routes/products.routes"); // semua api/product
const adminRoutes = require("./routes/admin.routers"); // admin auth
const adminProductsRoutes = require("./routes/admin.products.routes"); // crud admin product

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // dah deploy tukar origin ke domain production
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", ordersRoutes); // kalau dalam route ada mcm router.post("/orders") dia akan jadi url mcmni /api/orders
app.use("/api/admin", adminRoutes); 
app.use("/api", productsRoutes);
app.use("/api/admin", adminProductsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", detail: err.message });
});

module.exports = app;
