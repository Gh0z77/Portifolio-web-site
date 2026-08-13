import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useI18n } from '../lib/i18n'
import { l10n } from '../lib/l10n'
import { playCountTick, playCountDone } from '../lib/sound'
import type { Project, Service, Testimonial } from '../types'
import PageTransition from '../components/PageTransition'
import GlitchText from '../components/ui/GlitchText'
import DecodeText from '../components/ui/DecodeText'
import Reveal from '../components/ui/Reveal'
import CyberButton from '../components/ui/CyberButton'
import CyberCard from '../components/ui/CyberCard'
import SectionHeading from '../components/ui/SectionHeading'
import Tag from '../components/ui/Tag'
import { truncate } from '../lib/utils'

/** Aylanib yozilib-o'chiriladigan typewriter */
function useTypewriter(words: string[], speed = 70, pause = 1600) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  // Til almashganda boshidan boshlash
  useEffect(() => {
    setText('')
    setWordIndex(0)
    setDeleting(false)
  }, [words])

  useEffect(() => {
    const word = words[wordIndex % words.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && text.length < word.length) {
      timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), speed)
    } else if (!deleting && text.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(word.slice(0, text.length - 1)), speed / 2)
    } else if (deleting && text.length === 0) {
      setDeleting(false)
      setWordIndex((i) => i + 1)
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, speed, pause])

  return text
}

/** Ekranga kirganda 0 dan sanab boruvchi raqam */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1)
      setValue(Math.floor(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) {
        playCountTick(p)
        raf = requestAnimationFrame(tick)
      } else {
        playCountDone()
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

export default function Home() {
  const { tr, lang, links } = useI18n()
  const typed = useTypewriter(tr.home.roles)
  const [featured, setFeatured] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    document.title = tr.meta.home
  }, [tr])

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(3)
      .then(({ data }) => setFeatured((data as Project[]) ?? []))
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .limit(3)
      .then(({ data }) => setServices((data as Service[]) ?? []))
    supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .limit(6)
      .then(({ data }) => setTestimonials((data as Testimonial[]) ?? []))
  }, [])

  // "3+" -> raqam 3 + suffiks "+"; raqm topilmasa matn o'z holicha
  const stats = tr.home.stats.map((s) => {
    const m = /^(\d+)(.*)$/.exec(s.value.trim())
    return {
      target: m ? parseInt(m[1], 10) : null,
      suffix: m ? m[2] : '',
      raw: s.value,
      label: s.label,
    }
  })

  return (
    <PageTransition>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-5 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 font-mono text-xs md:text-sm text-amber"
        >
          {tr.home.initLine.includes('[OK]') ? (
            <>
              {tr.home.initLine.replace('[OK]', '').trimEnd()}{' '}
              <span className="text-matrix-bright">[OK]</span>
            </>
          ) : (
            tr.home.initLine
          )}
        </motion.p>

        <h1 className="font-display text-6xl font-black tracking-[0.08em] text-ghost md:text-8xl lg:text-9xl text-glow-green animate-flicker">
          <GlitchText text={links.siteName} interval={4} />
        </h1>

        <p className="mt-6 h-7 font-mono text-base md:text-xl text-matrix-bright">
          <span className="text-steel">$ </span>
          {typed}
          <span className="ml-0.5 inline-block h-5 w-2.5 translate-y-0.5 bg-matrix animate-blink" />
        </p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-steel-light md:text-base"
        >
          {tr.home.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <CyberButton to="/portfolio" size="lg">
            {tr.home.ctaProjects}
          </CyberButton>
          <CyberButton to="/contact" variant="amber" size="lg">
            {tr.home.ctaContact}
          </CyberButton>
        </motion.div>

      </section>

      {/* ================= TECH MARQUEE ================= */}
      <section className="relative overflow-hidden border-y border-steel-dim/40 bg-panel/40 py-4">
        <div
          className="flex w-max animate-marquee gap-8"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          }}
        >
          {[...tr.home.marquee, ...tr.home.marquee].map((item, i) => (
            <span key={i} className="flex items-center gap-8 font-mono text-sm tracking-widest text-steel">
              {item} <span className="text-matrix">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ================= STATISTIKA ================= */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="clip-corner-sm border border-steel-dim/50 glass p-6 text-center transition-colors duration-300 hover:border-matrix/60">
                <p
                  className={`font-display text-4xl font-bold md:text-5xl ${
                    i % 2 === 0 ? 'text-matrix-bright text-glow-green' : 'text-amber-bright text-glow-amber'
                  }`}
                >
                  {s.target !== null ? <CountUp target={s.target} suffix={s.suffix} /> : s.raw}
                </p>
                <p className="mt-2 font-mono text-xs text-steel-light">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= TANLANGAN LOYIHALAR ================= */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <SectionHeading key={`f-${lang}`} index="01" title={tr.home.featuredTitle} command="ls ./featured --sort=best" />
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.12}>
                <Link to={`/portfolio/${p.slug}`} data-hover className="block h-full">
                  <CyberCard className="flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-video overflow-hidden border-b border-steel-dim/40">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-900 to-panel">
                          <span className="font-mono text-4xl text-matrix/40">&lt;/&gt;</span>
                        </div>
                      )}
                      <span className="absolute right-2 top-2 border border-amber/60 bg-bg/80 px-2 py-0.5 font-mono text-[10px] text-amber-bright">
                        ★ featured
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg text-ghost transition-colors duration-300 group-hover:text-matrix-bright">
                        {p.title}
                      </h3>
                      <p className="mt-2 flex-1 font-mono text-xs leading-relaxed text-steel-light">
                        {truncate(l10n(p, 'description', lang), 100)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tech_stack.slice(0, 4).map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    </div>
                  </CyberCard>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-10 text-center">
            <CyberButton to="/portfolio" variant="ghost">
              {tr.common.viewAll}
            </CyberButton>
          </Reveal>
        </section>
      )}

      {/* ================= XIZMATLAR PREVIEW ================= */}
      {services.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <SectionHeading key={`s-${lang}`} index="02" title={tr.home.whatIDo} command="cat services.txt | head -3" />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.12}>
                <CyberCard className="h-full p-6">
                  <span className="font-mono text-3xl text-matrix">
                    {['{ }', '</>', '#!'][i % 3]}
                  </span>
                  <h3 className="mt-4 font-display text-lg text-ghost">{l10n(s, 'title', lang)}</h3>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-steel-light">
                    {truncate(l10n(s, 'description', lang), 120)}
                  </p>
                </CyberCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-10 text-center">
            <CyberButton to="/services" variant="ghost">
              {tr.common.details}
            </CyberButton>
          </Reveal>
        </section>
      )}

      {/* ================= MIJOZLAR FIKRI ================= */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <SectionHeading key={`t-${lang}`} index="03" title={tr.home.testimonialsTitle} command="cat reviews.log" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <CyberCard tilt={false} className="flex h-full flex-col p-6">
                  <span className="font-display text-4xl leading-none text-matrix/40">"</span>
                  <p className="mt-2 flex-1 font-mono text-xs leading-relaxed text-steel-light md:text-sm">
                    {l10n(t, 'text', lang)}
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-steel-dim/40 pt-4">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-matrix/40">
                      {t.avatar_url ? (
                        <img src={t.avatar_url} alt={t.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-navy-900 font-mono text-sm text-matrix-bright">
                          {t.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm text-ghost">{t.name}</p>
                      {t.role && (
                        <p className="truncate font-mono text-[11px] text-steel">{l10n(t, 'role', lang)}</p>
                      )}
                    </div>
                  </div>
                </CyberCard>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-4xl px-5 py-16 md:py-24">
        <Reveal>
          <div className="clip-corner border border-matrix/40 glass p-10 text-center animate-pulse-border md:p-16">
            <DecodeText
              as="h2"
              text={tr.home.ctaTitle}
              className="font-display text-3xl font-bold uppercase tracking-wider text-ghost md:text-5xl"
            />
            <p className="mx-auto mt-5 max-w-md font-mono text-sm text-steel-light">
              {tr.home.ctaText}
            </p>
            <div className="mt-8">
              <CyberButton to="/contact" variant="amber" size="lg">
                {tr.home.ctaBtn}
              </CyberButton>
            </div>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  )
}
