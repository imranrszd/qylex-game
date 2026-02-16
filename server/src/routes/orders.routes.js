const express = require("express");
const multer = require("multer");
const ordersController = require("../controllers/orders.controller");

const router = express.Router();

// Memory storage sebab kau nak terus forward ke Telegram (tak simpan file)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (ubah ikut perlu)
  },
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf";

    if (!ok) return cb(new Error("Only image/* or application/pdf allowed"));
    cb(null, true);
  },
});

router.post("/", upload.single("receipt"), ordersController.createOrder);

module.exports = router;
