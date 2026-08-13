import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useI18n } from '../lib/i18n'
import { l10n } from '../lib/l10n'
import type { Project } from '../types'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/ui/SectionHeading'
import CyberCard from '../components/ui/CyberCard'
import Tag from '../components/ui/Tag'
import Loader from '../components/Loader'
import { cn, truncate } from '../lib/utils'

export default function Portfolio() {
  const { tr, lang } = useI18n()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    document.title = tr.meta.portfolio
  }, [tr])

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects((data as Project[]) ?? [])
        setLoading(false)
      })
  }, [])

  const techs = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => p.tech_stack.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [projects])

  const filtered = useMemo(
    () => (!filter ? projects : projects.filter((p) => p.tech_stack.includes(filter))),
    [projects, filter]
  )

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading key={`p-${lang}`} index="01" title={tr.portfolio.title} command='grep -r "projects" ./' />

        {loading ? (
          <Loader />
        ) : projects.length === 0 ? (
          <div className="clip-corner border border-steel-dim/50 glass p-10 text-center font-mono text-sm text-steel">
            {tr.portfolio.empty}
          </div>
        ) : (
          <>
            {/* Filtrlar */}
            <div className="mb-10 flex flex-wrap gap-2">
              {[null, ...techs].map((t) => (
                <button
                  key={t ?? '__all__'}
                  data-hover
                  onClick={() => setFilter(t)}
                  className={cn(
                    'clip-corner-sm border px-4 py-1.5 font-mono text-xs tracking-wide transition-all duration-300',
                    filter === t
                      ? 'border-matrix bg-matrix text-on-matrix shadow-glow-green'
                      : 'border-steel-dim text-steel-light hover:border-matrix hover:text-matrix-bright'
                  )}
                >
                  {t ?? tr.portfolio.all}
                </button>
              ))}
            </div>

            {/* Loyihalar gridi */}
            <motion.div layout className="grid gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link to={`/portfolio/${p.slug}`} data-hover className="block h-full">
                      <CyberCard className="flex h-full flex-col overflow-hidden">
                        {/* Rasm */}
                        <div className="relative aspect-video overflow-hidden border-b border-steel-dim/40">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-900 via-panel to-navy-800">
                              <span className="font-mono text-5xl text-matrix/40">&lt;/&gt;</span>
                            </div>
                          )}
                          {/* Hover overlay */}
                          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-bg/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                            {p.live_url && (
                              <a
                                href={p.live_url}
                                target="_blank"
                                rel="noreferrer"
                                data-hover
                                onClick={(e) => e.stopPropagation()}
                                title="Jonli ko'rish"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-matrix text-matrix-bright transition-all hover:bg-matrix hover-text-on-matrix hover:shadow-glow-green"
                              >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M7 17 17 7M9 7h8v8" />
                                </svg>
                              </a>
                            )}
                            {p.github_url && (
                              <a
                                href={p.github_url}
                                target="_blank"
                                rel="noreferrer"
                                data-hover
                                onClick={(e) => e.stopPropagation()}
                                title="GitHub"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-amber text-amber-bright transition-all hover:bg-amber hover-text-on-amber hover:shadow-glow-amber"
                              >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                                </svg>
                              </a>
                            )}
                          </div>
                          {p.featured && (
                            <span className="absolute right-2 top-2 border border-amber/60 bg-bg/80 px-2 py-0.5 font-mono text-[10px] text-amber-bright">
                              ★ featured
                            </span>
                          )}
                        </div>
                        {/* Matn */}
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-display text-lg text-ghost transition-colors duration-300 group-hover:text-matrix-bright">
                            {p.title}
                          </h3>
                          <p className="mt-2 flex-1 font-mono text-xs leading-relaxed text-steel-light">
                            {truncate(l10n(p, 'description', lang), 140)}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {p.tech_stack.map((t) => (
                              <Tag key={t}>{t}</Tag>
                            ))}
                          </div>
                        </div>
                      </CyberCard>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <p className="mt-10 text-center font-mono text-sm text-steel">
                {tr.portfolio.noMatch}
              </p>
            )}
          </>
        )}
      </div>
    </PageTransition>
  )
}
