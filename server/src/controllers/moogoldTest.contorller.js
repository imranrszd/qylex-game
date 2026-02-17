const { createOrder } = require("../services/moogold.service");

exports.testCreateOrder = async (req, res) => {
  try {
    const { variationId, quantity, category, userid, serverid, partnerOrderId } = req.body;

    if (!variationId || !quantity) {
      return res.status(400).json({ ok: false, message: "variationId and quantity are required" });
    }

    const fields = {};
    if (userid) fields["User ID"] = String(userid);
    // IMPORTANT: your product detail shows "Server ID" sometimes; your doc examples also show "Server"
    // For safety: send both if provided, MooGold will ignore unknown fields for that product.
    if (serverid) {
      fields["Server ID"] = String(serverid);
      fields["Server"] = String(serverid);
    }

    const resp = await createOrder({
      variationId,
      quantity,
      category: category ?? 1, // 1=Direct Top Up, 2=eVouchers :contentReference[oaicite:0]{index=0}
      partnerOrderId,          // optional :contentReference[oaicite:1]{index=1}
      fields,
    });

    return res.json({ ok: true, supplier: "moogold", data: resp });
  } catch (err) {
    return res.status(err.status || 500).json({
      ok: false,
      message: err.message,
      raw: err.raw || null,
    });
  }
};
