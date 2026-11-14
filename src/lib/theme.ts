import { getSupabase } from './db'

/** Standart ranglar (rasmdan olingan palitra) */
export const DEFAULT_PRIMARY = '#5fb50a'
export const DEFAULT_ACCENT = '#f2a50c'

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace('#', '')
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

/** amt: 0..1 — oq tomonga (musbat) yoki qora tomonga (manfiy) siljitish */
function shade(rgb: [number, number, number], amt: number): [number, number, number] {
  const target = amt >= 0 ? 255 : 0
  const t = Math.abs(amt)
  return rgb.map((c) => Math.round(c + (target - c) * t)) as [number, number, number]
}

/** Rang yorqinligi (0-255) */
function luminance(rgb: [number, number, number]): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

/** Juda to'q tanlangan rangni qora fonda ko'rinadigan darajagacha yoritish */
function ensureVisible(rgb: [number, number, number]): [number, number, number] {
  let c = rgb
  let i = 0
  while (luminance(c) < 70 && i < 6) {
    c = shade(c, 0.2)
    i++
  }
  return c
}

/** Rang USTIDAGI matn uchun kontrast rang (to'q yoki och) */
function onColor(rgb: [number, number, number]): string {
  return luminance(rgb) >= 140 ? '4 6 12' : '240 243 250'
}

const triplet = (rgb: [number, number, number]) => `${rgb[0]} ${rgb[1]} ${rgb[2]}`

/**
 * Tanlangan ikki rangdan butun palitra hosil qilib CSS o'zgaruvchilarga yozadi.
 * Barcha tailwind matrix/amber ranglari, glow'lar va canvas fonlar shunga ergashadi.
 * Juda to'q ranglar avtomatik yoritiladi; rang ustidagi matn kontrasti avto hisoblanadi.
 */
export function applyTheme(primaryHex: string, accentHex: string) {
  const p = ensureVisible(hexToRgb(primaryHex) ?? hexToRgb(DEFAULT_PRIMARY)!)
  const a = ensureVisible(hexToRgb(accentHex) ?? hexToRgb(DEFAULT_ACCENT)!)
  const root = document.documentElement.style
  root.setProperty('--clr-matrix', triplet(p))
  root.setProperty('--clr-matrix-bright', triplet(shade(p, 0.35)))
  root.setProperty('--clr-matrix-dim', triplet(shade(p, -0.45)))
  root.setProperty('--clr-matrix-dark', triplet(shade(p, -0.65)))
  root.setProperty('--clr-on-matrix', onColor(p))
  root.setProperty('--clr-amber', triplet(a))
  root.setProperty('--clr-amber-bright', triplet(shade(a, 0.3)))
  root.setProperty('--clr-amber-dim', triplet(shade(a, -0.45)))
  root.setProperty('--clr-on-amber', onColor(a))
  window.dispatchEvent(new CustomEvent('themechange'))
}

/** Saytga kirganda bazadan tema ranglarini yuklash (bo'lmasa standart qoladi) */
export async function loadTheme() {
  try {
    const { data } = await (await getSupabase())
      .from('site_settings')
      .select('key, value')
      .in('key', ['theme_primary', 'theme_accent'])
    const primary = data?.find((s) => s.key === 'theme_primary')?.value?.trim()
    const accent = data?.find((s) => s.key === 'theme_accent')?.value?.trim()
    if (primary || accent) {
      applyTheme(primary || DEFAULT_PRIMARY, accent || DEFAULT_ACCENT)
    }
  } catch {
    // baza mavjud bo'lmasa — standart ranglar
  }
}

/** Canvas kabi joylarda ishlatish uchun joriy rang qiymatini o'qish */
export function readThemeVar(name: string, alpha: number): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v ? `rgba(${v.split(/\s+/).join(', ')}, ${alpha})` : `rgba(95, 181, 10, ${alpha})`
}
