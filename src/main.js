import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { translations, schedule, calendarDays, WEDDING_DATE } from './i18n.js';

import iconPlay from 'lucide-static/icons/play.svg?raw';
import iconPause from 'lucide-static/icons/pause.svg?raw';

const iconChurch = `<svg class="schedule-card__icon" viewBox="0 0 100 80" fill="url(#goldIconGrad)">
  <path d="M47.5 3 L52.5 3 L52.5 8 L59 8 L59 13 L52.5 13 L52.5 19 L47.5 19 L47.5 13 L41 13 L41 8 L47.5 8 Z"/>
  <path d="M50 20 L89 47 L84 55 L50 31 L16 55 L11 47 Z"/>
  <path d="M50 30 L73 47 L73 76 L57 76 L57 62 A7 7 0 0 0 43 62 L43 76 L27 76 L27 47 Z" fill-rule="evenodd"/>
  <path d="M7 62 L25 51 L25 76 L7 76 Z"/>
  <path d="M93 62 L75 51 L75 76 L93 76 Z"/>
</svg>`;

const iconGlassesGold = `<svg class="schedule-card__icon" viewBox="21 -2 58 68" fill="url(#goldIconGrad)">
  <g transform="translate(42 10) rotate(12)">
    <path d="M-6 0 L-5.5 15 C-5.5 22 -3 26 0 26 C3 26 5.5 22 5.5 15 L6 0 Z" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-5.7 10 C-4 12 -2 8.4 0 9.8 C2 11.2 4 8 5.7 10" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0 26 L0 52" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-6 52 L6 52" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(58 10) rotate(-12)">
    <path d="M-6 0 L-5.5 15 C-5.5 22 -3 26 0 26 C3 26 5.5 22 5.5 15 L6 0 Z" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-5.7 10 C-4 12 -2 8.4 0 9.8 C2 11.2 4 8 5.7 10" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0 26 L0 52" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-6 52 L6 52" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <path d="M50 2 L50 7" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M43.5 3.5 L45.5 8" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M56.5 3.5 L54.5 8" fill="none" stroke="url(#goldIconGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const iconLocationGold = `<svg class="schedule-card__icon" viewBox="0 0 100 80" fill="none">
  <ellipse cx="50" cy="66" rx="33" ry="7" stroke="url(#goldIconGrad)" stroke-width="3.5"/>
  <path d="M50 70 C50 70 28 44 28 30 A22 22 0 1 1 72 30 C72 44 50 70 50 70 Z M50 42 C43 35.5 35.5 31.5 35.5 25 C35.5 20.8 38.8 17.5 43 17.5 C46 17.5 48.6 19.4 50 22 C51.4 19.4 54 17.5 57 17.5 C61.2 17.5 64.5 20.8 64.5 25 C64.5 31.5 57 35.5 50 42 Z" fill="url(#goldIconGrad)" fill-rule="evenodd"/>
</svg>`;

gsap.registerPlugin(ScrollTrigger);

/* ---------------- Language ----------------
   Armenian-only site — no language switcher. */
function t(key) {
  return translations.hy[key] ?? key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });

  renderTimeline();
  renderCalendar();
  renderCountdown();
}

/* ---------------- Welcome calendar ---------------- */
function renderCalendar() {
  const el = document.getElementById('calendarGrid');
  el.innerHTML = calendarDays
    .map(
      (d) => `
        <div class="calendar__day${d.highlight ? ' is-highlight' : ''}">
          <span class="calendar__wd">${d.hy}</span>
          <span class="calendar__date">${d.date}</span>
        </div>`
    )
    .join('');
}

/* ---------------- Countdown ---------------- */
function renderCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  const diff = Math.max(0, new Date(WEDDING_DATE).getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const units = [
    [days, t('countdown.days')],
    [hours, t('countdown.hours')],
    [minutes, t('countdown.minutes')],
    [seconds, t('countdown.seconds')],
  ];

  el.innerHTML = units
    .map(
      ([value, label], i) => `
        ${i > 0 ? '<span class="countdown__divider" aria-hidden="true"></span>' : ''}
        <div class="countdown__unit">
          <span class="countdown__value">${String(value).padStart(2, '0')}</span>
          <span class="countdown__label">${label}</span>
        </div>`
    )
    .join('');
}

/* ---------------- Schedule ---------------- */
// A verified [lat, lon] pair drops an exact pin; a plain text query just
// searches, which can drift to the wrong building on ambiguous addresses.
function mapUrl(item) {
  if (item.coords) {
    const [lat, lon] = item.coords;
    return `https://yandex.com/maps/?whatshere%5Bpoint%5D=${lon},${lat}&whatshere%5Bzoom%5D=17`;
  }
  return `https://yandex.com/maps/?text=${encodeURIComponent(item.mapQuery)}`;
}

function renderTimeline() {
  const el = document.getElementById('timeline');
  el.innerHTML = schedule
    .map((item) => {
      const title = item.am;
      const address = item.address
        ? `<p class="schedule-card__address">${item.address}</p>`
        : '';
      const btn = item.mapQuery || item.coords
        ? `<a class="schedule-card__btn" target="_blank" rel="noopener" href="${mapUrl(item)}">
             ${t('schedule.map_btn')}
           </a>`
        : '';
      const icon = item.icon === 'church' ? iconChurch
        : item.icon === 'restaurant' ? iconGlassesGold
        : item.icon === 'home' ? iconLocationGold
        : '';
      return `
        <li class="schedule-card">
          ${icon}
          <p class="schedule-card__time">${item.time}</p>
          <p class="schedule-card__title">${title}</p>
          ${address}
          ${btn}
        </li>`;
    })
    .join('');

  // Each card gets its own scroll-linked reveal (scrub) instead of one bulk
  // staggered tween — since every card sits at a different scroll position
  // already, that spacing does the staggering naturally, in sync with how
  // fast the visitor actually scrolls.
  document.querySelectorAll('.schedule-card').forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 36, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top 65%',
          end: 'top 35%',
          scrub: 0.6,
        },
      }
    );
    // The time gets its own little flourish on top of the card's scrub fade
    // — a quick elastic pop-in, fired once, so it feels like it "arrives"
    // rather than just fading in with everything else. Starts later than
    // the card itself so it reads as a follow-up beat, once the visitor has
    // actually reached the block instead of while it's still entering.
    const time = item.querySelector('.schedule-card__time');
    if (time) {
      gsap.fromTo(
        time,
        { opacity: 0, scale: 0.55 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'back.out(2.2)',
          scrollTrigger: { trigger: item, start: 'top 50%' },
        }
      );
    }
  });
}

/* ---------------- Slideshow helper (crossfade) ---------------- */
function initSlideshow(selector, intervalMs) {
  const slides = document.querySelectorAll(selector);
  if (!slides.length) return;
  let i = 0;
  slides[0].classList.add('is-active');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || slides.length < 2) return;
  setInterval(() => {
    slides[i].classList.remove('is-active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-active');
  }, intervalMs);
}

/* ---------------- Hero entrance + scroll cue ---------------- */
gsap.set(['.eyebrow--light', '.hero__date', '.hero__scroll', '.hero__amp'], { opacity: 0 });
gsap.set('.hero__name', { opacity: 0 });

function playHeroEntrance() {
  // Smaller travel distance on phones — the same offset that reads as a
  // gentle drift on a large screen feels like a hard jump on a small one.
  const nameOffset = window.innerWidth <= 560 ? 22 : 42;
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  // Names first — groom's settles down from above, bride's rises up from
  // below, matching how they're stacked, both arriving together ('<').
  tl.fromTo('[data-i18n="couple.groom"]', { opacity: 0, y: -nameOffset }, { opacity: 1, y: 0, duration: 1.4 })
    .fromTo('[data-i18n="couple.bride"]', { opacity: 0, y: nameOffset }, { opacity: 1, y: 0, duration: 1.4 }, '<')
    // Starts only once the names have fully settled, not alongside them.
    .fromTo('.hero__amp', { opacity: 0 }, { opacity: 1, duration: 0.6 })
    // Then the invitation line, then the date — one after another.
    .fromTo('.eyebrow--light', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 })
    .fromTo('.hero__date', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 })
    .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3');
}

function initScrollCue() {
  document.getElementById('scrollCue').addEventListener('click', () => {
    document.getElementById('welcome').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------------- Background music ---------------- */
function initMusic() {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggle');
  const icon = document.getElementById('musicIcon');

  function updateIcon() {
    icon.innerHTML = audio.paused ? iconPlay : iconPause;
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });
  audio.addEventListener('play', updateIcon);
  audio.addEventListener('pause', updateIcon);
  updateIcon();

  return audio;
}

// Browsers block audio-with-sound autoplay without a fresh user gesture, so a
// returning visitor (envelope already opened in a past session) won't get
// sound from a bare .play() call on load. This arms a one-time fallback that
// starts playback on the visitor's next tap/click/key anywhere on the page —
// the closest thing to "plays automatically" the platform actually allows.
// Only events that count as real "user activation" per browser autoplay
// policy are used here — scroll/pointerdown/touchstart do NOT qualify and
// silently fail, which is why those were dropped.
function armAutoplayFallback(audio) {
  const events = ['click', 'pointerup', 'keydown'];
  const handler = () => {
    audio.play().catch(() => {});
    events.forEach((ev) => document.removeEventListener(ev, handler));
  };
  events.forEach((ev) => document.addEventListener(ev, handler));
}

/* ---------------- Intro envelope gate ----------------
   Mobile only — desktop visitors skip straight to the hero. Shows on
   every visit (not just once per visitor) — the envelope is the
   permanent front door of the site, not a one-time welcome. */
// Set to false to skip the envelope-opening gate on site entry.
const ENVELOPE_GATE_ENABLED = true;
const ENVELOPE_GATE_QUERY = '(max-width: 560px)';

function initIntro(audio) {
  const intro = document.getElementById('intro');
  const envelope = document.querySelector('.envelope');
  const isMobile = window.matchMedia(ENVELOPE_GATE_QUERY).matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!ENVELOPE_GATE_ENABLED || !isMobile || prefersReduced) {
    intro.hidden = true;
    playHeroEntrance();
    audio.play().catch(() => armAutoplayFallback(audio));
    return;
  }

  intro.hidden = false;
  // Plain `overflow: hidden` on body doesn't reliably block scroll on iOS
  // Safari (the page can still rubber-band/drag underneath a fixed overlay).
  // Pinning body itself with position:fixed is the technique that actually
  // holds there. The page is always at the very top when the envelope
  // shows, so there's no scroll offset to preserve/restore.
  document.body.style.position = 'fixed';
  document.body.style.top = '0';
  document.body.style.left = '0';
  document.body.style.right = '0';

  document.getElementById('envelopeBtn').addEventListener(
    'click',
    () => {
      envelope.disabled = true;
      intro.classList.add('is-opening');
      audio.play().catch(() => {}); // runs inside the click handler, so it satisfies autoplay policies

      // #intro is just a fixed overlay on top of the real page, so once the
      // flaps scale away and the face/seal fade out, the actual hero is
      // already sitting there to reveal — no separate grow/reveal step needed.
      // Timeout matches the 1.3s flap animation plus a small buffer.
      setTimeout(() => {
        intro.hidden = true;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        playHeroEntrance();
      }, 1450);
    },
    { once: true }
  );
}

/* ---------------- Scroll reveals ----------------
   Tied to scroll position (scrub) rather than a fixed-duration tween firing
   once — the element's opacity/position tracks how far it's travelled
   through a scroll window, so it always reveals at the same pace regardless
   of how fast someone scrolls, instead of racing through a canned duration. */
function initReveals() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    // The footer is the last thing on the page, so a scrub tied to an "end"
    // scroll position is fragile there — depending on the device/toolbar,
    // there may not be enough scroll room below it to ever complete, which
    // left the footer stuck semi-transparent on some phones. It gets a
    // plain one-time fade instead, which only needs the "start" point.
    const isLast = el.closest('.footer') !== null;
    if (isLast) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        }
      );
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 44 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 50%',
          scrub: 0.6,
        },
      }
    );
  });
}

/* ---------------- RSVP form ---------------- */
function initRsvpForm() {
  const form = document.getElementById('rsvpForm');
  const attendingGroup = document.getElementById('attendingGroup');
  const sideField = document.getElementById('sideField');
  const sideGroup = document.getElementById('sideGroup');
  const guestsField = document.getElementById('guestsField');
  const guestsValue = document.getElementById('guestsValue');
  const guestsMinus = document.getElementById('guestsMinus');
  const guestsPlus = document.getElementById('guestsPlus');
  const note = document.getElementById('formNote');
  const submitBtn = document.getElementById('submitBtn');
  const successBox = document.getElementById('rsvpSuccess');
  const successText = document.getElementById('rsvpSuccessText');

  const GUESTS_MIN = 1;
  const GUESTS_MAX = 10;

  let attending = 'yes';
  let side = 'groom';
  let guests = 1;

  attendingGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.choice');
    if (!btn) return;
    attending = btn.dataset.value;
    [...attendingGroup.children].forEach((b) => b.classList.toggle('is-active', b === btn));
    sideField.classList.toggle('is-hidden', attending === 'no');
    guestsField.classList.toggle('is-hidden', attending === 'no');
  });

  sideGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.choice');
    if (!btn) return;
    side = btn.dataset.value;
    [...sideGroup.children].forEach((b) => b.classList.toggle('is-active', b === btn));
  });

  guestsMinus.addEventListener('click', () => {
    guests = Math.max(GUESTS_MIN, guests - 1);
    guestsValue.textContent = guests;
  });
  guestsPlus.addEventListener('click', () => {
    guests = Math.min(GUESTS_MAX, guests + 1);
    guestsValue.textContent = guests;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    note.textContent = '';

    if (!name) {
      note.textContent = t('rsvp.name_required');
      return;
    }

    submitBtn.disabled = true;
    const submitLabel = submitBtn.querySelector('span');
    const originalLabel = submitLabel.textContent;
    submitLabel.textContent = t('rsvp.submit_sending');

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attending, side, guests }),
      });
      if (!res.ok) throw new Error('bad response');

      form.hidden = true;
      successBox.hidden = false;
      successText.textContent = t('rsvp.success').replace('{name}', name);
      gsap.from(successBox, { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' });
    } catch (err) {
      note.textContent = t('rsvp.error');
      submitBtn.disabled = false;
      submitLabel.textContent = originalLabel;
    }
  });
}

/* ---------------- Init ---------------- */
applyTranslations();
initSlideshow('.hero__slide', 5000);
initScrollCue();
initReveals();
initRsvpForm();
initIntro(initMusic());
setInterval(renderCountdown, 1000);

// Web fonts (and the hero photos) can still be loading when ScrollTrigger
// first measures element positions, which throws off every scrub trigger's
// start/end coordinates once text reflows. Recalculate once things settle.
document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
