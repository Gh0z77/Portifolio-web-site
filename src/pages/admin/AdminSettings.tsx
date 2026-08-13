import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase, functionsUrl, functionHeaders } from '../../lib/supabase'
import { applyTheme, DEFAULT_PRIMARY, DEFAULT_ACCENT } from '../../lib/theme'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import CyberButton from '../../components/ui/CyberButton'
import Reveal from '../../components/ui/Reveal'

/** Bir bosishda qo'llanadigan tayyor tema shablonlari */
const PRESETS: { name: string; primary: string; accent: string }[] = [
  { name: 'MATRIX', primary: '#5fb50a', accent: '#f2a50c' },
  { name: 'CYBER ICE', primary: '#00d4ff', accent: '#ff8a00' },
  { name: 'NEON VIOLET', primary: '#a855f7', accent: '#22d3ee' },
  { name: 'BLOOD PROTOCOL', primary: '#ff2d55', accent: '#ffb300' },
  { name: 'GOLD RUSH', primary: '#ffcc00', accent: '#00e5a0' },
  { name: 'SAKURA', primary: '#ff4fa0', accent: '#38e8ff' },
]

export default function AdminSettings() {
  const [botToken, setBotToken] = useState('')
  const [chatId, setChatId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [testMsg, setTestMsg] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [passMsg, setPassMsg] = useState<string | null>(null)
  const [passSaving, setPassSaving] = useState(false)

  // 2FA (TOTP) holati
  const [mfaEnabled, setMfaEnabled] = useState<boolean | null>(null)
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null)
  const [enrollQr, setEnrollQr] = useState<string | null>(null)
  const [enrollSecret, setEnrollSecret] = useState<string | null>(null)
  const [enrollId, setEnrollId] = useState<string | null>(null)
  const [mfaCode, setMfaCode] = useState('')
  const [mfaMsg, setMfaMsg] = useState<string | null>(null)
  const [mfaBusy, setMfaBusy] = useState(false)

  const loadMfa = async () => {
    const { data } = await supabase.auth.mfa.listFactors()
    const verified = data?.totp?.find((f) => f.status === 'verified')
    setMfaEnabled(!!verified)
    setMfaFactorId(verified?.id ?? null)
  }

  const [primary, setPrimary] = useState(DEFAULT_PRIMARY)
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const [themeMsg, setThemeMsg] = useState<string | null>(null)
  const [themeSaving, setThemeSaving] = useState(false)

  useEffect(() => {
    document.title = 'Sozlamalar — GHOST Admin'
    loadMfa()
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['telegram_bot_token', 'telegram_chat_id', 'theme_primary', 'theme_accent'])
      .then(({ data }) => {
        setBotToken(data?.find((s) => s.key === 'telegram_bot_token')?.value ?? '')
        setChatId(data?.find((s) => s.key === 'telegram_chat_id')?.value ?? '')
        setPrimary(data?.find((s) => s.key === 'theme_primary')?.value?.trim() || DEFAULT_PRIMARY)
        setAccent(data?.find((s) => s.key === 'theme_accent')?.value?.trim() || DEFAULT_ACCENT)
      })
  }, [])

  /* Rangni tanlaganda darhol jonli ko'rinish */
  const previewPrimary = (v: string) => {
    setPrimary(v)
    applyTheme(v, accent)
  }
  const previewAccent = (v: string) => {
    setAccent(v)
    applyTheme(primary, v)
  }

  const saveTheme = async () => {
    setThemeMsg(null)
    setThemeSaving(true)
    const { error } = await supabase.from('site_settings').upsert(
      [
        { key: 'theme_primary', value: primary },
        { key: 'theme_accent', value: accent },
      ],
      { onConflict: 'key' }
    )
    setThemeSaving(false)
    setThemeMsg(error ? `[XATO] ${error.message}` : '[OK] tema saqlandi — endi barcha mehmonlar shu ranglarni ko\'radi ✔')
  }

  /** Shablonni tanlash — darhol qo'llanadi va saqlanadi */
  const applyPreset = async (p: { name: string; primary: string; accent: string }) => {
    setPrimary(p.primary)
    setAccent(p.accent)
    applyTheme(p.primary, p.accent)
    setThemeMsg(null)
    setThemeSaving(true)
    const { error } = await supabase.from('site_settings').upsert(
      [
        { key: 'theme_primary', value: p.primary },
        { key: 'theme_accent', value: p.accent },
      ],
      { onConflict: 'key' }
    )
    setThemeSaving(false)
    setThemeMsg(error ? `[XATO] ${error.message}` : `[OK] "${p.name}" temasi qo'llandi va saqlandi ✔`)
  }

  const resetTheme = async () => {
    setPrimary(DEFAULT_PRIMARY)
    setAccent(DEFAULT_ACCENT)
    applyTheme(DEFAULT_PRIMARY, DEFAULT_ACCENT)
    await supabase.from('site_settings').upsert(
      [
        { key: 'theme_primary', value: DEFAULT_PRIMARY },
        { key: 'theme_accent', value: DEFAULT_ACCENT },
      ],
      { onConflict: 'key' }
    )
    setThemeMsg('[OK] standart ranglar qaytarildi ✔')
  }

  const saveTelegram = async (e: FormEvent) => {
    e.preventDefault()
    setSaveMsg(null)
    setSaving(true)
    const { error } = await supabase.from('site_settings').upsert(
      [
        { key: 'telegram_bot_token', value: botToken.trim() },
        { key: 'telegram_chat_id', value: chatId.trim() },
      ],
      { onConflict: 'key' }
    )
    setSaving(false)
    setSaveMsg(error ? `[XATO] ${error.message}` : '[OK] sozlamalar saqlandi ✔')
  }

  const sendTest = async () => {
    setTestMsg(null)
    setTesting(true)
    try {
      const res = await fetch(`${functionsUrl}/contact`, {
        method: 'POST',
        headers: functionHeaders,
        body: JSON.stringify({ test: true }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.telegram === 'sent') {
        setTestMsg('[OK] test xabari Telegramga yuborildi ✔ — botni tekshiring')
      } else if (data.telegram === 'not_configured') {
        setTestMsg('[!] token/chat_id hali saqlanmagan — avval yuqorida saqlang')
      } else {
        setTestMsg(
          `[XATO] yuborilmadi — token yoki chat_id noto'g'ri, yoki botingizga /start bosilmagan${
            data.detail ? ` (${data.detail})` : ''
          }`
        )
      }
    } catch {
      setTestMsg('[XATO] tarmoq xatosi — funksiya deploy qilinganini tekshiring')
    } finally {
      setTesting(false)
    }
  }

  /** 2FA yoqishni boshlash — QR kod va sirli kalitni olish */
  const startEnroll = async () => {
    setMfaMsg(null)
    setMfaBusy(true)

    // Avvalgi chala (tasdiqlanmagan) faktorlarni tozalash — 422 xatoning oldini oladi
    try {
      const { data: existing } = await supabase.auth.mfa.listFactors()
      const stale = existing?.all?.filter(
        (f) => f.factor_type === 'totp' && f.status !== 'verified'
      )
      if (stale?.length) {
        for (const f of stale) {
          await supabase.auth.mfa.unenroll({ factorId: f.id })
        }
      }
    } catch {
      /* tozalashda xato — davom etamiz */
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `ghost-${Date.now()}`,
    })
    setMfaBusy(false)
    if (error) {
      setMfaMsg(`[XATO] ${error.message}`)
      return
    }
    setEnrollId(data.id)
    setEnrollQr(data.totp.qr_code)
    setEnrollSecret(data.totp.secret)
  }

  /** Authenticator ilovasidagi kod bilan tasdiqlash */
  const confirmEnroll = async (e: FormEvent) => {
    e.preventDefault()
    if (!enrollId || mfaCode.trim().length < 6) {
      setMfaMsg('[!] 6 xonali kodni kiriting')
      return
    }
    setMfaBusy(true)
    setMfaMsg(null)
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrollId,
      code: mfaCode.trim(),
    })
    setMfaBusy(false)
    if (error) {
      setMfaMsg("[XATO] kod noto'g'ri — qayta urinib ko'ring")
    } else {
      setEnrollQr(null)
      setEnrollSecret(null)
      setEnrollId(null)
      setMfaCode('')
      setMfaMsg('[OK] 2FA yoqildi ✔ — endi kirishda kod so\'raladi')
      loadMfa()
    }
  }

  /** 2FA ni o'chirish */
  const disableMfa = async () => {
    if (!mfaFactorId) return
    if (!confirm("2FA o'chirilsinmi? Bu xavfsizlikni pasaytiradi.")) return
    setMfaBusy(true)
    const { error } = await supabase.auth.mfa.unenroll({ factorId: mfaFactorId })
    setMfaBusy(false)
    setMfaMsg(error ? `[XATO] ${error.message}` : "[OK] 2FA o'chirildi")
    loadMfa()
  }

  const changePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPassMsg(null)
    if (pass1.length < 8) {
      setPassMsg('[!] parol kamida 8 belgi bo\'lishi kerak')
      return
    }
    if (pass1 !== pass2) {
      setPassMsg('[!] parollar mos kelmadi')
      return
    }
    setPassSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pass1 })
    setPassSaving(false)
    if (error) {
      setPassMsg(`[XATO] ${error.message}`)
    } else {
      setPassMsg('[OK] parol yangilandi ✔')
      setPass1('')
      setPass2('')
    }
  }

  return (
    <PageTransition>
      <DecodeText
        as="h1"
        text="SOZLAMALAR"
        className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
      />

      <div className="mt-8 max-w-2xl space-y-8">
        {/* ============ RANG TEMASI ============ */}
        <Reveal>
          <div className="clip-corner border border-steel-dim/50 bg-panel/70 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-matrix">
              // sayt rang temasi
            </p>
            <p className="mt-2 font-mono text-xs text-steel">
              rangni tanlashingiz bilan butun sayt jonli ravishda moslashadi
            </p>

            {/* Tayyor shablonlar */}
            <div className="mt-5">
              <label className="mb-2 block font-mono text-xs text-matrix">--tayyor shablonlar</label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    data-hover
                    onClick={() => applyPreset(p)}
                    className="clip-corner-sm group flex items-center gap-2.5 border border-steel-dim bg-navy-900/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-steel"
                  >
                    <span className="flex shrink-0 -space-x-1">
                      <span
                        className="h-4 w-4 rounded-full border border-bg"
                        style={{ background: p.primary, boxShadow: `0 0 8px ${p.primary}` }}
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-bg"
                        style={{ background: p.accent }}
                      />
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-steel-light group-hover:text-ghost">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--asosiy rang (yashil o'rnida)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primary}
                    onChange={(e) => previewPrimary(e.target.value)}
                    className="h-11 w-16 cursor-pointer border border-steel-dim bg-transparent"
                    data-hover
                  />
                  <input
                    value={primary}
                    onChange={(e) => previewPrimary(e.target.value)}
                    className="cyber-input flex-1"
                    placeholder="#5fb50a"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--ikkinchi rang (amber o'rnida)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => previewAccent(e.target.value)}
                    className="h-11 w-16 cursor-pointer border border-steel-dim bg-transparent"
                    data-hover
                  />
                  <input
                    value={accent}
                    onChange={(e) => previewAccent(e.target.value)}
                    className="cyber-input flex-1"
                    placeholder="#f2a50c"
                  />
                </div>
              </div>
            </div>
            {/* Jonli namuna */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="clip-corner-sm border border-matrix bg-matrix-dark/30 px-4 py-2 font-mono text-xs text-matrix-bright shadow-glow-green">
                asosiy rang namunasi
              </span>
              <span className="clip-corner-sm border border-amber bg-amber-dim/20 px-4 py-2 font-mono text-xs text-amber-bright shadow-glow-amber">
                ikkinchi rang namunasi
              </span>
            </div>
            {themeMsg && <p className="mt-4 font-mono text-xs text-matrix-bright">{themeMsg}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <CyberButton size="sm" onClick={saveTheme} disabled={themeSaving}>
                {themeSaving ? 'saqlanmoqda...' : 'temani saqlash ✔'}
              </CyberButton>
              <CyberButton size="sm" variant="ghost" onClick={resetTheme}>
                standart ranglar
              </CyberButton>
            </div>
          </div>
        </Reveal>

        {/* ============ TELEGRAM ============ */}
        <Reveal>
          <form onSubmit={saveTelegram} className="clip-corner border border-steel-dim/50 bg-panel/70 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-matrix">
              // telegram bot sozlamalari
            </p>
            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--bot token</label>
                <input
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="cyber-input"
                  placeholder="123456789:AAF..."
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--chat id</label>
                <input
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="cyber-input"
                  placeholder="123456789"
                  autoComplete="off"
                />
              </div>
              {saveMsg && <p className="font-mono text-xs text-amber-bright">{saveMsg}</p>}
              <div className="flex flex-wrap gap-3">
                <CyberButton type="submit" disabled={saving} size="sm">
                  {saving ? 'saqlanmoqda...' : 'saqlash ✔'}
                </CyberButton>
                <CyberButton variant="amber" size="sm" onClick={sendTest} disabled={testing}>
                  {testing ? 'yuborilmoqda...' : '⚡ test xabar yuborish'}
                </CyberButton>
              </div>
              {testMsg && <p className="font-mono text-xs text-matrix-bright">{testMsg}</p>}
            </div>

            {/* Yo'riqnoma */}
            <div className="mt-6 border-t border-steel-dim/40 pt-5 font-mono text-xs leading-relaxed text-steel-light">
              <p className="mb-2 text-steel">// qanday sozlanadi:</p>
              <ol className="list-decimal space-y-1.5 pl-5">
                <li>
                  Telegramda <span className="text-amber-bright">@BotFather</span> ga{' '}
                  <span className="text-matrix-bright">/newbot</span> yuborib yangi bot yarating va
                  u bergan <span className="text-amber-bright">token</span>ni nusxalang
                </li>
                <li>
                  <span className="text-amber-bright">@userinfobot</span> ga{' '}
                  <span className="text-matrix-bright">/start</span> yozib o'zingizning{' '}
                  <span className="text-amber-bright">chat ID</span> raqamingizni oling
                </li>
                <li>
                  <span className="text-amber">MUHIM:</span> o'zingiz yaratgan botga kirib{' '}
                  <span className="text-matrix-bright">/start</span> tugmasini bosing — aks holda bot
                  sizga yoza olmaydi
                </li>
                <li>Token va ID ni yuqoriga kiritib saqlang, keyin test yuboring</li>
              </ol>
            </div>
          </form>
        </Reveal>

        {/* ============ 2FA (TOTP) ============ */}
        <Reveal delay={0.05}>
          <div className="clip-corner border border-steel-dim/50 bg-panel/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-widest text-matrix">
                // ikki bosqichli himoya (2FA)
              </p>
              {mfaEnabled !== null && (
                <span
                  className={`border px-2.5 py-1 font-mono text-[11px] ${
                    mfaEnabled
                      ? 'border-matrix/50 text-matrix-bright'
                      : 'border-amber/50 text-amber-bright'
                  }`}
                >
                  {mfaEnabled ? '● YOQILGAN' : '○ O\'CHIQ'}
                </span>
              )}
            </div>
            <p className="mt-2 font-mono text-xs leading-relaxed text-steel-light">
              Yoqilganda kirish uchun parol + Google Authenticator/Authy ilovasidagi 6 xonali kod
              kerak bo'ladi. Parol o'g'irlansa ham hisobingiz himoyada qoladi.
            </p>

            {mfaMsg && <p className="mt-3 font-mono text-xs text-matrix-bright">{mfaMsg}</p>}

            {/* Enroll jarayoni: QR + kod tasdiqlash */}
            {enrollQr ? (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap items-start gap-5">
                  {enrollQr.trimStart().startsWith('data:') ? (
                    <img
                      src={enrollQr}
                      alt="2FA QR"
                      className="w-40 shrink-0 border-4 border-white bg-white"
                    />
                  ) : (
                    <div
                      className="w-40 shrink-0 border-4 border-white bg-white [&_svg]:h-full [&_svg]:w-full"
                      dangerouslySetInnerHTML={{ __html: enrollQr }}
                    />
                  )}
                  <div className="min-w-[220px] flex-1 space-y-2 font-mono text-xs text-steel-light">
                    <p>1. Google Authenticator yoki Authy ilovasini oching</p>
                    <p>2. QR kodni skanerlang, yoki qo'lda kiriting:</p>
                    <p className="break-all border border-steel-dim/50 bg-navy-900/40 p-2 text-amber-bright">
                      {enrollSecret}
                    </p>
                    <p>3. Ilova bergan 6 xonali kodni pastga yozing</p>
                  </div>
                </div>
                <form onSubmit={confirmEnroll} className="flex flex-wrap items-center gap-3">
                  <input
                    inputMode="numeric"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="cyber-input w-40 text-center text-xl tracking-[0.4em]"
                    placeholder="000000"
                  />
                  <CyberButton type="submit" size="sm" disabled={mfaBusy}>
                    {mfaBusy ? 'tekshirilmoqda...' : 'tasdiqlash ✔'}
                  </CyberButton>
                  <CyberButton
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEnrollQr(null)
                      setEnrollSecret(null)
                      setEnrollId(null)
                      setMfaCode('')
                    }}
                  >
                    bekor qilish
                  </CyberButton>
                </form>
              </div>
            ) : (
              <div className="mt-5">
                {mfaEnabled ? (
                  <CyberButton size="sm" variant="amber" onClick={disableMfa} disabled={mfaBusy}>
                    2FA ni o'chirish
                  </CyberButton>
                ) : (
                  <CyberButton size="sm" onClick={startEnroll} disabled={mfaBusy}>
                    {mfaBusy ? 'tayyorlanmoqda...' : '🛡 2FA ni yoqish'}
                  </CyberButton>
                )}
              </div>
            )}
          </div>
        </Reveal>

        {/* ============ PAROL ============ */}
        <Reveal delay={0.1}>
          <form onSubmit={changePassword} className="clip-corner border border-steel-dim/50 bg-panel/70 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-matrix">
              // parolni o'zgartirish
            </p>
            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--yangi parol</label>
                <input
                  type="password"
                  value={pass1}
                  onChange={(e) => setPass1(e.target.value)}
                  className="cyber-input"
                  placeholder="kamida 8 belgi"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs text-matrix">--takrorlang</label>
                <input
                  type="password"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  className="cyber-input"
                  placeholder="yana bir marta"
                  autoComplete="new-password"
                />
              </div>
              {passMsg && <p className="font-mono text-xs text-amber-bright">{passMsg}</p>}
              <CyberButton type="submit" disabled={passSaving} size="sm">
                {passSaving ? 'yangilanmoqda...' : 'parolni yangilash ✔'}
              </CyberButton>
            </div>
          </form>
        </Reveal>
      </div>
    </PageTransition>
  )
}
