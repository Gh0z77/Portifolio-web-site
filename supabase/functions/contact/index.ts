// GHOST Portfolio — kontakt forma funksiyasi
// Xabarni bazaga yozadi va Telegram orqali egasiga yuboradi.

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let payload: {
    name?: string
    email?: string
    telegram?: string
    subject?: string
    body?: string
    website?: string // honeypot — odam to'ldirmaydi
    test?: boolean
  }
  try {
    payload = await req.json()
  } catch {
    return json({ error: "Noto'g'ri so'rov" }, 400)
  }

  // Honeypot: bot to'ldirgan bo'lsa jimgina "muvaffaqiyat" qaytaramiz
  if (payload.website && payload.website.trim() !== '') {
    return json({ ok: true })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const isTest = payload.test === true

  if (!isTest) {
    const name = (payload.name ?? '').trim()
    const body = (payload.body ?? '').trim()
    if (name.length < 2 || name.length > 120) {
      return json({ error: 'Ismingizni kiriting (kamida 2 belgi)' }, 400)
    }
    if (body.length < 5 || body.length > 4000) {
      return json({ error: 'Xabar matni juda qisqa yoki juda uzun' }, 400)
    }

    const { error: insertError } = await supabase.from('messages').insert({
      name,
      email: (payload.email ?? '').trim() || null,
      telegram: (payload.telegram ?? '').trim() || null,
      subject: (payload.subject ?? '').trim() || null,
      body,
    })
    if (insertError) {
      console.error('DB insert error:', insertError)
      return json({ error: 'Xabarni saqlashda xatolik yuz berdi' }, 500)
    }
  }

  // Telegram sozlamalarini o'qish
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['telegram_bot_token', 'telegram_chat_id'])

  const token = settings?.find((s) => s.key === 'telegram_bot_token')?.value?.trim()
  const chatId = settings?.find((s) => s.key === 'telegram_chat_id')?.value?.trim()

  if (!token || !chatId) {
    // Telegram sozlanmagan — xabar bazada saqlandi, bu ham muvaffaqiyat
    return json({ ok: true, telegram: 'not_configured' })
  }

  const lines = isTest
    ? [
        '🧪 <b>Test xabari</b>',
        '',
        'Telegram bot muvaffaqiyatli ulandi! ✅',
        'Endi saytdan kelgan xabarlar shu yerga tushadi.',
      ]
    : [
        '📬 <b>Saytdan yangi xabar!</b>',
        '',
        `👤 <b>Ism:</b> ${esc(payload.name ?? '')}`,
        payload.email ? `📧 <b>Email:</b> ${esc(payload.email)}` : '',
        payload.telegram ? `💬 <b>Telegram:</b> ${esc(payload.telegram)}` : '',
        payload.subject ? `📌 <b>Mavzu:</b> ${esc(payload.subject)}` : '',
        '',
        `📝 ${esc(payload.body ?? '')}`,
      ].filter((l) => l !== '')

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
      }),
    })
    const tgData = await tgRes.json()
    if (!tgData.ok) {
      console.error('Telegram error:', tgData)
      return json({ ok: true, telegram: 'failed', detail: tgData.description })
    }
  } catch (e) {
    console.error('Telegram fetch error:', e)
    return json({ ok: true, telegram: 'failed' })
  }

  return json({ ok: true, telegram: 'sent' })
})
