// Bir martalik migratsiya funksiyasi — sxema va boshlang'ich ma'lumotlarni o'rnatadi.
// Himoya: x-setup-key sarlavhasi service_role kalitiga teng bo'lishi shart.

import postgres from 'npm:postgres@3.4.4'

const SCHEMA_SQL = `
create or replace function public.is_admin()
returns boolean
language sql stable
as $fn$
  select coalesce((auth.jwt() ->> 'email') = 'ghost@gmail.com', false)
$fn$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $fn$
begin
  new.updated_at = now();
  return new;
end $fn$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  content text,
  image_url text,
  tech_stack text[] not null default '{}',
  live_url text,
  github_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects for select using (true);
drop policy if exists "projects_admin_insert" on public.projects;
create policy "projects_admin_insert" on public.projects for insert with check (public.is_admin());
drop policy if exists "projects_admin_update" on public.projects;
create policy "projects_admin_update" on public.projects for update using (public.is_admin());
drop policy if exists "projects_admin_delete" on public.projects;
create policy "projects_admin_delete" on public.projects for delete using (public.is_admin());

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
for each row execute function public.set_updated_at();

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_url text,
  tags text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;

drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts for select using (published = true or public.is_admin());
drop policy if exists "blog_admin_insert" on public.blog_posts;
create policy "blog_admin_insert" on public.blog_posts for insert with check (public.is_admin());
drop policy if exists "blog_admin_update" on public.blog_posts;
create policy "blog_admin_update" on public.blog_posts for update using (public.is_admin());
drop policy if exists "blog_admin_delete" on public.blog_posts;
create policy "blog_admin_delete" on public.blog_posts for delete using (public.is_admin());

drop trigger if exists trg_blog_updated on public.blog_posts;
create trigger trg_blog_updated before update on public.blog_posts
for each row execute function public.set_updated_at();

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  price text,
  sort_order int not null default 0,
  active boolean not null default true
);
alter table public.services enable row level security;

drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services for select using (active = true or public.is_admin());
drop policy if exists "services_admin_insert" on public.services;
create policy "services_admin_insert" on public.services for insert with check (public.is_admin());
drop policy if exists "services_admin_update" on public.services;
create policy "services_admin_update" on public.services for update using (public.is_admin());
drop policy if exists "services_admin_delete" on public.services;
create policy "services_admin_delete" on public.services for delete using (public.is_admin());

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  telegram text,
  subject text,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;

drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages for insert with check (true);
drop policy if exists "messages_admin_read" on public.messages;
create policy "messages_admin_read" on public.messages for select using (public.is_admin());
drop policy if exists "messages_admin_update" on public.messages;
create policy "messages_admin_update" on public.messages for update using (public.is_admin());
drop policy if exists "messages_admin_delete" on public.messages;
create policy "messages_admin_delete" on public.messages for delete using (public.is_admin());

create table if not exists public.site_settings (
  key text primary key,
  value text
);
alter table public.site_settings enable row level security;

drop policy if exists "settings_admin_all" on public.site_settings;
create policy "settings_admin_all" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (key, value) values
  ('telegram_bot_token', ''),
  ('telegram_chat_id', '')
on conflict (key) do nothing;

insert into public.services (title, description, icon, price, sort_order)
select * from (values
  ('Web sayt yaratish', 'Landing page, korporativ sayt yoki internet-do''kon — zamonaviy dizayn, tez ishlash va SEO bilan.', 'globe', 'kelishilgan holda', 1),
  ('Telegram bot dasturlash', 'Do''kon botlari, buyurtma qabul qilish, CRM integratsiya va biznes jarayonlarini avtomatlashtirish.', 'bot', 'kelishilgan holda', 2),
  ('Web ilovalar (SPA/PWA)', 'React asosida murakkab interaktiv ilovalar: admin panellar, dashboardlar, ichki tizimlar.', 'code', 'kelishilgan holda', 3),
  ('Backend va API', 'Supabase, Node.js, ma''lumotlar bazasi loyihalash va xavfsiz API''lar qurish.', 'server', 'kelishilgan holda', 4),
  ('Texnik qo''llab-quvvatlash', 'Mavjud loyihalarni rivojlantirish, xatolarni tuzatish va yangi funksiyalar qo''shish.', 'wrench', 'kelishilgan holda', 5)
) as v(title, description, icon, price, sort_order)
where not exists (select 1 from public.services);

insert into public.projects (title, slug, description, content, tech_stack, featured, sort_order) values
  (
    'GHOST Portfolio',
    'ghost-portfolio',
    'Cyberpunk uslubidagi shaxsiy portfolio — siz hozir ko''rib turgan sayt. React, Supabase va Framer Motion bilan qurilgan.',
    E'## Loyiha haqida\\n\\nBu sayt to''liq **React + TypeScript** asosida qurilgan bo''lib, backend sifatida **Supabase** ishlatiladi.\\n\\n### Texnologiyalar\\n\\n- Vite + React 18\\n- Tailwind CSS\\n- Framer Motion animatsiyalar\\n- Supabase (baza, auth, edge functions)\\n- Telegram Bot API integratsiyasi\\n\\n### Xususiyatlar\\n\\n- Matrix uslubidagi jonli fon\\n- Maxsus kursor va scroll animatsiyalar\\n- Admin panel orqali kontent boshqaruvi\\n- Kontakt forma → Telegram xabarnoma',
    array['React', 'TypeScript', 'Supabase', 'Tailwind', 'Framer Motion'],
    true,
    1
  )
on conflict (slug) do nothing;

insert into public.blog_posts (title, slug, excerpt, content, tags, published) values
  (
    'Salom, dunyo! Blog ochildi',
    'salom-dunyo',
    'GHOST portfolio saytining rasmiy blogi ishga tushdi. Bu yerda dasturlash, texnologiyalar va loyihalarim haqida yozib boraman.',
    E'## Assalomu alaykum!\\n\\nBu mening shaxsiy blogimning birinchi posti. Bu yerda quyidagi mavzularda yozib boraman:\\n\\n- Web dasturlash (React, TypeScript, Node.js)\\n- Telegram botlar yaratish\\n- Supabase va backend texnologiyalar\\n- Loyihalarim va tajribalarim\\n\\nKuzatib boring! 🚀',
    array['yangilik', 'blog'],
    true
  )
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

do $blk$
begin
  begin
    drop policy if exists "media_public_read" on storage.objects;
    create policy "media_public_read" on storage.objects
      for select using (bucket_id = 'media');
  exception when others then raise notice 'media_public_read: %', sqlerrm;
  end;
  begin
    drop policy if exists "media_admin_insert" on storage.objects;
    create policy "media_admin_insert" on storage.objects
      for insert with check (bucket_id = 'media' and public.is_admin());
  exception when others then raise notice 'media_admin_insert: %', sqlerrm;
  end;
  begin
    drop policy if exists "media_admin_update" on storage.objects;
    create policy "media_admin_update" on storage.objects
      for update using (bucket_id = 'media' and public.is_admin());
  exception when others then raise notice 'media_admin_update: %', sqlerrm;
  end;
  begin
    drop policy if exists "media_admin_delete" on storage.objects;
    create policy "media_admin_delete" on storage.objects
      for delete using (bucket_id = 'media' and public.is_admin());
  exception when others then raise notice 'media_admin_delete: %', sqlerrm;
  end;
end $blk$;
`

// Bir martalik setup token — sxema o'rnatilgach funksiya o'chiriladi.
// Migratsiya idempotent (faqat yo'q jadvallarni yaratadi), shuning uchun xavfsiz.
const SETUP_TOKEN = 'ghost-setup-2026-x7k9-mQ2v'

Deno.serve(async (req) => {
  const setupKey = req.headers.get('x-setup-key')
  if (setupKey !== SETUP_TOKEN) {
    return new Response(JSON.stringify({ error: 'Ruxsat yo`q (setup token xato)' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const dbUrl = Deno.env.get('SUPABASE_DB_URL')
  if (!dbUrl) {
    return new Response(JSON.stringify({ error: 'SUPABASE_DB_URL topilmadi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const sql = postgres(dbUrl, { prepare: false })
  try {
    await sql.unsafe(SCHEMA_SQL)
    return new Response(JSON.stringify({ ok: true, message: 'Sxema muvaffaqiyatli o`rnatildi' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Migration error:', e)
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } finally {
    await sql.end()
  }
})
