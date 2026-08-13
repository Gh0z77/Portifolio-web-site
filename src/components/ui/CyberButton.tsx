import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode, MouseEventHandler } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'amber' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  onClick?: MouseEventHandler
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

/**
 * Cyberpunk tugma: kesilgan burchaklar, hoverda ichidan to'ladigan rang
 * va yorug'lik chizig'i o'tishi.
 */
export default function CyberButton({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  type = 'button',
  disabled,
  className,
}: Props) {
  const base = cn(
    'clip-corner-sm relative inline-flex items-center justify-center gap-2 font-mono uppercase tracking-widest overflow-hidden group transition-all duration-300 select-none bg-bg/70 backdrop-blur-[3px]',
    size === 'sm' && 'px-4 py-2 text-xs',
    size === 'md' && 'px-6 py-3 text-sm',
    size === 'lg' && 'px-8 py-4 text-base',
    variant === 'primary' &&
      'border border-matrix text-matrix-bright hover-text-on-matrix hover:shadow-glow-green',
    variant === 'amber' &&
      'border border-amber text-amber-bright hover-text-on-amber hover:shadow-glow-amber',
    variant === 'ghost' &&
      'border border-steel-dim text-steel-light hover:border-matrix hover:text-matrix-bright',
    disabled && 'opacity-40 pointer-events-none',
    className
  )

  const fill = (
    <>
      {/* Hoverda pastdan to'ladigan fon */}
      <span
        className={cn(
          'absolute inset-0 z-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out',
          variant === 'primary' && 'bg-matrix',
          variant === 'amber' && 'bg-amber',
          variant === 'ghost' && 'bg-transparent'
        )}
      />
      {/* Yorug'lik chizig'i */}
      <span className="absolute inset-y-0 z-0 -left-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:left-full transition-all duration-700 ease-out" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  )

  const motionProps = {
    whileTap: { scale: 0.96 },
    whileHover: { scale: 1.02 },
  }

  if (to) {
    return (
      <motion.span {...motionProps} className="inline-block">
        <Link to={to} className={base} data-hover>
          {fill}
        </Link>
      </motion.span>
    )
  }
  if (href) {
    return (
      <motion.span {...motionProps} className="inline-block">
        <a href={href} target="_blank" rel="noreferrer" className={base} data-hover>
          {fill}
        </a>
      </motion.span>
    )
  }
  return (
    <motion.button
      {...motionProps}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
      data-hover
    >
      {fill}
    </motion.button>
  )
}
