const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function isAllowedAdmin(fromId, chatId) {
  return String(chatId) === String(CHAT_ID);
}

function assert(cond, msg, status = 400) {
  if (!cond) {
    const e = new Error(msg);
    e.status = status;
    throw e;
  }
}

async function tgApi(method, payload) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram API error: ${json.description || "unknown"}`);
  return json.result;
}

function isAllowedAdmin(fromId, chatId) {
  if (String(chatId) !== String(CHAT_ID)) return false;
  if (ADMIN_USER_IDS.length === 0) return true;
  return ADMIN_USER_IDS.includes(String(fromId));
}

async function answerCallback(callback_query_id, text, show_alert = false) {
  return tgApi("answerCallbackQuery", { callback_query_id, text, show_alert });
}

async function editCaption(chat_id, message_id, caption, reply_markup = null) {
  return tgApi("editMessageCaption", {
    chat_id,
    message_id,
    caption,
    parse_mode: "HTML",
    ...(reply_markup ? { reply_markup } : {}),
  });
}

async function editText(chat_id, message_id, text, reply_markup = null) {
  return tgApi("editMessageText", {
    chat_id,
    message_id,
    text,
    parse_mode: "HTML",
    ...(reply_markup ? { reply_markup } : {}),
  });
}

module.exports = {
  assert,
  tgApi,
  isAllowedAdmin,
  answerCallback,
  editCaption,
  editText,
};
