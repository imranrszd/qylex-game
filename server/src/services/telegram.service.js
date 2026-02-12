const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function sendPaymentProofToTelegram({ orderId, amount, playerId, phone, email, imageAbsPath }) {
    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!token || !chatId) {
        throw new Error("Missing TG_BOT_TOKEN or TG_CHAT_ID in .env");
    }

    const url = `https://api.telegram.org/bot${token}/sendPhoto`;

    const captionLines = [
        "🧾 Payment Proof (MVP)",
        "",
        `Order ID: ${orderId}`,
        `Amount: RM ${amount}`,
        `Player ID: ${playerId}`,
        phone ? `Phone: ${phone}` : null,
        email ? `Email: ${email}` : null,
        "",
        "Action: verify bank transfer then approve in admin endpoint.",
    ].filter(Boolean);

    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("caption", captionLines.join("\n"));
    form.append("photo", fs.createReadStream(imageAbsPath));

    const res = await axios.post(url, form, { headers: form.getHeaders(), timeout: 30000 });

    if (!res.data?.ok) {
        throw new Error(`Telegram sendPhoto failed: ${JSON.stringify(res.data)}`);
    }

    return res.data.result; // includes message_id, etc.
}

module.exports = { sendPaymentProofToTelegram };
