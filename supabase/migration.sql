-- ============================================================
--  MIGRACIÓN para bases de datos que YA existen
--
--  Ejecuta este archivo en:  Supabase > SQL Editor > New query > Run
--
--  Es 100% seguro correrlo aunque ya hayas aplicado cambios antes:
--  cada columna usa "add column if not exists", así que no duplica nada.
-- ============================================================

-- 1) Beneficios editables (si aún no lo tenías)
alter table public.site_config
  add column if not exists benefits text not null
  default E'Proceso rápido\nSin filas\nAtención personalizada\nComprobante de registro';

-- 2) Los 8 contadores por terminación de número
--    (23:59 hora del Centro de México, UTC-6)
alter table public.site_config
  add column if not exists deadline_0   timestamptz not null default '2026-08-15T23:59:00-06:00',
  add column if not exists deadline_1   timestamptz not null default '2026-09-15T23:59:00-06:00',
  add column if not exists deadline_2   timestamptz not null default '2026-10-15T23:59:00-06:00',
  add column if not exists deadline_3   timestamptz not null default '2026-10-31T23:59:00-06:00',
  add column if not exists deadline_4   timestamptz not null default '2026-11-15T23:59:00-06:00',
  add column if not exists deadline_5   timestamptz not null default '2026-11-30T23:59:00-06:00',
  add column if not exists deadline_6   timestamptz not null default '2026-12-15T23:59:00-06:00',
  add column if not exists deadline_789 timestamptz not null default '2026-12-31T23:59:00-06:00';

-- Listo. La columna vieja "countdown_target" puede quedarse; ya no se usa.
