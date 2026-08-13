import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { buildI18n } from '../../lib/translate'
import type { Testimonial } from '../../types'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import CyberButton from '../../components/ui/CyberButton'
import Tag from '../../components/ui/Tag'
import Loader from '../../components/Loader'
import ImageUpload from './ImageUpload'
import AdminModal from './AdminModal'

interface FormState {
  id: string | null
  name: string
  role: string
  text: string
  avatar_url: string | null
  sort_order: number
  active: boolean
}

const EMPTY: FormState = {
  id: null,
  name: '',
  role: '',
  text: '',
  avatar_url: null,
  sort_order: 0,
  active: true,
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [stage, setStage] = useState<'idle' | 'translating' | 'saving'>('idle')
  const [flash, setFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setItems((data as Testimonial[]) ?? [])
        setLoading(false)
      })
  }

  useEffect(() => {
    document.title = 'Mijozlar fikri — GHOST Admin'
    load()
  }, [])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError(null)
    if (form.name.trim().length < 2 || form.text.trim().length < 5) {
      setError('[!] Ism va fikr matni kiritilishi shart')
      return
    }

    setStage('translating')
    let i18n: Record<string, Record<string, string>> = {}
    try {
      i18n = await buildI18n({ text: form.text, role: form.role })
    } catch {
      /* tarjima ishlamasa asl matn qoladi */
    }

    setStage('saving')
    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || null,
      text: form.text.trim(),
      avatar_url: form.avatar_url,
      sort_order: form.sort_order,
      active: form.active,
      i18n,
    }
    const q = form.id
      ? supabase.from('testimonials').update(payload).eq('id', form.id)
      : supabase.from('testimonials').insert(payload)
    const { error: err } = await q
    setStage('idle')
    if (err) {
      setError(`[XATO] ${err.message}`)
    } else {
      setFlash('[OK] saqlandi va tarjima qilindi ✔')
      setTimeout(() => setFlash(null), 2500)
      setForm(null)
      load()
    }
  }

  const remove = async (t: Testimonial) => {
    if (!confirm(`"${t.name}" fikrini o'chirasizmi?`)) return
    await supabase.from('testimonials').delete().eq('id', t.id)
    load()
  }

  const toggleActive = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ active: !t.active }).eq('id', t.id)
    setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x)))
  }

  const busy = stage !== 'idle'

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DecodeText
          as="h1"
          text="MIJOZLAR FIKRI"
          className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
        />
        <CyberButton
          size="sm"
          onClick={() => {
            setError(null)
            setForm({ ...EMPTY, sort_order: items.length + 1 })
          }}
        >
          ＋ yangi fikr
        </CyberButton>
      </div>
      <p className="mt-2 font-mono text-xs text-steel">
        // mijozlaringizdan 2-3 gaplik fikr so'rang — bu ishonchning eng kuchli quroli
      </p>

      {flash && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-mono text-sm text-matrix-bright">
          {flash}
        </motion.p>
      )}

      <AdminModal
        open={!!form}
        onClose={() => !busy && setForm(null)}
        title={form?.id ? 'fikrni tahrirlash' : 'yangi fikr'}
      >
        {form && (
          <form onSubmit={save} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--mijoz ismi *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => (f ? { ...f, name: e.target.value } : f))}
                  className="cyber-input"
                  placeholder="Aziz Karimov"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--lavozimi / loyihasi</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm((f) => (f ? { ...f, role: e.target.value } : f))}
                  className="cyber-input"
                  placeholder="«Do'kon» internet-magazin egasi"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs text-matrix">
                --fikr matni * <span className="text-steel">(o'zbekcha yozing — ru/en avtomatik)</span>
              </label>
              <textarea
                value={form.text}
                onChange={(e) => setForm((f) => (f ? { ...f, text: e.target.value } : f))}
                rows={4}
                className="cyber-input resize-y"
                placeholder="GHOST bilan ishlash juda qulay bo'ldi..."
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <ImageUpload
                value={form.avatar_url}
                onChange={(url) => setForm((f) => (f ? { ...f, avatar_url: url } : f))}
                label="mijoz rasmi (ixtiyoriy)"
              />
              <div className="space-y-5">
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
                <label data-hover className="flex cursor-pointer items-center gap-2 font-mono text-sm text-steel-light">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((f) => (f ? { ...f, active: e.target.checked } : f))}
                    className="h-4 w-4 accent-[#5fb50a]"
                  />
                  aktiv (saytda ko'rinadi)
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

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="mt-10 clip-corner border border-steel-dim/50 bg-panel/60 p-10 text-center font-mono text-sm text-steel">
          // fikrlar yo'q — birinchisini qo'shing
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center gap-4 border border-steel-dim/50 bg-panel/70 p-4 transition-colors hover:border-steel/70"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-steel-dim/40">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy-900 font-mono text-sm text-matrix/60">
                    {t.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm text-ghost">
                  {t.name} {t.role && <span className="font-mono text-xs text-steel">— {t.role}</span>}
                </p>
                <p className="truncate font-mono text-xs text-steel-light">{t.text}</p>
              </div>
              <button data-hover onClick={() => toggleActive(t)}>
                {t.active ? <Tag color="green">aktiv</Tag> : <Tag>o'chiq</Tag>}
              </button>
              <div className="flex items-center gap-2">
                <button
                  data-hover
                  onClick={() =>
                    setForm({
                      id: t.id,
                      name: t.name,
                      role: t.role ?? '',
                      text: t.text,
                      avatar_url: t.avatar_url,
                      sort_order: t.sort_order,
                      active: t.active,
                    })
                  }
                  className="border border-steel-dim px-3 py-1.5 font-mono text-xs text-steel-light transition-colors hover:border-matrix hover:text-matrix-bright"
                >
                  tahrirlash
                </button>
                <button
                  data-hover
                  onClick={() => remove(t)}
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
