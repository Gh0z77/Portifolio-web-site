/**
 * O'zbekcha matnni ru/en ga avtomatik tarjima qilish.
 * Google Translate'ning ochiq gtx endpointi ishlatiladi (kalitsiz, bepul).
 * Admin panelda saqlash paytida chaqiriladi — natija bazadagi i18n ustunida saqlanadi.
 */

export type TargetLang = 'ru' | 'en'

async function gtx(text: string, to: TargetLang): Promise<string> {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=' +
    to +
    '&dt=t&q=' +
    encodeURIComponent(text)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`translate ${res.status}`)
  const data = (await res.json()) as [Array<[string, string]>]
  return (data[0] ?? []).map((seg) => seg[0]).join('')
}

/** Uzun matnni paragraf bo'yicha bo'lib tarjima qiladi (endpoint limiti uchun) */
export async function translateText(text: string, to: TargetLang): Promise<string> {
  const t = (text ?? '').trim()
  if (!t) return ''
  const chunks: string[] = []
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

  const out: string[] = []
  for (const chunk of chunks) {
    out.push(await gtx(chunk, to))
  }
  return out.join('\n\n')
}

/**
 * Berilgan maydonlarni ru va en ga tarjima qilib, i18n obyektini qaytaradi.
 * Birorta tarjima muvaffaqiyatsiz bo'lsa — o'sha maydon shunchaki tashlab ketiladi
 * (sayt asl o'zbekcha matnni ko'rsataveradi).
 */
export async function buildI18n(
  fields: Record<string, string | null | undefined>
): Promise<Record<string, Record<string, string>>> {
  const result: Record<string, Record<string, string>> = { ru: {}, en: {} }
  const targets: TargetLang[] = ['ru', 'en']
  for (const to of targets) {
    for (const [key, val] of Object.entries(fields)) {
      const v = (val ?? '').trim()
      if (!v) continue
      try {
        const translated = await translateText(v, to)
        if (translated) result[to][key] = translated
      } catch {
        // tarjima xatosi — bu maydon uchun asl matn qoladi
      }
    }
  }
  return result
}
