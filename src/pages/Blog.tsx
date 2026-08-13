import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useI18n } from '../lib/i18n'
import { l10n } from '../lib/l10n'
import type { BlogPost } from '../types'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/ui/SectionHeading'
import CyberCard from '../components/ui/CyberCard'
import Reveal from '../components/ui/Reveal'
import Tag from '../components/ui/Tag'
import Loader from '../components/Loader'
import { cn, formatDate, truncate } from '../lib/utils'

export default function Blog() {
  const { tr, lang } = useI18n()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<string | null>(null)

  useEffect(() => {
    document.title = tr.meta.blog
  }, [tr])

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data as BlogPost[]) ?? [])
        setLoading(false)
      })
  }, [])

  const tags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [posts])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => {
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? '').toLowerCase().includes(q)
      const matchTag = !tag || p.tags.includes(tag)
      return matchQ && matchTag
    })
  }, [posts, query, tag])

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading key={`b-${lang}`} index="01" title={tr.blog.title} command="tail -f ./blog.log" />

        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <div className="clip-corner border border-steel-dim/50 glass p-10 text-center font-mono text-sm text-steel">
            {tr.blog.empty}
          </div>
        ) : (
          <>
            {/* Qidiruv va teg filtrlar */}
            <div className="mb-10 space-y-4">
              <div className="relative max-w-md">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-matrix">
                  /
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tr.blog.search}
                  className="cyber-input pl-9"
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    data-hover
                    onClick={() => setTag(null)}
                    className={cn(
                      'border px-3 py-1 font-mono text-xs transition-all duration-300',
                      !tag
                        ? 'border-matrix bg-matrix text-on-matrix'
                        : 'border-steel-dim text-steel-light hover:border-matrix hover:text-matrix-bright'
                    )}
                  >
                    {tr.blog.all}
                  </button>
                  {tags.map((t) => (
                    <button
                      key={t}
                      data-hover
                      onClick={() => setTag(tag === t ? null : t)}
                      className={cn(
                        'border px-3 py-1 font-mono text-xs transition-all duration-300',
                        tag === t
                          ? 'border-matrix bg-matrix text-on-matrix'
                          : 'border-steel-dim text-steel-light hover:border-matrix hover:text-matrix-bright'
                      )}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Postlar */}
            {filtered.length === 0 ? (
              <p className="font-mono text-sm text-steel">{tr.blog.noMatch}</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 2) * 0.1}>
                    <Link to={`/blog/${post.slug}`} data-hover className="block h-full">
                      <CyberCard className="flex h-full flex-col overflow-hidden">
                        <div className="relative aspect-[2/1] overflow-hidden border-b border-steel-dim/40">
                          {post.cover_url ? (
                            <img
                              src={post.cover_url}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-900 via-panel to-amber-dim/20">
                              <span className="font-mono text-2xl text-amber/50">~/blog</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <p className="font-mono text-[11px] text-amber-bright">
                            {formatDate(post.created_at)}
                          </p>
                          <h3 className="mt-2 font-display text-lg leading-snug text-ghost transition-colors duration-300 group-hover:text-matrix-bright">
                            {l10n(post, 'title', lang)}
                          </h3>
                          <p className="mt-2 flex-1 font-mono text-xs leading-relaxed text-steel-light">
                            {truncate(l10n(post, 'excerpt', lang), 130)}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {post.tags.map((t) => (
                              <Tag key={t}>#{t}</Tag>
                            ))}
                          </div>
                          <p className="mt-4 font-mono text-xs text-matrix">
                            {tr.blog.read.replace(' →', '')}{' '}
                            <span className="transition-transform duration-300 inline-block group-hover:translate-x-1">→</span>
                          </p>
                        </div>
                      </CyberCard>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  )
}
