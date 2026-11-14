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

export { ADMIN_SLUG, ADMIN_BASE, ADMIN_DASH } from './admin'
