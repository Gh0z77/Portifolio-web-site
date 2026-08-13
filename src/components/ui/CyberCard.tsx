import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ReactNode, MouseEvent } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  children: ReactNode
  className?: string
  /** 3D tilt effekti (default: true) */
  tilt?: boolean
  /** Burchak qavslari ko'rsatilsinmi */
  brackets?: boolean
}

/**
 * Cyberpunk karta: sichqonchaga ergashuvchi yorug'lik dog'i,
 * yengil 3D tilt va hoverda yonadigan burchak qavslari.
 */
export default function CyberCard({ children, className, tilt = true, brackets = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (tilt && window.matchMedia('(pointer: fine)').matches) {
      const rx = ((y / rect.height) - 0.5) * -5
      const ry = ((x / rect.width) - 0.5) * 5
      setTransform(`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`)
    }
  }

  const onMouseLeave = () => setTransform('')

  const bracket = 'absolute w-4 h-4 border-matrix transition-all duration-300 opacity-30 group-hover:opacity-100'

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transform, transition: transform ? 'transform 0.1s ease-out' : 'transform 0.5s ease' }}
      className={cn(
        'card-spotlight group relative border border-steel-dim/60 glass',
        'hover:border-steel/80 transition-colors duration-300',
        className
      )}
    >
      {brackets && (
        <>
          <span className={cn(bracket, 'left-0 top-0 border-l-2 border-t-2 group-hover:-left-1 group-hover:-top-1')} />
          <span className={cn(bracket, 'right-0 top-0 border-r-2 border-t-2 group-hover:-right-1 group-hover:-top-1')} />
          <span className={cn(bracket, 'left-0 bottom-0 border-l-2 border-b-2 group-hover:-left-1 group-hover:-bottom-1')} />
          <span className={cn(bracket, 'right-0 bottom-0 border-r-2 border-b-2 group-hover:-right-1 group-hover:-bottom-1')} />
        </>
      )}
      {children}
    </motion.div>
  )
}
