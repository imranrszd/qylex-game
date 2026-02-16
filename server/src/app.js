const express = require("express");
const cors = require("cors");
const path = require("path");

const ordersRoutes = require("./routes/orders.routes"); // semua api/order
const productsRoutes = require("./routes/products.routes"); // semua api/product
const adminRoutes = require("./routes/admin.routers"); // admin auth
const adminProductsRoutes = require("./routes/admin.products.routes"); // crud admin product
const adminSuppliersRoutes = require("./routes/admin.suppliers.routes");
const validateRoutes = require("./routes/validate.routes");
const adminPaymentsRoutes = require("./routes/admin.payments.routes");
const telegramRoutes = require("./routes/telegram.routes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // dah deploy tukar origin ke domain production
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// public
app.use("/api/orders", ordersRoutes); // kalau dalam route ada mcm router.post("/orders") dia akan jadi url mcmni /api/orders
app.use("/api", productsRoutes);
app.use("/api/validate", validateRoutes);
app.use("/api/telegram", telegramRoutes);

// admin
app.use("/api/admin", adminPaymentsRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/admin", adminProductsRoutes);
app.use("/api/admin/suppliers",adminSuppliersRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    message: err.message || "Server error",
  });
});

module.exports = app;
