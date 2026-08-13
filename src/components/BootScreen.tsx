import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'
import { playBoot, audioReady } from '../lib/sound'

/**
 * Sayt ochilganda chiqadigan "tizim yuklanishi" animatsiyasi —
 * Iron Man / JARVIS uslubida. Matnlari admin -> Sayt kontenti -> boot ekrandan boshqariladi.
 * Ovoz: brauzer birinchi foydalanuvchi harakatigacha audio'ni bloklaydi, shuning uchun
 * ohang darhol chiqmasa — birinchi bosish/klaviatura bosilishida ijro etiladi.
 */
export default function BootScreen({ onDone }: { onDone: () => void }) {
  const { tr, links } = useI18n()
  const [finishing, setFinishing] = useState(false)
  const soundPlayed = useRef(false)

  const bootLines = tr.boot.lines.map((l) => l.replace('{site}', links.siteName))

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return
    }
    document.body.style.overflow = 'hidden'

    // Avtomatik urinish — audio ruxsat etilgan bo'lsa darhol chalinadi
    if (audioReady()) {
      playBoot()
      soundPlayed.current = true
    }

    // Aks holda birinchi foydalanuvchi harakatida (bosish/klaviatura) chalinadi.
    // Skip bosilsa ham ohang sayt ochilishi ustida davom etaveradi.
    const onGesture = () => {
      if (!soundPlayed.current) {
        playBoot()
        soundPlayed.current = true
      }
      cleanupGesture()
    }
    const cleanupGesture = () => {
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('keydown', onGesture)
    }
    window.addEventListener('pointerdown', onGesture)
    window.addEventListener('keydown', onGesture)

    const t = setTimeout(() => setFinishing(true), 2600)
    return () => {
      clearTimeout(t)
      cleanupGesture()
      document.body.style.overflow = ''
    }
  }, [onDone])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!finishing && (
        <motion.div
          key="boot"
          data-hover
          onClick={() => setFinishing(true)}
          exit={{ opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
        >
          {/* ============ ARC REACTOR HALQALARI ============ */}
          <div className="relative flex h-56 w-56 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-matrix/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute inset-5 rounded-full border border-matrix/60"
              style={{ borderTopColor: 'rgb(var(--clr-amber))', borderTopWidth: 3 }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
              className="absolute inset-10 rounded-full border border-matrix"
              style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0.4 }}
              animate={{ scale: [0.85, 1.06, 0.85], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="h-16 w-16 rounded-full bg-matrix"
              style={{
                boxShadow:
                  '0 0 30px rgb(var(--clr-matrix) / 0.9), 0 0 90px rgb(var(--clr-matrix) / 0.5), inset 0 0 18px rgba(255,255,255,0.6)',
              }}
            />
            {[0, 90, 180, 270].map((deg) => (
              <motion.span
                key={deg}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute inset-0"
                style={{ rotate: deg }}
              >
                <span className="absolute left-1/2 top-0 h-2.5 w-0.5 -translate-x-1/2 bg-amber" />
              </motion.span>
            ))}
          </div>

          {/* ============ BOOT LOGLAR ============ */}
          <div className="mt-10 w-[min(92vw,460px)] font-mono text-[11px] leading-relaxed text-matrix md:text-xs">
            {bootLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.3, duration: 0.18 }}
              >
                {line}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + bootLines.length * 0.3 }}
              className="mt-2 text-amber-bright text-glow-amber"
            >
              &gt; {tr.boot.online}
              <span className="ml-1 inline-block h-3 w-2 bg-amber animate-blink align-middle" />
            </motion.p>
          </div>

          {/* ============ PROGRESS ============ */}
          <div className="mt-8 h-0.5 w-[min(80vw,380px)] overflow-hidden bg-navy-900">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.3, ease: 'easeInOut' }}
              className="h-full origin-left bg-gradient-to-r from-matrix via-matrix-bright to-amber"
              style={{ boxShadow: '0 0 10px rgb(var(--clr-matrix) / 0.8)' }}
            />
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-steel">
            {tr.boot.skip}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
