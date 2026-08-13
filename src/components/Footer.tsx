import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'

const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M21.94 4.4c.26-1.06-.4-1.53-1.12-1.26L2.4 10.06c-1.2.47-1.18 1.14-.21 1.44l4.7 1.47 10.9-6.87c.51-.34.98-.15.6.19l-8.83 7.97-.34 4.86c.49 0 .7-.22.96-.48l2.3-2.23 4.79 3.54c.88.49 1.51.24 1.75-.82l3.02-14.73z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6L22 7" />
    </svg>
  ),
}

export default function Footer() {
  const { tr, links } = useI18n()
  const socials = [
    { label: 'GitHub', href: links.github, icon: ICONS.github },
    { label: 'Telegram', href: links.telegram, icon: ICONS.telegram },
    { label: 'Email', href: `mailto:${links.email}`, icon: ICONS.email },
  ]
  return (
    <footer className="relative border-t border-steel-dim/40 glass mt-24">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Logo va tagline */}
          <div>
            <p className="font-display text-lg font-bold tracking-[0.2em] text-ghost">
              {links.siteName}<span className="text-matrix">_</span>
            </p>
            <p className="mt-3 font-mono text-xs leading-relaxed text-steel">
              {tr.footer.tagline1}
              <br />
              {tr.footer.tagline2}
            </p>
          </div>

          {/* Tezkor havolalar */}
          <div className="font-mono text-sm">
            <p className="text-matrix mb-3 text-xs uppercase tracking-widest">{tr.footer.pages}</p>
            <ul className="grid grid-cols-2 gap-1.5">
              {[
                ['/', tr.nav.home],
                ['/about', tr.nav.about],
                ['/services', tr.nav.services],
                ['/portfolio', tr.nav.portfolio],
                ['/blog', tr.nav.blog],
                ['/contact', tr.nav.contact],
                ['/terminal', tr.nav.terminal],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    data-hover
                    className="text-steel-light hover:text-matrix-bright transition-colors duration-300"
                  >
                    <span className="text-steel-dim">./</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ijtimoiy tarmoqlar */}
          <div>
            <p className="font-mono text-matrix mb-3 text-xs uppercase tracking-widest">{tr.footer.contact}</p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  data-hover
                  className="clip-corner-sm flex h-10 w-10 items-center justify-center border border-steel-dim text-steel-light transition-all duration-300 hover:border-matrix hover:text-matrix-bright hover:shadow-glow-green"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-steel-dim/30 pt-6 font-mono text-[11px] text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {links.siteName} — {tr.footer.rights}
          </p>
          <p>
            <span className="text-steel-dim">[ react + supabase + framer-motion ]</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
