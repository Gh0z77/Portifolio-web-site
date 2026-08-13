import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabase'
import { useI18n } from '../lib/i18n'
import { l10n } from '../lib/l10n'
import type { Project } from '../types'
import PageTransition from '../components/PageTransition'
import DecodeText from '../components/ui/DecodeText'
import GlitchText from '../components/ui/GlitchText'
import CyberButton from '../components/ui/CyberButton'
import Reveal from '../components/ui/Reveal'
import Tag from '../components/ui/Tag'
import Loader from '../components/Loader'
import { formatDate } from '../lib/utils'

export default function ProjectDetail() {
  const { tr, lang, links } = useI18n()
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        setProject((data as Project) ?? null)
        setLoading(false)
        if (data) document.title = `${(data as Project).title} — ${links.siteName}`
      })
  }, [slug])

  if (loading) {
    return (
      <PageTransition>
        <Loader />
      </PageTransition>
    )
  }

  if (!project) {
    return (
      <PageTransition>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
          <p className="mb-4 font-mono text-sm text-amber">// ERROR: FILE NOT FOUND</p>
          <h1 className="font-display text-5xl font-black text-ghost md:text-7xl">
            <GlitchText text="404" interval={3} />
          </h1>
          <p className="mt-4 font-mono text-sm text-steel-light">{tr.project.notFound}</p>
          <div className="mt-8">
            <CyberButton to="/portfolio" variant="ghost">
              {tr.project.back}
            </CyberButton>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <Reveal direction="none">
          <CyberButton to="/portfolio" variant="ghost" size="sm">
            {tr.project.back}
          </CyberButton>
        </Reveal>

        <div className="mt-8">
          <p className="font-mono text-xs text-amber md:text-sm">
            <span className="text-steel">$</span> cat ./projects/{project.slug}.md
          </p>
          <DecodeText
            as="h1"
            text={project.title}
            className="mt-3 font-display text-3xl font-bold uppercase tracking-wide text-ghost md:text-5xl"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-amber-bright">{formatDate(project.created_at)}</span>
            <span className="text-steel-dim">·</span>
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </div>

        {project.image_url && (
          <Reveal className="mt-10">
            <div className="clip-corner overflow-hidden border border-steel-dim/60 shadow-glow-navy">
              <img src={project.image_url} alt={project.title} className="w-full object-cover" />
            </div>
          </Reveal>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* Kontent */}
          <Reveal>
            <div className="prose-ghost font-mono text-sm md:text-base">
              {project.content ? (
                <ReactMarkdown>{l10n(project, 'content', lang)}</ReactMarkdown>
              ) : (
                <p>{l10n(project, 'description', lang)}</p>
              )}
            </div>
          </Reveal>

          {/* Yon panel */}
          <Reveal delay={0.15} direction="left">
            <div className="clip-corner h-fit border border-steel-dim/60 bg-panel/70 p-6 lg:sticky lg:top-28">
              <p className="font-mono text-xs uppercase tracking-widest text-matrix">
                {tr.project.info}
              </p>
              <div className="mt-4 space-y-3 font-mono text-xs">
                <p className="text-steel-light">
                  <span className="text-steel">{tr.project.date}</span>{' '}
                  <span className="text-amber-bright">{formatDate(project.created_at)}</span>
                </p>
                <div>
                  <p className="mb-2 text-steel">{tr.project.techs}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.map((t) => (
                      <Tag key={t} color="green">
                        {t}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                {project.live_url && (
                  <CyberButton href={project.live_url} size="sm">
                    {tr.project.live}
                  </CyberButton>
                )}
                {project.github_url && (
                  <CyberButton href={project.github_url} variant="ghost" size="sm">
                    {tr.project.github}
                  </CyberButton>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}
