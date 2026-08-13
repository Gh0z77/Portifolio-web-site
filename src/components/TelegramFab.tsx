import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n'

/**
 * Suzuvchi Telegram tugmasi — har sahifada pastki o'ng burchakda.
 * Mijoz bir bosishda to'g'ridan-to'g'ri Telegram chatga o'tadi.
 */
export default function TelegramFab() {
  const { links } = useI18n()

  return (
    <motion.a
      href={links.telegram}
      target="_blank"
      rel="noreferrer"
      data-hover
      aria-label="Telegram"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-matrix/60 glass text-matrix-bright shadow-glow-green"
    >
      {/* Pulsatsiya halqasi */}
      <motion.span
        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full border border-matrix"
      />
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M21.94 4.4c.26-1.06-.4-1.53-1.12-1.26L2.4 10.06c-1.2.47-1.18 1.14-.21 1.44l4.7 1.47 10.9-6.87c.51-.34.98-.15.6.19l-8.83 7.97-.34 4.86c.49 0 .7-.22.96-.48l2.3-2.23 4.79 3.54c.88.49 1.51.24 1.75-.82l3.02-14.73z" />
      </svg>
    </motion.a>
  )
}
