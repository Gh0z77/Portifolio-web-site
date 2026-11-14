import { ADMIN_BASE } from './admin'
import { getSupabase } from './db'

/**
 * O'z analytics tizimimiz: har sahifa ochilishi Supabase'ga yoziladi.
 * Tashqi servis yo'q, cookie yo'q — faqat anonim visitor ID (localStorage).
 */

const VID_KEY = 'ghost-vid'

function visitorId(): string {
  try {
    let vid = localStorage.getItem(VID_KEY)
    if (!vid) {
      vid = crypto.randomUUID()
      localStorage.setItem(VID_KEY, vid)
    }
    return vid
  } catch {
    return 'anon'
  }
}

let lastPath = ''

export function trackPageView(path: string, lang: string) {
  // Admin sahifalari va ketma-ket takrorlar hisoblanmaydi
  if (path.startsWith(ADMIN_BASE)) return
  if (path === lastPath) return
  lastPath = path

  const device = window.innerWidth < 768 ? 'mobile' : 'desktop'
  const ref = document.referrer
  const referrer =
    ref && !ref.includes(window.location.host) ? ref.slice(0, 200) : null

  getSupabase()
    .then((sb) => sb.from('page_views').insert({ path, visitor: visitorId(), lang, device, referrer }))
    .catch(() => {
      /* xato bo'lsa ham sayt ishlashiga ta'sir qilmaydi */
    })
}
