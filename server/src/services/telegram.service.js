const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const BOT_TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

async function sendPaymentProof({ orderId, amount, playerId, phone, imagePath }) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("caption",
`🧾 New Payment Proof

Order: ${orderId}
Amount: RM ${amount}
Player ID: ${playerId}
Phone: ${phone}

Please verify in bank app.`);
  
  form.append("photo", fs.createReadStream(imagePath));

  await axios.post(url, form, {
    headers: form.getHeaders(),
  });
}

module.exports = { sendPaymentProof };
