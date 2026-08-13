import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { buildI18n } from '../../lib/translate'
import type { Service } from '../../types'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import CyberButton from '../../components/ui/CyberButton'
import Tag from '../../components/ui/Tag'
import Loader from '../../components/Loader'
import AdminModal from './AdminModal'

interface FormState {
  id: string | null
  title: string
  description: string
  icon: string
  price: string
  sort_order: number
  active: boolean
}

const EMPTY: FormState = {
  id: null,
  title: '',
  description: '',
  icon: 'globe',
  price: 'kelishilgan holda',
  sort_order: 0,
  active: true,
}

const ICONS = ['globe', 'bot', 'code', 'server', 'wrench', 'terminal']

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [stage, setStage] = useState<'idle' | 'translating' | 'saving'>('idle')
  const [flash, setFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setServices((data as Service[]) ?? [])
        setLoading(false)
      })
  }

  useEffect(() => {
    document.title = 'Xizmatlar — GHOST Admin'
    load()
  }, [])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError(null)
    if (form.title.trim().length < 2) {
      setError('[!] Nomi kiritilishi shart')
      return
    }

    setStage('translating')
    let i18n: Record<string, Record<string, string>> = {}
    try {
      i18n = await buildI18n({
        title: form.title,
        description: form.description,
        price: form.price,
      })
    } catch {
      /* tarjima ishlamasa — asl matn qoladi */
    }

    setStage('saving')
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      icon: form.icon,
      price: form.price.trim() || null,
      sort_order: form.sort_order,
      active: form.active,
      i18n,
    }
    const q = form.id
      ? supabase.from('services').update(payload).eq('id', form.id)
      : supabase.from('services').insert(payload)
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

  const remove = async (s: Service) => {
    if (!confirm(`"${s.title}" xizmatini o'chirasizmi?`)) return
    await supabase.from('services').delete().eq('id', s.id)
    load()
  }

  const toggleActive = async (s: Service) => {
    await supabase.from('services').update({ active: !s.active }).eq('id', s.id)
    setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)))
  }

  const busy = stage !== 'idle'

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DecodeText
          as="h1"
          text="XIZMATLAR"
          className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
        />
        <CyberButton
          size="sm"
          onClick={() => {
            setError(null)
            setForm({ ...EMPTY, sort_order: services.length + 1 })
          }}
        >
          ＋ yangi xizmat
        </CyberButton>
      </div>

      {flash && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-mono text-sm text-matrix-bright">
          {flash}
        </motion.p>
      )}

      {/* ============ MODAL FORMA ============ */}
      <AdminModal
        open={!!form}
        onClose={() => !busy && setForm(null)}
        title={form?.id ? 'xizmatni tahrirlash' : 'yangi xizmat'}
      >
        {form && (
          <form onSubmit={save} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--nomi *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => (f ? { ...f, title: e.target.value } : f))}
                  className="cyber-input"
                  placeholder="Xizmat nomi"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--ikonka</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm((f) => (f ? { ...f, icon: e.target.value } : f))}
                  className="cyber-input"
                >
                  {ICONS.map((i) => (
                    <option key={i} value={i} className="bg-panel">
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs text-matrix">
                --tavsif <span className="text-steel">(o'zbekcha yozing — ru/en avtomatik)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => (f ? { ...f, description: e.target.value } : f))}
                rows={3}
                className="cyber-input resize-y"
                placeholder="Xizmat haqida qisqacha"
              />
            </div>
            <div className="flex flex-wrap items-end gap-5">
              <div className="min-w-[200px] flex-1">
                <label className="mb-1.5 block font-mono text-xs text-matrix">--narx</label>
                <input
                  value={form.price}
                  onChange={(e) => setForm((f) => (f ? { ...f, price: e.target.value } : f))}
                  className="cyber-input"
                  placeholder="kelishilgan holda"
                />
              </div>
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
              <label data-hover className="flex cursor-pointer items-center gap-2 pb-1 font-mono text-sm text-steel-light">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => (f ? { ...f, active: e.target.checked } : f))}
                  className="h-4 w-4 accent-[#5fb50a]"
                />
                aktiv (saytda ko'rinadi)
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
      ) : services.length === 0 ? (
        <div className="mt-10 clip-corner border border-steel-dim/50 bg-panel/60 p-10 text-center font-mono text-sm text-steel">
          // xizmatlar yo'q
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-4 border border-steel-dim/50 bg-panel/70 p-4 transition-colors hover:border-steel/70"
            >
              <span className="clip-corner-sm flex h-10 w-10 shrink-0 items-center justify-center border border-matrix/40 bg-matrix-dark/30 font-mono text-xs text-matrix-bright">
                {s.icon?.slice(0, 2) ?? '??'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm text-ghost">{s.title}</p>
                <p className="truncate font-mono text-xs text-steel">{s.price}</p>
              </div>
              <button data-hover onClick={() => toggleActive(s)} title="holatni almashtirish">
                {s.active ? <Tag color="green">aktiv</Tag> : <Tag>o'chirilgan</Tag>}
              </button>
              <div className="flex items-center gap-2">
                <button
                  data-hover
                  onClick={() => {
                    setError(null)
                    setForm({
                      id: s.id,
                      title: s.title,
                      description: s.description ?? '',
                      icon: s.icon ?? 'globe',
                      price: s.price ?? '',
                      sort_order: s.sort_order,
                      active: s.active,
                    })
                  }}
                  className="border border-steel-dim px-3 py-1.5 font-mono text-xs text-steel-light transition-colors hover:border-matrix hover:text-matrix-bright"
                >
                  tahrirlash
                </button>
                <button
                  data-hover
                  onClick={() => remove(s)}
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
