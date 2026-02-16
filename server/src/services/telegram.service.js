const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function assert(cond, msg, status = 400) {
  if (!cond) {
    const e = new Error(msg);
    e.status = status;
    throw e;
  }
}

async function sendOrderToTelegram({ text, file, inlineKeyboard }) {
  assert(BOT_TOKEN, "Missing TELEGRAM_BOT_TOKEN", 500);
  assert(CHAT_ID, "Missing TELEGRAM_CHAT_ID", 500);
  assert(text, "Missing text");

  // file optional (tapi dalam flow kau memang wajib)
  if (!file) {
    // fallback: send message text only
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        ...(inlineKeyboard
          ? { reply_markup: { inline_keyboard: inlineKeyboard } }
          : {}),
      }),
    });

    const json = await res.json();
    if (!json.ok) throw new Error(`Telegram failed: ${json.description || "unknown"}`);
    return json.result;
  }

  const mimeType = file.mimetype;
  const isPdf = mimeType === "application/pdf";
  const endpoint = isPdf ? "sendDocument" : "sendPhoto";

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("caption", text);
  form.append("parse_mode", "HTML");

  if (inlineKeyboard) {
    form.append("reply_markup", JSON.stringify({ inline_keyboard: inlineKeyboard }));
  }

  // Multer memoryStorage gives Buffer at file.buffer
  const blob = new Blob([file.buffer], { type: mimeType });
  const filename = file.originalname || (isPdf ? "receipt.pdf" : "receipt.jpg");

  if (isPdf) form.append("document", blob, filename);
  else form.append("photo", blob, filename);

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`, {
    method: "POST",
    body: form, // ✅ no manual headers needed
  });

  // Debug kalau telegram bagi 400 kosong lagi
  const raw = await res.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(`Telegram returned non-JSON. HTTP ${res.status}. Body: ${raw}`);
  }

  if (!json.ok) {
    throw new Error(`Telegram failed: ${json.description || "unknown"}`);
  }

  return json.result;
}

module.exports = { sendOrderToTelegram };
