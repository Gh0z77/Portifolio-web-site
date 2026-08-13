import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabase'
import { useI18n } from '../lib/i18n'
import { l10n } from '../lib/l10n'
import type { BlogPost as BlogPostType } from '../types'
import PageTransition from '../components/PageTransition'
import DecodeText from '../components/ui/DecodeText'
import GlitchText from '../components/ui/GlitchText'
import CyberButton from '../components/ui/CyberButton'
import Reveal from '../components/ui/Reveal'
import Tag from '../components/ui/Tag'
import Loader from '../components/Loader'
import { formatDate, truncate } from '../lib/utils'

export default function BlogPost() {
  const { tr, lang, links } = useI18n()
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [others, setOthers] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        const p = (data as BlogPostType) ?? null
        setPost(p)
        setLoading(false)
        if (p) {
          document.title = `${l10n(p, 'title', lang)} — ${links.siteName}`
          supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .neq('slug', slug)
            .order('created_at', { ascending: false })
            .limit(2)
            .then(({ data: rest }) => setOthers((rest as BlogPostType[]) ?? []))
        }
      })
  }, [slug])

  if (loading) {
    return (
      <PageTransition>
        <Loader />
      </PageTransition>
    )
  }

  if (!post) {
    return (
      <PageTransition>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
          <p className="mb-4 font-mono text-sm text-amber">// ERROR: POST NOT FOUND</p>
          <h1 className="font-display text-5xl font-black text-ghost md:text-7xl">
            <GlitchText text="404" interval={3} />
          </h1>
          <p className="mt-4 font-mono text-sm text-steel-light">{tr.post.notFound}</p>
          <div className="mt-8">
            <CyberButton to="/blog" variant="ghost">
              {tr.post.back}
            </CyberButton>
          </div>
        </div>
      </PageTransition>
    )
  }

  const words = (post.content ?? '').split(/\s+/).filter(Boolean).length
  const readMin = Math.max(1, Math.round(words / 200))

  return (
    <PageTransition>
      <article className="mx-auto max-w-4xl px-5 py-16 md:py-20">
        <Reveal direction="none">
          <CyberButton to="/blog" variant="ghost" size="sm">
            {tr.post.back}
          </CyberButton>
        </Reveal>

        {post.cover_url && (
          <Reveal className="mt-8">
            <div className="clip-corner overflow-hidden border border-steel-dim/60 shadow-glow-navy">
              <img src={post.cover_url} alt={post.title} className="max-h-[420px] w-full object-cover" />
            </div>
          </Reveal>
        )}

        <div className="mt-10">
          <DecodeText
            as="h1"
            text={l10n(post, 'title', lang)}
            className="font-display text-2xl font-bold leading-tight text-ghost md:text-4xl"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="text-amber-bright">{formatDate(post.created_at)}</span>
            <span className="text-steel-dim">·</span>
            <span className="text-steel-light">{tr.post.readTime.replace('{n}', String(readMin))}</span>
            {post.tags.length > 0 && (
              <>
                <span className="text-steel-dim">·</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <Tag key={t}>#{t}</Tag>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <Reveal className="mt-10">
          <div className="prose-ghost font-mono text-sm md:text-base">
            <ReactMarkdown>{l10n(post, 'content', lang) || l10n(post, 'excerpt', lang)}</ReactMarkdown>
          </div>
        </Reveal>

        {others.length > 0 && (
          <div className="mt-16 border-t border-steel-dim/40 pt-10">
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-matrix">
              {tr.post.others}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to={`/blog/${o.slug}`}
                  data-hover
                  className="clip-corner-sm group border border-steel-dim/50 glass p-5 transition-colors duration-300 hover:border-matrix/60"
                >
                  <p className="font-mono text-[11px] text-amber-bright">{formatDate(o.created_at)}</p>
                  <h3 className="mt-1.5 font-display text-base text-ghost transition-colors duration-300 group-hover:text-matrix-bright">
                    {l10n(o, 'title', lang)}
                  </h3>
                  <p className="mt-2 font-mono text-xs text-steel-light">
                    {truncate(l10n(o, 'excerpt', lang), 90)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </PageTransition>
  )
}
