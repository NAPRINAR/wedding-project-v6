// Shared by api/rsvp-stats.js (web page) and api/telegram-webhook.js (/list
// command) so both read and count the same way.

import { kv } from '@vercel/kv';

export async function getResponses() {
  const raw = await kv.lrange('rsvp:responses', 0, -1);
  return raw.map((r) => (typeof r === 'string' ? JSON.parse(r) : r));
}

export async function clearResponses() {
  await kv.del('rsvp:responses');
}

// One response per guest, matched by name (trimmed/case-insensitive) — a
// resubmission (e.g. localStorage cleared, different browser) replaces the
// guest's earlier answer in place instead of adding a duplicate line.
export async function upsertResponse(record) {
  const raw = await kv.lrange('rsvp:responses', 0, -1);
  const normalizedName = record.name.trim().toLowerCase();
  const idx = raw.findIndex((r) => {
    const parsed = typeof r === 'string' ? JSON.parse(r) : r;
    return parsed.name?.trim().toLowerCase() === normalizedName;
  });
  const serialized = JSON.stringify(record);
  if (idx === -1) {
    await kv.rpush('rsvp:responses', serialized);
    return { replaced: false };
  }
  await kv.lset('rsvp:responses', idx, serialized);
  return { replaced: true };
}

export function summarize(responses) {
  const yes = responses.filter((r) => r.attending === 'yes');
  const no = responses.filter((r) => r.attending === 'no');
  const groom = yes.filter((r) => r.side === 'groom');
  const bride = yes.filter((r) => r.side === 'bride');
  // Older responses recorded before the guest-count field existed have no
  // `guests` value — treat those as a single guest so totals stay accurate.
  const totalGuests = yes.reduce((sum, r) => sum + (r.guests || 1), 0);
  return { yes, no, groom, bride, totalGuests };
}
