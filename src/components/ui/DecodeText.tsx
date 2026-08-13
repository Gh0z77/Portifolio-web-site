import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useInView } from 'framer-motion'
import { SCRAMBLE_CHARS } from '../../lib/utils'
import { playDecodeTick } from '../../lib/sound'

interface Props {
  text: string
  className?: string
  /** Boshlanish kechikishi (ms) */
  delay?: number
  /** Har bir belgi uchun qadam (ms) */
  speed?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div'
}

/**
 * Ekranga kirganda matn "shifrlangan" belgilardan asl holiga
 * chapdan o'ngga qarab ochiladi (hacker decode effekti).
 * text o'zgarsa (masalan til almashsa) animatsiya qaytadan boshlanadi.
 */
export default function DecodeText({
  text,
  className,
  delay = 0,
  speed = 28,
  as: Tag = 'span',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as RefObject<Element>, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!inView) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(text)
      return
    }

    let frame = 0
    let interval: ReturnType<typeof setInterval> | undefined
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame++
        playDecodeTick()
        const resolved = Math.floor(frame / 2)
        let out = ''
        for (let i = 0; i < text.length; i++) {
          if (i < resolved) {
            out += text[i]
          } else if (text[i] === ' ') {
            out += ' '
          } else {
            out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }
        }
        setDisplay(out)
        if (resolved >= text.length && interval) clearInterval(interval)
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [inView, text, delay, speed])

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {display || ' '}
    </Tag>
  )
}
