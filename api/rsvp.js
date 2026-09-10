// Vercel Serverless Function.
// Requires environment variables TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID,
// set in the Vercel project dashboard (Settings -> Environment Variables).
// TELEGRAM_CHAT_ID may hold more than one recipient as a comma-separated
// list (e.g. "111111111,222222222") to notify several people at once.
// Also records each response in the connected KV store (Storage tab) so
// /api/rsvp-stats can show a running tally — see that file.
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

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || !chatIds.length) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
    return res.status(500).json({ error: 'server_not_configured' });
  }

  const cleanName = name.trim().slice(0, 120);
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
    await kv.rpush(
      'rsvp:responses',
      JSON.stringify({
        name: cleanName,
        attending,
        side: attending === 'yes' ? safeSide : null,
        guests: attending === 'yes' ? safeGuests : null,
        time: Date.now(),
      })
    );
  } catch (err) {
    // Don't fail the guest's submission just because the tally couldn't be
    // recorded — the Telegram message below is still the primary channel.
    console.error('KV write failed:', err);
  }

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

    if (!results.some(Boolean)) {
      // Only fail the request if EVERY recipient failed — one bad chat_id
      // shouldn't block the guest's response from reaching the others.
      return res.status(502).json({ error: 'telegram_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Telegram request failed:', err);
    return res.status(502).json({ error: 'telegram_failed' });
  }
}
