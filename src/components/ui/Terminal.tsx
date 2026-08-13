import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '../../lib/utils'
import { playTypeTick } from '../../lib/sound'

export interface TermLine {
  cmd: string
  out?: string[]
}

interface Props {
  lines: TermLine[]
  title?: string
  className?: string
  /** Yozish tezligi ms/belgi */
  speed?: number
}

/**
 * Terminal oynasi: buyruqlar birma-bir yoziladi, natijalari chiqadi.
 * Ekranga kirgandagina boshlanadi.
 */
export default function Terminal({ lines, title = 'ghost@portfolio:~', className, speed = 34 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [rendered, setRendered] = useState<{ cmd: string; out: string[]; done: boolean }[]>([])

  useEffect(() => {
    if (!inView) return
    setRendered([])

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setRendered(lines.map((l) => ({ cmd: l.cmd, out: l.out ?? [], done: true })))
      return
    }

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(setTimeout(res, ms))
      })

    const run = async () => {
      for (let li = 0; li < lines.length; li++) {
        if (cancelled) return
        const line = lines[li]
        // Buyruqni belgima-belgi yozish
        for (let c = 1; c <= line.cmd.length; c++) {
          if (cancelled) return
          playTypeTick()
          setRendered((prev) => {
            const next = prev.slice(0, li)
            next[li] = { cmd: line.cmd.slice(0, c), out: [], done: false }
            return next
          })
          await wait(speed)
        }
        await wait(250)
        if (cancelled) return
        setRendered((prev) => {
          const next = [...prev]
          next[li] = { cmd: line.cmd, out: line.out ?? [], done: true }
          return next
        })
        await wait(400)
      }
    }
    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [inView, lines, speed])

  return (
    <div
      ref={ref}
      className={cn(
        'clip-corner border border-steel-dim/70 glass font-mono text-sm shadow-glow-navy',
        className
      )}
    >
      {/* Sarlavha paneli */}
      <div className="flex items-center gap-2 border-b border-steel-dim/50 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-amber/80" />
        <span className="h-3 w-3 rounded-full bg-matrix/80" />
        <span className="h-3 w-3 rounded-full bg-steel/80" />
        <span className="ml-3 text-xs text-steel">{title}</span>
      </div>
      {/* Tana */}
      <div className="p-4 md:p-5 space-y-2 min-h-[120px]">
        {rendered.map((line, i) => (
          <div key={i}>
            <p className="text-ghost">
              <span className="text-matrix-bright">❯</span>{' '}
              <span className="text-amber-bright">{line.cmd}</span>
              {!line.done && (
                <span className="inline-block w-2 h-4 bg-matrix ml-0.5 align-middle animate-blink" />
              )}
            </p>
            {line.done &&
              line.out.map((o, j) => (
                <p key={j} className="pl-4 text-steel-light whitespace-pre-wrap">
                  {o}
                </p>
              ))}
          </div>
        ))}
        {rendered.length === lines.length && rendered.every((r) => r.done) && (
          <p>
            <span className="text-matrix-bright">❯</span>{' '}
            <span className="inline-block w-2 h-4 bg-matrix align-middle animate-blink" />
          </p>
        )}
      </div>
    </div>
  )
}
