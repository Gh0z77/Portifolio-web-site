import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { translations, LANGS } from './translations'
import type { Lang, Translation } from './translations'
import { getSupabase } from './db'

/**
 * Admin paneldan saqlangan kontentni standart tarjimalar ustiga chuqur birlashtirish.
 * Bo'sh/null qiymatlar e'tiborga olinmaydi — standart matn qoladi.
 */
function deepMerge<T>(base: T, over: unknown): T {
  if (over === null || over === undefined || over === '') return base
  if (Array.isArray(base)) {
    return (Array.isArray(over) && over.length > 0 ? over : base) as T
  }
  if (typeof base === 'object' && base !== null && typeof over === 'object') {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
      if (v === null || v === undefined || v === '') continue
      const bv = out[k]
      out[k] = bv !== undefined && typeof bv === 'object' && bv !== null ? deepMerge(bv, v) : v
    }
    return out as T
  }
  return over as T
}

/** Tilga bog'liq bo'lmagan sayt sozlamalari (admin Kontent bo'limidan o'zgartiriladi) */
export interface SiteLinks {
  siteName: string
  email: string
  telegramUser: string
  telegram: string
  github: string
}

export const DEFAULT_LINKS: SiteLinks = {
  siteName: 'GHOST',
  email: 'diorbek2255@gmail.com',
  telegramUser: '@ghost_dev',
  telegram: 'https://t.me/',
  github: 'https://github.com/',
}

interface I18nContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  tr: Translation
  links: SiteLinks
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'uz',
  setLang: () => {},
  tr: translations.uz,
  links: DEFAULT_LINKS,
})

/** Foydalanuvchi QO'LDA tanlagan til — eng yuqori ustunlik */
const STORAGE_KEY = 'ghost-lang'
/** Geo-IP orqali aniqlangan til keshi (har safar API chaqirmaslik uchun) */
const GEO_KEY = 'ghost-geo-lang'

/** Rus tili keng tarqalgan davlatlar */
const RU_COUNTRIES = ['RU', 'BY', 'KZ', 'KG', 'TJ', 'TM', 'AM', 'AZ', 'MD']
const UZ_COUNTRIES = ['UZ']

function countryToLang(code: string): Lang {
  const c = code.toUpperCase()
  if (UZ_COUNTRIES.includes(c)) return 'uz'
  if (RU_COUNTRIES.includes(c)) return 'ru'
  return 'en'
}

function savedManualLang(): Lang | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (saved && LANGS.includes(saved)) return saved
  } catch {
    /* localStorage yopiq */
  }
  return null
}

/** Geo natijasi kelguncha ko'rsatiladigan boshlang'ich taxmin (brauzer tili) */
function browserGuess(): Lang {
  const nav = navigator.language?.toLowerCase() ?? ''
  if (nav.startsWith('uz')) return 'uz'
  if (nav.startsWith('ru')) return 'ru'
  if (nav.startsWith('en')) return 'en'
  return 'uz'
}

/** Davlat kodini geo-IP orqali aniqlash (2 ta zaxira servis, 3.5s timeout).
 *  Natija 24 soat keshlanadi — davlat o'zgarsa (masalan safar/VPN) qayta aniqlanadi. */
async function detectGeoLang(): Promise<Lang | null> {
  try {
    const raw = localStorage.getItem(GEO_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { l?: Lang; t?: number }
      if (
        parsed.l &&
        LANGS.includes(parsed.l) &&
        parsed.t &&
        Date.now() - parsed.t < 24 * 3600_000
      ) {
        return parsed.l
      }
    }
  } catch {
    /* eski format yoki buzilgan kesh — qayta aniqlaymiz */
  }

  const tryFetch = async (url: string, pick: (d: Record<string, unknown>) => unknown): Promise<string | null> => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 3500)
    try {
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) return null
      const data = (await res.json()) as Record<string, unknown>
      const code = pick(data)
      return typeof code === 'string' && code.length === 2 ? code : null
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  }

  const country =
    (await tryFetch('https://api.country.is/', (d) => d.country)) ??
    (await tryFetch('https://ipwho.is/?fields=country_code', (d) => d.country_code))

  if (!country) return null
  const lang = countryToLang(country)
  try {
    localStorage.setItem(GEO_KEY, JSON.stringify({ l: lang, t: Date.now() }))
  } catch {
    /* ignore */
  }
  return lang
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => savedManualLang() ?? browserGuess())
  const [overrides, setOverrides] = useState<Record<string, unknown> | null>(null)

  // Admin panelda tahrirlangan sayt matnlarini yuklash
  useEffect(() => {
    getSupabase()
      .then((sb) => sb.from('site_settings').select('value').eq('key', 'content_overrides').maybeSingle())
      .then(({ data }) => {
        if (data?.value) {
          try {
            setOverrides(JSON.parse(data.value))
          } catch {
            /* buzilgan JSON — standart matnlar qoladi */
          }
        }
      })
  }, [])

  // Foydalanuvchi tilni qo'lda tanlaganida — saqlaymiz, geo endi aralashmaydi
  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }

  // Birinchi tashrifda davlat bo'yicha avtomatik tanlash
  useEffect(() => {
    if (savedManualLang()) return // qo'lda tanlangan — geo kerak emas
    let cancelled = false
    detectGeoLang().then((geoLang) => {
      if (geoLang && !cancelled && !savedManualLang()) {
        setLangState(geoLang)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const tr = useMemo(
    () => deepMerge(translations[lang], overrides?.[lang]),
    [lang, overrides]
  )

  const links = useMemo(
    () => deepMerge(DEFAULT_LINKS, overrides?.links),
    [overrides]
  )

  return (
    <I18nContext.Provider value={{ lang, setLang, tr, links }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
