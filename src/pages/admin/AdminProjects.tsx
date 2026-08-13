import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { buildI18n } from '../../lib/translate'
import type { Project } from '../../types'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import CyberButton from '../../components/ui/CyberButton'
import Tag from '../../components/ui/Tag'
import Loader from '../../components/Loader'
import ImageUpload from './ImageUpload'
import AdminModal from './AdminModal'
import { formatDate, slugify } from '../../lib/utils'

interface FormState {
  id: string | null
  title: string
  slug: string
  slugTouched: boolean
  description: string
  content: string
  image_url: string | null
  tech: string
  live_url: string
  github_url: string
  featured: boolean
  sort_order: number
}

const EMPTY: FormState = {
  id: null,
  title: '',
  slug: '',
  slugTouched: false,
  description: '',
  content: '',
  image_url: null,
  tech: '',
  live_url: '',
  github_url: '',
  featured: false,
  sort_order: 0,
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [stage, setStage] = useState<'idle' | 'translating' | 'saving'>('idle')
  const [flash, setFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects((data as Project[]) ?? [])
        setLoading(false)
      })
  }

  useEffect(() => {
    document.title = 'Loyihalar — GHOST Admin'
    load()
  }, [])

  const openNew = () => {
    setError(null)
    setForm({ ...EMPTY, sort_order: projects.length + 1 })
  }

  const openEdit = (p: Project) => {
    setError(null)
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      slugTouched: true,
      description: p.description ?? '',
      content: p.content ?? '',
      image_url: p.image_url,
      tech: p.tech_stack.join(', '),
      live_url: p.live_url ?? '',
      github_url: p.github_url ?? '',
      featured: p.featured,
      sort_order: p.sort_order,
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
    if (!slug) {
      setError("[!] Slug bo'sh bo'lishi mumkin emas")
      return
    }

    // Ruscha/inglizcha versiyalar avtomatik tarjima qilinadi
    setStage('translating')
    let i18n: Record<string, Record<string, string>> = {}
    try {
      i18n = await buildI18n({
        description: form.description,
        content: form.content,
      })
    } catch {
      /* tarjima ishlamasa — asl matn qoladi */
    }

    setStage('saving')
    const payload = {
      title: form.title.trim(),
      slug,
      description: form.description.trim() || null,
      content: form.content.trim() || null,
      image_url: form.image_url,
      tech_stack: form.tech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      live_url: form.live_url.trim() || null,
      github_url: form.github_url.trim() || null,
      featured: form.featured,
      sort_order: form.sort_order,
      i18n,
    }
    const q = form.id
      ? supabase.from('projects').update(payload).eq('id', form.id)
      : supabase.from('projects').insert(payload)
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

  const remove = async (p: Project) => {
    if (!confirm(`"${p.title}" loyihasini o'chirasizmi?`)) return
    await supabase.from('projects').delete().eq('id', p.id)
    load()
  }

  const toggleFeatured = async (p: Project) => {
    await supabase.from('projects').update({ featured: !p.featured }).eq('id', p.id)
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)))
  }

  const busy = stage !== 'idle'

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DecodeText
          as="h1"
          text="LOYIHALAR"
          className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
        />
        <CyberButton size="sm" onClick={openNew}>
          ＋ yangi loyiha
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
        title={form?.id ? 'loyihani tahrirlash' : 'yangi loyiha'}
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
                  placeholder="Loyiha nomi"
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
                  placeholder="loyiha-nomi"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs text-matrix">
                --qisqa tavsif <span className="text-steel">(o'zbekcha yozing — ru/en avtomatik)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => (f ? { ...f, description: e.target.value } : f))}
                rows={2}
                className="cyber-input resize-y"
                placeholder="Kartada ko'rinadigan 1-2 gaplik tavsif"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs text-matrix">--kontent (markdown)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => (f ? { ...f, content: e.target.value } : f))}
                rows={10}
                className="cyber-input resize-y font-mono"
                placeholder={'## Loyiha haqida\n\nBatafsil ma\'lumot markdown formatida...'}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm((f) => (f ? { ...f, image_url: url } : f))}
              />
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block font-mono text-xs text-matrix">
                    --texnologiyalar (vergul bilan)
                  </label>
                  <input
                    value={form.tech}
                    onChange={(e) => setForm((f) => (f ? { ...f, tech: e.target.value } : f))}
                    className="cyber-input"
                    placeholder="React, TypeScript, Supabase"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-xs text-matrix">--live url</label>
                  <input
                    value={form.live_url}
                    onChange={(e) => setForm((f) => (f ? { ...f, live_url: e.target.value } : f))}
                    className="cyber-input"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-xs text-matrix">--github url</label>
                  <input
                    value={form.github_url}
                    onChange={(e) => setForm((f) => (f ? { ...f, github_url: e.target.value } : f))}
                    className="cyber-input"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <label data-hover className="flex cursor-pointer items-center gap-2 font-mono text-sm text-steel-light">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => (f ? { ...f, featured: e.target.checked } : f))}
                  className="h-4 w-4 accent-[#5fb50a]"
                />
                ★ tanlangan (bosh sahifada)
              </label>
              <label className="flex items-center gap-2 font-mono text-sm text-steel-light">
                tartib:
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, sort_order: Number(e.target.value) || 0 } : f))
                  }
                  className="cyber-input w-24 !py-1.5"
                />
              </label>
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
      ) : projects.length === 0 ? (
        <div className="mt-10 clip-corner border border-steel-dim/50 bg-panel/60 p-10 text-center font-mono text-sm text-steel">
          // loyihalar yo'q — birinchisini qo'shing
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 border border-steel-dim/50 bg-panel/70 p-4 transition-colors hover:border-steel/70"
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden border border-steel-dim/40">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy-900 font-mono text-xs text-matrix/40">
                    &lt;/&gt;
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm text-ghost">{p.title}</p>
                <p className="truncate font-mono text-xs text-steel">
                  /{p.slug} · {formatDate(p.created_at)}
                </p>
              </div>
              {p.featured && <Tag color="amber">★ featured</Tag>}
              <div className="flex items-center gap-2">
                <button
                  data-hover
                  title={p.featured ? 'featureddan olish' : 'featured qilish'}
                  onClick={() => toggleFeatured(p)}
                  className={`px-2 py-1 font-mono text-lg transition-colors ${
                    p.featured ? 'text-amber-bright' : 'text-steel-dim hover:text-amber'
                  }`}
                >
                  ★
                </button>
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
