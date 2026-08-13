import { useEffect, useRef, useState } from 'react'

/**
 * Maxsus kursor: markazda nuqta + orqasidan yumshoq ergashuvchi halqa.
 * Interaktiv elementlar ustida (a, button, input, [data-hover]) kattalashadi.
 * Touch qurilmalarda umuman ko'rinmaydi.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const [enabled, setEnabled] = useState(false)
  const hovering = useRef(false)
  const pressed = useRef(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      const target = e.target as HTMLElement | null
      hovering.current = !!target?.closest(
        'a, button, input, textarea, select, label, [data-hover], [role="button"]'
      )
    }
    const onDown = () => { pressed.current = true }
    const onUp = () => { pressed.current = false }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    let raf = 0
    const loop = () => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (dot && ring) {
        // Halqa lerp bilan kechikib ergashadi
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.16
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.16

        const hoverScale = hovering.current ? 2.1 : 1
        const pressScale = pressed.current ? 0.75 : 1
        dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${pressScale})`
        ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${hoverScale * pressScale})`
        ring.style.borderColor = hovering.current ? 'rgb(var(--clr-amber) / 0.9)' : 'rgb(var(--clr-matrix) / 0.8)'
        ring.style.backgroundColor = hovering.current ? 'rgb(var(--clr-amber) / 0.08)' : 'transparent'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 z-[300] h-1.5 w-1.5 rounded-full bg-matrix-bright pointer-events-none"
        style={{ boxShadow: '0 0 10px rgb(var(--clr-matrix-bright) / 0.9)' }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 z-[300] h-8 w-8 rounded-full border pointer-events-none transition-[border-color,background-color] duration-200"
      />
    </>
  )
}
