-- ============================================================
--  Registro Celular — Esquema de base de datos (Supabase)
--  Ejecuta TODO este archivo en:  Supabase > SQL Editor > New query
-- ============================================================

create extension if not exists "pgcrypto";

-- Tabla de configuración del sitio (una sola fila, id = 1)
create table if not exists public.site_config (
  id                 integer primary key default 1,
  hero_title         text not null default '¡Protege tu línea!',
  hero_subtitle      text not null default 'Registro Celular Obligatorio',
  hero_note          text not null default 'Te ayudamos a registrar tu número paso a paso, desde tu propio teléfono y ante tu compañía.',
  countdown_timezone text not null default 'America/Mexico_City',
  -- 10 plazos por terminación de número (23:59 hora del Centro de México):
  deadline_0         timestamptz not null default '2026-08-15T23:59:00-06:00',
  deadline_1         timestamptz not null default '2026-08-31T23:59:00-06:00',
  deadline_2         timestamptz not null default '2026-09-15T23:59:00-06:00',
  deadline_3         timestamptz not null default '2026-09-30T23:59:00-06:00',
  deadline_4         timestamptz not null default '2026-10-15T23:59:00-06:00',
  deadline_5         timestamptz not null default '2026-10-31T23:59:00-06:00',
  deadline_6         timestamptz not null default '2026-11-15T23:59:00-06:00',
  deadline_7         timestamptz not null default '2026-11-30T23:59:00-06:00',
  deadline_8         timestamptz not null default '2026-12-15T23:59:00-06:00',
  deadline_9         timestamptz not null default '2026-12-31T23:59:00-06:00',
  address_label      text not null default 'Dónde encontrarnos',
  address_value      text not null default '',
  maps_url           text not null default '',
  hours_text         text not null default 'Lunes a sábado, 9:00 a 18:00 hrs.',
  donation_text      text not null default 'El registro es totalmente gratuito. La aportación es voluntaria (10, 15 o 20 MXN) por el uso del equipo e internet, nunca por el registro.',
  benefits           text not null default E'Proceso rápido\nSin filas\nAtención personalizada\nComprobante de registro',
  color_start        text not null default '#38bdf8',
  color_mid          text not null default '#22c55e',
  color_end          text not null default '#ef4444',
  updated_at         timestamptz not null default now(),
  constraint site_config_single_row check (id = 1)
);

-- Garantiza que exista la fila inicial
insert into public.site_config (id) values (1)
on conflict (id) do nothing;

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.site_config enable row level security;

-- Cualquiera (incluido el público no autenticado) puede LEER la configuración.
drop policy if exists "Public read config" on public.site_config;
create policy "Public read config"
  on public.site_config
  for select
  to anon, authenticated
  using (true);

-- Solo usuarios autenticados (el administrador) pueden MODIFICAR.
drop policy if exists "Authenticated update config" on public.site_config;
create policy "Authenticated update config"
  on public.site_config
  for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================
--  Listo. El siguiente paso es crear tu usuario administrador:
--  Supabase > Authentication > Users > Add user (marca "Auto Confirm User")
-- ============================================================
