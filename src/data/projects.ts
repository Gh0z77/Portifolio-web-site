/**
 * Statik loyihalar ro'yxati — saytning o'zida yotadi, Supabase'siz ham ko'rinadi.
 *
 * Yangi loyiha qo'shish:
 *   1. public/projects/<slug>.jpg ga skrinshot qo'ying (1280px kenglik yetarli)
 *   2. Pastdagi ro'yxatga yozuv qo'shing (matn o'zbekcha)
 *   3. `node scripts/translate-static.mjs` — ru/en tarjimalar avtomatik yangilanadi
 *
 * `sort` — tartib raqami (kichigi tepada). `featured: true` — bosh sahifada ko'rinadi (eng ko'pi 3 ta).
 */

export interface StaticProject {
  slug: string
  title: string
  /** Qisqa tavsif (kartada ko'rinadi, ~1-2 jumla) */
  description: string
  /** Batafsil sahifa uchun markdown */
  content?: string
  /** public/projects/ ichidagi fayl nomi */
  image?: string
  tech: string[]
  live?: string
  github?: string
  featured?: boolean
  sort?: number
  /** YYYY-MM-DD — loyiha tugatilgan sana */
  date: string
}

export interface StaticService {
  title: string
  description: string
  icon: string
  price: string
}

export const STATIC_PROJECTS: StaticProject[] = [
  {
    slug: 'uzgrow-site',
    title: 'UZ GROW — korporativ sayt',
    description:
      "Issiqxona qurish va agro-injiniring kompaniyasi UZ GROW'ning rasmiy sayti: uch tilda, admin panel va Telegram'ga tushadigan murojaatlar bilan.",
    content: `## Loyiha haqida

Kompaniyaning asosiy jonli sayti — mahsulotlar, loyihalar galereyasi, yangiliklar va murojaat formasi bitta joyda.

### Nimalar qilindi

- Next.js 16 (App Router) + React 19 asosida tez yuklanadigan sayt
- O'zbek / rus / ingliz tillari — URL o'zgarmasdan almashadi
- Supabase: ma'lumotlar bazasi va rasm/video fayllar saqlash
- Yashirin admin panel: kontent, galereya va murojaatlarni boshqarish
- Saytdan kelgan murojaatlar darhol Telegram'ga yuboriladi
- Fon videosi va to'liq mobil moslashuv, SEO (sitemap, OG, canonical)
- Vercel'da avtomatik deploy (GitHub'ga push → sayt yangilanadi)`,
    image: 'uzgrow-site.jpg',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel'],
    live: 'https://www.uzgrow.uz',
    github: 'https://github.com/uzgroww-oss/uzgrowlast-main-1',
    featured: true,
    sort: 1,
    date: '2026-10-26',
  },
  {
    slug: 'agro-alliance',
    title: 'Agro Alliance — agro blogerlar platformasi',
    description:
      "O'zbekistondagi agro blogerlarni brendlar bilan bog'lovchi marketing platformasi: agentlik, blogerlar va kompaniyalar uchun alohida kabinetlar. Web + Android + iOS.",
    content: `## Loyiha haqida

Agentlik 70–80 ta agro blogerni oylik shartnoma bilan ishlatadi, kompaniyalarga esa ularning auditoriyasini reklama sifatida sotadi. Platforma shu jarayonni raqamlashtiradi.

### Rollar

- **Agentlik (admin)** — blogerlar, kompaniyalar, kampaniyalar va statistikani boshqaradi
- **Blogerlar** — profil, auditoriya ko'rsatkichlari, topshiriqlar
- **Kompaniyalar** — login/parol bilan kabinetga kirib blogerlarni tanlaydi va hamkorlik qiladi

### Texnik tomoni

- React + TypeScript + Vite, Tailwind CSS v4
- Supabase: baza, auth, RLS himoyasi
- Capacitor orqali Android va iOS ilovalari (bitta kod bazasi)
- Xavfsizlik auditi va qattiqlashtirishlar
- Netlify'da hosting, agroalliance.uz domeni`,
    image: 'agro-alliance.jpg',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Supabase', 'Capacitor'],
    live: 'https://www.agroalliance.uz',
    github: 'https://github.com/uzgroww-oss/agro-alliance',
    featured: true,
    sort: 2,
    date: '2026-08-13',
  },
  {
    slug: 'yasa',
    title: 'Yasa — AI bilan ilova quruvchi',
    description:
      "lovable.dev uslubidagi AI ilova quruvchi: chatda nima kerakligini yozasiz, AI haqiqiy React + Vite + Tailwind loyihasini yozadi va yonida jonli ko'rsatadi.",
    content: `## Loyiha haqida

Foydalanuvchi oddiy tilda vazifa beradi — Yasa to'liq ishlaydigan React ilovasini yaratadi, jonli ko'rinishda ko'rsatadi va nashr qilib beradi.

### Imkoniyatlar

- Chat orqali yaratish: oqimli javob, fayl o'zgarishlari kartalari, AI "o'ylashi" xulosasi
- Jonli ko'rinish — har loyiha alohida subdomenda, telefon/planshet rejimi, konsol
- Avtomatik tuzatish: build xatosi bo'lsa AI o'zi 2 martagacha tuzatadi
- Elementni tanlash: ko'rinishdagi elementni bosib, aynan shuni o'zgartirishni so'rash
- Kod muharriri, versiyalar tarixi, tiklash, Bekor qilish / Qaytarish
- Nashr qilish, hamjamiyat va remiks, ZIP yuklab olish
- Bir nechta AI provayder: Claude, Gemini, OpenAI-mos (OpenRouter, DeepSeek, Groq, Ollama) va kalitsiz demo rejim
- Interfeys uch tilda: o'zbek, rus, ingliz`,
    image: 'yasa.jpg',
    tech: ['React', 'TypeScript', 'Vite', 'Node.js', 'Claude API', 'Gemini'],
    github: 'https://github.com/Gh0z77/yasa',
    featured: true,
    sort: 3,
    date: '2026-10-14',
  },
  {
    slug: 'uz-grow-xodim',
    title: 'XODIM UZ GROW — korxona boshqaruv platformasi',
    description:
      "UZ GROW korxonasining ichki xodimlarni boshqarish tizimi: 15 rol uchun alohida kabinet, umumiy Express backend va Neon Postgres bazasi. Android ilovasi ham bor.",
    content: `## Loyiha haqido

Kompaniyaning barcha bo'limlari — administrator, rahbarlar, menejerlar, HR, buxgalteriya va boshqa 15 rol — bitta platformada ishlaydi. Har rol o'z ish maydoni, navigatsiyasi va ma'lumotlariga ega.

### Nimalar bor

- Rol asosida himoyalangan marshrutlar va JWT autentifikatsiya
- Admin panel: foydalanuvchilar, rollar, parollar, faollik jurnali
- Rollararo umumiy komponentlar: AI yordamchi, profil, asboblar
- Fayllarni guruhlash, sahifalash, tezlik optimizatsiyasi
- Express backend + Neon Postgres (serverless)
- Capacitor orqali Android ilova
- To'liq hujjatlar: topshirish, integratsiya va deploy qo'llanmalari`,
    image: 'uz-grow-xodim.jpg',
    tech: ['React', 'TypeScript', 'Vite', 'Express', 'PostgreSQL', 'Capacitor'],
    live: 'https://uz-grow-xodim.vercel.app',
    github: 'https://github.com/rustamasaka1991-png/uz-grow-xodim',
    featured: true,
    sort: 4,
    date: '2026-10-27',
  },
  {
    slug: 'uzgrow-bot',
    title: 'Uzgrow — mijozlar va xodimlar Telegram botlari',
    description:
      "Ikki Telegram bot va xodimlar uchun Mini App: mijoz xodimning shaxsiy havolasi orqali darhol chat boshlaydi, xodimlar esa barcha suhbatlarni Telegram ichidagi ilovada yuritadi.",
    content: `## Loyiha haqida

- **Mijozlar boti** — mijoz operator yoki menejerni tanlaydi (yoki xodimning shaxsiy havolasi orqali to'g'ridan-to'g'ri yozadi), birinchi xabarga avto-javob
- **Xodimlar boti** — chatlar ro'yxati, tarix, javob berish, onlayn/oflayn holat; admin panel: xodim qo'shish, bloklash; ROP uchun ommaviy xabar va shikoyatlar
- **Mini App** — Telegram ichida ochiladigan chat oynasi, profil va admin panel; fon prefetch va kesh bilan tez yuklanadi

### Maxfiylik

Har suhbatni faqat mijoz va u tanlagan xodim ko'radi. Shikoyat qilingan suhbatni faqat ROP va developer o'qiy oladi. Barcha xabarlar Supabase bazasida.`,
    image: 'uzgrow-bot.jpg',
    tech: ['TypeScript', 'Telegram Bot API', 'Mini App', 'Supabase', 'Vercel'],
    live: 'https://uzgrow-bot.vercel.app',
    github: 'https://github.com/rustamasaka1991-png/uzgrow-bot',
    sort: 5,
    date: '2026-10-07',
  },
  {
    slug: 'uzgrow-dashboard',
    title: "Uz-Grow — sotuv bo'limi KPI dashboard",
    description:
      "Sotuv menejerlarining kunlik / haftalik / oylik KPI natijalari va reytingi: qo'ng'iroqlar OnlinePBX'dan, sotuvlar amoCRM'dan avtomatik keladi.",
    content: `## Loyiha haqida

Rahbariyat uchun jonli doska: kim nechta real qo'ng'iroq qildi, qancha gaplashdi, nechta bitim yopdi — hammasi avtomatik hisoblanadi.

### Imkoniyatlar

- OnlinePBX integratsiyasi: real aloqa soni, suhbat vaqti
- amoCRM integratsiyasi: yutilgan bitimlar soni va summasi
- Ustiga bosib tahrirlash: plan, bonus, kunlik natija — Enter saqlaydi, Esc bekor qiladi
- Reyting: KPI foizlaridan ball, 1-2-3 medallar, oy lideri, kunlik bonus g'oliblari
- Filtr: kun / hafta / oy / yil / oraliq, xodimlar va KPI bo'yicha saralash
- Xodimlar: qo'shish, rasm, ichki raqam, amoCRM ID, faolsizlantirish`,
    image: 'uzgrow-dashboard.jpg',
    tech: ['Node.js', 'JavaScript', 'OnlinePBX API', 'amoCRM API', 'Vercel'],
    live: 'https://dashboard-three-roan-78.vercel.app',
    github: 'https://github.com/rustamasaka1991-png/dashboard',
    sort: 6,
    date: '2026-10-07',
  },
  {
    slug: 'uzgrow-org',
    title: 'UZ-GROW — tashkiliy tuzilma',
    description:
      "Kompaniya bo'limlari, xodimlar va ularning 10 bo'limli anketalarini yuritish uchun React ilova: ta'sischi → CEO → bo'limlar daraxti, baholash va chop etish.",
    content: `## Loyiha haqida

- Umumiy tuzilma: ta'sischi → CEO → bo'limlar; bo'lim va xodim qo'shish
- Bo'lim kabineti: daraxt (rahbar → xodimlar → guruhlar), anketa to'ldirilganlik foizi, vazifalar
- Xodim anketasi — 10 bo'lim: shaxsiy, ta'lim, mehnat, oila, shaxsiyat, hobbi, maqsad, baholash, rivojlanish, takliflar
- Baholash: 6 mezon, 100 ball, daraja avtomatik
- Rasm yuklash (avtomatik 512px), chop etish rejimi
- Server kerak emas — ma'lumotlar brauzerda saqlanadi; jonli sayt sinovi va kamchiliklar ro'yxati bilan topshirilgan`,
    image: 'uzgrow-org.jpg',
    tech: ['React', 'TypeScript', 'Vite', 'Vercel'],
    live: 'https://uzgrow-org.vercel.app',
    github: 'https://github.com/rustamasaka1991-png/uzgrow-org',
    sort: 7,
    date: '2026-10-27',
  },
  {
    slug: 'grow-eco',
    title: 'GROW ECO — investitsiya smeta platformasi',
    description:
      "Rahbariyat uchun jonli taqdimot-kalkulyator: chapda raqamlar kiritiladi, o'ngda 4 biznes modelning natijalari, KPI va grafiklar real vaqtda o'zgaradi.",
    content: `## Loyiha haqida

Besh tab: Smart Issiqxona, Ulgurji Bozor, Moliyaviy Yordam (SaaS), O'quv Markazlari va ularning umumiy konsolidatsiyasi (ECO).

### Imkoniyatlar

- Har tabda hisob-kitob paneli va jonli natijalar: KPI, grafiklar
- 3 yillik o'sish strategiyasi va jamlangan pul oqimi
- USD ↔ UZS valyuta almashtirish
- Taqdimot rejimi — panellar yashirinadi, raqamlar kattalashadi
- Ssenariylarni nom bilan saqlash va qaytarish: Supabase cloud + localStorage zaxira, avto-saqlash`,
    image: 'grow-eco.jpg',
    tech: ['JavaScript', 'HTML', 'CSS', 'Supabase', 'Vercel'],
    live: 'https://grow-eco-two.vercel.app',
    github: 'https://github.com/rustamasaka1991-png/grow-eco',
    sort: 8,
    date: '2026-10-01',
  },
  {
    slug: 'vakansiya-bot',
    title: 'UZ-GROW — ishga qabul Telegram boti',
    description:
      "Reklamadan kelgan nomzodlarni avtomatik saralaydigan, anketa oladigan va HR bo'limiga tayyor kartochka yuboradigan Telegram bot + Mini App anketa.",
    content: `## Loyiha haqida

- Bosqichma-bosqich oqim: talabnoma → kompaniya taklifi → anketa → tasdiqlash
- Har lavozim uchun alohida talabnoma, taklif va savollar
- Reklama manbasini kuzatish (deep-link: Instagram, Telegram, TikTok, Facebook, bloger)
- HR kartochkasi + tugmalar: uchrashuv belgilash / rad etish / qo'shimcha savol
- Nomzod HR savoliga javob bera oladi — javob HR'ga qaytadi
- Admin panel: nomzodlar, lavozim/holat bo'yicha saralash, statistika, Excel hisobot, nomzodni butunlay o'chirish
- Rollar: nomzod / HR admin / super admin; Vercel serverless'da ishlaydi`,
    image: 'vakansiya-bot.jpg',
    tech: ['Python', 'aiogram', 'Telegram Mini App', 'SQLite', 'Vercel'],
    github: 'https://github.com/rustamasaka1991-png/vakansiya-bot',
    sort: 9,
    date: '2026-10-14',
  },
  {
    slug: 'uzgrow-voice',
    title: "UzGrow Voice — qo'ng'iroqlar tahlili paneli",
    description:
      "Savdo bo'limi telefon suhbatlarini o'zbek va rus tillarida matnga aylantirib, menejerlarni nazorat ro'yxati bo'yicha baholaydigan panel.",
    content: `## Loyiha haqida

- Umumiy ko'rinish: KPI kartalar, natijalar grafigi, soatlar bo'yicha qo'ng'iroqlar, zaif mezonlar, e'tirozlar, til/sheva, mavzular
- Qo'ng'iroqlar: filtrlar (menejer, natija, tur, til, yo'nalish), qidiruv, saralash, CSV eksport
- Qo'ng'iroq sahifasi: audio pleyer + transkript (tarjima, kuzatish, tezlik), nazorat ro'yxati bahosi, kayfiyat, izohlar
- Menejerlar: jadval + kuchli/zaif tomonlar matritsasi, har menejer profili va tavsiyalar
- Sozlamalar: API kalit, til, model, kompaniya lug'ati, baholash mezonlari muharriri
- Next.js 15 (App Router) + TypeScript + Tailwind 4; namunaviy 20 qo'ng'iroq bilan darrov ishlaydi`,
    image: 'uzgrow-voice.jpg',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'AI'],
    sort: 10,
    date: '2026-08-26',
  },
  {
    slug: 'listingforge',
    title: 'ListingForge — AI mahsulot tavsiflari',
    description:
      "Etsy, Amazon, Shopify va eBay sotuvchilari uchun AI listing generator: mahsulot nomi va bir necha jumla → sarlavha, tavsif, SEO teglar, reklama matni va tarjimalar.",
    content: `## Loyiha haqida

Sotuvchi mahsulot nomi va qisqa izoh yozadi — ilova platforma talablariga mos sarlavha, tavsif, bullet pointlar, 13 ta SEO teg, long-tail kalit so'zlar, reklama matni va ixtiyoriy tarjimalarni qaytaradi.

### Texnik tomoni

- Next.js 16 (App Router), TypeScript, Tailwind 4
- Bepul AI provayderlar zanjiri: Gemini → OpenAI-mos API → Pollinations; kalitsiz ham ishlaydi
- Bir xil generatorni ishlatadigan Telegram bot (webhook)
- Hisobsiz, to'lovsiz bepul beta: har tashrifchiga kunlik limit
- Global (inglizcha) auditoriya uchun landing va generator sahifasi`,
    image: 'listingforge.jpg',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'Gemini', 'Telegram Bot API'],
    sort: 11,
    date: '2026-10-28',
  },
  {
    slug: 'ai-app-builder',
    title: "AI App Builder — g'oyadan ilovagacha",
    description:
      "G'oyani yozasiz — AI Next.js ilovasini yozadi, alohida sandbox'da ishga tushiradi va jonli preview beradi. Loyihalar, xabarlar tarixi va fragmentlar bazada saqlanadi.",
    content: `## Loyiha haqida

- Prompt → AI agent kod yozadi → E2B sandbox'da build → jonli preview havolasi
- Tayyor shablonlar: CRM, e-commerce, blog, dashboard, landing, chat ilova
- Loyihalar va xabarlar tarixi: har javob fragment (kod + preview) sifatida saqlanadi
- Fon ishlar Inngest orqali: uzun AI generatsiya brauzerni bloklamaydi
- Next.js (App Router) + tRPC + Prisma + Inngest + E2B sandboxes
- Interfeys o'zbek tilida`,
    image: 'ai-app-builder.jpg',
    tech: ['Next.js', 'TypeScript', 'tRPC', 'Prisma', 'Inngest', 'E2B'],
    sort: 12,
    date: '2026-09-18',
  },
  {
    slug: 'gracia',
    title: 'Gracia Family — restoran sayti',
    description:
      "Andijondagi italyan oilaviy restorani uchun monoxrom lyuks sayt: interaktiv taom vitrinasi, filtrlanadigan menyu, oldindan buyurtma va zal rejasidan stol bron qilish.",
    content: `## Loyiha haqida

- Interaktiv taom spotlight va filtrlanadigan karta (menyu)
- Oldindan buyurtma ro'yxati
- Zal rejasidan stol tanlab bron qilish
- Menejerlar uchun parol bilan himoyalangan boshqaruv xonasi
- O'zbek, rus va ingliz — avtomatik tanlanadi
- TanStack Start (SSR) + React 19 + Tailwind CSS v4 + Supabase; barcha animatsiyalar sof CSS`,
    image: 'gracia.jpg',
    tech: ['TanStack Start', 'React', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel'],
    live: 'https://gracia-digital-elegance.vercel.app',
    github: 'https://github.com/Gh0z77/gracia-digital-elegance',
    sort: 12,
    date: '2026-08-15',
  },
  {
    slug: 'gracia-miniapp',
    title: 'Gracia — Telegram Mini App',
    description:
      "Gracia restorani mijozlari uchun Telegram ichidagi ilova: menyu, savat, yetkazib berish, stol bron qilish, keshbek va anketa — hammasi botdan chiqmasdan.",
    content: `## Loyiha haqida

- Bosh sahifa: keshbek balansi, ommabop taomlar, tezkor tugmalar
- Menyu va savat, yetkazib berishga buyurtma
- Stol bron qilish
- Profil va anketa to'ldirib sovg'a keshbek olish
- Telegram initData orqali xavfsiz autentifikatsiya
- FastAPI backend, Vercel serverless'da`,
    image: 'gracia-miniapp.jpg',
    tech: ['Python', 'FastAPI', 'Telegram Mini App', 'JavaScript', 'Vercel'],
    live: 'https://gracia-sage.vercel.app',
    sort: 13,
    date: '2026-08-28',
  },
  {
    slug: 'yesmine',
    title: "Yesmine — ayollar kiyimi internet-do'koni",
    description:
      "Yesmine brendi uchun to'liq e-commerce: dizayn tizimi, landing, do'kon, savat, yetkazib berish manzili bilan checkout va real bazaga ulangan admin panel.",
    content: `## Loyiha haqida

- Brend dizayn tizimi: logotipdan olingan rang palitrasi, serif sarlavhalar, mesh-gradient fonlar
- Landing, katalog, mahsulot sahifasi, savat, checkout (demo to'lov + yetkazib berish manzili)
- Admin panel: mahsulotlar, buyurtmalar, mijozlar — Supabase bazasida real ma'lumot
- TanStack Start (SSR) + React 19 + Tailwind 4
- Xodimlar uchun alohida panel (Yesmine xodimlar paneli) bir xil bazaga ulanadi`,
    tech: ['TanStack Start', 'React', 'TypeScript', 'Tailwind', 'Supabase'],
    github: 'https://github.com/Gh0z77/yesmine-boutique-suite',
    sort: 14,
    date: '2026-08-14',
  },
  {
    slug: 'yesmine-panel',
    title: 'Yesmine — xodimlar paneli',
    description:
      "Do'kon xodimlari uchun alohida ilova: bitta login — baza xodimning lavozimini aniqlab o'z paneliga tushiradi. Himoya kodda emas, bazada (RLS + has_permission).",
    content: `## Loyiha haqida

Xodim email va parolni yozadi — qayerga tushishini brauzer emas, baza hal qiladi. Menyu ham huquqlardan tuziladi: kassirda "Moliya" bo'limi umuman ko'rinmaydi.

### Sahifalar (har biri o'z huquqi bilan)

- Boshqaruv paneli, kassa va smena
- Lidlar, buyurtmalar, mahsulotlar, mijozlar
- Marketing / SMM, xodimlar, moliya, ta'minot

Manzilni qo'lda yozib boshqa bo'limga o'tib bo'lmaydi — sahifa qaytaradi, baza baribir ma'lumot bermaydi.`,
    image: 'yesmine-panel.jpg',
    tech: ['React', 'TypeScript', 'Vite', 'Supabase', 'PostgreSQL'],
    github: 'https://github.com/Gh0z77/yesmine-panel',
    sort: 15,
    date: '2026-08-20',
  },
  {
    slug: 'yasmine-xodim',
    title: 'Yasmine Xodim — HR platforma',
    description:
      "Xodimlarni boshqarish platformasi: imkoniyatlar, modullar, narxlar va mijozlar sahifali landing, rol tanlab kiriladigan ilova va JWT bilan himoyalangan backend.",
    content: `## Loyiha haqida

- Landing: bosh sahifa, imkoniyatlar, modullar, narxlar, mijozlar
- Ilova qismi: rol tanlash → email/parol → ish maydoni
- Express backend, JWT imzo kaliti bazada saqlanadi
- React + TypeScript + Vite + Tailwind
- Render va Vercel'ga deploy konfiguratsiyasi`,
    image: 'yasmine-xodim.jpg',
    tech: ['React', 'TypeScript', 'Vite', 'Express', 'JWT'],
    github: 'https://github.com/rustamasaka1991-png/yasmine-xodim',
    sort: 16,
    date: '2026-08-29',
  },
  {
    slug: 'shoxtaxi',
    title: 'SHOX TAXI — shaharlararo taksi Mini App',
    description:
      "Haydovchi va yo'lovchini bir joyda uchrashtiruvchi Telegram Mini App: o'rindiq xaritasi va narxi, bron kodi, ikki tomonlama baho, ishonchlilik foizi va pochta xizmati.",
    content: `## Loyiha haqida

Muammo: sho'pirni guruhlar orqali topish — kim, qachon, qaysi o'rindiqda ketishi noma'lum. Ilovada hamma narsa yozma va kuzatiladi.

### Imkoniyatlar

- E'lonlar lentasi: haydovchi safarlari va yo'lovchi buyurtmalari, shahar/sana filtri
- Bron: o'rindiq xaritasidan tanlash, avtomatik tasdiq, 4 raqamli bron kodi
- Ishonch: ikki tomonlama baho va teglar, past reytingda avto-suspend
- "Tayyorman" tasdig'i, haydovchi almashtirish faqat barcha yo'lovchi roziligi bilan
- Pochta: Toshkentga ketayotgan haydovchiga yuk berish, o'lcham bo'yicha narx
- Aloqa faqat ilova ichida — telefon raqami ko'rsatilmaydi
- FastAPI + SQLAlchemy + Alembic migratsiyalar, Telegram bot bildirishnomalari`,
    image: 'shoxtaxi.jpg',
    tech: ['Python', 'FastAPI', 'SQLAlchemy', 'Telegram Mini App', 'JavaScript'],
    github: 'https://github.com/shoxtaxiuz-netizen/shoxtaxi',
    sort: 17,
    date: '2026-09-25',
  },
  {
    slug: 'smart-attire',
    title: 'Virtual Try-On — kiyimni AI bilan kiydirish',
    description:
      "Kiyim do'koni uchun AI yordamida kiyimni mijoz suratiga \"kiydirib\" ko'rsatadigan web ilova: surat yuklanadi → kiyim tanlanadi → natija yuklab olinadi. Ro'yxatdan o'tish shart emas.",
    content: `## Loyiha haqida

- 3 qadamli try-on sahifasi: surat → kiyim → natija
- Yashirin admin panel: kiyimlar katalogini boshqarish (sarlavhani 5 marta bosib ham ochiladi)
- Gemini image editing (Lovable AI Gateway / Google AI Studio / OpenRouter)
- Supabase: garments jadvali va Storage bucket, migratsiyalar bilan
- TanStack Start (SSR) + React 19 + Tailwind v4
- Alohida Python kutubxona (CLI va bot/backend uchun): odam rasmi + kiyim rasmi → natija`,
    tech: ['TanStack Start', 'React', 'TypeScript', 'Supabase', 'Gemini', 'Python'],
    sort: 18,
    date: '2026-08-14',
  },
  {
    slug: 'moneyflow',
    title: 'MoneyFlow — shaxsiy moliya yordamchisi',
    description:
      "O'zbekcha shaxsiy moliya ilovasi: balans, byudjetlar, maqsadlar, obunalar, qarzlar, tahlil grafiklari va faqat real ma'lumotdan javob beradigan AI yordamchi.",
    content: `## Loyiha haqida

ENTER → SAQLASH → HISOBLASH → TAHLIL → HISOBOT → MAQSAD → ODAT

- Dashboard: balans, daromad/xarajat/jamg'arma, kun/hafta/oy, byudjet qoldig'i, kunlik limit
- Amallar: qidirish, filtr, saralash, tahrirlash, nusxalash
- Tahlil: daromad vs xarajat, kunlik grafik, kategoriyalar, moliyaviy salomatlik bali, bashorat
- Maqsadlar: progress, oylik kerakli summa, taxminiy yakun
- Profil: byudjetlar (70/90/100% ogohlantirish), obunalar, qarzlar, takroriy to'lovlar, CSV/PDF eksport, valyuta, tun/kun rejimi
- AI yordamchi hech qachon son to'qimaydi — faqat real hisob-kitobdan
- Next.js 14 + Recharts; offline localStorage, production uchun Supabase sxema tayyor`,
    image: 'moneyflow.jpg',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Recharts'],
    sort: 19,
    date: '2026-09-23',
  },
  {
    slug: 'kcal',
    title: 'kcal — energiya va vazn hisobi (PWA)',
    description:
      "Shaxsiy energiya hisob tizimi: nima yedingiz, qancha sarfladingiz va bu vaznga nima qiladi. Telefon sensorlari, kamera tahlili va o'z tarozingizga moslashadigan model.",
    content: `## Loyiha haqida

Har raqam o'z ishonchlilik darajasi bilan keladi, har baho qayerdan kelganini aytadi, ma'lumotsiz kun "ma'lumot yo'q" deb yoziladi — hech qachon nol emas.

### Nimalar bor

- Energiya sarfi: 5 ta nashr etilgan tenglamadan biri (BMR), ovqat termik effekti, ACSM yurish/yugurish, mashg'ulotlar
- Telefon sensorlari orqali faollik kuzatuvi
- Qurilma ichida kamera tahlili: mashg'ulotlar (pose model) va oziq-ovqat yorliqlari
- O'z tarozi ko'rsatkichlariga kalibrlanadigan vazn bashorati
- Auditga ochiq ledger: har kilokaloriya o'z manbasi bilan
- PWA — telefonga o'rnatiladi; 671 ta test, qat'iy TypeScript`,
    image: 'kcal.jpg',
    tech: ['Next.js', 'TypeScript', 'PWA', 'On-device ML', 'Tailwind'],
    sort: 20,
    date: '2026-08-23',
  },
  {
    slug: 'upseller',
    title: 'UpSell — akademiya, CRM va moliya paneli',
    description:
      "Sotuv o'qitish akademiyasi uchun boshqaruv tizimi: rollar va ruxsatlar, CRM, moliya hisobi va real vaqt yangilanishlar — Next.js 15 + Supabase.",
    content: `## Loyiha haqida

- Rollar va ruxsatlar: CEO, menejer, o'qituvchi va boshqalar — seed bilan tayyor
- Login: foydalanuvchi oddiy login kiritadi, tizim uni ichki emailga aylantiradi
- CRM: lidlar, mijozlar, xizmat turlari
- Moliya: to'lovlar, hisobotlar, Recharts grafiklari
- Supabase: Postgres + Auth + Realtime, RLS siyosatlari migratsiyalarda
- Next.js 15 (App Router) + TypeScript + Tailwind`,
    image: 'upseller.jpg',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Recharts'],
    sort: 21,
    date: '2026-09-07',
  },
  {
    slug: 'aytla',
    title: 'Aytla — gapirishga asoslangan til kursi',
    description:
      "O'zbek, rus va turk tilida so'zlashuvchilar uchun ingliz / rus / turk / o'zbek tili kursi: har dars gapirish bilan tugaydi. Bitta kod — web, Android va iOS.",
    content: `## Loyiha haqida

- Har dars oxirgi 3 mashqi — "ayt" mashqlari: o'rganganini gapirib (mikrofonsiz — yozib) beradi
- Bitta kurs, to'rt maqsad tili: har so'z va jumla uz / ru / tr tarjimasi bilan yoziladi
- Yo'l maqsaddan boshlanadi: kundalik, sayohat, ish, o'qish — mos bo'limlar oldinga chiqadi
- Hisoblar, bulutli sinxronizatsiya, haftalik ligalar, AI bilan suhbat mashqi uchun kichik API
- Expo + React Native + react-native-web; 3D landing sahifa va Remotion intro videosi`,
    image: 'aytla.jpg',
    tech: ['Expo', 'React Native', 'TypeScript', 'Node.js', 'Remotion'],
    github: 'https://github.com/Gh0z77/aytla',
    sort: 22,
    date: '2026-10-27',
  },
  {
    slug: 'ad-post-bot',
    title: 'Avto-Xabar — Telegram broadcast bot + web panel',
    description:
      "Foydalanuvchi xabar (matn + rasm), interval va guruhlarni tanlaydi — bot belgilangan vaqtda Telegram guruhlariga avtomatik yuboradi. Founder panel: statistika, userlar, ban, announce.",
    content: `## Loyiha haqida

- Telegram bot: ro'yxatdan o'tish, guruhlar ro'yxati, web panelga shaxsiy havola
- Web panel (Flask): xabar matni + rasm, interval, guruh tanlash, Start / Stop / Test
- Fon scheduler har 30 soniyada vaqti kelganlarni yuboradi
- Founder panel: statistika, userlar/ban, announce, stopall
- Yagona DB sxemasi, HMAC web auth, Vercel serverless webhook + Render variantlari`,
    image: 'ad-post-bot.jpg',
    tech: ['Python', 'aiogram', 'Flask', 'SQLite', 'Vercel'],
    github: 'https://github.com/Gh0z77/ad-post-bot',
    sort: 23,
    date: '2026-09-25',
  },
  {
    slug: 'instagram-mcp',
    title: 'Instagram Comments MCP server',
    description:
      "Claude'ga Instagram post/reels izohlarini o'qish va javob berish imkonini beruvchi MCP server: \"oxirgi reelsdagi narx so'raganlarga javob ber\" — bitta buyruq bilan.",
    content: `## Loyiha haqida

Claude javob matnini o'zi yozadi; server faqat Instagram o'qish va bitta yozish amalini tool sifatida beradi.

### Tool'lar

- list_recent_media — oxirgi postlar/reelslar
- get_media_details — bitta post tafsiloti
- get_comments — javob berilmagan izohlar (allaqachon javob berilganlar chiqarib tashlanadi — bir odamga ikki marta javob bermaslik uchun)
- reply_to_comment — ommaviy javob

Parol bilan himoyalangan kichik web sahifa orqali Instagram hisobi bir bosishda ulanadi — tokenlarni qo'lda ko'chirish shart emas. Next.js + Vercel.`,
    image: 'instagram-mcp.jpg',
    tech: ['Next.js', 'TypeScript', 'MCP', 'Instagram Graph API', 'Vercel'],
    live: 'https://instagram-comments-mcp.vercel.app',
    sort: 24,
    date: '2026-08-17',
  },
  {
    slug: 'mood-drop',
    title: 'MOOD DROP — kichkina syurpriz',
    description:
      "Yaqin insonga kichkina raqamli syurpriz yaratib, havola bilan yuborish: rasmlar, kayfiyat tanlovi, uchuvchi zarrachalar, yurakchalar va musiqa.",
    content: `## Loyiha haqida

- Yaratuvchi sahifa: rasm yuklash, kayfiyat/uslub tanlash, bosqichma-bosqich progress
- Ko'rish sahifasi: havola orqali ochiladi, bosganda yurakchalar, uchuvchi zarrachalar, ovoz
- Mobilga mo'ljallangan, gorizontal scroll'siz, juda yengil
- React + TypeScript + Vite + Tailwind`,
    image: 'mood-drop.jpg',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind'],
    sort: 25,
    date: '2026-09-15',
  },
  {
    slug: 'python-kiosk',
    title: "Python Kiosk Tutor — desktop o'rgatuvchi",
    description:
      "Shaxsiy Python o'rgatuvchi desktop ilova: kuniga bir marta ochasiz, \"Boshlash\"ni bosasiz — ilova qulflanadi va 2 soat aktiv o'qish tugamaguncha chiqib bo'lmaydi.",
    content: `## Loyiha haqida

JavaScript dasturchisi uchun mo'ljallangan: har mavzu JS bilan solishtirib tushuntiriladi.

- Kiosk rejim: oyna o'zini yuqoriga qaytaradi, fokusni tortib oladi, tizim tugmalari uch qatlamda bloklanadi
- Sessiya tiklanadi: Task Manager'dan o'ldirsangiz ham ilovani qayta ochganda qulf qaytadi
- Timer ilova yopiq vaqtni hisoblamaydi
- Darslar JSON formatda, kunlik reja
- Electron + Vite + React; Windows 11'da o'lchangan halol hujjatlar`,
    tech: ['Electron', 'React', 'Vite', 'JavaScript'],
    sort: 26,
    date: '2026-08-19',
  },
  {
    slug: 'smartrazgon',
    title: 'SmartRazgon — MT5 savdo roboti + dashboard',
    description:
      "MetaTrader 5 uchun intraday robot (Expert Advisor): bir nechta juftlik va oltinni kuzatadi, har savdoni SL/TP bilan ochadi, nima sababdan kirganini grafikda chizib beradi. Web dashboard va Telegram bot bilan.",
    content: `## Loyiha haqida

- Robot (MQL5): tahlil, savdo, risk nazorati, grafikda sabablarni chizish
- Web dashboard (Python): holat, grafiklar, savdo sabablari, sozlamalar, boshqaruv
- Demo rejim: MT5'siz simulyator bilan ishlash
- Telegram bot: robotni telefondan kuzatish va boshqarish
- Backtest hisobotlari, strategiya va arxitektura hujjatlari
- Ogohlantirish: hech bir robot foyda kafolatlamaydi — avval demo, keyin cent hisobda sinash tavsiya qilinadi`,
    image: 'smartrazgon.jpg',
    tech: ['MQL5', 'Python', 'JavaScript', 'Telegram Bot API'],
    sort: 27,
    date: '2026-10-27',
  },
  {
    slug: 'pet-mutation-lab',
    title: "Pet Mutation Lab — Roblox o'yini",
    description:
      "To'liq Roblox pet-simulyator: tuxum ochish, jonzotlarni Mutation Reactor'da birlashtirish, yangi turlarni kashf qilish, olamlarni ochish, questlar va Top Mutators reytingi.",
    content: `## Loyiha haqida

- Barcha assetlar protsedural — original jonzotlar, xarita va UI
- Luau manba kodi Rojo tartibida (server/client/ModuleScripts)
- StudioSync vositasi: Rojo'siz ham istalgan bo'sh place'ga sinxronlash
- Tuxum ochish, mutatsiya reaktori, olamlar, questlar, leaderboard, Halloween petlar
- Remotion'da tayyorlangan treyler videosi
- Arxitektura, test rejasi, relizga chiqarish hujjatlari`,
    image: 'pet-mutation-lab.jpg',
    tech: ['Luau', 'Roblox Studio', 'Rojo', 'Remotion'],
    sort: 28,
    date: '2026-10-27',
  },
  {
    slug: 'motion-design',
    title: 'Vector PRO — motion design treyler',
    description:
      "Telefon mockup ichida kodda chizilgan motion-design treyler: grid, grain, glow effektlari, keyin Playwright + FFmpeg bilan 30 fps MP4 videoga render qilinadi.",
    content: `## Loyiha haqida

- Sof HTML + CSS + JavaScript animatsiya, tashqi kutubxonasiz
- Kadrlar Playwright bilan olinadi, FFmpeg bilan 30 fps videoga yig'iladi
- Poster, brief, casting, box, phones — alohida still kadrlar
- Ijtimoiy tarmoqlar uchun vertikal format`,
    image: 'motion-design.jpg',
    tech: ['HTML', 'CSS', 'JavaScript', 'Playwright', 'FFmpeg'],
    sort: 29,
    date: '2026-10-03',
  },
  {
    slug: 'uy-ishlari-bot',
    title: 'Uy ishlari — maktab Telegram boti',
    description:
      "O'qituvchi, starosta, o'quvchi va developer rollari bilan uy vazifalari, eslatmalar va dars jadvalini boshqaruvchi Telegram bot. Har kuni avtomatik eslatmalar.",
    content: `## Loyiha haqida

- Rollar: developer (hammasi), o'qituvchi (vazifa, eslatma, jadval), starosta, o'quvchi
- Vazifalarni olish, tasdiqlash, bajarilgan deb belgilash
- Avtomatik eslatmalar: 07:30 bugungi jadval, 08:00 muddati yaqin vazifalar, 19:30 ertangi darslar
- Statistika va o'chirish — developer uchun
- Python + aiogram + SQLite`,
    tech: ['Python', 'aiogram', 'SQLite', 'Telegram Bot API'],
    sort: 30,
    date: '2026-10-21',
  },
  {
    slug: 'ghost-portfolio',
    title: 'GHOST Portfolio',
    description:
      "Cyberpunk-terminal uslubidagi shaxsiy portfolio — siz hozir ko'rib turgan sayt. React, Supabase va Framer Motion bilan qurilgan.",
    content: `## Loyiha haqida

Bu sayt to'liq **React + TypeScript** asosida qurilgan, backend sifatida **Supabase** ishlatiladi; loyihalar ro'yxati esa saytning o'zida yotadi — baza o'chiq bo'lsa ham ishlayveradi.

### Xususiyatlar

- Matrix uslubidagi jonli fon, maxsus kursor, 8-bit ovozlar
- Glitch / decode matn animatsiyalari, boot ekrani
- Uch til (uz / ru / en) — avtomatik tarjima
- Admin panel: loyihalar, blog, xizmatlar, xabarlar, statistika
- Kontakt forma → Telegram xabarnoma
- O'z analytics tizimi (cookie'siz)`,
    image: 'ghost-portfolio.jpg',
    tech: ['React', 'TypeScript', 'Supabase', 'Tailwind', 'Framer Motion', 'Vite'],
    live: 'https://portifolio-web-site-three.vercel.app',
    github: 'https://github.com/Gh0z77/Portifolio-web-site',
    sort: 31,
    date: '2026-08-16',
  },
]

export const STATIC_SERVICES: StaticService[] = [
  {
    title: 'Web sayt yaratish',
    description:
      "Landing page, korporativ sayt yoki internet-do'kon — zamonaviy dizayn, tez ishlash va SEO bilan.",
    icon: 'globe',
    price: 'kelishilgan holda',
  },
  {
    title: 'Telegram bot dasturlash',
    description:
      "Do'kon botlari, buyurtma qabul qilish, Mini App'lar, CRM integratsiya va biznes jarayonlarini avtomatlashtirish.",
    icon: 'bot',
    price: 'kelishilgan holda',
  },
  {
    title: 'Web ilovalar (SPA/PWA)',
    description:
      'React asosida murakkab interaktiv ilovalar: admin panellar, dashboardlar, ichki tizimlar.',
    icon: 'code',
    price: 'kelishilgan holda',
  },
  {
    title: 'Backend va API',
    description:
      "Supabase, Node.js, Python, ma'lumotlar bazasi loyihalash va xavfsiz API'lar qurish.",
    icon: 'server',
    price: 'kelishilgan holda',
  },
  {
    title: "AI integratsiya",
    description:
      "Claude, Gemini va boshqa modellarni mahsulotga ulash: AI yordamchilar, generatorlar, MCP serverlar.",
    icon: 'cpu',
    price: 'kelishilgan holda',
  },
  {
    title: "Texnik qo'llab-quvvatlash",
    description:
      "Mavjud loyihalarni rivojlantirish, xatolarni tuzatish va yangi funksiyalar qo'shish.",
    icon: 'wrench',
    price: 'kelishilgan holda',
  },
]
