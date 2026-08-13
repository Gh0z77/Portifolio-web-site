import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  text: string
  className?: string
  /** Har necha soniyada avtomatik glitch bo'lsin (0 = faqat hoverda) */
  interval?: number
}

/** Katta sarlavhalar uchun RGB-split glitch effekti */
export default function GlitchText({ text, className, interval = 5 }: Props) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!interval) return
    let timeout: ReturnType<typeof setTimeout>
    const tick = () => {
      setActive(true)
      timeout = setTimeout(() => {
        setActive(false)
        timeout = setTimeout(tick, interval * 1000 + Math.random() * 2000)
      }, 450)
    }
    timeout = setTimeout(tick, 1200)
    return () => clearTimeout(timeout)
  }, [interval])

  return (
    <span
      data-text={text}
      className={cn('glitch', active && 'glitch-active', className)}
    >
      {text}
    </span>
  )
}
