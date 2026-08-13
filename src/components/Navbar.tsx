import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n'
import { LANGS } from '../lib/translations'
import { getVolumeLevel, setVolumeLevel } from '../lib/sound'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [vol, setVol] = useState(getVolumeLevel)
  const location = useLocation()
  const { lang, setLang, tr, links } = useI18n()

  /* Bosgan sari aylanadi: o'chiq -> past -> o'rta -> baland -> o'chiq */
  const cycleVolume = () => {
    const next = (vol + 1) % 4
    setVolumeLevel(next)
    setVol(next)
  }


  const navLinks = [
    { to: '/', label: tr.nav.home },
    { to: '/about', label: tr.nav.about },
    { to: '/services', label: tr.nav.services },
    { to: '/portfolio', label: tr.nav.portfolio },
    { to: '/blog', label: tr.nav.blog },
    { to: '/contact', label: tr.nav.contact },
    { to: '/terminal', label: tr.nav.terminal },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sahifa almashganda mobil menyuni yopish
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const langSwitcher = (
    <div className="flex items-center gap-1 font-mono text-[11px]">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-steel-dim">/</span>}
          <button
            data-hover
            onClick={() => setLang(l)}
            className={cn(
              'px-1 py-0.5 uppercase tracking-wider transition-colors duration-300',
              lang === l ? 'text-matrix-bright text-glow-green' : 'text-steel hover:text-ghost'
            )}
          >
            {l}
          </button>
        </span>
      ))}
      <button
        data-hover
        onClick={cycleVolume}
        title={tr.common.vol[vol]}
        className={cn(
          'ml-1.5 flex h-6 w-7 items-center justify-center border transition-all duration-300',
          vol > 0
            ? 'border-matrix/50 text-matrix-bright hover:shadow-glow-green'
            : 'border-steel-dim text-steel-dim hover:text-steel hover:border-steel'
        )}
      >
        <svg viewBox="0 0 26 24" className="h-3.5 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4V5z" />
          {vol === 0 && (
            <>
              <path d="m16 9 6 6" />
              <path d="m22 9-6 6" />
            </>
          )}
          {vol >= 1 && <path d="M15 10a3.5 3.5 0 0 1 0 4" />}
          {vol >= 2 && <path d="M17.5 8a7 7 0 0 1 0 8" />}
          {vol >= 3 && <path d="M20 6a10.5 10.5 0 0 1 0 12" />}
        </svg>
      </button>
    </div>
  )

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 border-b',
        scrolled
          ? 'bg-bg/75 backdrop-blur-md border-steel-dim/50 py-0'
          : 'bg-transparent border-transparent py-2'
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        {/* Logo */}
        <Link to="/" data-hover className="group flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-[0.2em] text-ghost group-hover:text-matrix-bright transition-colors duration-300">
            {links.siteName}
          </span>
          <span className="inline-block h-5 w-2.5 bg-matrix animate-blink" />
        </Link>

        {/* Desktop menyu */}
        <div className="hidden md:flex items-center gap-5">
          <ul className="flex items-center gap-1">
            {navLinks.map((link, i) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  data-hover
                  className={({ isActive }) =>
                    cn(
                      'relative px-3 py-2 font-mono text-[13px] tracking-wide transition-colors duration-300 group',
                      isActive ? 'text-matrix-bright' : 'text-steel-light hover:text-ghost'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="text-steel-dim mr-0.5">0{i + 1}.</span>
                      {link.label}
                      <span
                        className={cn(
                          'absolute -bottom-0.5 left-3 right-3 h-px bg-matrix transition-transform duration-300 origin-left',
                          isActive ? 'scale-x-100 shadow-glow-green' : 'scale-x-0 group-hover:scale-x-100'
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <span className="h-4 w-px bg-steel-dim" />
          {langSwitcher}
        </div>

        {/* Mobil: til + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {langSwitcher}
          <button
            data-hover
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span className={cn('h-0.5 w-6 bg-matrix transition-all duration-300', open && 'translate-y-2 rotate-45')} />
            <span className={cn('h-0.5 w-6 bg-matrix transition-all duration-300', open && 'opacity-0')} />
            <span className={cn('h-0.5 w-6 bg-amber transition-all duration-300', open && '-translate-y-2 -rotate-45')} />
          </button>
        </div>
      </nav>

      {/* Mobil menyu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-bg/[0.98] border-b border-steel-dim/50"
          >
            <ul className="px-6 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'block py-2.5 font-mono text-sm tracking-wide',
                        isActive ? 'text-matrix-bright' : 'text-steel-light'
                      )
                    }
                  >
                    <span className="text-steel-dim mr-2">0{i + 1}.</span>
                    ./{link.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
