// Vercel Serverless Function — a small password-gated page showing the
// running RSVP tally. Open it as:
//   https://<your-site>/api/rsvp-stats?key=<ADMIN_KEY>
// Set ADMIN_KEY yourself in the Vercel project's Environment Variables
// (any password you like) — this file never sees or stores it beyond the
// comparison below.

import { getResponses, summarize } from './_lib/rsvp-summary.js';

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
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method not allowed');
  }

  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || req.query.key !== adminKey) {
    return res.status(401).send('Unauthorized');
  }

  let responses = [];
  try {
    responses = await getResponses();
  } catch (err) {
    console.error('KV read failed:', err);
    return res.status(502).send('Could not read the stored responses.');
  }

  const { yes, no, groom, bride, totalGuests } = summarize(responses);

  const rows = responses
    .slice()
    .reverse()
    .map((r) => {
      const when = r.time ? new Date(r.time).toLocaleString('ru-RU') : '—';
      const status = r.attending === 'yes' ? 'Придёт' : 'Не сможет';
      const side = r.side === 'groom' ? 'Жених' : r.side === 'bride' ? 'Невеста' : '—';
      const guests = r.attending === 'yes' ? (r.guests || 1) : '—';
      return `<tr><td>${escapeHtml(r.name)}</td><td>${status}</td><td>${side}</td><td>${guests}</td><td>${when}</td></tr>`;
    })
    .join('');

  const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RSVP — сводка</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 20px; color: #3B3542; }
  h1 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
  .sub { color: #8C8496; font-size: 13px; margin-bottom: 24px; }
  .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
  .stat { background: #F1ECE3; border-radius: 10px; padding: 14px 22px; min-width: 110px; }
  .stat b { display: block; font-size: 28px; line-height: 1.2; }
  .stat span { font-size: 12px; color: #8C8496; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #eee; }
  th { color: #8C8496; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
</style>
</head>
<body>
  <h1>RSVP — Դավիթ &amp; Սոնա</h1>
  <p class="sub">Обновляется автоматически при каждом новом ответе на сайте.</p>
  <div class="stats">
    <div class="stat"><b>${responses.length}</b><span>Всего ответов</span></div>
    <div class="stat"><b>${yes.length}</b><span>Придут (анкет)</span></div>
    <div class="stat"><b>${totalGuests}</b><span>Гостей всего</span></div>
    <div class="stat"><b>${no.length}</b><span>Не смогут</span></div>
    <div class="stat"><b>${groom.length}</b><span>Со стороны жениха</span></div>
    <div class="stat"><b>${bride.length}</b><span>Со стороны невесты</span></div>
  </div>
  <table>
    <thead><tr><th>Имя</th><th>Статус</th><th>Сторона</th><th>Гостей</th><th>Когда</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5">Пока нет ответов</td></tr>'}</tbody>
  </table>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}
