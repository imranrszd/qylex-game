const ordersService = require("../services/orders.service");

exports.createOrder = async (req, res) => {
  try {
    const result = await ordersService.createOrder({
      body: req.body,
      file: req.file, // multer receipt
    });

    return res.status(201).json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return res.status(status).json({
      ok: false,
      message: err.message || "Internal error",
    });
  }
};
