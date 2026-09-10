// Vercel Serverless Function — receives Telegram updates (set as the bot's
// webhook) and replies to a /list command with the current RSVP tally, so
// you can check it without leaving the chat.
//
// One-time setup after deploying, open in a browser (with your own token):
//   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<your-site>/api/telegram-webhook
//
// Only replies to chat ids listed in TELEGRAM_CHAT_ID — anyone else's
// message to the bot is silently ignored.

import { getResponses, summarize } from './_lib/rsvp-summary.js';

function buildSummaryText(responses) {
  const { yes, no, groom, bride, totalGuests } = summarize(responses);
  const lines = [
    `📋 Ընդհանուր պատասխան: ${responses.length}`,
    `✅ Կգան: ${yes.length} հայտ, ${totalGuests} հյուր (փեսայի կողմից: ${groom.length}, հարսի կողմից: ${bride.length})`,
    `❌ Չեն կարողանա: ${no.length}`,
  ];

  const entry = (r) => `• ${r.name} (${r.guests || 1} հյուր)`;

  if (groom.length) {
    lines.push('', '💒 Փեսայի կողմից.');
    groom.slice().reverse().forEach((r) => lines.push(entry(r)));
  }
  if (bride.length) {
    lines.push('', '👰 Հարսի կողմից.');
    bride.slice().reverse().forEach((r) => lines.push(entry(r)));
  }
  if (no.length) {
    lines.push('', '❌ Չեն կարողանա գալ.');
    no.slice().reverse().forEach((r) => lines.push(`• ${r.name}`));
  }

  return lines.join('\n');
}

export default async function handler(req, res) {
  // Telegram expects a fast 200 regardless of what we did with the update.
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  const message = req.body?.message;
  const text = message?.text?.trim();
  const chatId = message?.chat?.id;
  if (!text || chatId === undefined) {
    return res.status(200).json({ ok: true });
  }

  const allowedIds = (process.env.TELEGRAM_CHAT_ID ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if (!allowedIds.includes(String(chatId))) {
    return res.status(200).json({ ok: true }); // not one of the couple's chats — ignore
  }

  if (text === '/list' || text === '/ցուցակ' || text === '/список' || text === '/stats') {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    let summary;
    try {
      summary = buildSummaryText(await getResponses());
    } catch (err) {
      console.error('KV read failed:', err);
      summary = 'Не удалось прочитать список ответов.';
    }
    if (token) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: summary }),
      });
    }
  }

  return res.status(200).json({ ok: true });
}
