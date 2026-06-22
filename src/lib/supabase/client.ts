import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para componentes que corren en el navegador
 * ("use client"). Usado en el login y el dashboard.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
