import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PageView } from '../../types'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import Reveal from '../../components/ui/Reveal'
import Loader from '../../components/Loader'

/** Sanani DD.MM ko'rinishida */
const dayLabel = (d: Date) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`

/** Mahalliy kun boshlanishi */
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export default function AdminStats() {
  const [rows, setRows] = useState<PageView[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Statistika — GHOST Admin'
    const since = new Date(Date.now() - 30 * 86400_000).toISOString()
    Promise.all([
      supabase
        .from('page_views')
        .select('path, visitor, lang, device, referrer, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(20000),
      supabase.from('page_views').select('id', { count: 'exact', head: true }),
    ]).then(([{ data }, { count }]) => {
      setRows((data as PageView[]) ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    })
  }, [])

  const stats = useMemo(() => {
    const now = new Date()
    const todayStart = startOfDay(now).getTime()
    const d7 = now.getTime() - 7 * 86400_000
    const agg = {
      today: 0,
      week: 0,
      month: rows.length,
      uniq30: new Set<string>(),
      uniqToday: new Set<string>(),
      pages: new Map<string, number>(),
      langs: new Map<string, number>(),
      devices: new Map<string, number>(),
      refs: new Map<string, number>(),
      daily: [] as { label: string; views: number; uniq: number }[],
    }
    // Oxirgi 14 kun uchun bo'sh kunlar
    const dayMap = new Map<string, { views: number; uniq: Set<string> }>()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(todayStart - i * 86400_000)
      dayMap.set(dayLabel(d), { views: 0, uniq: new Set() })
    }

    for (const r of rows) {
      const t = new Date(r.created_at).getTime()
      if (t >= todayStart) {
        agg.today++
        if (r.visitor) agg.uniqToday.add(r.visitor)
      }
      if (t >= d7) agg.week++
      if (r.visitor) agg.uniq30.add(r.visitor)
      agg.pages.set(r.path, (agg.pages.get(r.path) ?? 0) + 1)
      if (r.lang) agg.langs.set(r.lang, (agg.langs.get(r.lang) ?? 0) + 1)
      if (r.device) agg.devices.set(r.device, (agg.devices.get(r.device) ?? 0) + 1)
      if (r.referrer) {
        let host = r.referrer
        try {
          host = new URL(r.referrer).hostname
        } catch {
          /* oddiy matn */
        }
        agg.refs.set(host, (agg.refs.get(host) ?? 0) + 1)
      }
      const label = dayLabel(new Date(t))
      const day = dayMap.get(label)
      if (day) {
        day.views++
        if (r.visitor) day.uniq.add(r.visitor)
      }
    }

    agg.daily = Array.from(dayMap.entries()).map(([label, v]) => ({
      label,
      views: v.views,
      uniq: v.uniq.size,
    }))
    return agg
  }, [rows])

  const maxDay = Math.max(1, ...stats.daily.map((d) => d.views))
  const sortDesc = (m: Map<string, number>) =>
    Array.from(m.entries()).sort((a, b) => b[1] - a[1])

  const cards = [
    { label: 'bugun (tashrif)', value: stats.today, sub: `${stats.uniqToday.size} noyob mehmon` },
    { label: '7 kun', value: stats.week, sub: '' },
    { label: '30 kun', value: stats.month, sub: `${stats.uniq30.size} noyob mehmon` },
    { label: 'jami (boshidan)', value: total, sub: '' },
  ]

  return (
    <PageTransition>
      <DecodeText
        as="h1"
        text="STATISTIKA"
        className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
      />
      <p className="mt-2 font-mono text-xs text-steel">
        <span className="text-amber">❯</span> tail -f /var/log/visitors.log
      </p>

      {loading ? (
        <Loader />
      ) : (
        <div className="mt-8 space-y-8">
          {/* ============ ASOSIY RAQAMLAR ============ */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.07}>
                <div className="clip-corner-sm border border-steel-dim/50 bg-panel/80 p-5">
                  <p
                    className={`font-display text-3xl font-bold md:text-4xl ${
                      i % 2 === 0 ? 'text-matrix-bright text-glow-green' : 'text-amber-bright text-glow-amber'
                    }`}
                  >
                    {c.value}
                  </p>
                  <p className="mt-1.5 font-mono text-xs text-steel-light">{c.label}</p>
                  {c.sub && <p className="mt-0.5 font-mono text-[11px] text-steel">{c.sub}</p>}
                </div>
              </Reveal>
            ))}
          </div>

          {/* ============ 14 KUNLIK GRAFIK ============ */}
          <Reveal>
            <div className="clip-corner border border-steel-dim/50 bg-panel/80 p-6">
              <p className="mb-5 font-mono text-xs uppercase tracking-widest text-matrix">
                // oxirgi 14 kun
              </p>
              <div className="flex h-36 items-end gap-1.5 md:gap-2">
                {stats.daily.map((d) => (
                  <div key={d.label} className="group relative flex flex-1 flex-col items-center gap-1">
                    <span className="pointer-events-none absolute -top-8 hidden whitespace-nowrap border border-steel-dim bg-bg px-2 py-0.5 font-mono text-[10px] text-ghost group-hover:block">
                      {d.views} tashrif · {d.uniq} mehmon
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-matrix-dim to-matrix transition-all duration-300 group-hover:to-matrix-bright"
                      style={{
                        height: `${Math.max(3, (d.views / maxDay) * 110)}px`,
                        boxShadow: d.views > 0 ? '0 0 6px rgb(var(--clr-matrix) / 0.4)' : 'none',
                      }}
                    />
                    <span className="font-mono text-[9px] text-steel md:text-[10px]">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* ============ TOP SAHIFALAR ============ */}
            <Reveal>
              <div className="clip-corner border border-steel-dim/50 bg-panel/80 p-6">
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-matrix">
                  // eng ko'p ochilgan sahifalar (30 kun)
                </p>
                {stats.pages.size === 0 ? (
                  <p className="font-mono text-xs text-steel">// hali tashriflar yo'q</p>
                ) : (
                  <div className="space-y-2.5">
                    {sortDesc(stats.pages).slice(0, 7).map(([path, n]) => (
                      <div key={path} className="flex items-center gap-3">
                        <span className="w-32 truncate font-mono text-xs text-steel-light md:w-44">
                          {path === '/' ? '/ (bosh)' : path}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden bg-navy-900">
                          <div
                            className="h-full bg-gradient-to-r from-matrix-dim to-matrix"
                            style={{ width: `${(n / stats.month) * 100}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-xs text-amber-bright">{n}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            {/* ============ TIL / QURILMA ============ */}
            <Reveal delay={0.07}>
              <div className="clip-corner border border-steel-dim/50 bg-panel/80 p-6">
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-matrix">
                  // til va qurilma (30 kun)
                </p>
                <div className="space-y-2.5">
                  {sortDesc(stats.langs).map(([lang, n]) => (
                    <div key={lang} className="flex items-center gap-3">
                      <span className="w-20 font-mono text-xs uppercase text-steel-light">🌐 {lang}</span>
                      <div className="h-2 flex-1 overflow-hidden bg-navy-900">
                        <div
                          className="h-full bg-gradient-to-r from-matrix-dim to-matrix"
                          style={{ width: `${(n / Math.max(1, stats.month)) * 100}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-mono text-xs text-amber-bright">
                        {Math.round((n / Math.max(1, stats.month)) * 100)}%
                      </span>
                    </div>
                  ))}
                  <div className="!mt-5 border-t border-steel-dim/40 pt-4" />
                  {sortDesc(stats.devices).map(([device, n]) => (
                    <div key={device} className="flex items-center gap-3">
                      <span className="w-20 font-mono text-xs text-steel-light">
                        {device === 'mobile' ? '📱 telefon' : '🖥 kompyuter'}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden bg-navy-900">
                        <div
                          className="h-full bg-gradient-to-r from-amber-dim to-amber"
                          style={{ width: `${(n / Math.max(1, stats.month)) * 100}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-mono text-xs text-amber-bright">
                        {Math.round((n / Math.max(1, stats.month)) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* ============ QAYERDAN KELISHGAN ============ */}
          <Reveal>
            <div className="clip-corner border border-steel-dim/50 bg-panel/80 p-6">
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-matrix">
                // qayerdan kelishgan (referrer, 30 kun)
              </p>
              {stats.refs.size === 0 ? (
                <p className="font-mono text-xs text-steel">
                  // to'g'ridan-to'g'ri kirishlar — havola orqali kelganlar hali yo'q
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sortDesc(stats.refs).slice(0, 10).map(([host, n]) => (
                    <span
                      key={host}
                      className="border border-steel-dim px-3 py-1.5 font-mono text-xs text-steel-light"
                    >
                      {host} <span className="text-amber-bright">×{n}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      )}
    </PageTransition>
  )
}
