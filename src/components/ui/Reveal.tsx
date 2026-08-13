import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { playReveal } from '../../lib/sound'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Kattaroq siljish uchun */
  distance?: number
  once?: boolean
}

/** Scrollda ko'ringanda yumshoq paydo bo'lish (fade + slide) */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  distance = 28,
  once = true,
}: Props) {
  const offset = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }[direction]

  const soundPlayed = useRef(false)

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => {
        if (once && soundPlayed.current) return
        soundPlayed.current = true
        playReveal()
      }}
    >
      {children}
    </motion.div>
  )
}
