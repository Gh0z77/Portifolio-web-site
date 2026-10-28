import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { loadServices } from '../lib/projects'
import { useI18n } from '../lib/i18n'
import { l10n } from '../lib/l10n'
import type { Service } from '../types'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import CyberCard from '../components/ui/CyberCard'
import CyberButton from '../components/ui/CyberButton'
import Loader from '../components/Loader'
import { cn } from '../lib/utils'

/** icon maydoniga mos SVG belgilar */
function ServiceIcon({ name }: { name: string | null }) {
  const cls = 'h-7 w-7'
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" />
        </svg>
      )
    case 'bot':
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M12 8V4m0 0h3" />
          <circle cx="9" cy="13" r="1" fill="currentColor" />
          <circle cx="15" cy="13" r="1" fill="currentColor" />
          <path d="M9 17h6" />
        </svg>
      )
    case 'code':
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="m8 6-6 6 6 6M16 6l6 6-6 6M13 4l-2 16" />
        </svg>
      )
    case 'server':
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <rect x="3" y="4" width="18" height="7" rx="1.5" />
          <rect x="3" y="13" width="18" height="7" rx="1.5" />
          <path d="M7 7.5h.01M7 16.5h.01" />
        </svg>
      )
    case 'wrench':
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-3 3-2.6-.4-.4-2.6 3-3z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m7 9 3 3-3 3M13 15h4" />
        </svg>
      )
  }
}

export default function Services() {
  const { tr, lang } = useI18n()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    document.title = tr.meta.services
  }, [tr])

  useEffect(() => {
    loadServices().then((list) => {
      setServices(list)
      setLoading(false)
    })
  }, [])

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        {/* ============ XIZMATLAR ============ */}
        <SectionHeading key={`s-${lang}`} index="01" title={tr.services.title} command="ls -la ./services/" />
        {loading ? (
          <Loader />
        ) : services.length === 0 ? (
          <p className="font-mono text-sm text-steel">{tr.services.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1}>
                <CyberCard className="flex h-full flex-col p-6">
                  <div className="clip-corner-sm flex h-14 w-14 items-center justify-center border border-matrix/40 bg-matrix-dark/30 text-matrix-bright">
                    <ServiceIcon name={s.icon} />
                  </div>
                  <h3 className="mt-5 font-display text-lg text-ghost">{l10n(s, 'title', lang)}</h3>
                  <p className="mt-3 flex-1 font-mono text-xs leading-relaxed text-steel-light md:text-sm">
                    {l10n(s, 'description', lang)}
                  </p>
                  <p className="mt-5 font-mono text-xs text-amber">
                    <span className="text-steel">$</span> {tr.services.priceLabel}: {l10n(s, 'price', lang) || tr.services.priceDefault}
                  </p>
                  <div className="mt-4">
                    <CyberButton to="/contact" size="sm" variant="ghost">
                      {tr.services.orderBtn}
                    </CyberButton>
                  </div>
                </CyberCard>
              </Reveal>
            ))}
          </div>
        )}

        {/* ============ ISH JARAYONI ============ */}
        <div className="mt-24">
          <SectionHeading key={`p-${lang}`} index="02" title={tr.services.processTitle} command="cat workflow.sh" />
          <div className="grid gap-8 md:grid-cols-4">
            {tr.services.steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.15}>
                <div className="relative">
                  <p className="font-display text-5xl font-black text-steel-dim/60">{step.num}</p>
                  <h3 className="mt-2 font-display text-base tracking-widest text-matrix-bright">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-steel-light">{step.text}</p>
                  {i < tr.services.steps.length - 1 && (
                    <span className="absolute -right-6 top-4 hidden font-mono text-xl text-amber md:block">
                      »
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ============ FAQ ============ */}
        <div className="mt-24">
          <SectionHeading key={`f-${lang}`} index="03" title={tr.services.faqTitle} command="man ghost | grep FAQ" />
          <div className="mx-auto max-w-3xl space-y-3">
            {tr.services.faq.map((item, i) => {
              const open = openFaq === i
              return (
                <Reveal key={i} delay={i * 0.07}>
                  <div
                    className={cn(
                      'border glass transition-colors duration-300',
                      open ? 'border-matrix/60' : 'border-steel-dim/50'
                    )}
                  >
                    <button
                      data-hover
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-mono text-sm text-ghost">
                        <span className="mr-2 text-matrix">?</span>
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={{ duration: 0.25 }}
                        className={cn('font-mono text-lg', open ? 'text-matrix-bright' : 'text-steel')}
                      >
                        ›
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="border-t border-steel-dim/40 px-5 py-4 font-mono text-xs leading-relaxed text-steel-light md:text-sm">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* ============ CTA ============ */}
        <Reveal className="mt-20 text-center">
          <p className="font-mono text-sm text-steel-light">{tr.services.ctaQ}</p>
          <div className="mt-5">
            <CyberButton to="/contact" variant="amber">
              {tr.services.ctaBtn}
            </CyberButton>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  )
}
