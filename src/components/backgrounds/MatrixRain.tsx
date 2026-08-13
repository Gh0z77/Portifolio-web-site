import { useEffect, useRef } from 'react'
import { readThemeVar } from '../../lib/theme'

const CHARS = 'アイウエオカキクケコサシスセソ0123456789ABCDEFghost<>/{}[]=+*#$_'

/**
 * Matrix uslubidagi yomg'ir — butun sayt orqa foni.
 * Juda past opacity bilan chiziladi, kontentga xalaqit bermaydi.
 */
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let columns = 0
    let drops: number[] = []
    let speeds: number[] = []
    const fontSize = 18 // kattaroq shrift = kamroq ustun = yengilroq

    // Tema ranglari (admin paneldan o'zgarishi mumkin)
    let palette = {
      green: readThemeVar('--clr-matrix', 0.3),
      greenHead: readThemeVar('--clr-matrix-bright', 0.7),
      amber: readThemeVar('--clr-amber', 0.3),
      amberHead: readThemeVar('--clr-amber-bright', 0.7),
    }
    const onTheme = () => {
      palette = {
        green: readThemeVar('--clr-matrix', 0.3),
        greenHead: readThemeVar('--clr-matrix-bright', 0.7),
        amber: readThemeVar('--clr-amber', 0.3),
        amberHead: readThemeVar('--clr-amber-bright', 0.7),
      }
    }
    window.addEventListener('themechange', onTheme)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      columns = Math.floor(width / fontSize)
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50))
      speeds = Array.from({ length: columns }, () => 0.5 + Math.random() * 0.8)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let last = 0
    const FRAME_MS = 80 // ~12fps — fon uchun yetarli va juda tejamkor

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < FRAME_MS) return
      last = t

      // Iz qoldirish effekti
      ctx.fillStyle = 'rgba(4, 6, 12, 0.18)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        if (y > 0 && y < height) {
          const isAmber = i % 19 === 0
          // Har 3-ustun boshi yorqin — qolganlari bitta chizish bilan
          if (i % 3 === 0) {
            ctx.fillStyle = isAmber ? palette.amberHead : palette.greenHead
          } else {
            ctx.fillStyle = isAmber ? palette.amber : palette.green
          }
          ctx.fillText(char, x, y)
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -30)
        }
        drops[i] += speeds[i]
      }
    }

    if (reduced) {
      // Harakatsiz rejim: bir marta xira sepiladi
      ctx.fillStyle = 'rgba(4, 6, 12, 1)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < 6; j++) {
          ctx.fillStyle = readThemeVar('--clr-matrix', 0.08)
          ctx.fillText(
            CHARS[Math.floor(Math.random() * CHARS.length)],
            i * fontSize,
            Math.random() * height
          )
        }
      }
    } else {
      raf = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('themechange', onTheme)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 opacity-60"
      aria-hidden="true"
    />
  )
}
