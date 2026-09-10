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

const iconCake = `<svg class="schedule-card__icon" viewBox="29 8 42 55" fill="none">
  <g transform="translate(0 2)">
    <path d="M44 10 Q50 7.4 56 10 L56 23 Q50 25.6 44 23 Z" fill="url(#goldIconGrad)" stroke="url(#goldIconGrad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.5 17 Q47.3 19.6 50.0 17" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M50.0 17 Q52.8 19.6 55.5 17" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M44 14 L56 14" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M39 23 Q50 20.4 61 23 L61 39 Q50 41.6 39 39 Z" fill="url(#goldIconGrad)" stroke="url(#goldIconGrad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40.0 32 Q43.3 35 46.7 32" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M46.7 32 Q50.0 35 53.3 32" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M53.3 32 Q56.7 35 60.0 32" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M39 27 L61 27" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M33 39 Q50 36.4 67 39 L67 57 Q50 59.6 33 57 Z" fill="url(#goldIconGrad)" stroke="url(#goldIconGrad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M34.5 49 Q39.7 52.6 44.8 49" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M44.8 49 Q50.0 52.6 55.2 49" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M55.2 49 Q60.3 52.6 65.5 49" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <path d="M33 43 L67 43" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  </g>
</svg>`;

gsap.registerPlugin(ScrollTrigger);

/* ---------------- Language ---------------- */
const LANG_KEY = 'wedding-lang';
let lang = localStorage.getItem(LANG_KEY) || 'hy';

function t(key) {
  return translations[lang][key] ?? translations.hy[key] ?? key;
}

function applyTranslations() {
  document.documentElement.lang = lang === 'hy' ? 'hy' : 'ru';

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

  const current = document.querySelector('[data-lang-current]');
  const other = document.querySelector('[data-lang-other]');
  if (current && other) {
    current.textContent = lang === 'hy' ? 'ՀԱՅ' : 'RUS';
    other.textContent = lang === 'hy' ? 'RUS' : 'ՀԱՅ';
  }

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
          <span class="calendar__wd">${lang === 'hy' ? d.hy : d.ru}</span>
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

document.getElementById('langToggle').addEventListener('click', () => {
  lang = lang === 'hy' ? 'ru' : 'hy';
  localStorage.setItem(LANG_KEY, lang);
  applyTranslations();
});

/* ---------------- Schedule ---------------- */
function mapUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function renderTimeline() {
  const el = document.getElementById('timeline');
  el.innerHTML = schedule
    .map((item) => {
      const title = lang === 'hy' ? item.am : item.ru;
      const btn = item.mapQuery
        ? `<a class="schedule-card__btn" target="_blank" rel="noopener" href="${mapUrl(item.mapQuery)}">
             ${t('schedule.map_btn')}
           </a>`
        : '';
      const icon = item.icon === 'church' ? iconChurch
        : item.icon === 'restaurant' ? iconGlassesGold
        : item.icon === 'home' ? iconLocationGold
        : item.icon === 'spark' ? iconCake
        : '';
      return `
        <li class="schedule-card">
          ${icon}
          <p class="schedule-card__time">${item.time}</p>
          <p class="schedule-card__title">${title}</p>
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
  tl.fromTo('.eyebrow--light', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 })
    // Groom's name settles down from above, bride's rises up from below —
    // matching how they're stacked — both arriving together ('<').
    .fromTo('[data-i18n="couple.groom"]', { opacity: 0, y: -nameOffset }, { opacity: 1, y: 0, duration: 1.4 }, '-=0.55')
    .fromTo('[data-i18n="couple.bride"]', { opacity: 0, y: nameOffset }, { opacity: 1, y: 0, duration: 1.4 }, '<')
    // Starts only once the names have fully settled, not alongside them.
    .fromTo('.hero__amp', { opacity: 0 }, { opacity: 1, duration: 0.6 })
    .fromTo('.hero__date', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
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

/* ---------------- Monogram intro gate (mobile only) ----------------
   A lighter alternative to the envelope gate: big overlapping N/M
   monogram over the hero photo, one outline button. Mobile-only per
   request — desktop skips straight past it, same as when disabled. */
const MONOGRAM_INTRO_KEY = 'wedding-monogram-intro-seen';
const MONOGRAM_INTRO_QUERY = '(max-width: 560px)';

// Set to false to go back to showing the intro only once per visitor
// (normal behavior, via localStorage). Left true while the design is
// still being reviewed on reload — flip back per request.
const MONOGRAM_INTRO_ALWAYS_SHOW = true;

function initMonogramIntro(audio) {
  const intro = document.getElementById('monogramIntro');
  const isMobile = window.matchMedia(MONOGRAM_INTRO_QUERY).matches;
  const seen = !MONOGRAM_INTRO_ALWAYS_SHOW && localStorage.getItem(MONOGRAM_INTRO_KEY);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isMobile || seen || prefersReduced) {
    intro.hidden = true;
    return false;
  }

  intro.hidden = false;
  document.body.style.overflow = 'hidden';

  document.getElementById('monogramBtn').addEventListener(
    'click',
    () => {
      audio.play().catch(() => {}); // runs inside the click handler, so it satisfies autoplay policies
      intro.classList.add('is-leaving');
      setTimeout(() => {
        intro.hidden = true;
        document.body.style.overflow = '';
        localStorage.setItem(MONOGRAM_INTRO_KEY, '1');
        playHeroEntrance();
      }, 1100);
    },
    { once: true }
  );

  return true;
}

/* ---------------- Intro envelope gate ---------------- */
const INTRO_KEY = 'wedding-intro-seen';

// Set to true to bring back the envelope-opening gate on site entry.
// Disabled per request while it's being reworked/reconsidered — the click
// handler and grow animation below are left in place, just unreachable.
const ENVELOPE_GATE_ENABLED = false;

function initIntro(audio) {
  if (initMonogramIntro(audio)) return;

  const intro = document.getElementById('intro');
  const envelope = document.querySelector('.envelope');
  const seen = localStorage.getItem(INTRO_KEY);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!ENVELOPE_GATE_ENABLED || seen || prefersReduced) {
    intro.hidden = true;
    playHeroEntrance();
    audio.play().catch(() => armAutoplayFallback(audio));
    return;
  }

  intro.hidden = false;
  document.body.style.overflow = 'hidden';

  document.getElementById('envelopeBtn').addEventListener(
    'click',
    () => {
      envelope.disabled = true;
      envelope.classList.add('is-open');
      audio.play().catch(() => {}); // runs inside the click handler, so it satisfies autoplay policies

      setTimeout(() => {
        intro.classList.add('is-leaving');

        // Grow a plain fixed-position box from the letter's real on-screen
        // position to fill the viewport exactly (top/left/width/height, not
        // transform:scale) — immune to nested transform/perspective contexts,
        // so it reliably reaches all four edges regardless of where the small
        // envelope happens to sit.
        const slot = document.querySelector('.envelope__slot');
        const grow = document.getElementById('introGrow');
        const rect = slot.getBoundingClientRect();

        grow.style.top = `${rect.top}px`;
        grow.style.left = `${rect.left}px`;
        grow.style.width = `${rect.width}px`;
        grow.style.height = `${rect.height}px`;
        grow.style.borderRadius = '3px';
        grow.classList.add('is-active');

        grow.getBoundingClientRect(); // force layout before changing the target values

        requestAnimationFrame(() => {
          grow.style.top = '0px';
          grow.style.left = '0px';
          grow.style.width = '100vw';
          grow.style.height = '100vh';
          grow.style.borderRadius = '0px';
        });
      }, 930);

      setTimeout(() => {
        intro.hidden = true;
        document.body.style.overflow = '';
        localStorage.setItem(INTRO_KEY, '1');
        playHeroEntrance();
      }, 2130);
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
        body: JSON.stringify({ name, attending, side, guests, lang }),
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
