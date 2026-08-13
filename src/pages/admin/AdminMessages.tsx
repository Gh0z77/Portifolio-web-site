import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import type { ContactMessage } from '../../types'
import PageTransition from '../../components/PageTransition'
import DecodeText from '../../components/ui/DecodeText'
import Tag from '../../components/ui/Tag'
import Loader from '../../components/Loader'
import { cn, formatDate, truncate } from '../../lib/utils'

type LayoutCtx = { refreshUnread: () => void }

export default function AdminMessages() {
  const { refreshUnread } = useOutletContext<LayoutCtx>()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySaving, setReplySaving] = useState(false)
  const [replyMsg, setReplyMsg] = useState<string | null>(null)

  const load = () => {
    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMessages((data as ContactMessage[]) ?? [])
        setLoading(false)
      })
  }

  useEffect(() => {
    document.title = 'Xabarlar — GHOST Admin'
    load()
  }, [])

  const markRead = async (m: ContactMessage) => {
    if (m.read) return
    await supabase.from('messages').update({ read: true }).eq('id', m.id)
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)))
    refreshUnread()
  }

  const remove = async (m: ContactMessage) => {
    if (!confirm(`"${m.name}" yuborgan xabarni o'chirasizmi?`)) return
    await supabase.from('messages').delete().eq('id', m.id)
    setMessages((prev) => prev.filter((x) => x.id !== m.id))
    refreshUnread()
  }

  const toggle = (m: ContactMessage) => {
    setOpenId((cur) => (cur === m.id ? null : m.id))
    setReplyText(m.reply ?? '')
    setReplyMsg(null)
    markRead(m)
  }

  /** Javobni bazaga saqlash */
  const saveReply = async (m: ContactMessage) => {
    setReplySaving(true)
    setReplyMsg(null)
    const { error } = await supabase
      .from('messages')
      .update({ reply: replyText.trim() || null, replied_at: replyText.trim() ? new Date().toISOString() : null })
      .eq('id', m.id)
    setReplySaving(false)
    if (error) {
      setReplyMsg(`[XATO] ${error.message}`)
    } else {
      setMessages((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, reply: replyText.trim() || null } : x))
      )
      setReplyMsg('[OK] javob saqlandi ✔')
    }
  }

  /** Telegram orqali: javob matnini nusxalab, chatni ochish */
  const sendViaTelegram = async (m: ContactMessage) => {
    try {
      await navigator.clipboard.writeText(replyText)
      setReplyMsg('[OK] javob nusxalandi — Telegram chatga tashlang ✔')
    } catch {
      setReplyMsg('[!] nusxalab bo\'lmadi — matnni qo\'lda ko\'chiring')
    }
    window.open(`https://t.me/${(m.telegram ?? '').replace(/^@/, '')}`, '_blank')
  }

  const visible = filter === 'all' ? messages : messages.filter((m) => !m.read)

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DecodeText
          as="h1"
          text="XABARLAR"
          className="font-display text-2xl font-bold uppercase tracking-wider text-ghost md:text-3xl"
        />
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              data-hover
              onClick={() => setFilter(f)}
              className={cn(
                'clip-corner-sm border px-4 py-1.5 font-mono text-xs transition-all duration-300',
                filter === f
                  ? 'border-matrix bg-matrix text-on-matrix'
                  : 'border-steel-dim text-steel-light hover:border-matrix hover:text-matrix-bright'
              )}
            >
              {f === 'all' ? 'barchasi' : "o'qilmagan"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : visible.length === 0 ? (
        <div className="mt-10 clip-corner border border-steel-dim/50 bg-panel/60 p-10 text-center font-mono text-sm text-steel">
          // inbox bo'sh
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {visible.map((m) => {
            const open = openId === m.id
            return (
              <div
                key={m.id}
                className={cn(
                  'border bg-panel/70 transition-colors duration-300',
                  !m.read ? 'border-l-2 border-matrix border-y-steel-dim/50 border-r-steel-dim/50' : 'border-steel-dim/50',
                  open && 'border-matrix/60'
                )}
              >
                <button
                  data-hover
                  onClick={() => toggle(m)}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 text-left"
                >
                  <span className={cn('font-mono text-sm font-bold', m.read ? 'text-steel-light' : 'text-ghost')}>
                    {m.name}
                  </span>
                  {!m.read && <Tag color="green">yangi</Tag>}
                  {m.reply && <Tag color="amber">javob berilgan</Tag>}
                  {(m.email || m.telegram) && (
                    <span className="font-mono text-xs text-steel">{m.email || m.telegram}</span>
                  )}
                  <span className="hidden flex-1 truncate font-mono text-xs text-steel md:block">
                    {truncate(m.subject || m.body, 80)}
                  </span>
                  <span className="ml-auto font-mono text-[11px] text-steel">{formatDate(m.created_at)}</span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-steel-dim/40 px-5 py-4">
                        {m.subject && (
                          <p className="mb-2 font-mono text-xs text-amber-bright">
                            <span className="text-steel">mavzu:</span> {m.subject}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-steel-light">
                          {m.body}
                        </p>
                        {/* ============ JAVOB YOZISH ============ */}
                        <div className="mt-5 border-t border-steel-dim/40 pt-4">
                          <label className="mb-1.5 block font-mono text-xs text-matrix">
                            --javob yozish
                          </label>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                            className="cyber-input resize-y"
                            placeholder="Javobingizni yozing..."
                          />
                          {replyMsg && (
                            <p className="mt-2 font-mono text-xs text-matrix-bright">{replyMsg}</p>
                          )}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              data-hover
                              disabled={replySaving}
                              onClick={() => saveReply(m)}
                              className="clip-corner-sm border border-matrix px-4 py-2 font-mono text-xs text-matrix-bright transition-all hover:bg-matrix hover-text-on-matrix disabled:opacity-40"
                            >
                              {replySaving ? 'saqlanmoqda...' : '✔ javobni saqlash'}
                            </button>
                            {m.email && (
                              <a
                                data-hover
                                href={`mailto:${m.email}?subject=${encodeURIComponent(
                                  `Re: ${m.subject || 'Xabaringizga javob'}`
                                )}&body=${encodeURIComponent(replyText)}`}
                                className="clip-corner-sm border border-steel-dim px-4 py-2 font-mono text-xs text-steel-light transition-all hover:border-matrix hover:text-matrix-bright"
                              >
                                ✉ email orqali yuborish
                              </a>
                            )}
                            {m.telegram && (
                              <button
                                data-hover
                                onClick={() => sendViaTelegram(m)}
                                className="clip-corner-sm border border-steel-dim px-4 py-2 font-mono text-xs text-steel-light transition-all hover:border-matrix hover:text-matrix-bright"
                              >
                                ✈ telegramda yuborish
                              </button>
                            )}
                            <button
                              data-hover
                              onClick={() => remove(m)}
                              className="ml-auto font-mono text-xs text-steel transition-colors hover:text-amber-bright"
                            >
                              ✕ o'chirish
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
    </PageTransition>
  )
}
