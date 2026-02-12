const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../db/pool");
const { sendPaymentProofToTelegram } = require("../services/telegram.service");

const router = express.Router();

// ---- Multer setup (local storage) ----
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(process.cwd(), "uploads", "payment-proofs")),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt = [".png", ".jpg", ".jpeg", ".webp"].includes(ext) ? ext : ".jpg";
        cb(null, `order_${req.params.orderId}_${Date.now()}${safeExt}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const ok = ["image/png", "image/jpeg", "image/webp"].includes(file.mimetype);
        cb(ok ? null : new Error("Only PNG/JPG/WEBP allowed"), ok);
    },
});

// 1) Create order (guest checkout)
router.post("/orders", async (req, res, next) => {
    try {
        const { priceId, playerId, email, phone } = req.body;

        if (!priceId || !playerId) return res.status(400).json({ message: "priceId and playerId required" });
        if (!email && !phone) return res.status(400).json({ message: "email or phone number required" });

        // Get price snapshot from DB (never trust frontend)
        const priceRow = await pool.query(
        "SELECT price, provider, provider_category, provider_variation_id, requires_server FROM price_cards WHERE price_id=$1 AND is_active=true",
        [priceId]
        );

        if (priceRow.rowCount === 0) return res.status(404).json({ message: "Invalid priceId" });

        const { price } = priceRow.rows[0];

        // Create order
        const orderIns = await pool.query(
        `INSERT INTO orders (user_id, price_id, player_id, customer_email, customer_phone, amount_due, currency, status)
        VALUES (NULL, $1, $2, $3, $4, $5, 'MYR', 'PENDING_PAYMENT')
        RETURNING order_id, amount_due, currency, status`,
        [priceId, playerId, email || null, phone || null, price]
        );

        const order = orderIns.rows[0];

        // Create payment row (manual)
        await pool.query(
        `INSERT INTO payments (order_id, gateway, amount, currency, status, payment_method)
        VALUES ($1, 'manual', $2, $3, 'CREATED', 'BANK_TRANSFER')`,
        [order.order_id, order.amount_due, order.currency]
        );

        res.json({
        orderId: order.order_id,
        amountDue: order.amount_due,
        currency: order.currency,
        status: order.status,
        next: {
            uploadProofUrl: `/api/orders/${order.order_id}/payment-proof`,
        },
        });
    } catch (e) {
        next(e);
    }
});

// 2) Upload payment screenshot (customer)
router.post("/orders/:orderId/payment-proof", upload.single("proof"), async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { payerName, referenceNo } = req.body;

        if (!req.file) return res.status(400).json({ message: "proof image required" });

        const proofUrl = `/uploads/payment-proofs/${req.file.filename}`;

        // Mark payment pending verification + attach proof
        const payUp = await pool.query(
        `UPDATE payments
        SET status='PENDING_PAYMENT', proof_url=$2, payer_name=$3, reference_no=$4
        WHERE order_id=$1
        RETURNING payment_id, status, proof_url`,
        [orderId, proofUrl, payerName || null, referenceNo || null]
        );

        if (payUp.rowCount === 0) return res.status(404).json({ message: "Payment record not found for order" });

        // Get order details for caption
        const orderQ = await pool.query(
        `SELECT order_id, amount_due, player_id, customer_phone, customer_email
        FROM orders WHERE order_id=$1`,
        [orderId]
        );

        if (orderQ.rowCount === 0) return res.status(404).json({ message: "Order not found" });

        const order = orderQ.rows[0];

        // Send to Telegram group (non-blocking)
        try {
        await sendPaymentProofToTelegram({
            orderId: order.order_id,
            amount: order.amount_due,
            playerId: order.player_id,
            phone: order.customer_phone,
            email: order.customer_email,
            imageAbsPath: req.file.path, // multer file path
        });
        } catch (err) {
        console.error("Telegram notify failed:", err.message);
        }

        res.json({
        message: "Proof uploaded. Waiting for admin verification.",
        payment: payUp.rows[0],
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;