-- ============================================================
--  MIGRACIÓN para bases de datos que YA existen
--
--  Ejecuta este archivo en:  Supabase > SQL Editor > New query > Run
--
--  Es seguro correrlo: cada columna usa "add column if not exists".
--  Al final fija las 10 fechas OFICIALES actualizadas.
-- ============================================================

-- 1) Beneficios editables
alter table public.site_config
  add column if not exists benefits text not null
  default E'Proceso rápido\nSin filas\nAtención personalizada\nComprobante de registro';

-- 2) Colores del degradado de los contadores (azul → verde → rojo)
alter table public.site_config
  add column if not exists color_start text not null default '#38bdf8',
  add column if not exists color_mid   text not null default '#22c55e',
  add column if not exists color_end   text not null default '#ef4444';

-- 3) Los 10 contadores por terminación de número (un dígito cada uno)
alter table public.site_config
  add column if not exists deadline_0 timestamptz not null default '2026-08-15T23:59:00-06:00',
  add column if not exists deadline_1 timestamptz not null default '2026-08-31T23:59:00-06:00',
  add column if not exists deadline_2 timestamptz not null default '2026-09-15T23:59:00-06:00',
  add column if not exists deadline_3 timestamptz not null default '2026-09-30T23:59:00-06:00',
  add column if not exists deadline_4 timestamptz not null default '2026-10-15T23:59:00-06:00',
  add column if not exists deadline_5 timestamptz not null default '2026-10-31T23:59:00-06:00',
  add column if not exists deadline_6 timestamptz not null default '2026-11-15T23:59:00-06:00',
  add column if not exists deadline_7 timestamptz not null default '2026-11-30T23:59:00-06:00',
  add column if not exists deadline_8 timestamptz not null default '2026-12-15T23:59:00-06:00',
  add column if not exists deadline_9 timestamptz not null default '2026-12-31T23:59:00-06:00';

-- 4) Fija las fechas OFICIALES actualizadas (corrige los valores anteriores
--    de los dígitos 1–6, que cambiaron, y llena 7, 8 y 9).
--    Después puedes ajustar cualquier fecha/hora desde el panel.
update public.site_config set
  deadline_0 = '2026-08-15T23:59:00-06:00',
  deadline_1 = '2026-08-31T23:59:00-06:00',
  deadline_2 = '2026-09-15T23:59:00-06:00',
  deadline_3 = '2026-09-30T23:59:00-06:00',
  deadline_4 = '2026-10-15T23:59:00-06:00',
  deadline_5 = '2026-10-31T23:59:00-06:00',
  deadline_6 = '2026-11-15T23:59:00-06:00',
  deadline_7 = '2026-11-30T23:59:00-06:00',
  deadline_8 = '2026-12-15T23:59:00-06:00',
  deadline_9 = '2026-12-31T23:59:00-06:00'
where id = 1;

-- Nota: la columna vieja "deadline_789" (si existía) puede quedarse; ya no se usa.
