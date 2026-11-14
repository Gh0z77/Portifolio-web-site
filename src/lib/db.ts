/** Supabase klientini kerak bo'lganda yuklaydi: kutubxona (~180 KB) birinchi sahifa yuklanishini sekinlashtirmaydi. */
export const getSupabase = () => import('./supabase').then((m) => m.supabase)
