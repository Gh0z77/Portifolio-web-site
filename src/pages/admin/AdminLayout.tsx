import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase, ADMIN_EMAIL, ADMIN_BASE, ADMIN_DASH } from '../../lib/supabase'
import Loader from '../../components/Loader'
import { cn } from '../../lib/utils'

const MENU: { to: string; label: string; end?: boolean; icon: string }[] = [
  { to: ADMIN_DASH, label: 'dashboard', end: true, icon: '⌂' },
  { to: `${ADMIN_DASH}/projects`, label: 'loyihalar', icon: '▣' },
  { to: `${ADMIN_DASH}/blog`, label: 'blog', icon: '✎' },
  { to: `${ADMIN_DASH}/services`, label: 'xizmatlar', icon: '⚙' },
  { to: `${ADMIN_DASH}/messages`, label: 'xabarlar', icon: '✉' },
  { to: `${ADMIN_DASH}/testimonials`, label: 'mijozlar fikri', icon: '❝' },
  { to: `${ADMIN_DASH}/stats`, label: 'statistika', icon: '▦' },
  { to: `${ADMIN_DASH}/content`, label: 'sayt kontenti', icon: '▤' },
  { to: `${ADMIN_DASH}/settings`, label: 'sozlamalar', icon: '⚡' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [unread, setUnread] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.title = 'Admin — GHOST'
    supabase.auth.getSession().then(async ({ data }) => {
      // 1) Sessiya bo'lishi shart
      if (!data.session) {
        navigate(ADMIN_BASE, { replace: true })
        return
      }
      // 2) Faqat admin emaili — boshqa hisoblar darhol chiqariladi
      if (data.session.user.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut()
        navigate(ADMIN_BASE, { replace: true })
        return
      }
      // 3) 2FA yoqilgan bo'lsa — aal2 darajasi shart
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
        navigate(ADMIN_BASE, { replace: true })
        return
      }
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') navigate(ADMIN_BASE, { replace: true })
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (checking) return
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('read', false)
      .then(({ count }) => setUnread(count ?? 0))
  }, [checking])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate(ADMIN_BASE, { replace: true })
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  const menuItems = (
    <>
      {MENU.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          data-hover
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              'relative flex items-center gap-3 px-4 py-2.5 font-mono text-sm transition-all duration-300',
              isActive
                ? 'text-matrix-bright bg-matrix-dark/20 border-l-2 border-matrix'
                : 'text-steel-light border-l-2 border-transparent hover:text-ghost hover:bg-navy-900/40'
            )
          }
        >
          <span className="w-4 text-center">{item.icon}</span>
          {item.label}
          {item.label === 'xabarlar' && unread > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1.5 font-mono text-[10px] font-bold text-on-amber">
              {unread}
            </span>
          )}
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-steel-dim/50 bg-panel md:flex">
        <div className="border-b border-steel-dim/50 px-5 py-5">
          <Link to={ADMIN_DASH} data-hover className="font-display text-sm font-bold tracking-[0.15em] text-ghost">
            GHOST<span className="text-matrix">_</span>ADMIN
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 py-4">{menuItems}</nav>
        <div className="space-y-0.5 border-t border-steel-dim/50 py-4">
          <Link
            to="/"
            data-hover
            className="flex items-center gap-3 px-4 py-2 font-mono text-sm text-steel-light transition-colors hover:text-matrix-bright"
          >
            <span className="w-4 text-center">↗</span> saytni ochish
          </Link>
          <button
            data-hover
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2 font-mono text-sm text-steel-light transition-colors hover:text-amber-bright"
          >
            <span className="w-4 text-center">⏻</span> chiqish
          </button>
        </div>
      </aside>

      {/* Mobil top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-steel-dim/50 bg-panel px-4 py-3 md:hidden">
        <span className="font-display text-sm font-bold tracking-[0.15em] text-ghost">
          GHOST<span className="text-matrix">_</span>ADMIN
        </span>
        <button
          data-hover
          onClick={() => setMobileOpen((v) => !v)}
          className="font-mono text-sm text-matrix-bright"
        >
          {mobileOpen ? '[ yopish ]' : '[ menyu ]'}
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-12 z-40 border-b border-steel-dim/50 bg-panel md:hidden">
          <nav className="py-2">{menuItems}</nav>
          <div className="flex gap-2 border-t border-steel-dim/40 p-3">
            <Link to="/" className="flex-1 border border-steel-dim px-3 py-2 text-center font-mono text-xs text-steel-light">
              saytni ochish ↗
            </Link>
            <button onClick={logout} className="flex-1 border border-amber/50 px-3 py-2 text-center font-mono text-xs text-amber-bright">
              chiqish ⏻
            </button>
          </div>
        </div>
      )}

      {/* Kontent — Suspense shu yerda: bo'lim almashganda faqat shu maydon yangilanadi */}
      <main className="min-h-screen flex-1 px-5 pb-16 pt-20 md:ml-60 md:px-10 md:pt-10">
        <Suspense
          fallback={
            <div className="py-24 text-center font-mono text-sm text-matrix animate-pulse">
              [ yuklanmoqda... ]
            </div>
          }
        >
          <Outlet context={{ refreshUnread: () => {
            supabase
              .from('messages')
              .select('id', { count: 'exact', head: true })
              .eq('read', false)
              .then(({ count }) => setUnread(count ?? 0))
          } }} />
        </Suspense>
      </main>
    </div>
  )
}
