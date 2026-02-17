const { setOrderPaymentStatus } = require("../services/adminPayments.service");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

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
  if (!orderId) return null;

  // ✅ allow approve_auto
  const allowed = ["approve", "approve_auto", "reject"];
  if (!allowed.includes(action)) return null;

  return { action, orderId };
}

exports.telegramWebhook = async (req, res) => {
  res.sendStatus(200);

  try {
    const update = req.body;
    if (!update?.callback_query) return;

    const cq = update.callback_query;
    const msg = cq.message;
    const chatId = msg?.chat?.id;
    const messageId = msg?.message_id;

    if (String(chatId) !== String(process.env.TELEGRAM_CHAT_ID)) {
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

    // ✅ This service will do DB update AND supplier call if approve_auto
    const result = await setOrderPaymentStatus({ orderId, action, verifiedBy: null });
    
    if (action === "approve_auto" && result?.status !== "PROCESSING") {
      await tgApi("answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "❌ AUTO failed/partial. Retry / approve manual.",
        show_alert: true,
      });
      console.log("❌ AUTO approve failed:", { orderId, result });
      return;
    }

    const approved = action === "approve" || action === "approve_auto";

    await tgApi("answerCallbackQuery", {
      callback_query_id: cq.id,
      text: approved ? "✅ Approved" : "❌ Rejected",
      show_alert: false,
    });

    const statusLine = approved
      ? `<b>✅ VERIFIED: PAID</b>${action === "approve_auto" ? " (AUTO)" : " (MANUAL)"}`
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

    console.log("✅ Telegram action done:", { orderId, action, result });
  } catch (e) {
    console.error("❌ Telegram webhook handler failed:", e.message);
  }
};
