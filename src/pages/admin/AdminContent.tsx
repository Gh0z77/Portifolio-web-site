import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { translateText } from '../../lib/translate'
import { translations } from '../../lib/translations'
import { DEFAULT_LINKS } from '../../lib/i18n'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import CyberButton from '../../components/ui/CyberButton'
import { cn } from '../../lib/utils'

/* ============================================================
   Sayt barcha matnlarini tahrirlash: o'zbekcha yoziladi,
   ru/en avtomatik tarjima qilinib content_overrides ga saqlanadi.
   ============================================================ */

const DEF = translations.uz

interface CForm {
  home: {
    initLine: string
    desc: string
    roles: string
    marquee: string
    stats: { value: string; label: string }[]
    featuredTitle: string
    whatIDo: string
    ctaTitle: string
    ctaText: string
    ctaBtn: string
    ctaProjects: string
    ctaContact: string
  }
  about: {
    p1: string
    p2: string
    terminal: { cmd: string; out: string }[]
    info: { jobVal: string; locationVal: string; statusVal: string; emailVal: string }
    skillsGroups: { title: string; skills: { name: string; level: number }[] }[]
    timeline: { year: string; title: string; text: string }[]
    interests: string
  }
  services: {
    steps: { title: string; text: string }[]
    faq: { q: string; a: string }[]
    ctaQ: string
    ctaBtn: string
  }
  contact: {
    cLocationVal: string
    cResponseVal: string
    orFill: string
    successTitle: string
    successText: string
  }
  footer: { tagline1: string; tagline2: string }
  boot: { lines: string; online: string; skip: string }
  links: { siteName: string; email: string; telegramUser: string; telegram: string; github: string }
}

const buildDefaults = (): CForm => ({
  home: {
    initLine: DEF.home.initLine,
    desc: DEF.home.desc,
    roles: DEF.home.roles.join('\n'),
    marquee: DEF.home.marquee.join(', '),
    stats: DEF.home.stats.map((s) => ({ ...s })),
    featuredTitle: DEF.home.featuredTitle,
    whatIDo: DEF.home.whatIDo,
    ctaTitle: DEF.home.ctaTitle,
    ctaText: DEF.home.ctaText,
    ctaBtn: DEF.home.ctaBtn,
    ctaProjects: DEF.home.ctaProjects,
    ctaContact: DEF.home.ctaContact,
  },
  about: {
    p1: DEF.about.p1,
    p2: DEF.about.p2,
    terminal: DEF.about.terminal.map((t) => ({ cmd: t.cmd, out: (t.out ?? []).join(' | ') })),
    info: {
      jobVal: DEF.about.info.jobVal,
      locationVal: DEF.about.info.locationVal,
      statusVal: DEF.about.info.statusVal,
      emailVal: DEF.about.info.emailVal,
    },
    skillsGroups: DEF.about.skillsGroups.map((g) => ({
      title: g.title,
      skills: g.skills.map((s) => ({ ...s })),
    })),
    timeline: DEF.about.timeline.map((t) => ({ ...t })),
    interests: DEF.about.interests.join(', '),
  },
  services: {
    steps: DEF.services.steps.map((s) => ({ title: s.title, text: s.text })),
    faq: DEF.services.faq.map((f) => ({ ...f })),
    ctaQ: DEF.services.ctaQ,
    ctaBtn: DEF.services.ctaBtn,
  },
  contact: {
    cLocationVal: DEF.contact.cLocationVal,
    cResponseVal: DEF.contact.cResponseVal,
    orFill: DEF.contact.orFill,
    successTitle: DEF.contact.successTitle,
    successText: DEF.contact.successText,
  },
  footer: { tagline1: DEF.footer.tagline1, tagline2: DEF.footer.tagline2 },
  boot: {
    lines: DEF.boot.lines.join('\n'),
    online: DEF.boot.online,
    skip: DEF.boot.skip,
  },
  links: { ...DEFAULT_LINKS },
})

/** Parallel tarjima uchun cheklagich (bir vaqtda maks 5 so'rov) */
function createLimiter(max: number) {
  let active = 0
  const queue: (() => void)[] = []
  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= max) await new Promise<void>((res) => queue.push(res))
    active++
    try {
      return await fn()
    } finally {
      active--
      const next = queue.shift()
      if (next) next()
    }
  }
}

/* ============ Kichik forma komponentlari ============ */

function F({
  label,
  value,
  onChange,
  rows,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs text-matrix">--{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="cyber-input resize-y"
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="cyber-input" />
      )}
    </div>
  )
}

function Section({
  id,
  title,
  open,
  toggle,
  children,
}: {
  id: string
  title: string
  open: string | null
  toggle: (id: string) => void
  children: ReactNode
}) {
  const isOpen = open === id
  return (
    <div className={cn('border bg-panel/70 transition-colors', isOpen ? 'border-matrix/50' : 'border-steel-dim/50')}>
      <button
        type="button"
        data-hover
        onClick={() => toggle(id)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-matrix">// {title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          className={cn('font-mono text-lg', isOpen ? 'text-matrix-bright' : 'text-steel')}
        >
          ›
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-steel-dim/40 p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================ */

export default function AdminContent() {
  const [form, setForm] = useState<CForm>(buildDefaults)
  const [openSec, setOpenSec] = useState<string | null>('home')
  const [stage, setStage] = useState<'idle' | 'translating' | 'saving'>('idle')
  const [progress, setProgress] = useState(0)
  const [msg, setMsg] = useState<string | null>(null)

  // Baza kontentini (loyiha/post/xizmat/fikr) ru+en ga to'ldirish
  const [dbBusy, setDbBusy] = useState(false)
  const [dbProg, setDbProg] = useState('')
  const [dbMsg, setDbMsg] = useState<string | null>(null)

  /**
   * Bazadagi BARCHA yozuvlarni tekshiradi: qaysi maydonning ru/en tarjimasi
   * yo'q bo'lsa — tarjima qilib i18n ustuniga yozadi. Avval qo'shilgan
   * (tarjimasiz saqlangan) kontent uchun bir bosishda hammasi to'ldiriladi.
   */
  const translateDb = async () => {
    setDbBusy(true)
    setDbMsg(null)
    const targets: ('ru' | 'en')[] = ['ru', 'en']
    const tables: { name: string; fields: string[] }[] = [
      { name: 'projects', fields: ['description', 'content'] },
      { name: 'blog_posts', fields: ['title', 'excerpt', 'content'] },
      { name: 'services', fields: ['title', 'description', 'price'] },
      { name: 'testimonials', fields: ['text', 'role'] },
    ]
    let updated = 0
    let ready = 0
    let failed = 0

    for (const tbl of tables) {
      const { data, error } = await supabase.from(tbl.name).select('*')
      if (error) {
        failed++
        continue
      }
      const rows = (data as Record<string, unknown>[]) ?? []
      for (const row of rows) {
        const existing = (row.i18n ?? {}) as Record<string, Record<string, string>>
        const next: Record<string, Record<string, string>> = {
          ru: { ...(existing.ru ?? {}) },
          en: { ...(existing.en ?? {}) },
        }
        let changed = false
        const label = String(row.title ?? row.name ?? '').slice(0, 28)

        for (const to of targets) {
          for (const f of tbl.fields) {
            const src = row[f]
            if (typeof src === 'string' && src.trim() && !next[to][f]) {
              setDbProg(`${tbl.name} · "${label}" → ${to}:${f}`)
              try {
                const translated = await translateText(src, to)
                if (translated) {
                  next[to][f] = translated
                  changed = true
                }
              } catch {
                failed++
              }
            }
          }
        }

        if (changed) {
          const { error: upErr } = await supabase
            .from(tbl.name)
            .update({ i18n: next })
            .eq('id', row.id)
          if (upErr) failed++
          else updated++
        } else {
          ready++
        }
      }
    }

    setDbProg('')
    setDbBusy(false)
    setDbMsg(
      `[OK] ${updated} ta yozuv tarjima qilindi, ${ready} ta allaqachon tayyor edi` +
        (failed ? `, ${failed} ta xato (qayta urinib ko'ring)` : '') +
        ' ✔ — saytni yangilang'
    )
  }

  const toggle = (id: string) => setOpenSec((cur) => (cur === id ? null : id))

  /** structuredClone bilan xavfsiz yangilash */
  const up = (fn: (draft: CForm) => void) =>
    setForm((f) => {
      const clone = structuredClone(f)
      fn(clone)
      return clone
    })

  useEffect(() => {
    document.title = 'Kontent — GHOST Admin'
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'content_overrides')
      .maybeSingle()
      .then(({ data }) => {
        if (!data?.value) return
        try {
          const saved = JSON.parse(data.value)
          const uz = saved?.uz
          const defaults = buildDefaults()
          if (uz) {
            setForm({
              home: {
                initLine: uz.home?.initLine ?? defaults.home.initLine,
                desc: uz.home?.desc ?? defaults.home.desc,
                roles: Array.isArray(uz.home?.roles) ? uz.home.roles.join('\n') : defaults.home.roles,
                marquee: Array.isArray(uz.home?.marquee) ? uz.home.marquee.join(', ') : defaults.home.marquee,
                stats: Array.isArray(uz.home?.stats) && uz.home.stats.length === 4 ? uz.home.stats : defaults.home.stats,
                featuredTitle: uz.home?.featuredTitle ?? defaults.home.featuredTitle,
                whatIDo: uz.home?.whatIDo ?? defaults.home.whatIDo,
                ctaTitle: uz.home?.ctaTitle ?? defaults.home.ctaTitle,
                ctaText: uz.home?.ctaText ?? defaults.home.ctaText,
                ctaBtn: uz.home?.ctaBtn ?? defaults.home.ctaBtn,
                ctaProjects: uz.home?.ctaProjects ?? defaults.home.ctaProjects,
                ctaContact: uz.home?.ctaContact ?? defaults.home.ctaContact,
              },
              about: {
                p1: uz.about?.p1 ?? defaults.about.p1,
                p2: uz.about?.p2 ?? defaults.about.p2,
                terminal: Array.isArray(uz.about?.terminal)
                  ? uz.about.terminal.map((t: { cmd: string; out?: string[] }) => ({
                      cmd: t.cmd ?? '',
                      out: (t.out ?? []).join(' | '),
                    }))
                  : defaults.about.terminal,
                info: { ...defaults.about.info, ...(uz.about?.info ?? {}) },
                skillsGroups: Array.isArray(uz.about?.skillsGroups) && uz.about.skillsGroups.length
                  ? uz.about.skillsGroups
                  : defaults.about.skillsGroups,
                timeline: Array.isArray(uz.about?.timeline) && uz.about.timeline.length
                  ? uz.about.timeline
                  : defaults.about.timeline,
                interests: Array.isArray(uz.about?.interests)
                  ? uz.about.interests.join(', ')
                  : defaults.about.interests,
              },
              services: {
                steps: Array.isArray(uz.services?.steps) && uz.services.steps.length
                  ? uz.services.steps.map((s: { title: string; text: string }) => ({ title: s.title, text: s.text }))
                  : defaults.services.steps,
                faq: Array.isArray(uz.services?.faq) && uz.services.faq.length
                  ? uz.services.faq
                  : defaults.services.faq,
                ctaQ: uz.services?.ctaQ ?? defaults.services.ctaQ,
                ctaBtn: uz.services?.ctaBtn ?? defaults.services.ctaBtn,
              },
              contact: { ...defaults.contact, ...(uz.contact ?? {}) },
              footer: { ...defaults.footer, ...(uz.footer ?? {}) },
              boot: {
                lines: Array.isArray(uz.boot?.lines) ? uz.boot.lines.join('\n') : defaults.boot.lines,
                online: uz.boot?.online ?? defaults.boot.online,
                skip: uz.boot?.skip ?? defaults.boot.skip,
              },
              links: { ...defaults.links, ...(saved.links ?? {}) },
            })
          }
        } catch {
          /* buzilgan JSON */
        }
      })
  }, [])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setProgress(0)

    const split = (s: string, sep: string) => s.split(sep).map((x) => x.trim()).filter(Boolean)

    // O'zbekcha asl obyekt
    const uzOv = {
      home: {
        initLine: form.home.initLine.trim(),
        desc: form.home.desc.trim(),
        roles: split(form.home.roles, '\n'),
        marquee: split(form.home.marquee, ','),
        stats: form.home.stats.map((s) => ({ value: s.value.trim(), label: s.label.trim() })),
        featuredTitle: form.home.featuredTitle.trim(),
        whatIDo: form.home.whatIDo.trim(),
        ctaTitle: form.home.ctaTitle.trim(),
        ctaText: form.home.ctaText.trim(),
        ctaBtn: form.home.ctaBtn.trim(),
        ctaProjects: form.home.ctaProjects.trim(),
        ctaContact: form.home.ctaContact.trim(),
      },
      about: {
        p1: form.about.p1.trim(),
        p2: form.about.p2.trim(),
        terminal: form.about.terminal.map((t) => ({ cmd: t.cmd.trim(), out: split(t.out, '|') })),
        info: {
          jobVal: form.about.info.jobVal.trim(),
          locationVal: form.about.info.locationVal.trim(),
          statusVal: form.about.info.statusVal.trim(),
          emailVal: form.about.info.emailVal.trim(),
        },
        skillsGroups: form.about.skillsGroups.map((g) => ({
          title: g.title.trim(),
          skills: g.skills
            .filter((s) => s.name.trim())
            .map((s) => ({ name: s.name.trim(), level: Number(s.level) || 0 })),
        })),
        timeline: form.about.timeline.map((t) => ({
          year: t.year.trim(),
          title: t.title.trim(),
          text: t.text.trim(),
        })),
        interests: split(form.about.interests, ','),
      },
      services: {
        steps: form.services.steps.map((s, i) => ({
          num: String(i + 1).padStart(2, '0'),
          title: s.title.trim(),
          text: s.text.trim(),
        })),
        faq: form.services.faq
          .filter((f) => f.q.trim() && f.a.trim())
          .map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
        ctaQ: form.services.ctaQ.trim(),
        ctaBtn: form.services.ctaBtn.trim(),
      },
      contact: {
        cLocationVal: form.contact.cLocationVal.trim(),
        cResponseVal: form.contact.cResponseVal.trim(),
        orFill: form.contact.orFill.trim(),
        successTitle: form.contact.successTitle.trim(),
        successText: form.contact.successText.trim(),
      },
      footer: {
        tagline1: form.footer.tagline1.trim(),
        tagline2: form.footer.tagline2.trim(),
      },
      boot: {
        lines: split(form.boot.lines, '\n'),
        online: form.boot.online.trim(),
        skip: form.boot.skip.trim(),
      },
    }

    // ru/en versiyalarni parallel tarjima qilish (progress bilan)
    setStage('translating')
    let failures = 0
    const limit = createLimiter(5)
    const T = (text: string, to: 'ru' | 'en') =>
      limit(async () => {
        try {
          const r = await translateText(text, to)
          setProgress((p) => p + 1)
          return r || text
        } catch {
          failures++
          setProgress((p) => p + 1)
          return text
        }
      })

    const buildLang = async (to: 'ru' | 'en') => {
      const h = uzOv.home
      const a = uzOv.about
      const s = uzOv.services
      const c = uzOv.contact
      const f = uzOv.footer
      const b = uzOv.boot
      const [
        desc, roles, statLabels, featuredTitle, whatIDo, ctaTitle, ctaText, ctaBtn, ctaProjects, ctaContact,
        p1, p2, termOuts, jobVal, locationVal, statusVal, groupTitles, tlTitles, tlTexts, interests,
        stepTitles, stepTexts, faqQ, faqA, sCtaQ, sCtaBtn,
        cLoc, cResp, orFill, sucT, sucX, tag1, tag2, bootSkip,
      ] = await Promise.all([
        T(h.desc, to),
        Promise.all(h.roles.map((r) => T(r, to))),
        Promise.all(h.stats.map((st) => T(st.label, to))),
        T(h.featuredTitle, to), T(h.whatIDo, to), T(h.ctaTitle, to), T(h.ctaText, to), T(h.ctaBtn, to),
        T(h.ctaProjects, to), T(h.ctaContact, to),
        T(a.p1, to), T(a.p2, to),
        Promise.all(a.terminal.map((t) => Promise.all(t.out.map((o) => T(o, to))))),
        T(a.info.jobVal, to), T(a.info.locationVal, to), T(a.info.statusVal, to),
        Promise.all(a.skillsGroups.map((g) => T(g.title, to))),
        Promise.all(a.timeline.map((t) => T(t.title, to))),
        Promise.all(a.timeline.map((t) => T(t.text, to))),
        Promise.all(a.interests.map((x) => T(x, to))),
        Promise.all(s.steps.map((st) => T(st.title, to))),
        Promise.all(s.steps.map((st) => T(st.text, to))),
        Promise.all(s.faq.map((x) => T(x.q, to))),
        Promise.all(s.faq.map((x) => T(x.a, to))),
        T(s.ctaQ, to), T(s.ctaBtn, to),
        T(c.cLocationVal, to), T(c.cResponseVal, to), T(c.orFill, to),
        T(c.successTitle, to), T(c.successText, to),
        T(f.tagline1, to), T(f.tagline2, to),
        T(b.skip, to),
      ])

      return {
        home: {
          initLine: h.initLine,
          desc, roles,
          marquee: h.marquee,
          stats: h.stats.map((st, i) => ({ value: st.value, label: statLabels[i] })),
          featuredTitle, whatIDo, ctaTitle, ctaText, ctaBtn, ctaProjects, ctaContact,
        },
        about: {
          p1, p2,
          terminal: a.terminal.map((t, i) => ({ cmd: t.cmd, out: termOuts[i] })),
          info: { jobVal, locationVal, statusVal, emailVal: a.info.emailVal },
          skillsGroups: a.skillsGroups.map((g, i) => ({ title: groupTitles[i], skills: g.skills })),
          timeline: a.timeline.map((t, i) => ({ year: t.year, title: tlTitles[i], text: tlTexts[i] })),
          interests,
        },
        services: {
          steps: s.steps.map((st, i) => ({ num: st.num, title: stepTitles[i], text: stepTexts[i] })),
          faq: s.faq.map((x, i) => ({ q: faqQ[i], a: faqA[i] })),
          ctaQ: sCtaQ, ctaBtn: sCtaBtn,
        },
        contact: { cLocationVal: cLoc, cResponseVal: cResp, orFill, successTitle: sucT, successText: sucX },
        footer: { tagline1: tag1, tagline2: tag2 },
        boot: { lines: b.lines, online: b.online, skip: bootSkip },
      }
    }

    const [ruOv, enOv] = await Promise.all([buildLang('ru'), buildLang('en')])

    setStage('saving')
    const { error } = await supabase.from('site_settings').upsert(
      [
        {
          key: 'content_overrides',
          value: JSON.stringify({ uz: uzOv, ru: ruOv, en: enOv, links: form.links }),
        },
      ],
      { onConflict: 'key' }
    )
    setStage('idle')
    if (error) {
      setMsg(`[XATO] ${error.message}`)
    } else {
      setMsg(
        failures > 5
          ? "[OK] saqlandi, lekin ba'zi tarjimalar ishlamadi — birozdan keyin qayta saqlang"
          : '[OK] saqlandi va 3 tilga tarjima qilindi ✔ — saytni yangilang'
      )
    }
  }

  const resetDefaults = async () => {
    if (!confirm('Barcha matnlar standart holatga qaytsinmi?')) return
    setStage('saving')
    await supabase
      .from('site_settings')
      .upsert([{ key: 'content_overrides', value: '' }], { onConflict: 'key' })
    setStage('idle')
    setForm(buildDefaults())
    setMsg('[OK] standart matnlar qaytarildi ✔')
  }

  const busy = stage !== 'idle'

  return (
    <PageTransition>
      <DecodeText
        as="h1"
        text="SAYT KONTENTI"
        className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
      />
      <p className="mt-2 font-mono text-xs text-steel">
        <span className="text-amber">❯</span> hammasini o'zbekcha yozing — ruscha va inglizcha avtomatik tarjima qilinadi
      </p>

      <form onSubmit={save} className="mt-8 max-w-3xl space-y-4">
        {/* ==================== BOSH SAHIFA ==================== */}
        <Section id="home" title="bosh sahifa" open={openSec} toggle={toggle}>
          <F label="hero yuqori satri (terminal uslub)" value={form.home.initLine} onChange={(v) => up((d) => { d.home.initLine = v })} />
          <F label="hero tavsif" value={form.home.desc} onChange={(v) => up((d) => { d.home.desc = v })} rows={2} />
          <F label="kasblar (typewriter, har qatorga bittadan)" value={form.home.roles} onChange={(v) => up((d) => { d.home.roles = v })} rows={4} />
          <F label="oqib o'tuvchi lenta (vergul bilan)" value={form.home.marquee} onChange={(v) => up((d) => { d.home.marquee = v })} rows={2} />
          <div>
            <label className="mb-1.5 block font-mono text-xs text-matrix">--statistika (4 ta)</label>
            <div className="space-y-2">
              {form.home.stats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s.value} onChange={(e) => up((d) => { d.home.stats[i].value = e.target.value })} className="cyber-input w-28" placeholder="3+" />
                  <input value={s.label} onChange={(e) => up((d) => { d.home.stats[i].label = e.target.value })} className="cyber-input flex-1" placeholder="yil tajriba" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="'tanlangan loyihalar' sarlavha" value={form.home.featuredTitle} onChange={(v) => up((d) => { d.home.featuredTitle = v })} />
            <F label="'nima qilaman' sarlavha" value={form.home.whatIDo} onChange={(v) => up((d) => { d.home.whatIDo = v })} />
            <F label="CTA sarlavha" value={form.home.ctaTitle} onChange={(v) => up((d) => { d.home.ctaTitle = v })} />
            <F label="CTA tugma matni" value={form.home.ctaBtn} onChange={(v) => up((d) => { d.home.ctaBtn = v })} />
            <F label="hero 1-tugma (loyihalar)" value={form.home.ctaProjects} onChange={(v) => up((d) => { d.home.ctaProjects = v })} />
            <F label="hero 2-tugma (aloqa)" value={form.home.ctaContact} onChange={(v) => up((d) => { d.home.ctaContact = v })} />
          </div>
          <F label="CTA matn" value={form.home.ctaText} onChange={(v) => up((d) => { d.home.ctaText = v })} rows={2} />
        </Section>

        {/* ==================== HAQIMDA ==================== */}
        <Section id="about" title="haqimda sahifasi" open={openSec} toggle={toggle}>
          <F label="1-paragraf" value={form.about.p1} onChange={(v) => up((d) => { d.about.p1 = v })} rows={3} />
          <F label="2-paragraf" value={form.about.p2} onChange={(v) => up((d) => { d.about.p2 = v })} rows={3} />
          <div>
            <label className="mb-1.5 block font-mono text-xs text-matrix">
              --terminal qatorlari (natijalarni | bilan ajrating)
            </label>
            <div className="space-y-2">
              {form.about.terminal.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input value={t.cmd} onChange={(e) => up((d) => { d.about.terminal[i].cmd = e.target.value })} className="cyber-input w-40" placeholder="whoami" />
                  <input value={t.out} onChange={(e) => up((d) => { d.about.terminal[i].out = e.target.value })} className="cyber-input flex-1" placeholder="natija 1 | natija 2" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="kasb qiymati" value={form.about.info.jobVal} onChange={(v) => up((d) => { d.about.info.jobVal = v })} />
            <F label="lokatsiya qiymati" value={form.about.info.locationVal} onChange={(v) => up((d) => { d.about.info.locationVal = v })} />
            <F label="holat qiymati" value={form.about.info.statusVal} onChange={(v) => up((d) => { d.about.info.statusVal = v })} />
            <F label="email qiymati" value={form.about.info.emailVal} onChange={(v) => up((d) => { d.about.info.emailVal = v })} />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs text-matrix">--ko'nikmalar (3 guruh)</label>
            <div className="space-y-4">
              {form.about.skillsGroups.map((g, gi) => (
                <div key={gi} className="border border-steel-dim/40 bg-navy-900/30 p-3">
                  <input
                    value={g.title}
                    onChange={(e) => up((d) => { d.about.skillsGroups[gi].title = e.target.value })}
                    className="cyber-input mb-2 !py-2"
                    placeholder="Guruh nomi"
                  />
                  {g.skills.map((s, si) => (
                    <div key={si} className="mb-1.5 flex gap-2">
                      <input value={s.name} onChange={(e) => up((d) => { d.about.skillsGroups[gi].skills[si].name = e.target.value })} className="cyber-input flex-1 !py-1.5 text-xs" placeholder="Skill nomi" />
                      <input
                        type="number" min={0} max={100}
                        value={s.level}
                        onChange={(e) => up((d) => { d.about.skillsGroups[gi].skills[si].level = Number(e.target.value) || 0 })}
                        className="cyber-input w-20 !py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        data-hover
                        onClick={() => up((d) => { d.about.skillsGroups[gi].skills.splice(si, 1) })}
                        className="border border-steel-dim px-2 font-mono text-xs text-steel transition-colors hover:border-amber hover:text-amber-bright"
                        title="o'chirish"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    data-hover
                    onClick={() => up((d) => { d.about.skillsGroups[gi].skills.push({ name: '', level: 80 }) })}
                    className="mt-1 border border-steel-dim px-2.5 py-1 font-mono text-[11px] text-steel-light transition-colors hover:border-matrix hover:text-matrix-bright"
                  >
                    ＋ skill qo'shish
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs text-matrix">--tajriba yo'li (4 bosqich)</label>
            <div className="space-y-3">
              {form.about.timeline.map((t, i) => (
                <div key={i} className="space-y-1.5 border border-steel-dim/40 bg-navy-900/30 p-3">
                  <div className="flex gap-2">
                    <input value={t.year} onChange={(e) => up((d) => { d.about.timeline[i].year = e.target.value })} className="cyber-input w-32 !py-1.5 text-xs" placeholder="2021" />
                    <input value={t.title} onChange={(e) => up((d) => { d.about.timeline[i].title = e.target.value })} className="cyber-input flex-1 !py-1.5 text-xs" placeholder="Sarlavha" />
                  </div>
                  <textarea value={t.text} onChange={(e) => up((d) => { d.about.timeline[i].text = e.target.value })} rows={2} className="cyber-input resize-y !py-1.5 text-xs" />
                </div>
              ))}
            </div>
          </div>
          <F label="qiziqishlar (vergul bilan)" value={form.about.interests} onChange={(v) => up((d) => { d.about.interests = v })} rows={2} />
        </Section>

        {/* ==================== XIZMATLAR ==================== */}
        <Section id="services" title="xizmatlar sahifasi (ish jarayoni + FAQ)" open={openSec} toggle={toggle}>
          <div>
            <label className="mb-1.5 block font-mono text-xs text-matrix">--ish jarayoni (4 qadam)</label>
            <div className="space-y-3">
              {form.services.steps.map((s, i) => (
                <div key={i} className="space-y-1.5 border border-steel-dim/40 bg-navy-900/30 p-3">
                  <input value={s.title} onChange={(e) => up((d) => { d.services.steps[i].title = e.target.value })} className="cyber-input !py-1.5 text-xs" placeholder="QADAM NOMI" />
                  <textarea value={s.text} onChange={(e) => up((d) => { d.services.steps[i].text = e.target.value })} rows={2} className="cyber-input resize-y !py-1.5 text-xs" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="font-mono text-xs text-matrix">--savol-javob (FAQ)</label>
              <button
                type="button"
                data-hover
                onClick={() => up((d) => { d.services.faq.push({ q: '', a: '' }) })}
                className="border border-steel-dim px-2.5 py-1 font-mono text-[11px] text-steel-light transition-colors hover:border-matrix hover:text-matrix-bright"
              >
                ＋ savol qo'shish
              </button>
            </div>
            <div className="space-y-3">
              {form.services.faq.map((f, i) => (
                <div key={i} className="space-y-1.5 border border-steel-dim/40 bg-navy-900/30 p-3">
                  <div className="flex gap-2">
                    <input value={f.q} onChange={(e) => up((d) => { d.services.faq[i].q = e.target.value })} className="cyber-input flex-1 !py-1.5 text-xs" placeholder="Savol?" />
                    <button
                      type="button"
                      data-hover
                      onClick={() => up((d) => { d.services.faq.splice(i, 1) })}
                      className="border border-steel-dim px-2.5 font-mono text-xs text-steel transition-colors hover:border-amber hover:text-amber-bright"
                    >
                      ✕
                    </button>
                  </div>
                  <textarea value={f.a} onChange={(e) => up((d) => { d.services.faq[i].a = e.target.value })} rows={2} className="cyber-input resize-y !py-1.5 text-xs" placeholder="Javob" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="pastki savol matni" value={form.services.ctaQ} onChange={(v) => up((d) => { d.services.ctaQ = v })} />
            <F label="pastki tugma matni" value={form.services.ctaBtn} onChange={(v) => up((d) => { d.services.ctaBtn = v })} />
          </div>
        </Section>

        {/* ==================== ALOQA ==================== */}
        <Section id="contact" title="aloqa sahifasi" open={openSec} toggle={toggle}>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="lokatsiya qiymati" value={form.contact.cLocationVal} onChange={(v) => up((d) => { d.contact.cLocationVal = v })} />
            <F label="javob vaqti qiymati" value={form.contact.cResponseVal} onChange={(v) => up((d) => { d.contact.cResponseVal = v })} />
          </div>
          <F label="'formani to'ldiring' izohi" value={form.contact.orFill} onChange={(v) => up((d) => { d.contact.orFill = v })} />
          <div className="grid gap-4 md:grid-cols-2">
            <F label="muvaffaqiyat sarlavhasi" value={form.contact.successTitle} onChange={(v) => up((d) => { d.contact.successTitle = v })} />
            <F label="muvaffaqiyat matni" value={form.contact.successText} onChange={(v) => up((d) => { d.contact.successText = v })} />
          </div>
        </Section>

        {/* ==================== HAVOLALAR ==================== */}
        <Section id="links" title="sayt nomi va havolalar (tarjima qilinmaydi)" open={openSec} toggle={toggle}>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="sayt nomi / nik (logo, hero)" value={form.links.siteName} onChange={(v) => up((d) => { d.links.siteName = v })} />
            <F label="email" value={form.links.email} onChange={(v) => up((d) => { d.links.email = v })} />
            <F label="telegram username (@...)" value={form.links.telegramUser} onChange={(v) => up((d) => { d.links.telegramUser = v })} />
            <F label="telegram havola (https://t.me/...)" value={form.links.telegram} onChange={(v) => up((d) => { d.links.telegram = v })} />
            <F label="github havola" value={form.links.github} onChange={(v) => up((d) => { d.links.github = v })} />
          </div>
        </Section>

        {/* ==================== FOOTER ==================== */}
        <Section id="footer" title="footer" open={openSec} toggle={toggle}>
          <F label="1-qator (shior)" value={form.footer.tagline1} onChange={(v) => up((d) => { d.footer.tagline1 = v })} />
          <F label="2-qator" value={form.footer.tagline2} onChange={(v) => up((d) => { d.footer.tagline2 = v })} />
        </Section>

        {/* ==================== BOOT EKRAN ==================== */}
        <Section id="boot" title="boot ekran (sayt ochilishi)" open={openSec} toggle={toggle}>
          <div>
            <label className="mb-1.5 block font-mono text-xs text-matrix">
              --yuklanish qatorlari <span className="text-steel">(har qatorga bittadan; {'{site}'} — sayt nomi bilan almashadi)</span>
            </label>
            <textarea
              value={form.boot.lines}
              onChange={(e) => up((d) => { d.boot.lines = e.target.value })}
              rows={7}
              className="cyber-input resize-y font-mono text-xs"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="yakuniy satr (sariq)" value={form.boot.online} onChange={(v) => up((d) => { d.boot.online = v })} />
            <F label="'o'tkazib yuborish' matni" value={form.boot.skip} onChange={(v) => up((d) => { d.boot.skip = v })} />
          </div>
        </Section>

        {/* ==================== BAZA KONTENTI TARJIMASI ==================== */}
        <Section id="dbtr" title="baza kontentini tarjima qilish" open={openSec} toggle={toggle}>
          <p className="font-mono text-xs leading-relaxed text-steel-light">
            Loyihalar, blog postlar, xizmatlar va mijoz fikrlarining ru/en tarjimasi
            yo'q bo'lganlarini topib, avtomatik to'ldiradi. Avval (tarjima tizimidan
            oldin) qo'shilgan kontent uchun bir marta bosish kifoya. Yangi saqlanganlar
            baribir avtomatik tarjima qilinadi.
          </p>
          {dbProg && (
            <p className="font-mono text-xs text-amber-bright animate-pulse">
              🌐 {dbProg}
            </p>
          )}
          {dbMsg && <p className="font-mono text-xs text-matrix-bright">{dbMsg}</p>}
          <div>
            <button
              type="button"
              data-hover
              onClick={translateDb}
              disabled={dbBusy}
              className="clip-corner-sm border border-matrix px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-matrix-bright transition-all hover:bg-matrix hover-text-on-matrix disabled:opacity-40"
            >
              {dbBusy ? 'tarjima qilinmoqda...' : "🌐 hammasini tekshirish va tarjima qilish"}
            </button>
          </div>
        </Section>

        {msg && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm text-matrix-bright">
            {msg}
          </motion.p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <CyberButton type="submit" disabled={busy}>
            {stage === 'translating'
              ? `🌐 tarjima qilinmoqda... (${progress})`
              : stage === 'saving'
                ? 'saqlanmoqda...'
                : 'hammasini saqlash va tarjima qilish ✔'}
          </CyberButton>
          <CyberButton variant="ghost" onClick={resetDefaults} disabled={busy}>
            standartga qaytarish
          </CyberButton>
        </div>
        <p className="font-mono text-[11px] text-steel">
          // portfolio kategoriyalari loyihalarning "texnologiyalar" maydonidan avtomatik yig'iladi —
          ularni Loyihalar bo'limida tahrirlang
        </p>
      </form>
    </PageTransition>
  )
}
