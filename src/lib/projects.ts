import { supabase } from './supabase'
import type { Project, Service, I18nMap } from '../types'
import { STATIC_PROJECTS, STATIC_SERVICES } from '../data/projects'
import staticI18n from '../data/projects.i18n.json'

/**
 * Loyihalar ma'lumot qatlami.
 *
 * Asosiy manba — saytning o'zida yotgan statik ro'yxat (`src/data/projects.ts`),
 * rasmlar `public/projects/` da. Supabase ishlasa, bazadagi yozuvlar statik
 * ro'yxat ustiga qo'shiladi (bir xil slug bo'lsa baza ustun). Supabase
 * o'chiq/pauzada bo'lsa ham sayt to'liq ishlayveradi.
 */

/** Fayl tuzilishi: { "project:<slug>": { _src: "hash", ru: {...}, en: {...} } } */
type I18nFile = Record<string, Record<string, string | Record<string, string>>>
const i18nFile = staticI18n as unknown as I18nFile

function i18nFor(key: string): I18nMap {
  const entry = i18nFile[key]
  if (!entry) return {}
  const out: I18nMap = {}
  for (const [lang, fields] of Object.entries(entry)) {
    if (typeof fields === 'object') out[lang] = fields
  }
  return out
}

export const staticProjects: Project[] = STATIC_PROJECTS.map((p, i) => ({
  id: `static-${p.slug}`,
  title: p.title,
  slug: p.slug,
  description: p.description,
  content: p.content ?? null,
  image_url: p.image ? `/projects/${p.image}` : null,
  tech_stack: p.tech,
  live_url: p.live ?? null,
  github_url: p.github ?? null,
  featured: p.featured ?? false,
  sort_order: p.sort ?? i + 1,
  created_at: `${p.date}T00:00:00.000Z`,
  updated_at: `${p.date}T00:00:00.000Z`,
  i18n: i18nFor(`project:${p.slug}`),
}))

export const staticServices: Service[] = STATIC_SERVICES.map((s, i) => ({
  id: `static-service-${i + 1}`,
  title: s.title,
  description: s.description,
  icon: s.icon,
  price: s.price,
  sort_order: i + 1,
  active: true,
  i18n: i18nFor(`service:${i + 1}`),
}))

/** Supabase so'rovi — xato yoki kechikishda null qaytaradi, hech qachon tashlamaydi */
async function safe<T>(query: PromiseLike<{ data: T | null; error: unknown }>, ms = 2500): Promise<T | null> {
  try {
    const res = await Promise.race([
      Promise.resolve(query),
      new Promise<{ data: null; error: string }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: 'timeout' }), ms)
      ),
    ])
    return res.error ? null : res.data
  } catch {
    return null
  }
}

function sortProjects(list: Project[]): Project[] {
  return [...list].sort(
    (a, b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at)
  )
}

function mergeBySlug(base: Project[], override: Project[]): Project[] {
  const map = new Map(base.map((p) => [p.slug, p]))
  for (const p of override) map.set(p.slug, p)
  return sortProjects([...map.values()])
}

export async function loadProjects(): Promise<Project[]> {
  const db = await safe<Project[]>(
    supabase.from('projects').select('*').order('sort_order', { ascending: true })
  )
  return mergeBySlug(staticProjects, db ?? [])
}

export async function loadFeatured(limit = 3): Promise<Project[]> {
  const all = await loadProjects()
  return all.filter((p) => p.featured).slice(0, limit)
}

export async function loadProject(slug: string): Promise<Project | null> {
  const db = await safe<Project>(
    supabase.from('projects').select('*').eq('slug', slug).maybeSingle()
  )
  if (db) return db
  return staticProjects.find((p) => p.slug === slug) ?? null
}

export async function loadServices(limit?: number): Promise<Service[]> {
  const db = await safe<Service[]>(
    supabase.from('services').select('*').eq('active', true).order('sort_order', { ascending: true })
  )
  const list = db && db.length > 0 ? db : staticServices
  return typeof limit === 'number' ? list.slice(0, limit) : list
}
