// Yandex Maps addresses: fill exact addresses in `mapQuery` once provided.
export const schedule = [
  {
    time: '11:00',
    am: 'Փեսայի տուն',
    icon: 'home',
    address: 'Ֆուրմանովի փող. 55, Գյումրի',
    coords: [40.790646, 43.840921], // verified exact pin — prefer over mapQuery
    mapQuery: 'Ֆուրմանովի փողոց 55, Գյումրի',
  },
  {
    time: '12:00',
    am: 'Հարսի տուն',
    icon: 'home',
    address: 'Ս. Թեհլիրյան փող. 16, Գյումրի',
    coords: [40.764750, 43.851750], // verified exact pin — prefer over mapQuery
    mapQuery: 'Սողոմոն Թեհլիրյան փողոց 16, Գյումրի',
  },
  {
    time: '14:00',
    am: 'Եկեղեցի Սուրբ Ամենափրկիչ',
    icon: 'church',
    address: 'Խ. Աբովյան փող. 145, Գյումրի',
    mapQuery: 'Սուրբ Ամենափրկիչ եկեղեցի Գյումրի',
  },
  {
    time: '15:00',
    am: 'Փեսայի տուն',
    icon: 'home',
    address: 'Ֆուրմանովի փող. 55, Գյումրի',
    coords: [40.790646, 43.840921], // verified exact pin — prefer over mapQuery
    mapQuery: 'Ֆուրմանովի փողոց 55, Գյումրի',
  },
  {
    time: '16:30',
    am: '«Imperial» ռեստորանային համալիր',
    icon: 'restaurant',
    address: 'Գյումրի',
    mapQuery: 'Imperial Գյումրի',
  },
];

// Wedding date is Friday, 25.09.2026 — the week is centered on that day.
export const calendarDays = [
  { date: 22, hy: 'Երք' },
  { date: 23, hy: 'Չրք' },
  { date: 24, hy: 'Հնգ' },
  { date: 25, hy: 'Ուրբ', highlight: true },
  { date: 26, hy: 'Շբթ' },
  { date: 27, hy: 'Կիր' },
  { date: 28, hy: 'Երկ' },
];

// Armenia is UTC+4 year-round (no DST), so this is unambiguous for every visitor.
export const WEDDING_DATE = '2026-09-25T00:00:00+04:00';

export const translations = {
  hy: {
    'couple.bride': 'Լիանա',
    'couple.groom': 'Հայկ',
    'hero.eyebrow': 'Հրավիրում ենք Ձեզ մեր հարսանիքին',
    'intro.hint': 'Սեղմեք՝ հրավերը բացելու համար',
    'intro.open_btn': 'Բացել հրավերը',
    'welcome.title': 'Սիրելի հյուրեր,',
    'welcome.text': 'Ուրախ ենք կիսվել Ձեզ հետ մեր կյանքի ամենագեղեցիկ օրով և սիրով հրավիրում ենք Ձեզ՝ լինել այս հիշարժան պահի մաս։',
    'calendar.month': 'ՍԵՊՏԵՄԲԵՐ 2026',
    'countdown.eyebrow': 'Հարսանիքին մնաց',
    'countdown.days': 'օր',
    'countdown.hours': 'ժամ',
    'countdown.minutes': 'րոպե',
    'countdown.seconds': 'վայրկյան',
    'schedule.eyebrow': 'Ծրագիր',
    'schedule.title': 'Օրվա ծրագիրը',
    'schedule.map_btn': 'Բացել քարտեզում',
    'rsvp.eyebrow': 'RSVP',
    'rsvp.title': 'Հաստատեք Ձեր ներկայությունը',
    'rsvp.deadline': 'Խնդրում ենք պատասխանել մինչև <span class="rsvp__deadline-date">սեպտեմբերի 18-ը</span>',
    'rsvp.name_label': 'Անուն և ազգանուն',
    'rsvp.name_placeholder': 'Անուն Ազգանուն',
    'rsvp.attending_label': 'Կգա՞ք արդյոք',
    'rsvp.attending_yes': 'Այո, կգամ',
    'rsvp.attending_no': 'Ցավոք, չեմ կարողանա',
    'rsvp.side_label': 'Ո՞ր կողմից եք',
    'rsvp.side_groom': 'Փեսայի կողմից',
    'rsvp.side_bride': 'Հարսի կողմից',
    'rsvp.guests_label': 'Քանի՞ հոգով եք գալու',
    'rsvp.guests_decrease': 'Պակասեցնել',
    'rsvp.guests_increase': 'Ավելացնել',
    'rsvp.submit': 'Ուղարկել պատասխանը',
    'rsvp.submit_sending': 'Ուղարկվում է...',
    'rsvp.success': 'Շնորհակալություն, {name}: Ձեր պատասխանն ընդունված է:',
    'rsvp.error': 'Չհաջողվեց ուղարկել: Փորձեք կրկին կամ զանգահարեք մեզ։',
    'rsvp.name_required': 'Խնդրում ենք նշել Ձեր անունը',
    'footer.wish': 'Սիրով սպասում ենք Ձեզ մեր կյանքի ամենակարևոր օրը',
    'footer.names': 'Հայկ <span class="footer__names-amp">&amp;</span> Լիանա',
    'footer.credit_link': 'Կայքը պատրաստել է <span class="footer__credit-brand">Moon Invite</span>-ը',
  },
};
