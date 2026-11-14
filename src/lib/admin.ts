/** Maxfiy admin yo'li — .env dagi VITE_ADMIN_PATH orqali o'zgartiriladi.
 *  Alohida faylda: App uni Supabase kutubxonasini yuklamasdan import qiladi. */
export const ADMIN_SLUG = (import.meta.env.VITE_ADMIN_PATH as string) || 'admin'
export const ADMIN_BASE = `/${ADMIN_SLUG}`
export const ADMIN_DASH = `${ADMIN_BASE}/dashboard`
