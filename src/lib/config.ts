import { createClient } from "@/lib/supabase/server";

export type SiteConfig = {
  hero_title: string;
  hero_subtitle: string;
  hero_note: string;
  /** Instante absoluto del plazo, en ISO (UTC). */
  countdown_target: string;
  /** Zona horaria IANA usada para interpretar/mostrar el plazo. */
  countdown_timezone: string;
  address_label: string;
  address_value: string;
  maps_url: string;
  hours_text: string;
  donation_text: string;
};

/** Valores por defecto (coinciden con el schema.sql) por si aún no hay fila. */
export const DEFAULT_CONFIG: SiteConfig = {
  hero_title: "¡Protege tu línea!",
  hero_subtitle: "Registro Celular Obligatorio",
  hero_note:
    "Te ayudamos a registrar tu número paso a paso, desde tu propio teléfono y ante tu compañía.",
  countdown_target: "2026-07-01T05:59:00.000Z", // 30 jun 2026 23:59 hora del Centro
  countdown_timezone: "America/Mexico_City",
  address_label: "Dónde encontrarnos",
  address_value: "",
  maps_url: "",
  hours_text: "Lunes a sábado, 9:00 a 18:00 hrs.",
  donation_text:
    "El registro es totalmente gratuito. La aportación es voluntaria (10, 15 o 20 MXN) por el uso del equipo e internet, nunca por el registro.",
};

/**
 * Lee la configuración del sitio desde Supabase.
 * Si no existe (o falla), regresa los valores por defecto para que la
 * página nunca se rompa.
 */
export async function getConfig(): Promise<SiteConfig> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return DEFAULT_CONFIG;

    return {
      hero_title: data.hero_title ?? DEFAULT_CONFIG.hero_title,
      hero_subtitle: data.hero_subtitle ?? DEFAULT_CONFIG.hero_subtitle,
      hero_note: data.hero_note ?? DEFAULT_CONFIG.hero_note,
      countdown_target:
        new Date(data.countdown_target).toISOString() ??
        DEFAULT_CONFIG.countdown_target,
      countdown_timezone:
        data.countdown_timezone ?? DEFAULT_CONFIG.countdown_timezone,
      address_label: data.address_label ?? DEFAULT_CONFIG.address_label,
      address_value: data.address_value ?? DEFAULT_CONFIG.address_value,
      maps_url: data.maps_url ?? DEFAULT_CONFIG.maps_url,
      hours_text: data.hours_text ?? DEFAULT_CONFIG.hours_text,
      donation_text: data.donation_text ?? DEFAULT_CONFIG.donation_text,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Construye el enlace de mapa: usa la URL pegada o, si no, busca por dirección. */
export function buildMapsHref(config: SiteConfig): string | null {
  if (config.maps_url && config.maps_url.trim().length > 0) {
    return config.maps_url.trim();
  }
  if (config.address_value && config.address_value.trim().length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      config.address_value.trim()
    )}`;
  }
  return null;
}
