// Vercel Serverless Function.
//
// Records each RSVP in up to three independent places — none of them can
// block a guest's submission on its own:
//   1. Vercel KV (Storage tab) — the primary store /api/rsvp-stats reads.
//   2. A Google Sheets Apps Script webhook (GOOGLE_SHEET_WEBHOOK_URL) — an
//      easy-to-open spreadsheet backup, optional.
//   3. Telegram (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID) — instant
//      notification, also optional.
// The guest only ever sees an error if ALL THREE fail (or none are
// configured) — a Telegram outage, for instance, never blocks a submission
// that KV or Sheets still recorded.
// Never commit real values for these — see .env.example.

import { kv } from '@vercel/kv';

const ATTENDING_LABEL = {
  yes: { hy: 'Այո, կգա', ru: 'Да, придёт' },
  no: { hy: 'Ցավոք, չի կարողանա', ru: 'К сожалению, не сможет' },
};

const SIDE_LABEL = {
  groom: { hy: 'Փեսայի կողմից', ru: 'Со стороны жениха' },
  bride: { hy: 'Հարսի կողմից', ru: 'Со стороны невесты' },
};

const GUESTS_LABEL = { hy: 'Հյուրերի քանակ', ru: 'Количество гостей' };
const GUESTS_MIN = 1;
const GUESTS_MAX = 10;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { name, attending, side, guests, lang } = req.body ?? {};

  if (typeof name !== 'string' || !name.trim() || name.length > 120) {
    return res.status(400).json({ error: 'invalid_name' });
  }
  if (!['yes', 'no'].includes(attending)) {
    return res.status(400).json({ error: 'invalid_attending' });
  }
  const safeLang = lang === 'ru' ? 'ru' : 'hy';
  const safeSide = ['groom', 'bride'].includes(side) ? side : null;
  const safeGuests = Math.min(Math.max(parseInt(guests, 10) || 1, GUESTS_MIN), GUESTS_MAX);
  const cleanName = name.trim().slice(0, 120);

  const record = {
    name: cleanName,
    attending,
    side: attending === 'yes' ? safeSide : null,
    guests: attending === 'yes' ? safeGuests : null,
    time: Date.now(),
  };

  let kvOk = false;
  try {
    await kv.rpush('rsvp:responses', JSON.stringify(record));
    kvOk = true;
  } catch (err) {
    console.error('KV write failed:', err);
  }

  let sheetsOk = false;
  const sheetsWebhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (sheetsWebhook) {
    try {
      const sheetRes = await fetch(sheetsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      sheetsOk = sheetRes.ok;
      if (!sheetsOk) console.error('Google Sheets webhook error:', await sheetRes.text());
    } catch (err) {
      console.error('Google Sheets webhook failed:', err);
    }
  }

  let telegramOk = false;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (token && chatIds.length) {
    const lines = [
      '💍 <b>Նոր պատասխան հարսանիքի հրավերին</b>',
      '',
      `👤 Անուն: ${escapeHtml(cleanName)}`,
      `✅ Կգա՞: ${ATTENDING_LABEL[attending][safeLang]}`,
    ];
    if (attending === 'yes' && safeSide) {
      lines.push(`💒 Կողմ: ${SIDE_LABEL[safeSide][safeLang]}`);
    }
    if (attending === 'yes') {
      lines.push(`👥 ${GUESTS_LABEL[safeLang]}: ${safeGuests}`);
    }
    const text = lines.join('\n');

    try {
      const results = await Promise.all(
        chatIds.map(async (id) => {
          const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: id, text, parse_mode: 'HTML' }),
          });
          if (!tgRes.ok) {
            console.error(`Telegram API error for chat ${id}:`, await tgRes.text());
          }
          return tgRes.ok;
        })
      );
      telegramOk = results.some(Boolean);
    } catch (err) {
      console.error('Telegram request failed:', err);
    }
  } else {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars — skipping notification');
  }

  if (!kvOk && !sheetsOk && !telegramOk) {
    // Every channel failed (or none are configured) — the guest's response
    // genuinely wasn't recorded anywhere, so this is the one case worth
    // surfacing as an error.
    return res.status(502).json({ error: 'save_failed' });
  }
  return res.status(200).json({ ok: true });
}
