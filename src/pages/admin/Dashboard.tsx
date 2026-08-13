import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, ADMIN_DASH } from '../../lib/supabase'
import type { ContactMessage } from '../../types'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import CyberCard from '../../components/ui/CyberCard'
import CyberButton from '../../components/ui/CyberButton'
import Reveal from '../../components/ui/Reveal'
import { formatDate, truncate } from '../../lib/utils'

interface Stats {
  projects: number
  posts: number
  services: number
  unread: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, posts: 0, services: 0, unread: 0 })
  const [recent, setRecent] = useState<ContactMessage[]>([])

  useEffect(() => {
    document.title = 'Dashboard — GHOST Admin'
    const count = (table: string, filter?: (q: any) => any) => {
      let q: any = supabase.from(table).select('id', { count: 'exact', head: true })
      if (filter) q = filter(q)
      return q.then(({ count: c }: { count: number | null }) => c ?? 0)
    }
    Promise.all([
      count('projects'),
      count('blog_posts'),
      count('services'),
      count('messages', (q) => q.eq('read', false)),
    ]).then(([projects, posts, services, unread]) =>
      setStats({ projects, posts, services, unread })
    )
    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setRecent((data as ContactMessage[]) ?? []))
  }, [])

  const CARDS: { label: string; value: number; to: string; accent: boolean }[] = [
    { label: 'loyihalar', value: stats.projects, to: `${ADMIN_DASH}/projects`, accent: false },
    { label: 'blog postlar', value: stats.posts, to: `${ADMIN_DASH}/blog`, accent: true },
    { label: 'xizmatlar', value: stats.services, to: `${ADMIN_DASH}/services`, accent: false },
    { label: "o'qilmagan xabar", value: stats.unread, to: `${ADMIN_DASH}/messages`, accent: true },
  ]

  return (
    <PageTransition>
      <DecodeText
        as="h1"
        text="BOSHQARUV PANELI"
        className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
      />
      <p className="mt-2 font-mono text-xs text-steel">
        <span className="text-amber">❯</span> bugun: {formatDate(new Date().toISOString())} — xush kelibsiz, GHOST
      </p>

      {/* Statistika */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <Link to={c.to} data-hover className="block">
              <CyberCard tilt={false} className="p-5">
                <p
                  className={`font-display text-4xl font-bold ${
                    c.accent ? 'text-amber-bright text-glow-amber' : 'text-matrix-bright text-glow-green'
                  }`}
                >
                  {c.value}
                </p>
                <p className="mt-1.5 font-mono text-xs text-steel-light">{c.label}</p>
              </CyberCard>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* So'nggi xabarlar */}
      <Reveal delay={0.2}>
        <div className="mt-10 clip-corner border border-steel-dim/50 bg-panel/70">
          <div className="flex items-center justify-between border-b border-steel-dim/40 px-5 py-3">
            <p className="font-mono text-xs uppercase tracking-widest text-matrix">// so'nggi xabarlar</p>
            <Link
              to={`${ADMIN_DASH}/messages`}
              data-hover
              className="font-mono text-xs text-steel-light hover:text-matrix-bright"
            >
              barchasi →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-center font-mono text-xs text-steel">// xabarlar yo'q</p>
          ) : (
            <ul className="divide-y divide-steel-dim/30">
              {recent.map((m) => (
                <li key={m.id}>
                  <Link
                    to={`${ADMIN_DASH}/messages`}
                    data-hover
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-navy-900/40"
                  >
                    {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-matrix shadow-glow-green" />}
                    <span className={`font-mono text-sm ${m.read ? 'text-steel-light' : 'text-ghost'}`}>
                      {m.name}
                    </span>
                    <span className="hidden flex-1 truncate font-mono text-xs text-steel md:block">
                      {truncate(m.subject || m.body, 70)}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[11px] text-steel">
                      {formatDate(m.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      {/* Tezkor amallar */}
      <Reveal delay={0.3}>
        <div className="mt-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-matrix">// tezkor amallar</p>
          <div className="flex flex-wrap gap-3">
            <CyberButton to={`${ADMIN_DASH}/projects`} size="sm">
              ＋ yangi loyiha
            </CyberButton>
            <CyberButton to={`${ADMIN_DASH}/blog`} size="sm" variant="amber">
              ＋ yangi post
            </CyberButton>
            <CyberButton to={`${ADMIN_DASH}/settings`} size="sm" variant="ghost">
              ⚡ telegram sozlash
            </CyberButton>
          </div>
        </div>
      </Reveal>
    </PageTransition>
  )
}
