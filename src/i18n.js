// Yandex Maps addresses: fill exact addresses in `mapQuery` once provided.
export const schedule = [
  {
    time: '11:00',
    am: 'Փեսայի տուն',
    icon: 'home',
    address: 'Գորկու փող. 8, Գյումրի',
    mapQuery: 'Գորկու փողոց 8, Գյումրի',
  },
  {
    time: '12:00',
    am: 'Հարսի տուն',
    icon: 'home',
    address: 'Շիրազի փող. 4, Գյումրի',
    mapQuery: 'Շիրազի փողոց 4, Գյումրի',
  },
  {
    time: '14:00',
    am: 'Եկեղեցի Սուրբ Ամենափրկիչ',
    icon: 'church',
    address: 'Գյումրի',
    mapQuery: 'Եկեղեցի Սուրբ Ամենափրկիչ, Գյումրի',
  },
  {
    time: '15:00',
    am: 'Փեսայի տուն',
    icon: 'home',
    address: 'Գորկու փող. 8, Գյումրի',
    mapQuery: 'Գորկու փողոց 8, Գյումրի',
  },
  {
    time: '16:30',
    am: '«Վիկտորիա» ռեստորանային համալիր',
    icon: 'restaurant',
    address: 'Գյումրի',
    mapQuery: 'Վիկտորիա ռեստորան Գյումրի',
  },
];

// Wedding date is Wednesday, 27.01.2027 — the week is centered on that day.
export const calendarDays = [
  { date: 24, hy: 'Կիր' },
  { date: 25, hy: 'Երկ' },
  { date: 26, hy: 'Երք' },
  { date: 27, hy: 'Չրք', highlight: true },
  { date: 28, hy: 'Հնգ' },
  { date: 29, hy: 'Ուրբ' },
  { date: 30, hy: 'Շբթ' },
];

// Armenia is UTC+4 year-round (no DST), so this is unambiguous for every visitor.
export const WEDDING_DATE = '2027-01-27T00:00:00+04:00';

export const translations = {
  hy: {
    'couple.bride': 'Սոնա',
    'couple.groom': 'Դավիթ',
    'hero.eyebrow': 'Հրավիրում ենք Ձեզ մեր հարսանիքին',
    'intro.hint': 'Սեղմեք՝ հրավերը բացելու համար',
    'intro.open_btn': 'Բացել հրավերը',
    'welcome.title': 'Սիրելի հյուրեր,',
    'welcome.text': 'Ուրախ ենք կիսվել Ձեզ հետ մեր կյանքի ամենագեղեցիկ օրով և սիրով հրավիրում ենք Ձեզ՝ լինել այս հիշարժան պահի մաս։',
    'calendar.month': 'ՀՈՒՆՎԱՐ 2027',
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
    'rsvp.deadline': 'Խնդրում ենք պատասխանել մինչև <span class="rsvp__deadline-date">հունվարի 20-ը</span>',
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
    'footer.names': 'Դավիթ <span class="footer__names-amp">&amp;</span> Սոնա',
    'footer.credit_link': 'Կայքը պատրաստել է <span class="footer__credit-brand">Moon Invite</span>-ը',
  },
};
