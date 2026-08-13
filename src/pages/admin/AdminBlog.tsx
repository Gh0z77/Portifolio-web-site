import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../../lib/supabase'
import { buildI18n } from '../../lib/translate'
import type { BlogPost } from '../../types'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import CyberButton from '../../components/ui/CyberButton'
import Tag from '../../components/ui/Tag'
import Loader from '../../components/Loader'
import ImageUpload from './ImageUpload'
import AdminModal from './AdminModal'
import { cn, formatDate, slugify } from '../../lib/utils'

interface FormState {
  id: string | null
  title: string
  slug: string
  slugTouched: boolean
  excerpt: string
  content: string
  cover_url: string | null
  tags: string
  published: boolean
}

const EMPTY: FormState = {
  id: null,
  title: '',
  slug: '',
  slugTouched: false,
  excerpt: '',
  content: '',
  cover_url: null,
  tags: '',
  published: false,
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [preview, setPreview] = useState(false)
  const [stage, setStage] = useState<'idle' | 'translating' | 'saving'>('idle')
  const [flash, setFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data as BlogPost[]) ?? [])
        setLoading(false)
      })
  }

  useEffect(() => {
    document.title = 'Blog — GHOST Admin'
    load()
  }, [])

  const openNew = () => {
    setError(null)
    setPreview(false)
    setForm({ ...EMPTY })
  }

  const openEdit = (p: BlogPost) => {
    setError(null)
    setPreview(false)
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      slugTouched: true,
      excerpt: p.excerpt ?? '',
      content: p.content ?? '',
      cover_url: p.cover_url,
      tags: p.tags.join(', '),
      published: p.published,
    })
  }

  const showFlash = (msg: string) => {
    setFlash(msg)
    setTimeout(() => setFlash(null), 2500)
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError(null)
    if (form.title.trim().length < 2) {
      setError('[!] Sarlavha kiritilishi shart')
      return
    }
    const slug = form.slug.trim() || slugify(form.title)

    setStage('translating')
    let i18n: Record<string, Record<string, string>> = {}
    try {
      i18n = await buildI18n({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
      })
    } catch {
      /* tarjima ishlamasa — asl matn qoladi */
    }

    setStage('saving')
    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      cover_url: form.cover_url,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      published: form.published,
      i18n,
    }
    const q = form.id
      ? supabase.from('blog_posts').update(payload).eq('id', form.id)
      : supabase.from('blog_posts').insert(payload)
    const { error: err } = await q
    setStage('idle')
    if (err) {
      setError(`[XATO] ${err.message}`)
    } else {
      showFlash('[OK] saqlandi va tarjima qilindi ✔')
      setForm(null)
      load()
    }
  }

  const remove = async (p: BlogPost) => {
    if (!confirm(`"${p.title}" postini o'chirasizmi?`)) return
    await supabase.from('blog_posts').delete().eq('id', p.id)
    load()
  }

  const togglePublished = async (p: BlogPost) => {
    await supabase.from('blog_posts').update({ published: !p.published }).eq('id', p.id)
    setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)))
  }

  const busy = stage !== 'idle'

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DecodeText
          as="h1"
          text="BLOG POSTLAR"
          className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
        />
        <CyberButton size="sm" onClick={openNew}>
          ＋ yangi post
        </CyberButton>
      </div>

      {flash && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 font-mono text-sm text-matrix-bright"
        >
          {flash}
        </motion.p>
      )}

      {/* ============ MODAL FORMA ============ */}
      <AdminModal
        open={!!form}
        onClose={() => !busy && setForm(null)}
        title={form?.id ? 'postni tahrirlash' : 'yangi post'}
      >
        {form && (
          <form onSubmit={save} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--sarlavha *</label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) =>
                      f
                        ? {
                            ...f,
                            title: e.target.value,
                            slug: f.slugTouched ? f.slug : slugify(e.target.value),
                          }
                        : f
                    )
                  }
                  className="cyber-input"
                  placeholder="Post sarlavhasi"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--slug (url)</label>
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, slug: e.target.value, slugTouched: true } : f))
                  }
                  className="cyber-input"
                  placeholder="post-sarlavhasi"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs text-matrix">
                --qisqa tavsif <span className="text-steel">(o'zbekcha yozing — ru/en avtomatik)</span>
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => (f ? { ...f, excerpt: e.target.value } : f))}
                rows={2}
                className="cyber-input resize-y"
                placeholder="Ro'yxatda ko'rinadigan qisqa matn"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="font-mono text-xs text-matrix">--kontent (markdown)</label>
                <button
                  type="button"
                  data-hover
                  onClick={() => setPreview((v) => !v)}
                  className={cn(
                    'border px-3 py-1 font-mono text-[11px] transition-colors',
                    preview
                      ? 'border-matrix bg-matrix text-on-matrix'
                      : 'border-steel-dim text-steel-light hover:border-matrix hover:text-matrix-bright'
                  )}
                >
                  {preview ? '✎ tahrirlash' : "👁 ko'rib chiqish"}
                </button>
              </div>
              {preview ? (
                <div className="prose-ghost min-h-[200px] border border-steel-dim bg-navy-900/30 p-4 font-mono text-sm">
                  <ReactMarkdown>{form.content || "_bo'sh_"}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => (f ? { ...f, content: e.target.value } : f))}
                  rows={12}
                  className="cyber-input resize-y font-mono"
                  placeholder={'## Sarlavha\n\nPost matni markdown formatida...'}
                />
              )}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <ImageUpload
                value={form.cover_url}
                onChange={(url) => setForm((f) => (f ? { ...f, cover_url: url } : f))}
                label="muqova rasmi"
              />
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block font-mono text-xs text-matrix">--teglar (vergul bilan)</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm((f) => (f ? { ...f, tags: e.target.value } : f))}
                    className="cyber-input"
                    placeholder="react, dasturlash, yangilik"
                  />
                </div>
                <label data-hover className="flex cursor-pointer items-center gap-2 font-mono text-sm text-steel-light">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((f) => (f ? { ...f, published: e.target.checked } : f))}
                    className="h-4 w-4 accent-[#5fb50a]"
                  />
                  chop etish (saytda ko'rinadi)
                </label>
              </div>
            </div>

            {error && <p className="font-mono text-xs text-amber-bright">{error}</p>}

            <div className="flex gap-3 pt-2">
              <CyberButton type="submit" disabled={busy}>
                {stage === 'translating'
                  ? '🌐 tarjima qilinmoqda...'
                  : stage === 'saving'
                    ? 'saqlanmoqda...'
                    : 'saqlash ✔'}
              </CyberButton>
              <CyberButton variant="ghost" onClick={() => setForm(null)} disabled={busy}>
                bekor qilish
              </CyberButton>
            </div>
          </form>
        )}
      </AdminModal>

      {/* ============ RO'YXAT ============ */}
      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <div className="mt-10 clip-corner border border-steel-dim/50 bg-panel/60 p-10 text-center font-mono text-sm text-steel">
          // postlar yo'q — birinchisini yozing
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 border border-steel-dim/50 bg-panel/70 p-4 transition-colors hover:border-steel/70"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm text-ghost">{p.title}</p>
                <p className="truncate font-mono text-xs text-steel">
                  /{p.slug} · {formatDate(p.created_at)}
                </p>
              </div>
              <button data-hover onClick={() => togglePublished(p)} title="holatni almashtirish">
                {p.published ? <Tag color="green">chop etilgan</Tag> : <Tag>qoralama</Tag>}
              </button>
              <div className="flex items-center gap-2">
                <button
                  data-hover
                  onClick={() => openEdit(p)}
                  className="border border-steel-dim px-3 py-1.5 font-mono text-xs text-steel-light transition-colors hover:border-matrix hover:text-matrix-bright"
                >
                  tahrirlash
                </button>
                <button
                  data-hover
                  onClick={() => remove(p)}
                  className="border border-steel-dim px-3 py-1.5 font-mono text-xs text-steel-light transition-colors hover:border-amber hover:text-amber-bright"
                >
                  o'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  )
}
