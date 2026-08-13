import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, ADMIN_EMAIL, ADMIN_DASH } from '../../lib/supabase'
import PageTransition from '../../components/PageTransition'
import GlitchText from '../../components/ui/GlitchText'
import CyberButton from '../../components/ui/CyberButton'

/* Bruteforce himoya: 5 xato -> 5 daqiqa qulf (brauzer darajasida) */
const LOCK_KEY = 'ghost-login-guard'
const MAX_ATTEMPTS = 5
const LOCK_MS = 5 * 60 * 1000

interface LockState {
  n: number
  until: number
}

function readLock(): LockState {
  try {
    const raw = localStorage.getItem(LOCK_KEY)
    if (raw) return JSON.parse(raw) as LockState
  } catch {
    /* ignore */
  }
  return { n: 0, until: 0 }
}

function writeLock(s: LockState) {
  try {
    localStorage.setItem(LOCK_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(0)
  const [lockLeft, setLockLeft] = useState(0)

  // 2FA bosqichi
  const [stage, setStage] = useState<'password' | 'totp'>('password')
  const [totpCode, setTotpCode] = useState('')
  const [factorId, setFactorId] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Kirish — GHOST'
    // Mavjud sessiya: to'g'ri admin va AAL darajasi yetarli bo'lsa — kirgizamiz
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return
      if (data.session.user.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut()
        return
      }
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
        // Parol to'g'ri, lekin 2FA kod kerak
        const { data: factors } = await supabase.auth.mfa.listFactors()
        const totp = factors?.totp?.[0]
        if (totp) {
          setFactorId(totp.id)
          setStage('totp')
        }
      } else {
        navigate(ADMIN_DASH, { replace: true })
      }
    })
  }, [navigate])

  // Qulf hisoblagichi
  useEffect(() => {
    const tick = () => {
      const lock = readLock()
      setLockLeft(Math.max(0, Math.ceil((lock.until - Date.now()) / 1000)))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const fail = (msg: string) => {
    const lock = readLock()
    const n = lock.n + 1
    const until = n >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : lock.until
    writeLock({ n: n >= MAX_ATTEMPTS ? 0 : n, until })
    setError(
      n >= MAX_ATTEMPTS
        ? '[XATO] Juda ko\'p urinish — 5 daqiqaga qulflandi'
        : `${msg} (${MAX_ATTEMPTS - n} urinish qoldi)`
    )
    setShake((s) => s + 1)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (lockLeft > 0) {
      setError(`[QULF] ${Math.floor(lockLeft / 60)}:${String(lockLeft % 60).padStart(2, '0')} dan keyin urinib ko'ring`)
      return
    }
    setLoading(true)
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setLoading(false)
      fail("[XATO] ACCESS DENIED — login yoki parol noto'g'ri")
      return
    }
    // Faqat admin emailiga ruxsat — boshqa har qanday hisob chiqarib yuboriladi
    if (data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut()
      setLoading(false)
      fail('[XATO] ACCESS DENIED — bu hisobga ruxsat yo\'q')
      return
    }
    // 2FA yoqilgan bo'lsa — kod bosqichi
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const totp = factors?.totp?.[0]
      if (totp) {
        setFactorId(totp.id)
        setStage('totp')
        setLoading(false)
        return
      }
    }
    writeLock({ n: 0, until: 0 })
    setLoading(false)
    navigate(ADMIN_DASH, { replace: true })
  }

  const onVerifyTotp = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!factorId || totpCode.trim().length < 6) {
      setError('[!] 6 xonali kodni kiriting')
      return
    }
    setLoading(true)
    const { error: mfaError } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: totpCode.trim(),
    })
    setLoading(false)
    if (mfaError) {
      setTotpCode('')
      fail("[XATO] Kod noto'g'ri")
    } else {
      writeLock({ n: 0, until: 0 })
      navigate(ADMIN_DASH, { replace: true })
    }
  }

  const locked = lockLeft > 0

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center px-5">
        <motion.div
          key={shake}
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="clip-corner border border-steel-dim/60 bg-[#060a14]/95 shadow-glow-navy">
            {/* Terminal sarlavha */}
            <div className="flex items-center gap-2 border-b border-steel-dim/50 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-amber/80" />
              <span className="h-3 w-3 rounded-full bg-matrix/80" />
              <span className="h-3 w-3 rounded-full bg-steel/80" />
              <span className="ml-3 font-mono text-xs text-steel">root@ghost: access_control</span>
            </div>

            <div className="p-8">
              <h1 className="text-center font-display text-3xl font-bold tracking-widest text-ghost">
                <GlitchText text={stage === 'totp' ? '2FA' : 'KIRISH'} interval={6} />
              </h1>
              <p className="mt-2 text-center font-mono text-xs text-steel">
                {stage === 'totp'
                  ? '// authenticator ilovasidagi kodni kiriting'
                  : '// faqat administrator uchun'}
              </p>

              {stage === 'password' ? (
                <form onSubmit={onSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-1.5 block font-mono text-xs text-matrix">--email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="cyber-input"
                      placeholder="admin@email.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-xs text-matrix">--parol</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="cyber-input"
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  {locked && (
                    <p className="font-mono text-xs text-amber-bright">
                      [QULF] {Math.floor(lockLeft / 60)}:{String(lockLeft % 60).padStart(2, '0')}{' '}
                      dan keyin qayta urinib ko'ring
                    </p>
                  )}
                  {error && !locked && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-xs text-amber-bright"
                    >
                      {error}
                    </motion.p>
                  )}

                  <CyberButton type="submit" disabled={loading || locked} className="w-full">
                    {loading ? 'tekshirilmoqda...' : 'sudo login →'}
                  </CyberButton>
                </form>
              ) : (
                <form onSubmit={onVerifyTotp} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-1.5 block font-mono text-xs text-matrix">--totp kod</label>
                    <input
                      inputMode="numeric"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                      className="cyber-input text-center text-2xl tracking-[0.5em]"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-xs text-amber-bright"
                    >
                      {error}
                    </motion.p>
                  )}
                  <CyberButton type="submit" disabled={loading} className="w-full">
                    {loading ? 'tekshirilmoqda...' : 'tasdiqlash ✔'}
                  </CyberButton>
                  <button
                    type="button"
                    data-hover
                    onClick={async () => {
                      await supabase.auth.signOut()
                      setStage('password')
                      setTotpCode('')
                      setError(null)
                    }}
                    className="w-full text-center font-mono text-xs text-steel transition-colors hover:text-amber-bright"
                  >
                    ← boshqa hisob bilan kirish
                  </button>
                </form>
              )}

              <p className="mt-6 text-center">
                <Link
                  to="/"
                  data-hover
                  className="font-mono text-xs text-steel transition-colors hover:text-matrix-bright"
                >
                  ← saytga qaytish
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
