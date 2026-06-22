-- ============================================================
--  MIGRACIÓN: agrega la columna "benefits" (Beneficios editables)
--
--  Ejecuta este archivo UNA sola vez en tu base de datos que YA existe:
--  Supabase > SQL Editor > New query > pega esto > Run
--
--  (Es seguro: si la columna ya existe, no hace nada.)
-- ============================================================

alter table public.site_config
  add column if not exists benefits text not null
  default E'Proceso rápido\nSin filas\nAtención personalizada\nComprobante de registro';
