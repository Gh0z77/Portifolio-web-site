export type Lang = 'uz' | 'ru' | 'en'

interface TermLineT {
  cmd: string
  out?: string[]
}

export interface Translation {
  nav: { home: string; about: string; services: string; portfolio: string; blog: string; contact: string; terminal: string }
  meta: { home: string; about: string; services: string; portfolio: string; blog: string; contact: string }
  common: { loading: string; viewAll: string; details: string; empty: string; vol: string[] }
  footer: {
    tagline1: string
    tagline2: string
    pages: string
    contact: string
    rights: string
  }
  home: {
    initLine: string
    roles: string[]
    desc: string
    ctaProjects: string
    ctaContact: string
    marquee: string[]
    stats: { value: string; label: string }[]
    featuredTitle: string
    whatIDo: string
    testimonialsTitle: string
    ctaTitle: string
    ctaText: string
    ctaBtn: string
  }
  about: {
    title: string
    terminal: TermLineT[]
    p1: string
    p2: string
    info: { nick: string; job: string; jobVal: string; location: string; locationVal: string; email: string; emailVal: string; status: string; statusVal: string }
    skillsTitle: string
    skillsGroups: { title: string; skills: { name: string; level: number }[] }[]
    timelineTitle: string
    timeline: { year: string; title: string; text: string }[]
    interestsTitle: string
    interests: string[]
  }
  services: {
    title: string
    empty: string
    priceLabel: string
    priceDefault: string
    orderBtn: string
    processTitle: string
    steps: { num: string; title: string; text: string }[]
    faqTitle: string
    faq: { q: string; a: string }[]
    ctaQ: string
    ctaBtn: string
  }
  portfolio: {
    title: string
    all: string
    empty: string
    noMatch: string
  }
  project: {
    notFound: string
    back: string
    live: string
    github: string
    info: string
    date: string
    techs: string
  }
  blog: {
    title: string
    search: string
    all: string
    empty: string
    noMatch: string
    read: string
  }
  post: {
    back: string
    readTime: string
    others: string
    notFound: string
  }
  contact: {
    title: string
    cEmail: string
    cTelegram: string
    cLocation: string
    cLocationVal: string
    cResponse: string
    cResponseVal: string
    orFill: string
    lName: string
    lEmail: string
    lTelegram: string
    lSubject: string
    lMessage: string
    pName: string
    pEmail: string
    pSubject: string
    pMessage: string
    send: string
    sending: string
    successTitle: string
    successText: string
    again: string
    errName: string
    errBody: string
    errNet: string
    errGeneric: string
  }
  notFound: {
    errLine: string
    text: string
    homeBtn: string
  }
  boot: {
    lines: string[]
    online: string
    skip: string
  }
  term: {
    welcome1: string
    welcome2: string
    help: string[]
    whoami: string
    denied: string
    noPage: string
    noProjects: string
    openHint: string
    servicesMore: string
    noServices: string
    noPosts: string
    readHint: string
    formHint: string
    tgOpening: string
    ghOpening: string
    langOk: string
    langErr: string
    sudo: string
    hack: string[]
    hackDone: string
    matrix: string
    exit: string
    notFound: string
    working: string
    tip: string
    boo: string
  }
}

const uz: Translation = {
  nav: { home: 'bosh', about: 'haqimda', services: 'xizmatlar', portfolio: 'portfolio', blog: 'blog', contact: 'aloqa', terminal: 'terminal' },
  meta: {
    home: 'GHOST — Portfolio',
    about: 'Haqimda — GHOST',
    services: 'Xizmatlar — GHOST',
    portfolio: 'Portfolio — GHOST',
    blog: 'Blog — GHOST',
    contact: 'Aloqa — GHOST',
  },
  common: {
    loading: 'yuklanmoqda',
    viewAll: "barchasini ko'rish →",
    details: 'batafsil →',
    empty: "// ma'lumot topilmadi",
    vol: ["ovoz: o'chiq", 'ovoz: past', "ovoz: o'rta", 'ovoz: baland'],
  },
  footer: {
    tagline1: "// G'oyalarni kodga aylantiraman.",
    tagline2: '// Web saytlar · Botlar · Avtomatlashtirish',
    pages: '~/sahifalar',
    contact: '~/aloqa',
    rights: 'barcha huquqlar himoyalangan',
  },
  home: {
    initLine: '> initializing_portfolio... [OK]',
    roles: ['Full-stack dasturchi', 'Telegram bot yaratuvchi', 'Web sayt quruvchi', 'UI/UX ishqibozi'],
    desc: "G'oyalarni zamonaviy web saytlar, botlar va ilovalarga aylantiraman. Siz o'ylaysiz — men kodlayman.",
    ctaProjects: './loyihalar',
    ctaContact: './aloqa',
    marquee: ['REACT', 'TYPESCRIPT', 'NODE.JS', 'SUPABASE', 'TAILWIND', 'TELEGRAM API', 'POSTGRESQL', 'FRAMER MOTION', 'VITE', 'GIT'],
    stats: [
      { value: '3+', label: 'yil tajriba' },
      { value: '20+', label: 'bajarilgan loyiha' },
      { value: '15+', label: 'mamnun mijoz' },
      { value: '100%', label: "mas'uliyat" },
    ],
    featuredTitle: 'TANLANGAN LOYIHALAR',
    whatIDo: 'NIMA QILAMAN',
    testimonialsTitle: 'MIJOZLAR FIKRI',
    ctaTitle: 'LOYIHANGIZ BORMI?',
    ctaText: "G'oyangizni menga aytib bering — birgalikda uni ishlaydigan mahsulotga aylantiramiz.",
    ctaBtn: 'keling gaplashamiz →',
  },
  about: {
    title: 'HAQIMDA',
    terminal: [
      { cmd: 'whoami', out: ['GHOST — full-stack dasturchi'] },
      { cmd: 'cat skills.txt', out: ['> web saytlar · telegram botlar', '> admin panellar · API integratsiya'] },
      { cmd: 'uptime', out: ['3+ yil dasturlash tajribasi'] },
      { cmd: 'status', out: ['🟢 yangi loyihalarga ochiq'] },
    ],
    p1: "Salom! Men GHOST — web texnologiyalarga ishqiboz full-stack dasturchiman. Oddiy landing sahifadan tortib murakkab boshqaruv tizimlarigacha — g'oyani ishlaydigan mahsulotga aylantirishni yaxshi ko'raman.",
    p2: "Mening yondashuvim oddiy: toza kod, tez ishlash va foydalanuvchiga qulaylik. Har bir loyihaga o'z loyihamdek yondashaman — natija esdan chiqmaydigan bo'lishi kerak.",
    info: {
      nick: 'nik', job: 'kasb', jobVal: 'Full-stack dasturchi',
      location: 'lokatsiya', locationVal: "O'zbekiston",
      email: 'email', emailVal: 'rustamasaka1991@gmail.com',
      status: 'holat', statusVal: 'yangi loyihalarga ochiq 🟢',
    },
    skillsTitle: 'TEXNOLOGIYALAR',
    skillsGroups: [
      {
        title: 'Frontend',
        skills: [
          { name: 'React / Vite', level: 90 },
          { name: 'TypeScript', level: 85 },
          { name: 'Tailwind CSS', level: 92 },
          { name: 'Framer Motion', level: 80 },
        ],
      },
      {
        title: 'Backend',
        skills: [
          { name: 'Node.js', level: 80 },
          { name: 'Supabase', level: 88 },
          { name: 'PostgreSQL', level: 75 },
          { name: 'REST API', level: 85 },
        ],
      },
      {
        title: 'Vositalar',
        skills: [
          { name: 'Telegram Bot API', level: 90 },
          { name: 'Git / GitHub', level: 85 },
          { name: 'Figma', level: 70 },
          { name: 'Linux / CLI', level: 78 },
        ],
      },
    ],
    timelineTitle: "TAJRIBA YO'LI",
    timeline: [
      { year: '2021', title: 'Boshlanish', text: "Dasturlash olamiga birinchi qadam — HTML, CSS va JavaScript asoslarini mustaqil o'rgandim." },
      { year: '2022', title: 'Birinchi loyihalar', text: 'Birinchi buyurtma loyihalar: landing sahifalar va kichik biznes saytlari. React bilan tanishuv.' },
      { year: '2023 — 2024', title: 'Freelance va botlar', text: 'Freelance faoliyat: Telegram botlar, avtomatlashtirish tizimlari va murakkabroq web ilovalar.' },
      { year: '2025 — hozir', title: 'Yirik loyihalar', text: "To'liq full-stack loyihalar: korxona tizimlari, admin panellar, Supabase asosidagi zamonaviy ilovalar." },
    ],
    interestsTitle: 'QIZIQISHLAR',
    interests: ['yangi texnologiyalar', 'open-source', 'UI/UX dizayn', 'avtomatlashtirish', 'cyberpunk estetika', 'shaxmat', 'kofe ☕'],
  },
  services: {
    title: 'XIZMATLAR',
    empty: '// hozircha xizmatlar kiritilmagan',
    priceLabel: 'narx',
    priceDefault: 'kelishilgan holda',
    orderBtn: 'buyurtma berish →',
    processTitle: 'ISH JARAYONI',
    steps: [
      { num: '01', title: 'SUHBAT', text: "G'oyangiz va talablaringizni birga aniqlab olamiz." },
      { num: '02', title: 'REJA', text: 'Texnik reja, muddat va narxni kelishamiz.' },
      { num: '03', title: 'KOD', text: "Jarayonni ko'rsatib borgan holda loyihani quraman." },
      { num: '04', title: 'DEPLOY', text: "Loyihani topshiraman va qo'llab-quvvatlayman." },
    ],
    faqTitle: 'SAVOL-JAVOB',
    faq: [
      { q: 'Loyiha qancha vaqt oladi?', a: "Hajmiga bog'liq: oddiy landing 3-5 kun, korporativ sayt 1-2 hafta, murakkab tizimlar 3-6 hafta. Aniq muddat reja bosqichida kelishiladi va unga rioya qilinadi." },
      { q: 'Narxlar qanday belgilanadi?', a: "Har bir loyiha individual baholanadi — funksiyalar hajmi, dizayn murakkabligi va muddat hisobga olinadi. Suhbatdan keyin aniq va o'zgarmas narx taklif qilaman." },
      { q: "To'lov qanday amalga oshadi?", a: "Odatda 50% oldindan, 50% loyiha topshirilgach. Yirik loyihalarda bosqichma-bosqich to'lov ham mumkin." },
      { q: "Tayyor saytga keyin o'zgartirish kirita olamanmi?", a: "Albatta! Admin panel orqali kontentni o'zingiz boshqarasiz. Kattaroq o'zgarishlar uchun esa har doim murojaat qilishingiz mumkin." },
      { q: "Qo'llab-quvvatlash bormi?", a: "Ha, topshirilgandan keyin 1 oy bepul texnik qo'llab-quvvatlash beraman. Keyin xohishga ko'ra doimiy hamkorlik kelishamiz." },
    ],
    ctaQ: 'Savolingiz qoldimi?',
    ctaBtn: 'menga yozing →',
  },
  portfolio: {
    title: 'PORTFOLIO',
    all: 'barchasi',
    empty: "// hozircha loyihalar yuklanmagan — tez orada bu yer to'ladi",
    noMatch: "// bu filter bo'yicha loyiha topilmadi",
  },
  project: {
    notFound: 'Bunday loyiha mavjud emas.',
    back: '← cd ../portfolio',
    live: "jonli ko'rish ↗",
    github: 'github kodi',
    info: '// loyiha_info',
    date: 'sana:',
    techs: 'texnologiyalar:',
  },
  blog: {
    title: 'BLOG',
    search: 'qidirish...',
    all: '#barchasi',
    empty: "// blog hozircha bo'sh — birinchi post yo'lda",
    noMatch: '// mos post topilmadi',
    read: 'cat post.md →',
  },
  post: {
    back: '← cd ../blog',
    readTime: "~{n} daqiqa o'qish",
    others: '// boshqa postlar',
    notFound: 'Bunday post mavjud emas yoki hali chop etilmagan.',
  },
  contact: {
    title: 'ALOQA',
    cEmail: 'email',
    cTelegram: 'telegram',
    cLocation: 'lokatsiya',
    cLocationVal: "O'zbekiston 🇺🇿",
    cResponse: 'javob vaqti',
    cResponseVal: 'odatda 24 soat ichida',
    orFill: "// yoki shunchaki formani to'ldiring →",
    lName: '--ism *',
    lEmail: '--email',
    lTelegram: '--telegram',
    lSubject: '--mavzu',
    lMessage: '--xabar *',
    pName: 'Ismingiz',
    pEmail: 'siz@email.com',
    pSubject: 'Loyiha haqida',
    pMessage: "Loyihangiz haqida gapirib bering...",
    send: 'yuborish ./send.sh →',
    sending: 'yuborilmoqda',
    successTitle: '[OK] Xabar yuborildi ✔',
    successText: "Tez orada siz bilan bog'lanaman. Rahmat!",
    again: 'yana yozish',
    errName: '[!] Ismingizni kiriting',
    errBody: '[!] Xabar matnini yozing (kamida 5 belgi)',
    errNet: "[XATO] Tarmoq xatosi — internetni tekshirib qayta urinib ko'ring",
    errGeneric: "Xatolik yuz berdi, keyinroq urinib ko'ring",
  },
  notFound: {
    errLine: "// XATOLIK: SIGNAL YO'QOLDI",
    text: "Siz izlagan sahifa topilmadi yoki boshqa manzilga ko'chirilgan.",
    homeBtn: 'cd ~/bosh_sahifa',
  },
  boot: {
    lines: [
      '> {site}.OS v2.6 — kernel init ............ [OK]',
      '> loading modules: react · supabase ...... [OK]',
      '> matrix rain daemon ..................... [OK]',
      '> cursor tracking system ................. [OK]',
      '> ambient creatures: bugs, snakes ........ [OK]',
      '> establishing secure channel :443 ....... [OK]',
    ],
    online: 'ALL SYSTEMS ONLINE — WELCOME, VISITOR',
    skip: "o'tkazib yuborish uchun bosing",
  },
  term: {
    welcome1: '{site}.OS terminal v2.6 — xush kelibsiz, mehmon!',
    welcome2: "buyruqlar ro'yxati uchun 'help' yozing",
    help: [
      'help          — shu yordam',
      'whoami        — siz kimsiz?',
      "ls            — sahifalar ro'yxati",
      "cd <sahifa>   — sahifaga o'tish (masalan: cd portfolio)",
      "projects      — loyihalar ro'yxati",
      'open <slug>   — loyihani ochish',
      'services      — xizmatlar',
      'blog          — blog postlari',
      "read <slug>   — postni o'qish",
      "contact       — bog'lanish ma'lumotlari",
      'lang uz|ru|en — til almashtirish',
      'date          — hozirgi vaqt',
      'echo <matn>   — matnni qaytarish',
      'clear         — ekranni tozalash',
      'hack          — 😏',
    ],
    whoami: "mehmon (visitor) — lekin bu yerda hamma o'z uyidagidek 🏠",
    denied: "ruxsat rad etildi: bu yo'l siz uchun emas 🔒",
    noPage: "cd: bunday sahifa yo'q: {x} — 'ls' yozib ko'ring",
    noProjects: '// loyihalar topilmadi',
    openHint: "qaysi loyiha? masalan: open ghost-portfolio — ro'yxat uchun 'projects'",
    servicesMore: 'batafsil: cd services',
    noServices: '// xizmatlar topilmadi',
    noPosts: '// postlar topilmadi',
    readHint: "qaysi post? ro'yxat uchun 'blog'",
    formHint: 'forma orqali: cd contact',
    tgOpening: 'telegram ochilmoqda... ✈',
    ghOpening: 'github ochilmoqda...',
    langOk: "til o'zgartirildi: {x} ✔",
    langErr: 'mavjud tillar: uz, ru, en — masalan: lang ru',
    sudo: 'xa-xa... yaxshi urinish 😏 [sudo] parol: ****** — RUXSAT RAD ETILDI',
    hack: [
      'MAXFIY PROTOKOL ISHGA TUSHIRILDI...',
      'target: pentagon.gov ... ulanmoqda',
      "firewall aylanib o'tilmoqda ▓▓▓▓▓▓░░░░ 60%",
      "parollar: 123456, qwerty, parol123 sinab ko'rilmoqda...",
      "!!! IZ ANIQLANDI — FBI YO'LDA !!!",
    ],
    hackDone: 'hazillashdim 😄 men faqat halol kod yozaman. sizga ham shuni maslahat beraman!',
    matrix: 'afsuski, qizil tabletkani allaqachon yutgansiz — siz AYNAN matritsadasiz 🐇',
    exit: 'chiqmoqchimisiz? unda: cd home 🙂',
    notFound: "buyruq topilmadi: {x} — 'help' yozing",
    working: 'ishlanmoqda',
    tip: "// maslahat: 'help' → barcha buyruqlar · ↑↓ — tarix · 'hack' ni sinab ko'ring 😉",
    boo: 'boo! 👻',
  },
}

const ru: Translation = {
  nav: { home: 'главная', about: 'обо мне', services: 'услуги', portfolio: 'портфолио', blog: 'блог', contact: 'контакты', terminal: 'терминал' },
  meta: {
    home: 'GHOST — Портфолио',
    about: 'Обо мне — GHOST',
    services: 'Услуги — GHOST',
    portfolio: 'Портфолио — GHOST',
    blog: 'Блог — GHOST',
    contact: 'Контакты — GHOST',
  },
  common: {
    loading: 'загрузка',
    viewAll: 'смотреть все →',
    details: 'подробнее →',
    empty: '// данные не найдены',
    vol: ['звук: выкл', 'звук: тихо', 'звук: средне', 'звук: громко'],
  },
  footer: {
    tagline1: '// Превращаю идеи в код.',
    tagline2: '// Сайты · Боты · Автоматизация',
    pages: '~/страницы',
    contact: '~/контакты',
    rights: 'все права защищены',
  },
  home: {
    initLine: '> initializing_portfolio... [OK]',
    roles: ['Full-stack разработчик', 'Создатель Telegram-ботов', 'Разработчик сайтов', 'Фанат UI/UX'],
    desc: 'Превращаю идеи в современные сайты, боты и приложения. Вы придумываете — я кодирую.',
    ctaProjects: './проекты',
    ctaContact: './контакты',
    marquee: ['REACT', 'TYPESCRIPT', 'NODE.JS', 'SUPABASE', 'TAILWIND', 'TELEGRAM API', 'POSTGRESQL', 'FRAMER MOTION', 'VITE', 'GIT'],
    stats: [
      { value: '3+', label: 'года опыта' },
      { value: '20+', label: 'выполненных проектов' },
      { value: '15+', label: 'довольных клиентов' },
      { value: '100%', label: 'ответственность' },
    ],
    featuredTitle: 'ИЗБРАННЫЕ ПРОЕКТЫ',
    whatIDo: 'ЧЕМ Я ЗАНИМАЮСЬ',
    testimonialsTitle: 'ОТЗЫВЫ КЛИЕНТОВ',
    ctaTitle: 'ЕСТЬ ПРОЕКТ?',
    ctaText: 'Расскажите мне свою идею — вместе превратим её в работающий продукт.',
    ctaBtn: 'давайте обсудим →',
  },
  about: {
    title: 'ОБО МНЕ',
    terminal: [
      { cmd: 'whoami', out: ['GHOST — full-stack разработчик'] },
      { cmd: 'cat skills.txt', out: ['> сайты · telegram-боты', '> админ-панели · API интеграции'] },
      { cmd: 'uptime', out: ['3+ года опыта разработки'] },
      { cmd: 'status', out: ['🟢 открыт для новых проектов'] },
    ],
    p1: 'Привет! Я GHOST — full-stack разработчик, влюблённый в веб-технологии. От простого лендинга до сложных систем управления — люблю превращать идеи в работающие продукты.',
    p2: 'Мой подход прост: чистый код, высокая скорость и удобство для пользователя. К каждому проекту отношусь как к своему — результат должен запоминаться.',
    info: {
      nick: 'ник', job: 'профессия', jobVal: 'Full-stack разработчик',
      location: 'локация', locationVal: 'Узбекистан',
      email: 'email', emailVal: 'rustamasaka1991@gmail.com',
      status: 'статус', statusVal: 'открыт для проектов 🟢',
    },
    skillsTitle: 'ТЕХНОЛОГИИ',
    skillsGroups: [
      {
        title: 'Frontend',
        skills: [
          { name: 'React / Vite', level: 90 },
          { name: 'TypeScript', level: 85 },
          { name: 'Tailwind CSS', level: 92 },
          { name: 'Framer Motion', level: 80 },
        ],
      },
      {
        title: 'Backend',
        skills: [
          { name: 'Node.js', level: 80 },
          { name: 'Supabase', level: 88 },
          { name: 'PostgreSQL', level: 75 },
          { name: 'REST API', level: 85 },
        ],
      },
      {
        title: 'Инструменты',
        skills: [
          { name: 'Telegram Bot API', level: 90 },
          { name: 'Git / GitHub', level: 85 },
          { name: 'Figma', level: 70 },
          { name: 'Linux / CLI', level: 78 },
        ],
      },
    ],
    timelineTitle: 'ПУТЬ ОПЫТА',
    timeline: [
      { year: '2021', title: 'Начало', text: 'Первый шаг в мир программирования — самостоятельно освоил основы HTML, CSS и JavaScript.' },
      { year: '2022', title: 'Первые проекты', text: 'Первые заказы: лендинги и сайты для малого бизнеса. Знакомство с React.' },
      { year: '2023 — 2024', title: 'Фриланс и боты', text: 'Фриланс: Telegram-боты, системы автоматизации и более сложные веб-приложения.' },
      { year: '2025 — сейчас', title: 'Крупные проекты', text: 'Полноценные full-stack проекты: корпоративные системы, админ-панели, современные приложения на Supabase.' },
    ],
    interestsTitle: 'ИНТЕРЕСЫ',
    interests: ['новые технологии', 'open-source', 'UI/UX дизайн', 'автоматизация', 'cyberpunk эстетика', 'шахматы', 'кофе ☕'],
  },
  services: {
    title: 'УСЛУГИ',
    empty: '// услуги пока не добавлены',
    priceLabel: 'цена',
    priceDefault: 'по договорённости',
    orderBtn: 'заказать →',
    processTitle: 'ПРОЦЕСС РАБОТЫ',
    steps: [
      { num: '01', title: 'РАЗГОВОР', text: 'Вместе определяем вашу идею и требования.' },
      { num: '02', title: 'ПЛАН', text: 'Согласовываем техплан, сроки и цену.' },
      { num: '03', title: 'КОД', text: 'Строю проект, показывая прогресс по ходу работы.' },
      { num: '04', title: 'ДЕПЛОЙ', text: 'Сдаю проект и обеспечиваю поддержку.' },
    ],
    faqTitle: 'ВОПРОС-ОТВЕТ',
    faq: [
      { q: 'Сколько времени занимает проект?', a: 'Зависит от объёма: простой лендинг 3-5 дней, корпоративный сайт 1-2 недели, сложные системы 3-6 недель. Точный срок согласуется на этапе плана и соблюдается.' },
      { q: 'Как формируется цена?', a: 'Каждый проект оценивается индивидуально — учитывается объём функций, сложность дизайна и сроки. После разговора предлагаю точную фиксированную цену.' },
      { q: 'Как происходит оплата?', a: 'Обычно 50% предоплата, 50% после сдачи проекта. Для крупных проектов возможна поэтапная оплата.' },
      { q: 'Смогу ли я потом вносить изменения на сайт?', a: 'Конечно! Через админ-панель вы сами управляете контентом. А для больших изменений всегда можете обратиться ко мне.' },
      { q: 'Есть ли поддержка?', a: 'Да, после сдачи даю 1 месяц бесплатной техподдержки. Далее по желанию договариваемся о постоянном сотрудничестве.' },
    ],
    ctaQ: 'Остались вопросы?',
    ctaBtn: 'напишите мне →',
  },
  portfolio: {
    title: 'ПОРТФОЛИО',
    all: 'все',
    empty: '// проекты пока не загружены — скоро здесь будет много всего',
    noMatch: '// по этому фильтру проектов не найдено',
  },
  project: {
    notFound: 'Такого проекта не существует.',
    back: '← cd ../portfolio',
    live: 'живое демо ↗',
    github: 'код на github',
    info: '// инфо_проекта',
    date: 'дата:',
    techs: 'технологии:',
  },
  blog: {
    title: 'БЛОГ',
    search: 'поиск...',
    all: '#все',
    empty: '// блог пока пуст — первый пост уже в пути',
    noMatch: '// подходящих постов не найдено',
    read: 'cat post.md →',
  },
  post: {
    back: '← cd ../blog',
    readTime: '~{n} мин чтения',
    others: '// другие посты',
    notFound: 'Такого поста нет или он ещё не опубликован.',
  },
  contact: {
    title: 'КОНТАКТЫ',
    cEmail: 'email',
    cTelegram: 'telegram',
    cLocation: 'локация',
    cLocationVal: 'Узбекистан 🇺🇿',
    cResponse: 'время ответа',
    cResponseVal: 'обычно в течение 24 часов',
    orFill: '// или просто заполните форму →',
    lName: '--имя *',
    lEmail: '--email',
    lTelegram: '--telegram',
    lSubject: '--тема',
    lMessage: '--сообщение *',
    pName: 'Ваше имя',
    pEmail: 'vy@email.com',
    pSubject: 'О проекте',
    pMessage: 'Расскажите о вашем проекте...',
    send: 'отправить ./send.sh →',
    sending: 'отправка',
    successTitle: '[OK] Сообщение отправлено ✔',
    successText: 'Скоро свяжусь с вами. Спасибо!',
    again: 'написать ещё',
    errName: '[!] Введите ваше имя',
    errBody: '[!] Напишите текст сообщения (минимум 5 символов)',
    errNet: '[ОШИБКА] Сетевая ошибка — проверьте интернет и попробуйте снова',
    errGeneric: 'Произошла ошибка, попробуйте позже',
  },
  notFound: {
    errLine: '// ОШИБКА: СИГНАЛ ПОТЕРЯН',
    text: 'Страница, которую вы ищете, не найдена или была перемещена.',
    homeBtn: 'cd ~/главная',
  },
  boot: {
    lines: [
      '> {site}.OS v2.6 — kernel init ............ [OK]',
      '> loading modules: react · supabase ...... [OK]',
      '> matrix rain daemon ..................... [OK]',
      '> cursor tracking system ................. [OK]',
      '> ambient creatures: bugs, snakes ........ [OK]',
      '> establishing secure channel :443 ....... [OK]',
    ],
    online: 'ALL SYSTEMS ONLINE — WELCOME, VISITOR',
    skip: 'нажмите, чтобы пропустить',
  },
  term: {
    welcome1: '{site}.OS terminal v2.6 — добро пожаловать, гость!',
    welcome2: "введите 'help' для списка команд",
    help: [
      'help          — эта справка',
      'whoami        — кто вы?',
      'ls            — список страниц',
      'cd <страница> — перейти на страницу (например: cd portfolio)',
      'projects      — список проектов',
      'open <slug>   — открыть проект',
      'services      — услуги',
      'blog          — посты блога',
      'read <slug>   — читать пост',
      'contact       — контактные данные',
      'lang uz|ru|en — сменить язык',
      'date          — текущее время',
      'echo <текст>  — вернуть текст',
      'clear         — очистить экран',
      'hack          — 😏',
    ],
    whoami: 'гость (visitor) — но здесь все как дома 🏠',
    denied: 'доступ запрещён: этот путь не для вас 🔒',
    noPage: "cd: нет такой страницы: {x} — попробуйте 'ls'",
    noProjects: '// проекты не найдены',
    openHint: "какой проект? например: open ghost-portfolio — список: 'projects'",
    servicesMore: 'подробнее: cd services',
    noServices: '// услуги не найдены',
    noPosts: '// посты не найдены',
    readHint: "какой пост? список: 'blog'",
    formHint: 'через форму: cd contact',
    tgOpening: 'открываю telegram... ✈',
    ghOpening: 'открываю github...',
    langOk: 'язык изменён: {x} ✔',
    langErr: 'доступные языки: uz, ru, en — например: lang uz',
    sudo: 'ха-ха... хорошая попытка 😏 [sudo] пароль: ****** — ДОСТУП ЗАПРЕЩЁН',
    hack: [
      'СЕКРЕТНЫЙ ПРОТОКОЛ ЗАПУЩЕН...',
      'цель: pentagon.gov ... подключение',
      'обход файрвола ▓▓▓▓▓▓░░░░ 60%',
      'подбор паролей: 123456, qwerty, parol123...',
      '!!! СЛЕД ОБНАРУЖЕН — ФБР УЖЕ В ПУТИ !!!',
    ],
    hackDone: 'шучу 😄 я пишу только честный код. и вам советую!',
    matrix: 'увы, красную таблетку вы уже приняли — вы ИМЕННО в матрице 🐇',
    exit: 'хотите выйти? тогда: cd home 🙂',
    notFound: "команда не найдена: {x} — введите 'help'",
    working: 'выполняется',
    tip: "// подсказка: 'help' → все команды · ↑↓ — история · попробуйте 'hack' 😉",
    boo: 'бу! 👻',
  },
}

const en: Translation = {
  nav: { home: 'home', about: 'about', services: 'services', portfolio: 'portfolio', blog: 'blog', contact: 'contact', terminal: 'terminal' },
  meta: {
    home: 'GHOST — Portfolio',
    about: 'About — GHOST',
    services: 'Services — GHOST',
    portfolio: 'Portfolio — GHOST',
    blog: 'Blog — GHOST',
    contact: 'Contact — GHOST',
  },
  common: {
    loading: 'loading',
    viewAll: 'view all →',
    details: 'learn more →',
    empty: '// no data found',
    vol: ['sound: off', 'sound: low', 'sound: medium', 'sound: high'],
  },
  footer: {
    tagline1: '// Turning ideas into code.',
    tagline2: '// Websites · Bots · Automation',
    pages: '~/pages',
    contact: '~/contact',
    rights: 'all rights reserved',
  },
  home: {
    initLine: '> initializing_portfolio... [OK]',
    roles: ['Full-stack developer', 'Telegram bot builder', 'Website creator', 'UI/UX enthusiast'],
    desc: 'I turn ideas into modern websites, bots and apps. You imagine it — I code it.',
    ctaProjects: './projects',
    ctaContact: './contact',
    marquee: ['REACT', 'TYPESCRIPT', 'NODE.JS', 'SUPABASE', 'TAILWIND', 'TELEGRAM API', 'POSTGRESQL', 'FRAMER MOTION', 'VITE', 'GIT'],
    stats: [
      { value: '3+', label: 'years of experience' },
      { value: '20+', label: 'projects delivered' },
      { value: '15+', label: 'happy clients' },
      { value: '100%', label: 'commitment' },
    ],
    featuredTitle: 'FEATURED PROJECTS',
    whatIDo: 'WHAT I DO',
    testimonialsTitle: 'CLIENT TESTIMONIALS',
    ctaTitle: 'GOT A PROJECT?',
    ctaText: "Tell me your idea — together we'll turn it into a working product.",
    ctaBtn: "let's talk →",
  },
  about: {
    title: 'ABOUT ME',
    terminal: [
      { cmd: 'whoami', out: ['GHOST — full-stack developer'] },
      { cmd: 'cat skills.txt', out: ['> websites · telegram bots', '> admin panels · API integrations'] },
      { cmd: 'uptime', out: ['3+ years of coding experience'] },
      { cmd: 'status', out: ['🟢 open for new projects'] },
    ],
    p1: "Hi! I'm GHOST — a full-stack developer in love with web technologies. From a simple landing page to complex management systems — I love turning ideas into working products.",
    p2: 'My approach is simple: clean code, high performance and great user experience. I treat every project as my own — the result should be unforgettable.',
    info: {
      nick: 'nick', job: 'role', jobVal: 'Full-stack developer',
      location: 'location', locationVal: 'Uzbekistan',
      email: 'email', emailVal: 'rustamasaka1991@gmail.com',
      status: 'status', statusVal: 'open for projects 🟢',
    },
    skillsTitle: 'TECH STACK',
    skillsGroups: [
      {
        title: 'Frontend',
        skills: [
          { name: 'React / Vite', level: 90 },
          { name: 'TypeScript', level: 85 },
          { name: 'Tailwind CSS', level: 92 },
          { name: 'Framer Motion', level: 80 },
        ],
      },
      {
        title: 'Backend',
        skills: [
          { name: 'Node.js', level: 80 },
          { name: 'Supabase', level: 88 },
          { name: 'PostgreSQL', level: 75 },
          { name: 'REST API', level: 85 },
        ],
      },
      {
        title: 'Tools',
        skills: [
          { name: 'Telegram Bot API', level: 90 },
          { name: 'Git / GitHub', level: 85 },
          { name: 'Figma', level: 70 },
          { name: 'Linux / CLI', level: 78 },
        ],
      },
    ],
    timelineTitle: 'EXPERIENCE PATH',
    timeline: [
      { year: '2021', title: 'The beginning', text: 'First step into programming — self-taught the basics of HTML, CSS and JavaScript.' },
      { year: '2022', title: 'First projects', text: 'First client projects: landing pages and small business websites. Getting into React.' },
      { year: '2023 — 2024', title: 'Freelance & bots', text: 'Freelancing: Telegram bots, automation systems and more complex web apps.' },
      { year: '2025 — now', title: 'Big projects', text: 'Full-scale full-stack projects: enterprise systems, admin panels, modern apps built on Supabase.' },
    ],
    interestsTitle: 'INTERESTS',
    interests: ['new technologies', 'open-source', 'UI/UX design', 'automation', 'cyberpunk aesthetics', 'chess', 'coffee ☕'],
  },
  services: {
    title: 'SERVICES',
    empty: '// no services added yet',
    priceLabel: 'price',
    priceDefault: 'negotiable',
    orderBtn: 'order now →',
    processTitle: 'WORK PROCESS',
    steps: [
      { num: '01', title: 'TALK', text: 'We define your idea and requirements together.' },
      { num: '02', title: 'PLAN', text: 'We agree on the tech plan, timeline and price.' },
      { num: '03', title: 'CODE', text: 'I build the project while showing progress along the way.' },
      { num: '04', title: 'DEPLOY', text: 'I deliver the project and provide support.' },
    ],
    faqTitle: 'FAQ',
    faq: [
      { q: 'How long does a project take?', a: 'Depends on the scope: a simple landing 3-5 days, a corporate site 1-2 weeks, complex systems 3-6 weeks. The exact deadline is agreed at the planning stage and respected.' },
      { q: 'How is the price determined?', a: 'Every project is estimated individually — feature scope, design complexity and timeline are considered. After our talk I offer an exact fixed price.' },
      { q: 'How does payment work?', a: 'Usually 50% upfront, 50% on delivery. For larger projects milestone-based payment is possible.' },
      { q: 'Can I edit the site myself later?', a: 'Of course! You manage the content yourself via the admin panel. And for bigger changes you can always reach out to me.' },
      { q: 'Is there support?', a: 'Yes, 1 month of free technical support after delivery. After that we can agree on ongoing cooperation.' },
    ],
    ctaQ: 'Still have questions?',
    ctaBtn: 'write to me →',
  },
  portfolio: {
    title: 'PORTFOLIO',
    all: 'all',
    empty: '// no projects loaded yet — this space will fill up soon',
    noMatch: '// no projects match this filter',
  },
  project: {
    notFound: 'This project does not exist.',
    back: '← cd ../portfolio',
    live: 'live demo ↗',
    github: 'github code',
    info: '// project_info',
    date: 'date:',
    techs: 'technologies:',
  },
  blog: {
    title: 'BLOG',
    search: 'search...',
    all: '#all',
    empty: '// the blog is empty for now — first post is on the way',
    noMatch: '// no matching posts found',
    read: 'cat post.md →',
  },
  post: {
    back: '← cd ../blog',
    readTime: '~{n} min read',
    others: '// more posts',
    notFound: 'This post does not exist or is not published yet.',
  },
  contact: {
    title: 'CONTACT',
    cEmail: 'email',
    cTelegram: 'telegram',
    cLocation: 'location',
    cLocationVal: 'Uzbekistan 🇺🇿',
    cResponse: 'response time',
    cResponseVal: 'usually within 24 hours',
    orFill: '// or just fill in the form →',
    lName: '--name *',
    lEmail: '--email',
    lTelegram: '--telegram',
    lSubject: '--subject',
    lMessage: '--message *',
    pName: 'Your name',
    pEmail: 'you@email.com',
    pSubject: 'About a project',
    pMessage: 'Tell me about your project...',
    send: 'send ./send.sh →',
    sending: 'sending',
    successTitle: '[OK] Message sent ✔',
    successText: "I'll get back to you soon. Thanks!",
    again: 'write again',
    errName: '[!] Please enter your name',
    errBody: '[!] Please write a message (at least 5 characters)',
    errNet: '[ERROR] Network error — check your connection and try again',
    errGeneric: 'Something went wrong, please try again later',
  },
  notFound: {
    errLine: '// ERROR: SIGNAL LOST',
    text: 'The page you are looking for was not found or has been moved.',
    homeBtn: 'cd ~/home',
  },
  boot: {
    lines: [
      '> {site}.OS v2.6 — kernel init ............ [OK]',
      '> loading modules: react · supabase ...... [OK]',
      '> matrix rain daemon ..................... [OK]',
      '> cursor tracking system ................. [OK]',
      '> ambient creatures: bugs, snakes ........ [OK]',
      '> establishing secure channel :443 ....... [OK]',
    ],
    online: 'ALL SYSTEMS ONLINE — WELCOME, VISITOR',
    skip: 'click to skip',
  },
  term: {
    welcome1: '{site}.OS terminal v2.6 — welcome, visitor!',
    welcome2: "type 'help' for the list of commands",
    help: [
      'help          — this help',
      'whoami        — who are you?',
      'ls            — list pages',
      'cd <page>     — go to a page (e.g. cd portfolio)',
      'projects      — list projects',
      'open <slug>   — open a project',
      'services      — services',
      'blog          — blog posts',
      'read <slug>   — read a post',
      'contact       — contact info',
      'lang uz|ru|en — switch language',
      'date          — current time',
      'echo <text>   — echo text back',
      'clear         — clear the screen',
      'hack          — 😏',
    ],
    whoami: 'visitor — but everyone is at home here 🏠',
    denied: 'access denied: this path is not for you 🔒',
    noPage: "cd: no such page: {x} — try 'ls'",
    noProjects: '// no projects found',
    openHint: "which project? e.g.: open ghost-portfolio — list: 'projects'",
    servicesMore: 'more: cd services',
    noServices: '// no services found',
    noPosts: '// no posts found',
    readHint: "which post? list: 'blog'",
    formHint: 'via the form: cd contact',
    tgOpening: 'opening telegram... ✈',
    ghOpening: 'opening github...',
    langOk: 'language changed: {x} ✔',
    langErr: 'available languages: uz, ru, en — e.g.: lang uz',
    sudo: 'ha-ha... nice try 😏 [sudo] password: ****** — ACCESS DENIED',
    hack: [
      'SECRET PROTOCOL INITIATED...',
      'target: pentagon.gov ... connecting',
      'bypassing firewall ▓▓▓▓▓▓░░░░ 60%',
      'trying passwords: 123456, qwerty, parol123...',
      '!!! TRACE DETECTED — FBI IS ON THE WAY !!!',
    ],
    hackDone: "just kidding 😄 I only write honest code. I recommend you do too!",
    matrix: "sorry, you've already taken the red pill — you ARE in the matrix 🐇",
    exit: 'want to leave? then: cd home 🙂',
    notFound: "command not found: {x} — type 'help'",
    working: 'working',
    tip: "// tip: 'help' → all commands · ↑↓ — history · try 'hack' 😉",
    boo: 'boo! 👻',
  },
}

export const translations: Record<Lang, Translation> = { uz, ru, en }
export const LANGS: Lang[] = ['uz', 'ru', 'en']
