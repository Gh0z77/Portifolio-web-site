import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/** Edge funksiyalarga to'g'ridan-to'g'ri fetch uchun headerlar */
export const functionHeaders = {
  'Content-Type': 'application/json',
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
}

/** Supabase Edge Function bazaviy URL'i */
export const functionsUrl = `${supabaseUrl}/functions/v1`

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string) || ''

/** Maxfiy admin yo'li — .env dagi VITE_ADMIN_PATH orqali o'zgartiriladi */
export const ADMIN_SLUG = (import.meta.env.VITE_ADMIN_PATH as string) || 'admin'
export const ADMIN_BASE = `/${ADMIN_SLUG}`
export const ADMIN_DASH = `${ADMIN_BASE}/dashboard`
