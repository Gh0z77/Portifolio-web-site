import type { Lang } from './translations'
import type { I18nMap } from '../types'

interface HasI18n {
  i18n?: I18nMap | null
}

/**
 * Baza yozuvidan joriy til uchun maydon qiymatini oladi.
 * uz — asl matn; ru/en — i18n dagi avtomatik tarjima (bo'lmasa asl matn).
 */
export function l10n<T extends HasI18n>(item: T, field: string, lang: Lang): string {
  if (lang !== 'uz') {
    const translated = item.i18n?.[lang]?.[field]
    if (translated && translated.trim()) return translated
  }
  const base = (item as unknown as Record<string, unknown>)[field]
  return typeof base === 'string' ? base : ''
}
