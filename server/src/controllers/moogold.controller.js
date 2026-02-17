const { createOrder } = require("../services/moogold.service");

exports.createOrderDirect = async (req, res) => {
  try {
    const { variationId, quantity, category = 1, userid, serverid, partnerOrderId } = req.body;

    if (!variationId || !quantity) {
      return res.status(400).json({ ok: false, message: "variationId & quantity required" });
    }

    const fields = {};
    if (userid) fields["User ID"] = String(userid);
    if (serverid) {
      fields["Server ID"] = String(serverid);
      fields["Server"] = String(serverid);
    }

    const resp = await createOrder({ variationId, quantity, category, partnerOrderId, fields });
    res.json({ ok: true, supplier: "moogold", data: resp });
  } catch (e) {
    res.status(e.status || 500).json({ ok: false, message: e.message, raw: e.raw || null });
  }
};
