import { useEffect, useRef } from 'react'
import { readThemeVar } from '../lib/theme'
import { playExplosion } from '../lib/sound'
import { isScrolling } from '../lib/scrolling'

/**
 * Sayt bo'ylab yuruvchi jonzotlar (canvas):
 * - PIKSEL QO'NG'IZLAR — istalgan chetdan chiqib, sahifani kesib o'tadi
 * - KOD-ILONLAR — boshi ilon, tanasi kod belgilaridan, ilon fizikasi bilan sudraladi
 * Ular SAHIFAGA bog'langan (scroll qilsangiz joyida qoladi) va kartalar ustidan o'tadi.
 * Ustiga bosilsa — piksel zarrachalarga portlab yo'q bo'ladi.
 */

// 12x12 piksel qo'ng'iz (mo'ylov + 3 juft oyoq + qanot chizig'i)
const BUG_PIXELS: number[][] = [
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
]
const BUG_PX = 3 // har bir piksel o'lchami
const BUG_HALF = (12 * BUG_PX) / 2

const SNAKE_CHARS = 'wghost{}$#01<>*='

interface Vec {
  x: number
  y: number
}

interface BugCreature {
  kind: 'bug'
  id: number
  pos: Vec
  heading: number
  speed: number
  age: number
}

interface SnakeCreature {
  kind: 'snake'
  id: number
  segs: Vec[]
  heading: number
  speed: number
  chars: string[]
  age: number
  life: number
  shrinking: boolean
}

type Creature = BugCreature | SnakeCreature

interface Particle {
  pos: Vec
  vel: Vec
  life: number
  maxLife: number
  size: number
  color: 'green' | 'amber' | 'white'
}

let idCounter = 1

export default function AmbientFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let vw = 0
    let vh = 0
    const resize = () => {
      vw = window.innerWidth
      vh = window.innerHeight
      canvas.width = vw * dpr
      canvas.height = vh * dpr
      canvas.style.width = `${vw}px`
      canvas.style.height = `${vh}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Tema ranglari
    let colors = {
      body: readThemeVar('--clr-matrix', 0.85),
      bright: readThemeVar('--clr-matrix-bright', 0.95),
      dim: readThemeVar('--clr-matrix', 0.5),
      amber: readThemeVar('--clr-amber-bright', 0.95),
    }
    const onTheme = () => {
      colors = {
        body: readThemeVar('--clr-matrix', 0.85),
        bright: readThemeVar('--clr-matrix-bright', 0.95),
        dim: readThemeVar('--clr-matrix', 0.5),
        amber: readThemeVar('--clr-amber-bright', 0.95),
      }
    }
    window.addEventListener('themechange', onTheme)

    const creatures: Creature[] = []
    const particles: Particle[] = []

    const pageBounds = () => ({
      w: Math.max(document.documentElement.scrollWidth, vw),
      h: Math.max(document.documentElement.scrollHeight, vh),
    })

    /** Ko'rinib turgan hudud chetidan tasodifiy chiqish nuqtasi */
    const spawnPoint = (): { pos: Vec; heading: number } => {
      const sx = window.scrollX
      const sy = window.scrollY
      const edge = Math.floor(Math.random() * 4)
      const jitter = () => (Math.random() - 0.5) * 0.9
      switch (edge) {
        case 0: // chapdan
          return { pos: { x: sx - 50, y: sy + Math.random() * vh }, heading: 0 + jitter() }
        case 1: // o'ngdan
          return { pos: { x: sx + vw + 50, y: sy + Math.random() * vh }, heading: Math.PI + jitter() }
        case 2: // tepadan
          return { pos: { x: sx + Math.random() * vw, y: sy - 50 }, heading: Math.PI / 2 + jitter() }
        default: // pastdan
          return { pos: { x: sx + Math.random() * vw, y: sy + vh + 50 }, heading: -Math.PI / 2 + jitter() }
      }
    }

    const spawnBug = () => {
      const { pos, heading } = spawnPoint()
      creatures.push({
        kind: 'bug',
        id: idCounter++,
        pos,
        heading,
        speed: 55 + Math.random() * 55,
        age: 0,
      })
    }

    const spawnSnake = () => {
      const { pos, heading } = spawnPoint()
      const len = 12 + Math.floor(Math.random() * 8)
      const segs: Vec[] = []
      for (let i = 0; i < len; i++) {
        segs.push({
          x: pos.x - Math.cos(heading) * i * 13,
          y: pos.y - Math.sin(heading) * i * 13,
        })
      }
      creatures.push({
        kind: 'snake',
        id: idCounter++,
        segs,
        heading,
        speed: 75 + Math.random() * 45,
        chars: Array.from({ length: len }, () =>
          SNAKE_CHARS[Math.floor(Math.random() * SNAKE_CHARS.length)]
        ),
        age: 0,
        life: 70 + Math.random() * 40,
        shrinking: false,
      })
    }

    const spawnBatch = (n: number) => {
      for (let i = 0; i < n; i++) {
        setTimeout(() => {
          if (Math.random() < 0.55) spawnBug()
          else spawnSnake()
        }, i * 1800)
      }
    }

    // Boshlanishida 4 ta; keyin har 30s da 4-5 taga to'ldirib turamiz
    const firstSpawn = setTimeout(() => spawnBatch(4), 3500)
    const keepAlive = setInterval(() => {
      const target = 4 + Math.floor(Math.random() * 2)
      if (creatures.length < target) spawnBatch(target - creatures.length)
    }, 30000)

    /** Piksel-uslub portlash: kvadrat bo'laklar 8 yo'nalishda otiladi */
    const explodeAt = (points: Vec[]) => {
      for (const p of points) {
        const n = points.length > 3 ? 6 : 18
        for (let i = 0; i < n; i++) {
          // 8 ta qat'iy yo'nalish + ozgina tebranish — retro portlash shakli
          const dir = (Math.floor(Math.random() * 8) * Math.PI) / 4 + (Math.random() - 0.5) * 0.3
          const sp = 50 + Math.floor(Math.random() * 3) * 65 // 3 tezlik pog'onasi
          const r = Math.random()
          particles.push({
            pos: { ...p },
            vel: { x: Math.cos(dir) * sp, y: Math.sin(dir) * sp },
            life: 0.45 + Math.random() * 0.35,
            maxLife: 0.8,
            size: 6 + Math.floor(Math.random() * 3) * 3, // 6 / 9 / 12 px
            color: r < 0.5 ? 'green' : r < 0.8 ? 'amber' : 'white',
          })
        }
      }
    }

    /** Bosishda jonzotni topib portlatish (capture fazada — link bosilishini oldini oladi) */
    const onClick = (e: MouseEvent) => {
      const px = e.pageX
      const py = e.pageY
      for (let i = creatures.length - 1; i >= 0; i--) {
        const c = creatures[i]
        let hit = false
        let points: Vec[] = []
        if (c.kind === 'bug') {
          const dx = c.pos.x - px
          const dy = c.pos.y - py
          hit = dx * dx + dy * dy < 30 * 30
          points = [c.pos]
        } else {
          for (const s of c.segs) {
            const dx = s.x - px
            const dy = s.y - py
            if (dx * dx + dy * dy < 17 * 17) {
              hit = true
              break
            }
          }
          points = c.segs.filter((_, idx) => idx % 2 === 0)
        }
        if (hit) {
          e.preventDefault()
          e.stopPropagation()
          explodeAt(points)
          playExplosion()
          creatures.splice(i, 1)
          return
        }
      }
    }
    window.addEventListener('click', onClick, true)

    let last = performance.now()
    let raf = 0
    let hidden = false
    const FRAME_MS = 33 // ~30fps chegara — tejamkor

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (now - last < FRAME_MS) return
      // Scroll paytida jonzotlar yashiriladi: canvas sahifaga bog'langan, kadr chizish scroll'ni sekinlatardi
      if (isScrolling()) {
        if (!hidden) { ctx.clearRect(0, 0, vw, vh); hidden = true }
        last = now
        return
      }
      hidden = false
      const dt = Math.min((now - last) / 1000, 0.06)
      last = now

      // Hech narsa yo'q bo'lsa — chizmasdan dam olamiz
      if (creatures.length === 0 && particles.length === 0) {
        ctx.clearRect(0, 0, vw, vh)
        return
      }

      const { w: pw, h: ph } = pageBounds()
      const sx = window.scrollX
      const sy = window.scrollY

      ctx.clearRect(0, 0, vw, vh)

      // ================= JONZOTLAR =================
      for (let i = creatures.length - 1; i >= 0; i--) {
        const c = creatures[i]
        c.age += dt

        if (c.kind === 'bug') {
          // Tasodifiy burilib yurish
          c.heading += (Math.random() - 0.5) * 1.1 * dt
          c.pos.x += Math.cos(c.heading) * c.speed * dt
          c.pos.y += Math.sin(c.heading) * c.speed * dt

          // Sahifadan butunlay chiqib ketsa — olib tashlash
          if (
            c.pos.x < -100 || c.pos.x > pw + 100 ||
            c.pos.y < -100 || c.pos.y > ph + 100 ||
            c.age > 60
          ) {
            creatures.splice(i, 1)
            continue
          }

          // Chizish (viewport ichida bo'lsa)
          const cx = c.pos.x - sx
          const cy = c.pos.y - sy
          if (cx > -60 && cx < vw + 60 && cy > -60 && cy < vh + 60) {
            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(c.heading + Math.PI / 2)
            ctx.shadowColor = colors.body
            ctx.shadowBlur = 8
            const legFrame = Math.floor(now / 120) % 2
            for (let r = 0; r < 12; r++) {
              for (let col = 0; col < 12; col++) {
                if (!BUG_PIXELS[r][col]) continue
                // Chet piksellar (oyoqlar) yurish taktida siljiydi
                const isLeg = col <= 1 || col >= 10
                const rowShift = isLeg && legFrame === 1 ? (r % 2 === 0 ? 1 : -1) : 0
                ctx.fillStyle = isLeg ? colors.bright : colors.body
                ctx.fillRect(
                  col * BUG_PX - BUG_HALF,
                  (r + rowShift) * BUG_PX - BUG_HALF,
                  BUG_PX,
                  BUG_PX
                )
              }
            }
            ctx.restore()
          }
        } else {
          // ================= ILON =================
          if (!c.shrinking && c.age > c.life) c.shrinking = true
          if (c.shrinking) {
            // Dumidan qisqarib yo'q bo'ladi
            if (c.segs.length > 2) {
              if (Math.floor(now / 90) % 2 === 0) c.segs.pop()
            } else {
              creatures.splice(i, 1)
              continue
            }
          }

          // Bosh — silliq tasodifiy burilish + sahifa ichida qolishga intilish
          c.heading += Math.sin(now / 900 + c.id * 7) * 0.9 * dt + (Math.random() - 0.5) * 0.6 * dt
          const head = c.segs[0]
          const margin = 120
          if (head.x < margin) c.heading = c.heading * 0.9 + 0 * 0.1
          if (head.x > pw - margin) c.heading = c.heading * 0.9 + Math.PI * 0.1
          if (head.y < margin) c.heading = c.heading * 0.9 + (Math.PI / 2) * 0.1
          if (head.y > ph - margin) c.heading = c.heading * 0.9 + (-Math.PI / 2) * 0.1

          head.x += Math.cos(c.heading) * c.speed * dt
          head.y += Math.sin(c.heading) * c.speed * dt

          // Tana — har bo'g'in oldingisiga ergashadi (ilon fizikasi)
          const spacing = 13
          for (let s = 1; s < c.segs.length; s++) {
            const prev = c.segs[s - 1]
            const cur = c.segs[s]
            const dx = prev.x - cur.x
            const dy = prev.y - cur.y
            const dist = Math.hypot(dx, dy) || 1
            const move = dist - spacing
            if (move > 0) {
              cur.x += (dx / dist) * move
              cur.y += (dy / dist) * move
            }
          }

          // Chizish
          ctx.font = '13px "JetBrains Mono", monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          for (let s = c.segs.length - 1; s >= 1; s--) {
            const seg = c.segs[s]
            const cx = seg.x - sx
            const cy = seg.y - sy
            if (cx < -30 || cx > vw + 30 || cy < -30 || cy > vh + 30) continue
            const fade = 1 - (s / c.segs.length) * 0.6
            ctx.fillStyle = s % 5 === 0 ? colors.amber : colors.dim
            ctx.globalAlpha = fade
            ctx.fillText(c.chars[s], cx, cy)
          }
          ctx.globalAlpha = 1

          // Bosh — ilon boshi (uchburchak + ko'zlar + tili)
          const hx = head.x - sx
          const hy = head.y - sy
          if (hx > -30 && hx < vw + 30 && hy > -30 && hy < vh + 30) {
            ctx.save()
            ctx.translate(hx, hy)
            ctx.rotate(c.heading)
            ctx.shadowColor = colors.bright
            ctx.shadowBlur = 10
            ctx.fillStyle = colors.bright
            ctx.beginPath()
            ctx.moveTo(11, 0)
            ctx.lineTo(-6, 7)
            ctx.lineTo(-3, 0)
            ctx.lineTo(-6, -7)
            ctx.closePath()
            ctx.fill()
            // Ko'zlar
            ctx.shadowBlur = 0
            ctx.fillStyle = colors.amber
            ctx.fillRect(2, -4, 2.5, 2.5)
            ctx.fillRect(2, 1.5, 2.5, 2.5)
            // Vaqti-vaqti bilan chiqadigan til
            if (Math.floor(now / 700) % 4 === 0) {
              ctx.strokeStyle = colors.amber
              ctx.lineWidth = 1.5
              ctx.beginPath()
              ctx.moveTo(11, 0)
              ctx.lineTo(17, -2)
              ctx.moveTo(11, 0)
              ctx.lineTo(17, 2)
              ctx.stroke()
            }
            ctx.restore()
          }
        }
      }

      // ================= PIKSEL ZARRACHALAR =================
      const GRID = 3 // piksel to'r qadami
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life -= dt
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        p.vel.y += 60 * dt // yengil tortishish
        p.pos.x += p.vel.x * dt
        p.pos.y += p.vel.y * dt
        // Pozitsiya piksel to'rga yopishadi — retro ko'rinish
        const cx = Math.round((p.pos.x - sx) / GRID) * GRID
        const cy = Math.round((p.pos.y - sy) / GRID) * GRID
        if (cx < -20 || cx > vw + 20 || cy < -20 || cy > vh + 20) continue
        // O'lcham bosqichma-bosqich kichrayadi (silliq emas)
        const phase = p.life / p.maxLife
        const size = phase > 0.6 ? p.size : phase > 0.3 ? Math.max(3, p.size - 3) : Math.max(3, p.size - 6)
        ctx.globalAlpha = phase > 0.25 ? 1 : 0.6
        ctx.fillStyle =
          p.color === 'white' ? '#ffffff' : p.color === 'amber' ? colors.amber : colors.bright
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size)
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(firstSpawn)
      clearInterval(keepAlive)
      window.removeEventListener('resize', resize)
      window.removeEventListener('themechange', onTheme)
      window.removeEventListener('click', onClick, true)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    />
  )
}
