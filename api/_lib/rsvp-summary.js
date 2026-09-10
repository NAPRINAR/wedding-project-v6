// Shared by api/rsvp-stats.js (web page) and api/telegram-webhook.js (/list
// command) so both read and count the same way.

import { kv } from '@vercel/kv';

export async function getResponses() {
  const raw = await kv.lrange('rsvp:responses', 0, -1);
  return raw.map((r) => (typeof r === 'string' ? JSON.parse(r) : r));
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
