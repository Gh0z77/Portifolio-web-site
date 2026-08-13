import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  children: ReactNode
  className?: string
  color?: 'green' | 'amber' | 'steel'
}

/** Kichik texnologiya/teg chipi */
export default function Tag({ children, className, color = 'steel' }: Props) {
  return (
    <span
      className={cn(
        'inline-block border px-2 py-0.5 font-mono text-[11px] tracking-wide transition-colors duration-300',
        color === 'steel' && 'border-steel-dim text-steel-light hover:border-matrix hover:text-matrix-bright',
        color === 'green' && 'border-matrix/50 text-matrix-bright bg-matrix-dark/30',
        color === 'amber' && 'border-amber/50 text-amber-bright bg-amber-dim/20',
        className
      )}
    >
      {children}
    </span>
  )
}
