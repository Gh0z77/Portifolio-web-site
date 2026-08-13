import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/** Admin panel uchun markazlashgan modal oyna (Esc yoki fon bosilganda yopiladi) */
export default function AdminModal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] overflow-y-auto bg-bg/80 backdrop-blur-sm p-4 md:p-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="clip-corner mx-auto w-full max-w-3xl border border-matrix/40 bg-panel shadow-glow-navy"
          >
            <div className="flex items-center justify-between border-b border-steel-dim/50 px-6 py-4">
              <p className="font-mono text-xs uppercase tracking-widest text-matrix">// {title}</p>
              <button
                data-hover
                onClick={onClose}
                className="font-mono text-lg text-steel-light transition-colors hover:text-amber-bright"
                aria-label="Yopish"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
