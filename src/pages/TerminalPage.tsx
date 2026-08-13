import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useI18n } from '../lib/i18n'
import { l10n } from '../lib/l10n'
import { playTypeTick, playClick, playExplosion } from '../lib/sound'
import PageTransition from '../components/PageTransition'
import type { Project, Service, BlogPost } from '../types'
import type { Lang } from '../lib/translations'

/**
 * Virtual terminal — mehmonlar buyruq yozib sayt bilan "gaplashadi".
 * Barcha javob matnlari 3 tilda (tr.term), buyruq nomlari universal.
 */

interface Line {
  text: string
  kind: 'in' | 'out' | 'ok' | 'err' | 'accent'
}

const GHOST_ART = [
  ' ██████  ██   ██  ██████  ███████ ████████',
  '██       ██   ██ ██    ██ ██         ██',
  '██   ███ ███████ ██    ██ ███████    ██',
  '██    ██ ██   ██ ██    ██      ██    ██',
  ' ██████  ██   ██  ██████  ███████    ██',
]

const PAGES = ['home', 'about', 'services', 'portfolio', 'blog', 'contact', 'terminal']
const HACK_DELAYS = [500, 700, 800, 900, 600]

export default function TerminalPage() {
  const { tr, lang, setLang, links } = useI18n()
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `Terminal — ${links.siteName}`
  }, [links.siteName])

  // Xush kelibsiz banneri
  useEffect(() => {
    setLines([
      ...GHOST_ART.map((t) => ({ text: t, kind: 'accent' as const })),
      { text: '', kind: 'out' },
      { text: tr.term.welcome1.replace('{site}', links.siteName), kind: 'ok' },
      { text: tr.term.welcome2, kind: 'out' },
      { text: '', kind: 'out' },
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Har yangi qatordan keyin pastga scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const print = (text: string, kind: Line['kind'] = 'out') =>
    setLines((prev) => [...prev, { text, kind }])

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

  const run = async (raw: string) => {
    const cmdLine = raw.trim()
    print(`visitor@${links.siteName.toLowerCase()}:~$ ${cmdLine}`, 'in')
    if (!cmdLine) return

    setHistory((h) => [cmdLine, ...h].slice(0, 50))
    setHistIdx(-1)

    const [cmd, ...args] = cmdLine.split(/\s+/)
    const arg = args.join(' ')

    switch (cmd.toLowerCase()) {
      case 'help':
        tr.term.help.forEach((line) => print(line, 'out'))
        break

      case 'whoami':
        print(tr.term.whoami, 'ok')
        break

      case 'ls':
        print(PAGES.map((p) => `./${p}`).join('   '), 'accent')
        break

      case 'cd':
      case 'goto': {
        const page = arg.replace(/^\.?\//, '').toLowerCase()
        if (page === 'home' || page === '~' || page === '') {
          navigate('/')
        } else if (PAGES.includes(page) && page !== 'terminal') {
          navigate(`/${page}`)
        } else if (page === 'admin') {
          print(tr.term.denied, 'err')
        } else {
          print(tr.term.noPage.replace('{x}', arg), 'err')
        }
        break
      }

      case 'projects': {
        setBusy(true)
        const { data } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })
        setBusy(false)
        const projects = (data as Project[]) ?? []
        if (!projects.length) {
          print(tr.term.noProjects, 'err')
        } else {
          projects.forEach((p) =>
            print(`▣ ${p.title}  [${p.tech_stack.slice(0, 3).join(', ')}]  → open ${p.slug}`, 'out')
          )
        }
        break
      }

      case 'open': {
        if (!arg) {
          print(tr.term.openHint, 'err')
          break
        }
        navigate(`/portfolio/${arg}`)
        break
      }

      case 'services': {
        setBusy(true)
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('active', true)
          .order('sort_order', { ascending: true })
        setBusy(false)
        const services = (data as Service[]) ?? []
        services.forEach((s) => print(`⚙ ${l10n(s, 'title', lang)}`, 'out'))
        if (services.length) print(tr.term.servicesMore, 'accent')
        else print(tr.term.noServices, 'err')
        break
      }

      case 'blog': {
        setBusy(true)
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
        setBusy(false)
        const posts = (data as BlogPost[]) ?? []
        if (!posts.length) {
          print(tr.term.noPosts, 'err')
        } else {
          posts.forEach((p) => print(`✎ ${l10n(p, 'title', lang)}  → read ${p.slug}`, 'out'))
        }
        break
      }

      case 'read': {
        if (!arg) {
          print(tr.term.readHint, 'err')
          break
        }
        navigate(`/blog/${arg}`)
        break
      }

      case 'contact':
        print(`email    : ${links.email}`, 'out')
        print(`telegram : ${links.telegramUser}  (${links.telegram})`, 'out')
        print(`github   : ${links.github}`, 'out')
        print(tr.term.formHint, 'accent')
        break

      case 'telegram':
        window.open(links.telegram, '_blank')
        print(tr.term.tgOpening, 'ok')
        break

      case 'github':
        window.open(links.github, '_blank')
        print(tr.term.ghOpening, 'ok')
        break

      case 'lang': {
        const l = arg.toLowerCase() as Lang
        if (['uz', 'ru', 'en'].includes(l)) {
          setLang(l)
          print(tr.term.langOk.replace('{x}', l.toUpperCase()), 'ok')
        } else {
          print(tr.term.langErr, 'err')
        }
        break
      }

      case 'date':
        print(new Date().toLocaleString(), 'out')
        break

      case 'echo':
        print(arg || '', 'out')
        break

      case 'clear':
        setLines([])
        break

      case 'sudo':
        print(tr.term.sudo, 'err')
        break

      case 'hack': {
        setBusy(true)
        for (let i = 0; i < tr.term.hack.length; i++) {
          print(tr.term.hack[i], i === 0 ? 'accent' : i === tr.term.hack.length - 1 ? 'err' : 'out')
          await wait(HACK_DELAYS[i] ?? 700)
        }
        playExplosion()
        print('...', 'out')
        await wait(500)
        print(tr.term.hackDone, 'ok')
        setBusy(false)
        break
      }

      case 'matrix':
        print(tr.term.matrix, 'accent')
        break

      case 'ghost':
        GHOST_ART.forEach((t) => print(t, 'accent'))
        print(tr.term.boo, 'ok')
        break

      case 'exit':
        print(tr.term.exit, 'out')
        break

      default:
        print(tr.term.notFound.replace('{x}', cmd), 'err')
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !busy) {
      playClick()
      const value = input
      setInput('')
      run(value)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, history.length - 1)
      if (history[idx] !== undefined) {
        setHistIdx(idx)
        setInput(history[idx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = histIdx - 1
      setHistIdx(Math.max(idx, -1))
      setInput(idx >= 0 ? history[idx] : '')
    } else if (e.key.length === 1) {
      playTypeTick()
    }
  }

  const color = (kind: Line['kind']) =>
    kind === 'in'
      ? 'text-ghost'
      : kind === 'ok'
        ? 'text-matrix-bright'
        : kind === 'err'
          ? 'text-amber-bright'
          : kind === 'accent'
            ? 'text-matrix'
            : 'text-steel-light'

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-5 py-10 md:py-16">
        <div
          data-hover
          onClick={() => inputRef.current?.focus()}
          className="clip-corner border border-steel-dim/60 glass shadow-glow-navy"
        >
          {/* Sarlavha paneli */}
          <div className="flex items-center gap-2 border-b border-steel-dim/50 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-amber/80" />
            <span className="h-3 w-3 rounded-full bg-matrix/80" />
            <span className="h-3 w-3 rounded-full bg-steel/80" />
            <span className="ml-3 font-mono text-xs text-steel">
              visitor@{links.siteName.toLowerCase()}: interactive_shell
            </span>
          </div>

          {/* Chiqish maydoni */}
          <div
            ref={scrollRef}
            className="h-[55vh] overflow-y-auto p-4 font-mono text-xs leading-relaxed md:p-5 md:text-sm"
          >
            {lines.map((line, i) => (
              <p key={i} className={`whitespace-pre-wrap break-words ${color(line.kind)}`}>
                {line.text || ' '}
              </p>
            ))}
            {busy && (
              <p className="text-matrix animate-pulse">
                {tr.term.working}
                <span className="animate-blink">...</span>
              </p>
            )}

            {/* Kirish qatori */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-matrix-bright">
                visitor@{links.siteName.toLowerCase()}:~$
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={busy}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full flex-1 border-none bg-transparent font-mono text-xs text-ghost outline-none md:text-sm"
                aria-label="terminal input"
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[11px] text-steel">{tr.term.tip}</p>
      </div>
    </PageTransition>
  )
}
