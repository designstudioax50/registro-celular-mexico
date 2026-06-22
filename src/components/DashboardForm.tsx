"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/client";
import { updateConfig, type ConfigPayload } from "@/app/dashboard/actions";
import { TIMEZONES } from "@/lib/timezones";
import { type SiteConfig } from "@/lib/config";
import QRCodePanel from "@/components/QRCodePanel";

type Props = {
  initialConfig: SiteConfig;
  userEmail: string;
};

export default function DashboardForm({ initialConfig, userEmail }: Props) {
  const router = useRouter();

  const initialLocal = useMemo(() => {
    try {
      return DateTime.fromMillis(
        new Date(initialConfig.countdown_target).getTime()
      )
        .setZone(initialConfig.countdown_timezone)
        .toFormat("yyyy-MM-dd'T'HH:mm");
    } catch {
      return "2026-06-30T23:59";
    }
  }, [initialConfig.countdown_target, initialConfig.countdown_timezone]);

  const [form, setForm] = useState({
    hero_title: initialConfig.hero_title,
    hero_subtitle: initialConfig.hero_subtitle,
    hero_note: initialConfig.hero_note,
    address_label: initialConfig.address_label,
    address_value: initialConfig.address_value,
    maps_url: initialConfig.maps_url,
    hours_text: initialConfig.hours_text,
    donation_text: initialConfig.donation_text,
  });
  const [localDateTime, setLocalDateTime] = useState(initialLocal);
  const [timezone, setTimezone] = useState(initialConfig.countdown_timezone);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const previewDeadline = useMemo(() => {
    const dt = DateTime.fromISO(localDateTime, { zone: timezone }).setLocale(
      "es"
    );
    if (!dt.isValid) return null;
    return dt.toFormat("d 'de' LLLL 'de' yyyy · HH:mm 'hrs'");
  }, [localDateTime, timezone]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    const dt = DateTime.fromISO(localDateTime, { zone: timezone });
    const utcISO = dt.isValid ? dt.toUTC().toISO() : null;

    if (!utcISO) {
      setToast({ ok: false, msg: "Revisa la fecha y hora del contador." });
      setSaving(false);
      return;
    }

    const payload: ConfigPayload = {
      ...form,
      countdown_target: utcISO,
      countdown_timezone: timezone,
    };

    const res = await updateConfig(payload);
    setToast({ ok: res.ok, msg: res.message });
    setSaving(false);
    if (res.ok) {
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-28 pt-8 sm:px-8">
      {/* Encabezado */}
      <header className="animate-fade-up flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-ink/50">
            Sesión: <span className="text-ink/70">{userEmail}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-soft inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink/80 transition hover:text-ink"
          >
            Ver página
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="glass-soft inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:text-red-200"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div
          className={`animate-fade-up mt-6 rounded-2xl border px-5 py-3.5 text-sm ${
            toast.ok
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 flex flex-col gap-6">
        {/* Textos */}
        <Section
          title="Textos principales"
          subtitle="Lo que se muestra en la parte superior de la página."
          delay="0.04s"
        >
          <Field
            label="Título principal"
            value={form.hero_title}
            onChange={(v) => set("hero_title", v)}
            placeholder="¡Protege tu línea!"
          />
          <Field
            label="Subtítulo (texto pequeño arriba del título)"
            value={form.hero_subtitle}
            onChange={(v) => set("hero_subtitle", v)}
            placeholder="Registro Celular Obligatorio"
          />
          <TextareaField
            label="Mensaje de bienvenida"
            value={form.hero_note}
            onChange={(v) => set("hero_note", v)}
            placeholder="Te ayudamos a registrar tu número…"
          />
        </Section>

        {/* Contador */}
        <Section
          title="Contador regresivo"
          subtitle="Elige la fecha, la hora y la zona horaria del plazo."
          delay="0.1s"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              type="datetime-local"
              label="Fecha y hora límite"
              value={localDateTime}
              onChange={setLocalDateTime}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink/70">
                Zona horaria
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="glass-input appearance-none px-4 py-3 text-sm"
              >
                {TIMEZONES.map((tz) => (
                  <option
                    key={tz.value}
                    value={tz.value}
                    className="bg-panel text-ink"
                  >
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {previewDeadline && (
            <p className="mt-1 text-sm text-ink/50">
              El contador terminará el{" "}
              <span className="font-semibold text-sky-glow">
                {previewDeadline}
              </span>{" "}
              (hora de la zona seleccionada).
            </p>
          )}
        </Section>

        {/* Dirección y mapa */}
        <Section
          title="Dirección y botón de ubicación"
          subtitle="El botón “Cómo llegar” abrirá Google Maps en esta dirección."
          delay="0.16s"
        >
          <Field
            label="Encabezado de la sección"
            value={form.address_label}
            onChange={(v) => set("address_label", v)}
            placeholder="Dónde encontrarnos"
          />
          <TextareaField
            label="Dirección (texto que verá la gente)"
            value={form.address_value}
            onChange={(v) => set("address_value", v)}
            placeholder="Calle 60 #123 x 45 y 47, Centro, Mérida, Yucatán"
          />
          <Field
            label="Enlace de Google Maps (opcional pero recomendado)"
            value={form.maps_url}
            onChange={(v) => set("maps_url", v)}
            placeholder="https://maps.app.goo.gl/…"
          />
          <p className="-mt-1 text-xs text-ink/40">
            En Google Maps busca tu lugar → botón “Compartir” → “Copiar
            vínculo”, y pégalo aquí. Si lo dejas vacío, el botón buscará por la
            dirección de arriba.
          </p>
          <Field
            label="Horarios"
            value={form.hours_text}
            onChange={(v) => set("hours_text", v)}
            placeholder="Lunes a sábado, 9:00 a 18:00 hrs."
          />
        </Section>

        {/* Costo */}
        <Section
          title="Aviso de costo / aportación"
          subtitle="Texto de la tarjeta de costo. Mantén claro que el registro es gratis."
          delay="0.22s"
        >
          <TextareaField
            label="Texto de la aportación"
            value={form.donation_text}
            onChange={(v) => set("donation_text", v)}
          />
        </Section>

        {/* Botón guardar (sticky en móvil sería ideal, aquí normal) */}
        <button
          type="submit"
          disabled={saving}
          className="btn-glass mt-2 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      {/* QR */}
      <Section
        title="Código QR para tus carteles"
        subtitle="Imprímelo y pégalo en las tienditas y postes."
        delay="0.05s"
        className="mt-6"
      >
        <QRCodePanel />
      </Section>
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

function Section({
  title,
  subtitle,
  children,
  delay = "0s",
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: string;
  className?: string;
}) {
  return (
    <section
      className={`animate-fade-up glass rounded-3xl p-6 sm:p-8 ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="mb-6">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-ink/50">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-ink/70">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="glass-input px-4 py-3 text-sm"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-ink/70">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="glass-input resize-none px-4 py-3 text-sm leading-relaxed"
      />
    </div>
  );
}
