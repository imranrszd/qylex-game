const { setOrderPaymentStatus } = require("../services/adminPayments.service");

exports.verifyManualPayment = async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const { action } = req.body; // "approve" | "reject"
    if (!orderId) return res.status(400).json({ ok: false, message: "Invalid orderId" });
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ ok: false, message: "action must be approve or reject" });
    }

    const verifiedBy = req.user?.user_id || null;

    const result = await setOrderPaymentStatus({ orderId, action, verifiedBy });
    return res.json({ ok: true, ...result });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ ok: false, message: err.message || "Server error" });
  }
};
