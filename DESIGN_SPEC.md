# GHOST Portfolio — Dizayn spetsifikatsiyasi

Cyberpunk-terminal uslubidagi shaxsiy portfolio. Nik: **GHOST**. Til: sayt matnlari **o'zbekcha**, dekorativ terminal-elementlar (buyruqlar, kod) inglizcha.

## Palitra (tailwind tokenlar)

- `bg` `#04060c` — asosiy fon (deyarli qora, navy tusli)
- `panel` `#0a0f1e` — kartalar/panellar foni
- `navy` `#0e2a66` (900 `#081736`, 800 `#0b2050`, 700 `#123a8c`) — chuqur ko'k aksent
- `steel` `#44578a` (light `#8b9cc7`, dim `#2c3a61`) — muted matn/chegara
- `matrix` `#5fb50a` (bright `#8ee61e`, dim `#2f5c06`, dark `#1d3a04`) — ASOSIY aksent (yashil)
- `amber` `#f2a50c` (bright `#ffc93d`, dim `#8a5e07`) — IKKINCHI aksent
- `ghost` `#e8ecf5` — asosiy matn

Qoida: yashil = asosiy interaktiv rang, amber = urg'u/ogohlantirish, steel = muted, navy = fon qatlamlari. Oq rang faqat `ghost`.

## Tipografika

- `font-display` (Orbitron) — katta sarlavhalar, logotip. Har doim `uppercase tracking-wider`.
- `font-mono` (JetBrains Mono) — qolgan hamma narsa (body default shu).

## Umumiy CSS klasslar (index.css da tayyor)

- `.clip-corner` / `.clip-corner-sm` — kesilgan burchakli cyberpunk shakl
- `.card-spotlight` — sichqonchaga ergashuvchi yorug'lik (CyberCard ishlatadi)
- `.text-glow-green` / `.text-glow-amber` — neon matn
- `.cyber-input` — forma inputlari uchun tayyor stil (focus effekti bilan)
- `.prose-ghost` — markdown kontent uchun tipografika
- `.glitch` + `data-text` — glitch effekt (GlitchText komponenti orqali ishlating)
- Tailwind animatsiyalar: `animate-blink`, `animate-flicker`, `animate-float`, `animate-spin-slow`, `animate-marquee`, `animate-pulse-border`

## Tayyor komponentlar (src/components) — SHULARNI ISHLATING

- `ui/GlitchText` — `<GlitchText text="GHOST" interval={5} className="..."/>` katta sarlavhalar uchun RGB glitch
- `ui/DecodeText` — `<DecodeText text="..." as="h2" delay={0} speed={28} className/>` scroll'da shifrlanib ochiladigan matn
- `ui/Reveal` — `<Reveal delay={0.1} direction="up|down|left|right|none" className>` scroll'da fade+slide
- `ui/CyberButton` — `<CyberButton variant="primary|amber|ghost" size="sm|md|lg" to="/route" | href="url" | onClick | type="submit" disabled>` 
- `ui/CyberCard` — `<CyberCard tilt brackets className="p-6">` spotlight+tilt+burchak qavslar
- `ui/SectionHeading` — `<SectionHeading index="01" title="HAQIMDA" command="cat about.md"/>`
- `ui/Terminal` — `<Terminal lines={[{cmd:'whoami', out:['GHOST — full-stack dasturchi']}]} title="ghost@portfolio:~"/>` yozilib boruvchi terminal
- `ui/Tag` — `<Tag color="green|amber|steel">React</Tag>`
- `Loader` — suspense/loading holat
- `PageTransition` — HAR BIR sahifaning eng tashqi o'rami: `export default function Page() { return <PageTransition>...</PageTransition> }`

## Ma'lumotlar qatlami

- `src/lib/supabase.ts`: `supabase` client, `functionsUrl`, `ADMIN_EMAIL`
- `src/types.ts`: `Project`, `BlogPost`, `Service`, `ContactMessage`, `SiteSetting`
- `src/lib/utils.ts`: `cn()`, `formatDate()`, `slugify()`, `truncate()`

Jadval nomlari: `projects`, `blog_posts`, `services`, `messages`, `site_settings`.
Blog faqat `published=true` postlar publicda ko'rinadi (RLS). Loyihalar `sort_order` bo'yicha, keyin `created_at desc`.

## Kod konvensiyalari

- Har sahifa `export default function`, eng tashqarida `<PageTransition>`.
- Sahifa konteyner: `<div className="mx-auto max-w-6xl px-5">` (sektsiyalar `py-16 md:py-24`).
- Ma'lumot yuklashda: `useState` + `useEffect` bilan supabase query, `loading` holatida `<Loader/>`, bo'sh holatda chiroyli "hozircha bo'sh" bloki (terminal uslubda, masalan `// ma'lumot topilmadi`).
- Barcha interaktiv custom elementlarga `data-hover` atributi (maxsus kursor kattalashishi uchun).
- Rasmlar: `image_url` bo'lmasa gradient-placeholder ko'rsating (navy→panel gradient + katta mono belgi, masalan `</>`).
- TypeScript strict: har doim tiplarni to'g'ri yozing. Import yo'llari nisbiy (`../components/...`).
- Framer-motion importi: `import { motion } from 'framer-motion'`.
