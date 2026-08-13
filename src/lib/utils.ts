/** classNames birlashtirish */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Sanani chiroyli formatlash: 2026-07-27 -> 27.07.2026 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${d.getFullYear()}`
}

/** Sarlavhadan URL slug yasash */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['ʻʼ`]/g, '')
    .replace(/[^a-z0-9а-яёЀ-ӿ]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Matnni qisqartirish */
export function truncate(text: string, len = 140): string {
  if (text.length <= len) return text
  return text.slice(0, len).trimEnd() + '…'
}

/** Scramble effekti uchun belgilar to'plami */
export const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#01アイウエオカキク'
