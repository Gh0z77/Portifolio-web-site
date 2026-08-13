import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { functionsUrl, functionHeaders } from '../lib/supabase'
import { useI18n } from '../lib/i18n'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/ui/SectionHeading'
import CyberCard from '../components/ui/CyberCard'
import CyberButton from '../components/ui/CyberButton'
import Reveal from '../components/ui/Reveal'

const ICONS = {
  email: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6L22 7" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M21.94 4.4c.26-1.06-.4-1.53-1.12-1.26L2.4 10.06c-1.2.47-1.18 1.14-.21 1.44l4.7 1.47 10.9-6.87c.51-.34.98-.15.6.19l-8.83 7.97-.34 4.86c.49 0 .7-.22.96-.48l2.3-2.23 4.79 3.54c.88.49 1.51.24 1.75-.82l3.02-14.73z" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
}

const EMPTY_FORM = { name: '', email: '', telegram: '', subject: '', body: '', website: '' }

export default function Contact() {
  const { tr, lang, links } = useI18n()
  const [form, setForm] = useState(EMPTY_FORM)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = tr.meta.contact
  }, [tr])

  const contacts = [
    { label: tr.contact.cEmail, value: links.email, href: `mailto:${links.email}`, icon: ICONS.email, amber: false },
    { label: tr.contact.cTelegram, value: links.telegramUser, href: links.telegram, icon: ICONS.telegram, amber: false },
    { label: tr.contact.cLocation, value: tr.contact.cLocationVal, icon: ICONS.location, amber: true },
    { label: tr.contact.cResponse, value: tr.contact.cResponseVal, icon: ICONS.clock, amber: true },
  ]

  const set = (key: keyof typeof EMPTY_FORM) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.name.trim().length < 2) {
      setError(tr.contact.errName)
      return
    }
    if (form.body.trim().length < 5) {
      setError(tr.contact.errBody)
      return
    }

    setSending(true)
    try {
      const res = await fetch(`${functionsUrl}/contact`, {
        method: 'POST',
        headers: functionHeaders,
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setSent(true)
      } else {
        setError(`[!] ${data.error || tr.contact.errGeneric}`)
      }
    } catch {
      setError(tr.contact.errNet)
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setForm(EMPTY_FORM)
    setSent(false)
    setError(null)
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading key={`c-${lang}`} index="01" title={tr.contact.title} command="ssh visitor@ghost.uz" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          {/* ============ Kontakt ma'lumotlari ============ */}
          <div className="space-y-4">
            {contacts.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                <CyberCard tilt={false} brackets={false} className="p-4">
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" data-hover className="flex items-center gap-4">
                      <span className="clip-corner-sm flex h-11 w-11 shrink-0 items-center justify-center border border-matrix/40 bg-matrix-dark/30 text-matrix-bright">
                        {c.icon}
                      </span>
                      <span>
                        <span className="block font-mono text-[11px] uppercase tracking-widest text-steel">
                          {c.label}
                        </span>
                        <span className="block break-all font-mono text-sm text-ghost transition-colors hover:text-matrix-bright">
                          {c.value}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="clip-corner-sm flex h-11 w-11 shrink-0 items-center justify-center border border-amber/40 bg-amber-dim/20 text-amber-bright">
                        {c.icon}
                      </span>
                      <span>
                        <span className="block font-mono text-[11px] uppercase tracking-widest text-steel">
                          {c.label}
                        </span>
                        <span className="block font-mono text-sm text-ghost">{c.value}</span>
                      </span>
                    </div>
                  )}
                </CyberCard>
              </Reveal>
            ))}
            <Reveal delay={0.4}>
              <p className="pt-2 font-mono text-xs text-steel">{tr.contact.orFill}</p>
            </Reveal>
          </div>

          {/* ============ Forma ============ */}
          <Reveal delay={0.15}>
            <div className="clip-corner border border-steel-dim/60 glass shadow-glow-navy">
              {/* Terminal sarlavha */}
              <div className="flex items-center gap-2 border-b border-steel-dim/50 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-amber/80" />
                <span className="h-3 w-3 rounded-full bg-matrix/80" />
                <span className="h-3 w-3 rounded-full bg-steel/80" />
                <span className="ml-3 font-mono text-xs text-steel">
                  ghost@contact:~$ ./send_message.sh
                </span>
              </div>

              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-10 text-center font-mono"
                    >
                      <p className="text-2xl text-matrix-bright text-glow-green">{tr.contact.successTitle}</p>
                      <p className="mt-4 text-sm text-steel-light">{tr.contact.successText}</p>
                      <div className="mt-8">
                        <CyberButton variant="ghost" onClick={reset}>
                          {tr.contact.again}
                        </CyberButton>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      onSubmit={onSubmit}
                      className="space-y-5"
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block font-mono text-xs text-matrix">{tr.contact.lName}</label>
                          <input
                            value={form.name}
                            onChange={set('name')}
                            className="cyber-input"
                            placeholder={tr.contact.pName}
                            maxLength={120}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block font-mono text-xs text-matrix">{tr.contact.lEmail}</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={set('email')}
                            className="cyber-input"
                            placeholder={tr.contact.pEmail}
                          />
                        </div>
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block font-mono text-xs text-matrix">{tr.contact.lTelegram}</label>
                          <input
                            value={form.telegram}
                            onChange={set('telegram')}
                            className="cyber-input"
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block font-mono text-xs text-matrix">{tr.contact.lSubject}</label>
                          <input
                            value={form.subject}
                            onChange={set('subject')}
                            className="cyber-input"
                            placeholder={tr.contact.pSubject}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block font-mono text-xs text-matrix">{tr.contact.lMessage}</label>
                        <textarea
                          value={form.body}
                          onChange={set('body')}
                          rows={6}
                          className="cyber-input resize-y"
                          placeholder={tr.contact.pMessage}
                          maxLength={4000}
                        />
                      </div>

                      {/* Honeypot — botlar uchun tuzoq, odam ko'rmaydi */}
                      <input
                        name="website"
                        value={form.website}
                        onChange={set('website')}
                        tabIndex={-1}
                        autoComplete="off"
                        style={{ display: 'none' }}
                        aria-hidden="true"
                      />

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="font-mono text-xs text-amber-bright"
                        >
                          {error}
                        </motion.p>
                      )}

                      <div className="pt-2">
                        <CyberButton type="submit" disabled={sending} size="lg">
                          {sending ? (
                            <>
                              {tr.contact.sending}
                              <span className="inline-block animate-spin-slow">◌</span>
                            </>
                          ) : (
                            <>{tr.contact.send}</>
                          )}
                        </CyberButton>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Dekorativ pastki satr */}
        <Reveal className="mt-20">
          <p className="text-center font-mono text-[11px] tracking-[0.25em] text-steel-dim">
            // TCP CONNECTION ESTABLISHED — PORT 443 — SECURE CHANNEL //
          </p>
        </Reveal>
      </div>
    </PageTransition>
  )
}
