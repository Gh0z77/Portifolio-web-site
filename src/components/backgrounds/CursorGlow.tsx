import { useEffect, useRef } from 'react'

/**
 * Sichqonchaga ergashuvchi yorug'lik dog'i.
 * Fon gradientini qayta chizish o'rniga bitta katta doira faqat
 * transform bilan siljiydi — GPU kompozitorida ishlaydi, juda yengil.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const cur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 3 }
    cur.current = { ...target.current }

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf = 0
    const loop = () => {
      cur.current.x += (target.current.x - cur.current.x) * 0.06
      cur.current.y += (target.current.y - cur.current.y) * 0.06
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cur.current.x - 600}px, ${cur.current.y - 600}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        ref={ref}
        style={{
          width: 1200,
          height: 1200,
          willChange: 'transform',
          background:
            'radial-gradient(circle at center, rgb(var(--clr-matrix) / 0.06) 0%, rgba(18, 58, 140, 0.05) 30%, transparent 60%)',
        }}
      />
    </div>
  )
}
