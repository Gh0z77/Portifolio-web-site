/**
 * Statik loyihalar va xizmatlar matnini ru/en ga avtomatik tarjima qiladi.
 *
 *   node scripts/translate-static.mjs          # faqat yangi/o'zgargan yozuvlar
 *   node scripts/translate-static.mjs --all    # hammasini qayta tarjima qilish
 *
 * Tarjimon: GEMINI_API_KEY bo'lsa — Google Gemini (bepul kalit, aistudio.google.com),
 * bo'lmasa — Google Translate ochiq gtx endpointi (admin paneldagi bilan bir xil;
 * ko'p so'rovda 429 berishi mumkin).
 *
 * Natija: src/data/projects.i18n.json  (kalit: "project:<slug>" yoki "service:<n>")
 */
import { createServer } from 'vite'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'src/data/projects.i18n.json')
const force = process.argv.includes('--all')
const LANGS = ['ru', 'en']
const GEMINI_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------- Gemini ----------
async function geminiTranslate(fields) {
  const prompt =
    'Translate the Uzbek (Latin script) values of this JSON object into Russian and English.\n' +
    'Rules: keep Markdown formatting (headings, lists, bold) exactly; keep product, brand and technology names ' +
    '(UZ GROW, Supabase, Next.js, Telegram, etc.) unchanged; keep line breaks; do not add commentary.\n' +
    'Return ONLY a JSON object of the form {"ru": {<same keys>}, "en": {<same keys>}}.\n\n' +
    JSON.stringify(fields)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    })
    if (res.ok) {
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? ''
      try {
        const parsed = JSON.parse(text)
        if (parsed.ru && parsed.en) return parsed
      } catch {
        /* qayta urinamiz */
      }
    } else if (res.status !== 429 && res.status < 500) {
      throw new Error(`gemini ${res.status}: ${(await res.text()).slice(0, 200)}`)
    }
    await sleep(2000 * attempt)
  }
  throw new Error('gemini: 4 urinishdan keyin ham natija yo\'q')
}

// ---------- gtx (zaxira) ----------
async function gtx(text, to) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=' +
    to +
    '&dt=t&q=' +
    encodeURIComponent(text)
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      return (data[0] ?? []).map((seg) => seg[0]).join('')
    }
    await sleep(1500 * attempt)
  }
  throw new Error(`translate ${to} failed`)
}

async function gtxText(text, to) {
  const t = (text ?? '').trim()
  if (!t) return ''
  const chunks = []
  let buf = ''
  for (const para of t.split('\n\n')) {
    if (buf && (buf + '\n\n' + para).length > 3500) {
      chunks.push(buf)
      buf = para
    } else {
      buf = buf ? buf + '\n\n' + para : para
    }
  }
  if (buf) chunks.push(buf)
  const out = []
  for (const c of chunks) out.push(await gtx(c, to))
  return out.join('\n\n')
}

async function translateFields(fields) {
  if (GEMINI_KEY) return geminiTranslate(fields)
  const out = {}
  for (const lang of LANGS) {
    out[lang] = {}
    for (const [k, v] of Object.entries(fields)) out[lang][k] = await gtxText(v, lang)
  }
  return out
}

// ---------- asosiy ----------
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 12)

const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { STATIC_PROJECTS, STATIC_SERVICES } = await server.ssrLoadModule('/src/data/projects.ts')
await server.close()

const existing = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : {}
const result = {}

const items = [
  ...STATIC_PROJECTS.map((p) => ({ key: `project:${p.slug}`, fields: { description: p.description, content: p.content ?? '' } })),
  ...STATIC_SERVICES.map((s, i) => ({ key: `service:${i + 1}`, fields: { title: s.title, description: s.description } })),
]

console.log(`tarjimon: ${GEMINI_KEY ? 'Gemini ' + GEMINI_MODEL : 'Google gtx'}`)
let done = 0
for (const item of items) {
  const src = hash(JSON.stringify(item.fields))
  const prev = existing[item.key]
  if (!force && prev && prev._src === src) {
    result[item.key] = prev
    continue
  }
  const tr = await translateFields(item.fields)
  const entry = { _src: src }
  for (const lang of LANGS) {
    entry[lang] = {}
    for (const field of Object.keys(item.fields)) entry[lang][field] = String(tr[lang]?.[field] ?? '')
  }
  result[item.key] = entry
  done++
  process.stdout.write(`tarjima: ${item.key}\n`)
  // har safar saqlaymiz — uzilib qolsa qaytadan boshlamaslik uchun
  writeFileSync(outFile, JSON.stringify({ ...existing, ...result }, null, 2) + '\n')
}

writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n')
console.log(`tayyor: ${done} ta yangi tarjima, jami ${items.length} ta yozuv -> ${path.relative(root, outFile)}`)
