"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ConfigPayload = {
  hero_title: string;
  hero_subtitle: string;
  hero_note: string;
  countdown_target: string; // ISO UTC ya calculado en el cliente
  countdown_timezone: string;
  address_label: string;
  address_value: string;
  maps_url: string;
  hours_text: string;
  donation_text: string;
  benefits: string;
};

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

  // Validación mínima
  if (!payload.countdown_target || isNaN(new Date(payload.countdown_target).getTime())) {
    return { ok: false, message: "La fecha del contador no es válida." };
  }

  const { error } = await supabase
    .from("site_config")
    .update({
      hero_title: payload.hero_title.trim() || "¡Protege tu línea!",
      hero_subtitle: payload.hero_subtitle.trim(),
      hero_note: payload.hero_note.trim(),
      countdown_target: payload.countdown_target,
      countdown_timezone: payload.countdown_timezone,
      address_label: payload.address_label.trim() || "Dónde encontrarnos",
      address_value: payload.address_value.trim(),
      maps_url: payload.maps_url.trim(),
      hours_text: payload.hours_text.trim(),
      donation_text: payload.donation_text.trim(),
      benefits: payload.benefits.replace(/\r\n/g, "\n").trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    return { ok: false, message: "No se pudo guardar: " + error.message };
  }

  // Refresca la página pública para que se vean los cambios al instante.
  revalidatePath("/");

  return { ok: true, message: "Cambios guardados correctamente." };
}
