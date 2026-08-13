import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Har bir sahifa shu bilan o'raladi — kirishda glitch-slayd,
 * chiqishda yuqoriga so'nish. Ustidan yashil skaner chizig'i o'tadi.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -18, filter: 'blur(4px)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Sahifa kirishida bir marta o'tadigan skaner chizig'i */}
      <motion.div
        aria-hidden="true"
        initial={{ top: '-4%', opacity: 1 }}
        animate={{ top: '104%', opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="pointer-events-none fixed inset-x-0 z-[70] h-1"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(var(--clr-matrix-bright) / 0.85), rgb(var(--clr-amber) / 0.7), transparent)',
          boxShadow: '0 0 24px rgb(var(--clr-matrix) / 0.55)',
        }}
      />
      {children}
    </motion.div>
  )
}
