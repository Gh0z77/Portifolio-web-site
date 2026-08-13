/**
 * Saytning 8-bit ovoz tizimi — audio fayllarsiz, Web Audio API sintezi.
 * Tugma bosilishi, portlash, boot ohangi. Navbar'dagi tugma bilan o'chiriladi.
 */

const PREF_KEY = 'ghost-sound'
const VOL_KEY = 'ghost-vol'

let ctx: AudioContext | null = null
let soundOn = true

/** Ovoz darajasi: 0=o'chiq, 1=past, 2=o'rta, 3=baland */
let volLevel = 2
const VOL_MULT = [0, 0.5, 1, 1.9]

try {
  soundOn = localStorage.getItem(PREF_KEY) !== 'off'
  const savedVol = parseInt(localStorage.getItem(VOL_KEY) ?? '2', 10)
  if (savedVol >= 0 && savedVol <= 3) volLevel = savedVol
  if (!soundOn) volLevel = 0
  if (volLevel === 0) soundOn = false
} catch {
  /* ignore */
}

function volMult() {
  return VOL_MULT[volLevel]
}

export function getVolumeLevel() {
  return volLevel
}

/** Darajani o'rnatish — barcha ovozlar va fondagi musiqaga darhol ta'sir qiladi */
export function setVolumeLevel(level: number) {
  volLevel = Math.max(0, Math.min(3, Math.round(level)))
  soundOn = volLevel > 0
  try {
    localStorage.setItem(VOL_KEY, String(volLevel))
    localStorage.setItem(PREF_KEY, soundOn ? 'on' : 'off')
  } catch {
    /* ignore */
  }
  if (volLevel === 0) {
    stopAmbient()
  } else if (!ambient) {
    startAmbient()
  } else {
    retargetAmbient()
  }
}

export function isSoundOn() {
  return soundOn
}

export function setSoundOn(on: boolean) {
  setVolumeLevel(on ? (volLevel === 0 ? 2 : volLevel) : 0)
}

function ensureCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

interface BeepOpts {
  freq: number
  end?: number
  dur?: number
  type?: OscillatorType
  vol?: number
  delay?: number
}

/** Bitta sintez nota */
function beep({ freq, end, dur = 0.08, type = 'square', vol = 0.08, delay = 0 }: BeepOpts) {
  const scaled = vol * volMult()
  if (scaled <= 0.0001) return
  const ac = ensureCtx()
  if (!ac) return
  duckAmbient()
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (end) osc.frequency.exponentialRampToValueAtTime(Math.max(end, 1), t0 + dur)
  gain.gain.setValueAtTime(scaled, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

/** Shovqin portlashi (white noise + pastlovchi filtr) */
function noiseBurst(dur: number, volRaw: number, delay = 0) {
  const vol = volRaw * volMult()
  if (vol <= 0.0001) return
  const ac = ensureCtx()
  if (!ac) return
  duckAmbient()
  const t0 = ac.currentTime + delay
  const len = Math.floor(ac.sampleRate * dur)
  const buffer = ac.createBuffer(1, len, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource()
  src.buffer = buffer
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1400, t0)
  filter.frequency.exponentialRampToValueAtTime(90, t0 + dur)
  const gain = ac.createGain()
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(filter).connect(gain).connect(ac.destination)
  src.start(t0)
}

/** Audio hozir chalinishi mumkinmi (brauzer qulfi ochiqmi) */
export function audioReady(): boolean {
  const ac = ensureCtx()
  return ac?.state === 'running'
}

/* Tiklar orasidagi minimal oraliq — bir vaqtda ko'p animatsiya bo'lsa ham shovqin bo'lmaydi */
let lastTickAt = 0
function canTick(minGap: number): boolean {
  const now = performance.now()
  if (now - lastTickAt < minGap) return false
  lastTickAt = now
  return true
}

/** Matn shifrlanib ochilishidagi mayda "data" tiki (DecodeText) */
export function playDecodeTick() {
  if (!soundOn || !audioReady() || !canTick(35)) return
  beep({ freq: 1700 + Math.random() * 800, dur: 0.018, type: 'square', vol: 0.012 })
}

/** Terminal yozuvidagi klaviatura tiki */
export function playTypeTick() {
  if (!soundOn || !audioReady() || !canTick(45)) return
  beep({ freq: 1100 + Math.random() * 300, dur: 0.02, type: 'square', vol: 0.015 })
}

/** Raqam sanashdagi tik — progress (0..1) oshgani sari ohang ko'tariladi */
export function playCountTick(progress: number) {
  if (!soundOn || !audioReady() || !canTick(40)) return
  beep({ freq: 500 + progress * 700, dur: 0.025, type: 'square', vol: 0.02 })
}

/** Karta/section paydo bo'lishidagi yumshoq "fshsh" (Reveal) */
export function playReveal() {
  if (!soundOn || !audioReady() || !canTick(90)) return
  const ac = ensureCtx()
  if (!ac) return
  duckAmbient()
  const t0 = ac.currentTime
  const dur = 0.14
  const len = Math.floor(ac.sampleRate * dur)
  const buffer = ac.createBuffer(1, len, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource()
  src.buffer = buffer
  // Yuqoriga suzuvchi bandpass — "paydo bo'lish" hissi
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 1.2
  filter.frequency.setValueAtTime(400, t0)
  filter.frequency.exponentialRampToValueAtTime(1600, t0 + dur)
  const gain = ac.createGain()
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(0.028 * volMult(), t0 + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(filter).connect(gain).connect(ac.destination)
  src.start(t0)
}

/* Yakuniy "ding" — 4 ta raqam bir vaqtda tugasa ham bitta chalinadi */
let lastDingAt = 0

/** Raqam sanash tugadi — kichik ikki notali ding */
export function playCountDone() {
  if (!soundOn || !audioReady()) return
  const now = performance.now()
  if (now - lastDingAt < 250) return
  lastDingAt = now
  beep({ freq: 1180, dur: 0.09, type: 'triangle', vol: 0.05 })
  beep({ freq: 1568, dur: 0.12, type: 'triangle', vol: 0.04, delay: 0.06 })
}

/** Tugma/havola bosilish "blip"i */
export function playClick() {
  if (!soundOn) return
  beep({ freq: 950, end: 480, dur: 0.06, type: 'square', vol: 0.05 })
}

/** Qo'ng'iz/ilon portlashi — retro "kabum" */
export function playExplosion() {
  if (!soundOn) return
  noiseBurst(0.3, 0.16)
  beep({ freq: 240, end: 35, dur: 0.28, type: 'square', vol: 0.1 })
  beep({ freq: 1400, end: 300, dur: 0.1, type: 'sawtooth', vol: 0.04 })
}

/** Sayt ochilishidagi boot ketma-ketligi */
export function playBoot() {
  if (!soundOn) return
  beep({ freq: 320, dur: 0.07, vol: 0.05, delay: 0.1 })
  beep({ freq: 480, dur: 0.07, vol: 0.05, delay: 0.35 })
  beep({ freq: 640, dur: 0.07, vol: 0.05, delay: 0.6 })
  beep({ freq: 80, end: 600, dur: 0.9, type: 'sawtooth', vol: 0.025, delay: 0.2 })
  beep({ freq: 880, dur: 0.18, type: 'triangle', vol: 0.07, delay: 1.6 })
  beep({ freq: 1174, dur: 0.22, type: 'triangle', vol: 0.06, delay: 1.75 })
}

/* ============================================================
   ORQA FON AMBIENT — doimiy yoqimli "server xonasi" atmosferasi.
   Boshqa ovoz chiqqanda avtomatik pasayadi (ducking) va qaytadi.
   ============================================================ */

const AMBIENT_VOL = 0.014

function ambientVol() {
  return AMBIENT_VOL * volMult()
}

/** Daraja o'zgarganda fondagi musiqa balandligini silliq moslash */
function retargetAmbient() {
  if (!ambient || !ctx) return
  const g = ambient.master.gain
  const t = ctx.currentTime
  g.cancelScheduledValues(t)
  g.setValueAtTime(Math.max(g.value, 0.0001), t)
  g.linearRampToValueAtTime(Math.max(ambientVol(), 0.0001), t + 0.4)
}

interface AmbientState {
  master: GainNode
  sources: (OscillatorNode | AudioBufferSourceNode)[]
  others: AudioNode[]
  timers: number[]
}

let ambient: AmbientState | null = null

/** SFX chalinayotganda fonni pasaytirib, sekin qaytarish */
function duckAmbient() {
  if (!ambient || !ctx) return
  const g = ambient.master.gain
  const t = ctx.currentTime
  g.cancelScheduledValues(t)
  g.setValueAtTime(Math.max(g.value, 0.0001), t)
  g.linearRampToValueAtTime(Math.max(ambientVol() * 0.3, 0.0001), t + 0.05)
  g.setTargetAtTime(Math.max(ambientVol(), 0.0001), t + 0.4, 0.3)
}

/** Ambient ichidagi yumshoq data-blip (fonni pasaytirmaydi) */
function ambientBlip(freq: number) {
  if (!ctx || !ambient) return
  const t0 = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = freq
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.04)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9)
  osc.connect(g).connect(ambient.master)
  osc.start(t0)
  osc.stop(t0 + 1)
}

/** Doimiy fon atmosferasini yoqish */
export function startAmbient() {
  if (!soundOn || ambient) return
  const ac = ensureCtx()
  if (!ac || ac.state !== 'running') return

  const master = ac.createGain()
  master.gain.value = 0.0001
  master.connect(ac.destination)
  // 3 soniyada sekin paydo bo'ladi
  master.gain.linearRampToValueAtTime(Math.max(ambientVol(), 0.0001), ac.currentTime + 3)

  const sources: (OscillatorNode | AudioBufferSourceNode)[] = []
  const others: AudioNode[] = []

  // ============ LO-FI AKKORD MUSIQASI ============
  // Sekin, iliq akkordlar aylanasi: Am7 -> Fmaj7 -> Cmaj7 -> Gadd9.
  // O'yin menyusi musiqasi kabi — tinch, ohangdor, zeriktirmaydi.
  const CHORDS: number[][] = [
    [110.0, 164.81, 220.0, 261.63, 329.63], // Am7
    [87.31, 174.61, 220.0, 261.63, 349.23], // Fmaj7
    [130.81, 196.0, 246.94, 329.63, 392.0], // Cmaj7
    [98.0, 196.0, 246.94, 293.66, 440.0], // Gadd9
  ]
  const CHORD_LEN = 4.4 // soniya
  let chordIdx = 0

  const playChord = () => {
    if (!ambient || !ctx || !soundOn) return
    const freqs = CHORDS[chordIdx % CHORDS.length]
    chordIdx++
    const t0 = ctx.currentTime
    for (const f of freqs) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const g = ctx.createGain()
      // Yumshoq kirish, ushlab turish, keyingi akkordga silliq qo'shilish
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.linearRampToValueAtTime(0.24, t0 + 1.6)
      g.gain.setValueAtTime(0.24, t0 + CHORD_LEN - 1.2)
      g.gain.linearRampToValueAtTime(0.0001, t0 + CHORD_LEN + 0.8)
      osc.connect(g).connect(ambient.master)
      osc.start(t0)
      osc.stop(t0 + CHORD_LEN + 1)
    }
    // Ba'zan yuqori oktavada mayin "uchqun" melodiya notasi
    if (Math.random() < 0.5) {
      const f = freqs[2 + Math.floor(Math.random() * (freqs.length - 2))] * 2
      setTimeout(() => ambientBlip(f), 800 + Math.random() * 2200)
    }
  }

  const chordTimer = window.setInterval(playChord, CHORD_LEN * 1000)

  ambient = { master, sources, others, timers: [chordTimer] }
  // Birinchi akkord darhol boshlanadi
  playChord()
}

/** Fon atmosferasini o'chirish (yumshoq so'nish bilan) */
export function stopAmbient() {
  if (!ambient || !ctx) return
  const a = ambient
  ambient = null
  a.timers.forEach((t) => clearInterval(t))
  const t = ctx.currentTime
  a.master.gain.cancelScheduledValues(t)
  a.master.gain.setValueAtTime(Math.max(a.master.gain.value, 0.0001), t)
  a.master.gain.linearRampToValueAtTime(0.0001, t + 0.6)
  setTimeout(() => {
    for (const s of a.sources) {
      try {
        s.stop()
      } catch {
        /* allaqachon to'xtagan */
      }
      try {
        s.disconnect()
      } catch {
        /* ignore */
      }
    }
    for (const n of a.others) {
      try {
        n.disconnect()
      } catch {
        /* ignore */
      }
    }
    try {
      a.master.disconnect()
    } catch {
      /* ignore */
    }
  }, 800)
}

/**
 * Global ishga tushirish: birinchi foydalanuvchi harakatida audio "qulfdan chiqadi"
 * va ambient fon boshlanadi; barcha tugma/havola bosilishlariga blip qo'shiladi.
 */
export function initSound(): () => void {
  // Audio allaqachon ruxsat etilgan bo'lsa — fonni darhol boshlaymiz
  if (audioReady()) startAmbient()

  const unlock = () => {
    const ac = ensureCtx()
    if (ac) {
      // resume async — biroz kutib fonni yoqamiz
      setTimeout(() => startAmbient(), 200)
    }
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock)
  window.addEventListener('keydown', unlock)

  const onDocClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    if (target?.closest('a, button, [role="button"], select, label, input[type="checkbox"]')) {
      playClick()
    }
  }
  document.addEventListener('click', onDocClick)

  // Boshqa tab'ga o'tilganda fon to'xtaydi, qaytganda davom etadi
  const onVisibility = () => {
    if (document.hidden) stopAmbient()
    else if (soundOn && audioReady()) startAmbient()
  }
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
    document.removeEventListener('click', onDocClick)
    document.removeEventListener('visibilitychange', onVisibility)
    stopAmbient()
  }
}
