import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/ui/SectionHeading'
import Terminal from '../components/ui/Terminal'
import Reveal from '../components/ui/Reveal'
import Tag from '../components/ui/Tag'

export default function About() {
  const { tr, lang } = useI18n()

  useEffect(() => {
    document.title = tr.meta.about
  }, [tr])

  const info: [string, string][] = [
    [tr.about.info.nick, "'GHOST'"],
    [tr.about.info.job, `'${tr.about.info.jobVal}'`],
    [tr.about.info.location, `'${tr.about.info.locationVal}'`],
    [tr.about.info.email, `'${tr.about.info.emailVal}'`],
    [tr.about.info.status, `'${tr.about.info.statusVal}'`],
  ]

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        {/* ============ BIO ============ */}
        <SectionHeading key={`h-${lang}`} index="01" title={tr.about.title} command="cat ./about.md" />
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal direction="right">
            <Terminal title="ghost@dev:~" lines={tr.about.terminal} />
          </Reveal>

          <div className="space-y-5">
            <Reveal delay={0.1}>
              <p className="font-mono text-sm leading-relaxed text-steel-light md:text-base">
                {tr.about.p1}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-mono text-sm leading-relaxed text-steel-light md:text-base">
                {tr.about.p2}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="clip-corner-sm border border-steel-dim/50 glass p-5 font-mono text-xs md:text-sm">
                {info.map(([key, value]) => (
                  <p key={key} className="py-1">
                    <span className="text-steel">const</span>{' '}
                    <span className="text-matrix-bright">{key}</span>{' '}
                    <span className="text-steel">=</span>{' '}
                    <span className="text-amber-bright">{value}</span>
                    <span className="text-steel">;</span>
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ============ KO'NIKMALAR ============ */}
        <div className="mt-24">
          <SectionHeading key={`sk-${lang}`} index="02" title={tr.about.skillsTitle} command="npm ls --depth=0" />
          <div className="grid gap-8 md:grid-cols-3">
            {tr.about.skillsGroups.map((group, gi) => (
              <Reveal key={gi} delay={gi * 0.12}>
                <div className="clip-corner border border-steel-dim/50 glass p-6 h-full">
                  <h3 className="mb-5 font-display text-sm uppercase tracking-widest text-amber-bright">
                    <span className="text-steel mr-2">~/</span>
                    {group.title}
                  </h3>
                  <div className="space-y-4">
                    {group.skills.map((skill, si) => (
                      <div key={skill.name}>
                        <div className="mb-1.5 flex items-center justify-between font-mono text-xs">
                          <span className="text-ghost">{skill.name}</span>
                          <span className="text-amber">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden bg-navy-900">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: si * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full bg-gradient-to-r from-matrix-dim via-matrix to-matrix-bright"
                            style={{ boxShadow: '0 0 8px rgb(var(--clr-matrix) / 0.5)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ============ YO'L XARITASI ============ */}
        <div className="mt-24">
          <SectionHeading key={`t-${lang}`} index="03" title={tr.about.timelineTitle} command="git log --oneline --graph" />
          <div className="relative mx-auto max-w-3xl">
            {/* Markaziy chiziq */}
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-matrix via-steel-dim to-transparent md:left-1/2" />
            <div className="space-y-12">
              {tr.about.timeline.map((item, i) => (
                <Reveal key={item.year} direction={i % 2 === 0 ? 'left' : 'right'} delay={0.1}>
                  <div
                    className={`relative flex flex-col gap-3 pl-12 md:w-1/2 md:pl-0 ${
                      i % 2 === 0
                        ? 'md:pr-10 md:text-right'
                        : 'md:ml-auto md:pl-10'
                    }`}
                  >
                    {/* Nuqta */}
                    <span
                      className={`absolute top-1 h-3 w-3 rounded-full bg-matrix shadow-glow-green left-[10.5px] md:left-auto ${
                        i % 2 === 0 ? 'md:-right-[6.5px]' : 'md:-left-[6.5px]'
                      }`}
                    />
                    <p className="font-mono text-sm text-amber-bright">{item.year}</p>
                    <h3 className="font-display text-lg text-ghost">{item.title}</h3>
                    <p className="font-mono text-xs leading-relaxed text-steel-light">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ============ QIZIQISHLAR ============ */}
        <div className="mt-24">
          <SectionHeading key={`i-${lang}`} index="04" title={tr.about.interestsTitle} command="ls ~/interests" />
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {tr.about.interests.map((interest, i) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Tag color={i % 3 === 1 ? 'amber' : i % 3 === 2 ? 'green' : 'steel'} className="text-sm px-3 py-1">
                    {interest}
                  </Tag>
                </motion.span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}
