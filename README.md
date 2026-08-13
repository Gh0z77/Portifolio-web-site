# GHOST — Portfolio

Cyberpunk-terminal uslubidagi shaxsiy portfolio sayt. React + Supabase + Framer Motion.

## Sahifalar

- `/` — bosh sahifa (hero, statistika, tanlangan loyihalar, xizmatlar, CTA)
- `/about` — haqimda (terminal, ko'nikmalar, tajriba yo'li)
- `/services` — xizmatlar (bazadan), ish jarayoni, FAQ
- `/portfolio` — loyihalar (texnologiya bo'yicha filter), `/portfolio/:slug` — batafsil
- `/blog` — blog (qidiruv, teglar), `/blog/:slug` — post
- `/contact` — aloqa formasi (Telegram'ga xabar boradi)
- `/admin` — admin kirish (faqat egasi uchun), `/admin/dashboard` — boshqaruv paneli

## Ishga tushirish

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

`dist/` papkasini istalgan static hostingga (Vercel, Netlify, Cloudflare Pages) joylash mumkin.
SPA bo'lgani uchun barcha yo'llarni `index.html` ga yo'naltirish kerak (Vercel/Netlify buni avtomatik qiladi).

## Backend (Supabase)

- Jadvallar: `projects`, `blog_posts`, `services`, `messages`, `site_settings` (RLS bilan himoyalangan)
- Storage: `media` bucket (rasmlar uchun, public o'qish)
- Edge funksiyalar:
  - `contact` — kontakt formadan xabarni bazaga yozadi va Telegram'ga yuboradi
  - `db-setup` — bir martalik sxema o'rnatish (service key bilan himoyalangan)
- Sxema nusxasi: `supabase/schema.sql`

Birinchi o'rnatish: `setup-supabase.ps1` skripti funksiyalarni deploy qiladi, sxemani o'rnatadi va admin foydalanuvchini yaratadi (skript service key saqlagani uchun git'ga qo'shilmaydi).

## Telegram bot ulash

1. Telegramda **@BotFather** ga `/newbot` yuborib bot yarating, tokenni oling
2. **@userinfobot** ga `/start` yozib chat ID raqamingizni oling
3. O'z botingizga kirib `/start` bosing (majburiy!)
4. Admin panel → Sozlamalar → token va chat ID ni saqlang → "test xabar yuborish"

## Admin panel

`/admin` sahifasiga kirib email + parol bilan tizimga kiring. U yerda:

- Loyihalar qo'shish/tahrirlash (rasm yuklash bilan)
- Blog postlar yozish (markdown + preview)
- Xizmatlarni boshqarish
- Kelgan xabarlarni o'qish
- Telegram sozlamalari va parolni almashtirish

Parolni birinchi kirishdan keyin **Sozlamalar** bo'limida almashtirib oling.
