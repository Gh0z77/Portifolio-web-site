/** Baza yozuvlaridagi avtomatik tarjimalar: { ru: {title: '...'}, en: {...} } */
export type I18nMap = Record<string, Record<string, string>>

export interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  image_url: string | null
  tech_stack: string[]
  live_url: string | null
  github_url: string | null
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
  i18n?: I18nMap | null
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_url: string | null
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
  i18n?: I18nMap | null
}

export interface Service {
  id: string
  title: string
  description: string | null
  icon: string | null
  price: string | null
  sort_order: number
  active: boolean
  i18n?: I18nMap | null
}

export interface ContactMessage {
  id: string
  name: string
  email: string | null
  telegram: string | null
  subject: string | null
  body: string
  read: boolean
  created_at: string
  reply?: string | null
  replied_at?: string | null
}

export interface SiteSetting {
  key: string
  value: string | null
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  text: string
  avatar_url: string | null
  sort_order: number
  active: boolean
  i18n?: I18nMap | null
  created_at: string
}

export interface PageView {
  path: string
  visitor: string | null
  lang: string | null
  device: string | null
  referrer: string | null
  created_at: string
}
