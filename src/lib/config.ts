import { createClient } from "@/lib/supabase/server";
import {
  DEADLINE_COLUMNS,
  DEADLINE_DEFAULTS,
  type DeadlineColumn,
} from "@/lib/deadlines";

export type SiteConfig = {
  hero_title: string;
  hero_subtitle: string;
  hero_note: string;
  /** Zona horaria IANA compartida por todos los contadores. */
  countdown_timezone: string;
  /** 8 plazos por terminación de número, cada uno en ISO (UTC). */
  deadlines: Record<DeadlineColumn, string>;
  address_label: string;
  address_value: string;
  maps_url: string;
  hours_text: string;
  donation_text: string;
  /** Beneficios, uno por línea (separados por saltos de línea). */
  benefits: string;
};

/** Valores por defecto (coinciden con el schema.sql) por si aún no hay fila. */
export const DEFAULT_CONFIG: SiteConfig = {
  hero_title: "¡Protege tu línea!",
  hero_subtitle: "Registro Celular Obligatorio",
  hero_note:
    "Te ayudamos a registrar tu número paso a paso, desde tu propio teléfono y ante tu compañía.",
  countdown_timezone: "America/Mexico_City",
  deadlines: { ...DEADLINE_DEFAULTS },
  address_label: "Dónde encontrarnos",
  address_value: "",
  maps_url: "",
  hours_text: "Lunes a sábado, 9:00 a 18:00 hrs.",
  donation_text:
    "El registro es totalmente gratuito. La aportación es voluntaria (10, 15 o 20 MXN) por el uso del equipo e internet, nunca por el registro.",
  benefits: "Proceso rápido\nSin filas\nAtención personalizada\nComprobante de registro",
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

    // Construir los 8 plazos con respaldo a valores por defecto.
    const deadlines = {} as Record<DeadlineColumn, string>;
    for (const col of DEADLINE_COLUMNS) {
      const raw = (data as Record<string, unknown>)[col];
      deadlines[col] = raw
        ? new Date(raw as string).toISOString()
        : DEADLINE_DEFAULTS[col];
    }

    return {
      hero_title: data.hero_title ?? DEFAULT_CONFIG.hero_title,
      hero_subtitle: data.hero_subtitle ?? DEFAULT_CONFIG.hero_subtitle,
      hero_note: data.hero_note ?? DEFAULT_CONFIG.hero_note,
      countdown_timezone:
        data.countdown_timezone ?? DEFAULT_CONFIG.countdown_timezone,
      deadlines,
      address_label: data.address_label ?? DEFAULT_CONFIG.address_label,
      address_value: data.address_value ?? DEFAULT_CONFIG.address_value,
      maps_url: data.maps_url ?? DEFAULT_CONFIG.maps_url,
      hours_text: data.hours_text ?? DEFAULT_CONFIG.hours_text,
      donation_text: data.donation_text ?? DEFAULT_CONFIG.donation_text,
      benefits: data.benefits ?? DEFAULT_CONFIG.benefits,
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
