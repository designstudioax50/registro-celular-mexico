"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DEADLINE_COLUMNS, type DeadlineColumn } from "@/lib/deadlines";

export type ConfigPayload = {
  hero_title: string;
  hero_subtitle: string;
  hero_note: string;
  countdown_timezone: string;
  /** Los 8 plazos, cada uno en ISO UTC ya calculado en el cliente. */
  deadlines: Record<DeadlineColumn, string>;
  address_label: string;
  address_value: string;
  maps_url: string;
  hours_text: string;
  donation_text: string;
  benefits: string;
  color_start: string;
  color_mid: string;
  color_end: string;
};

function sanitizeHex(value: string, fallback: string): string {
  const v = (value || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v.toLowerCase() : fallback;
}

export async function updateConfig(
  payload: ConfigPayload
): Promise<{ ok: boolean; message: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "No autorizado. Inicia sesión de nuevo." };
  }

  // Validar que las 8 fechas sean válidas.
  for (const col of DEADLINE_COLUMNS) {
    const value = payload.deadlines[col];
    if (!value || isNaN(new Date(value).getTime())) {
      return {
        ok: false,
        message: "Hay una fecha de contador inválida. Revisa los 8 plazos.",
      };
    }
  }

  const updatePayload: Record<string, string> = {
    hero_title: payload.hero_title.trim() || "¡Protege tu línea!",
    hero_subtitle: payload.hero_subtitle.trim(),
    hero_note: payload.hero_note.trim(),
    countdown_timezone: payload.countdown_timezone,
    address_label: payload.address_label.trim() || "Dónde encontrarnos",
    address_value: payload.address_value.trim(),
    maps_url: payload.maps_url.trim(),
    hours_text: payload.hours_text.trim(),
    donation_text: payload.donation_text.trim(),
    benefits: payload.benefits.replace(/\r\n/g, "\n").trim(),
    color_start: sanitizeHex(payload.color_start, "#38bdf8"),
    color_mid: sanitizeHex(payload.color_mid, "#22c55e"),
    color_end: sanitizeHex(payload.color_end, "#ef4444"),
    updated_at: new Date().toISOString(),
  };

  // Agregar las 8 columnas de plazos.
  for (const col of DEADLINE_COLUMNS) {
    updatePayload[col] = payload.deadlines[col];
  }

  const { error } = await supabase
    .from("site_config")
    .update(updatePayload)
    .eq("id", 1);

  if (error) {
    return { ok: false, message: "No se pudo guardar: " + error.message };
  }

  // Refresca la página pública para que se vean los cambios al instante.
  revalidatePath("/");

  return { ok: true, message: "Cambios guardados correctamente." };
}
