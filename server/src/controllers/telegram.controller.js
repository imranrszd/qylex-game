const { setOrderPaymentStatus } = require("../services/adminPayments.service");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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

function parseCallbackData(s) {
  const [prefix, action, orderIdStr] = String(s || "").split(":");
  const orderId = Number(orderIdStr);
  if (prefix !== "pay") return null;
  if (!["approve", "reject"].includes(action)) return null;
  if (!orderId) return null;
  return { action, orderId };
}

exports.telegramWebhook = async (req, res) => {
  // Telegram needs fast 200
  res.sendStatus(200);

  try {
    const update = req.body;

    // Only care about button presses
    if (!update?.callback_query) return;

    const cq = update.callback_query;
    const msg = cq.message;
    const chatId = msg?.chat?.id;
    const messageId = msg?.message_id;

    // ✅ Allow everyone in YOUR group only
    if (String(chatId) !== String(TELEGRAM_CHAT_ID)) {
      await tgApi("answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "Not allowed (wrong group).",
        show_alert: true,
      });
      return;
    }

    const parsed = parseCallbackData(cq.data);
    if (!parsed) {
      await tgApi("answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "Invalid action.",
        show_alert: true,
      });
      return;
    }

    const { action, orderId } = parsed;

    // 1) Update DB
    const result = await setOrderPaymentStatus({
      orderId,
      action,
      verifiedBy: null, // optional mapping later
    });

    // 2) Acknowledge click (otherwise button shows loading forever)
    await tgApi("answerCallbackQuery", {
      callback_query_id: cq.id,
      text: action === "approve" ? "✅ Approved" : "❌ Rejected",
      show_alert: false,
    });

    // 3) Remove buttons + append VERIFIED line
    const statusLine =
      action === "approve"
        ? `<b>✅ VERIFIED: PAID</b>`
        : `<b>❌ VERIFIED: REJECTED</b>`;

    const newMarkup = { inline_keyboard: [] };

    if (msg?.caption) {
      await tgApi("editMessageCaption", {
        chat_id: chatId,
        message_id: messageId,
        caption: `${msg.caption}\n\n${statusLine}`,
        parse_mode: "HTML",
        reply_markup: newMarkup,
      });
    } else if (msg?.text) {
      await tgApi("editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text: `${msg.text}\n\n${statusLine}`,
        parse_mode: "HTML",
        reply_markup: newMarkup,
      });
    }

    console.log("✅ Telegram action done:", { orderId, action, db: result });
  } catch (e) {
    console.error("❌ Telegram webhook handler failed:", e.message);
  }
};
