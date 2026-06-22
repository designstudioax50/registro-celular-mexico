import { DateTime } from "luxon";
import Countdown from "@/components/Countdown";
import { getConfig, buildMapsHref } from "@/lib/config";

export const dynamic = "force-dynamic";

const OPERATORS = ["Telcel", "AT&T", "Movistar", "Bait", "Unefon"];

export default async function Home() {
  const config = await getConfig();
  const mapsHref = buildMapsHref(config);

  const deadlineDate = (() => {
    try {
      return DateTime.fromMillis(new Date(config.countdown_target).getTime())
        .setZone(config.countdown_timezone)
        .setLocale("es")
        .toFormat("d 'de' LLLL 'de' yyyy");
    } catch {
      return "";
    }
  })();

  return (
    <main className="relative mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8">
      {/* ===== Banner con imagen de fondo (header + hero) ===== */}
      <div className="relative isolate">
        {/* Imagen de fondo a ancho completo + degradado para legibilidad */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-screen -translate-x-1/2 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/header-bg.jpg)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,9,20,0.55) 0%, rgba(6,9,20,0.80) 55%, #060914 100%)",
            }}
          />
        </div>

        <div className="pt-10 sm:pt-16">
          {/* Encabezado */}
          <header className="animate-fade-up flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldIcon className="h-6 w-6 text-sky-glow" />
              <span className="font-display text-sm font-semibold tracking-tight text-ink/80">
                Registro Celular
              </span>
            </div>
            <span className="glass-soft hidden rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/65 sm:inline-block">
              De acuerdo a la ley en México
            </span>
          </header>

          {/* Hero */}
          <section className="relative mt-16 pb-4 text-center sm:mt-24">
            <p
              className="animate-fade-up text-sm font-semibold uppercase tracking-[0.3em] text-sky-glow/90"
              style={{ animationDelay: "0.05s" }}
            >
              {config.hero_subtitle}
            </p>
            <h1
              className="animate-fade-up text-gradient mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] sm:text-7xl md:text-8xl"
              style={{ animationDelay: "0.12s" }}
            >
              {config.hero_title}
            </h1>
            <p
              className="animate-fade-up mx-auto mt-7 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg"
              style={{ animationDelay: "0.2s" }}
            >
              {config.hero_note}
            </p>

            {/* Badge de fecha límite con efecto sheen */}
            {deadlineDate && (
              <div
                className="animate-fade-up sheen-wrap glass mx-auto mt-10 inline-flex items-center gap-3 rounded-2xl px-5 py-3"
                style={{ animationDelay: "0.28s" }}
              >
                <AlertIcon className="h-5 w-5 shrink-0 text-amber-400" />
                <span className="text-sm font-semibold text-ink/75 sm:text-base">
                  Fecha límite:{" "}
                  <span className="text-gradient-gold font-bold">
                    {deadlineDate}
                  </span>
                </span>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ===== Contador ===== */}
      <section
        className="animate-fade-up mt-16 sm:mt-20"
        style={{ animationDelay: "0.34s" }}
      >
        <Countdown
          targetISO={config.countdown_target}
          timezone={config.countdown_timezone}
        />
      </section>

      {/* ===== Banner: te ayudamos ===== */}
      <section
        className="animate-fade-up glass mt-20 overflow-hidden rounded-3xl p-7 sm:p-10"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="glass-soft flex h-16 w-16 items-center justify-center rounded-2xl">
            <HandshakeIcon className="h-8 w-8 text-sky-glow" />
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-ink">Nosotros te ayudamos, </span>
            <span className="text-gradient">hoy mismo</span>
          </h2>
          <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
            <Question
              icon={<BellIcon className="h-5 w-5 text-sky-glow" />}
              text="¿Recibiste un aviso de tu compañía?"
            />
            <Question
              icon={<WifiOffIcon className="h-5 w-5 text-sky-glow" />}
              text="¿No tienes internet o se te complica el trámite?"
            />
          </div>
        </div>
      </section>

      {/* ===== Requisitos / Beneficios / Costo ===== */}
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <InfoCard
          delay="0.04s"
          accent="sky"
          icon={<ClipboardIcon className="h-6 w-6" />}
          title="Requisitos"
        >
          <Item>Tu teléfono celular</Item>
          <Item>Identificación oficial vigente</Item>
          <Item>Tu CURP (si no la conoces, te ayudamos a consultarla)</Item>
        </InfoCard>

        <InfoCard
          delay="0.12s"
          accent="emerald"
          icon={<ShieldCheckIcon className="h-6 w-6" />}
          title="Beneficios"
        >
          {config.benefits
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line, i) => (
              <Item key={i} accent="emerald">
                {line}
              </Item>
            ))}
        </InfoCard>

        <InfoCard
          delay="0.2s"
          accent="amber"
          icon={<TagIcon className="h-6 w-6" />}
          title="Costo"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm text-ink/55">El registro es</span>
            <span className="text-gradient-gold font-display text-4xl font-extrabold leading-none">
              GRATUITO
            </span>
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              {config.donation_text}
            </p>
          </div>
        </InfoCard>
      </section>

      {/* ===== Compañías ===== */}
      <section className="animate-fade-up mt-8 glass rounded-3xl px-6 py-8 sm:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-ink/50">
          Te apoyamos con tu trámite ante tu compañía
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          {OPERATORS.map((op) => (
            <span
              key={op}
              className="glass-soft rounded-xl px-4 py-2 font-display text-base font-semibold text-ink/85 sm:text-lg"
            >
              {op}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-sky-glow/30 bg-sky-glow/10 px-4 py-2 font-display text-base font-semibold text-sky-glow sm:text-lg">
            <PlusIcon className="h-4 w-4" />
            y más
          </span>
        </div>
        <p className="mt-5 text-center text-xs text-ink/40">
          Funciona con todas las compañías. El trámite se realiza en tu propio
          teléfono, ante tu operadora oficial.
        </p>
      </section>

      {/* ===== Dirección + Mapa ===== */}
      <section className="animate-fade-up mt-8 glass overflow-hidden rounded-3xl">
        <div className="grid gap-px sm:grid-cols-[1.4fr_1fr]">
          <div className="p-7 sm:p-9">
            <div className="flex items-center gap-2.5">
              <PinIcon className="h-5 w-5 text-sky-glow" />
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                {config.address_label}
              </h3>
            </div>
            {config.address_value ? (
              <p className="mt-4 max-w-sm text-base leading-relaxed text-ink/70">
                {config.address_value}
              </p>
            ) : (
              <p className="mt-4 text-sm text-ink/40">
                Configura tu dirección desde el panel de administración.
              </p>
            )}

            {config.hours_text && (
              <div className="mt-6 flex items-center gap-2.5 text-sm text-ink/60">
                <ClockIcon className="h-4 w-4 text-ink/50" />
                <span>{config.hours_text}</span>
              </div>
            )}

            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass mt-7 inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 font-semibold text-ink"
              >
                <PinIcon className="h-5 w-5" />
                Cómo llegar
                <ArrowIcon className="h-4 w-4 opacity-70" />
              </a>
            )}
          </div>

          {/* Panel decorativo del mapa */}
          <div className="relative hidden min-h-[220px] overflow-hidden bg-gradient-to-br from-sky-glow/10 to-transparent sm:block">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(148,197,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,197,255,0.12) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full bg-sky-glow/30 blur-2xl" />
                <PinIcon className="relative h-12 w-12 text-sky-glow drop-shadow-[0_4px_12px_rgba(56,189,248,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer de confianza ===== */}
      <footer className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="glass-soft flex items-center gap-3 rounded-2xl px-5 py-3">
          <LockIcon className="h-5 w-5 text-sky-glow" />
          <p className="text-sm text-ink/65">
            El registro lo realizas{" "}
            <span className="font-semibold text-ink/85">tú</span>, desde tu
            teléfono, ante tu compañía. No almacenamos tus datos.
          </p>
        </div>
        <p className="mt-2 text-xs text-ink/35">
          Servicio de apoyo independiente · Tus datos están seguros
        </p>
      </footer>
    </main>
  );
}

/* ============================================================
   Subcomponentes de presentación
   ============================================================ */

function Question({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="glass-soft flex items-center gap-3 rounded-2xl px-5 py-4 text-left">
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium text-ink/80">{text}</span>
    </div>
  );
}

const ACCENTS = {
  sky: { ring: "border-sky-glow/30 bg-sky-glow/10 text-sky-glow" },
  emerald: { ring: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" },
  amber: { ring: "border-amber-400/30 bg-amber-400/10 text-amber-300" },
} as const;

function InfoCard({
  icon,
  title,
  children,
  accent = "sky",
  delay = "0s",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: keyof typeof ACCENTS;
  delay?: string;
}) {
  return (
    <div
      className="animate-fade-up glass flex flex-col rounded-3xl p-7"
      style={{ animationDelay: delay }}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${ACCENTS[accent].ring}`}
      >
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
        {title}
      </h3>
      <div className="mt-5 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Item({
  children,
  accent = "sky",
}: {
  children: React.ReactNode;
  accent?: "sky" | "emerald";
}) {
  const color = accent === "emerald" ? "text-emerald-300" : "text-sky-glow";
  return (
    <div className="flex items-start gap-3">
      <CheckIcon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
      <span className="text-sm leading-relaxed text-ink/70">{children}</span>
    </div>
  );
}

/* ============================================================
   Iconos (SVG en línea, sin dependencias)
   ============================================================ */

type IconProps = { className?: string };

function ShieldIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
      <rect x="9.2" y="10.5" width="5.6" height="5" rx="1.2" />
      <path d="M10.4 10.5V9a1.6 1.6 0 0 1 3.2 0v1.5" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function AlertIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function HandshakeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 0 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 0 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-1.6 1.6a1 1 0 0 1-1.4 0 1 1 0 0 1 0-1.4l2.4-2.4a3 3 0 0 1 2.4-.9l1.5.2" />
      <path d="m21 3-2.7 2.7" />
      <path d="M3 13.5 8 8.5l2 2" />
      <path d="m3 21 2.7-2.7" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function WifiOffIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2l20 20" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8.8a15 15 0 0 1 4.2-2.6" />
      <path d="M22 8.8a15 15 0 0 0-7-3.5" />
      <path d="M5 12.5a10 10 0 0 1 3-2" />
      <path d="M19 12.5a10 10 0 0 0-4-2.3" />
      <path d="M12 20h.01" />
    </svg>
  );
}

function ClipboardIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function TagIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.6 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.2 8.2a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.2" strokeWidth="1.4" opacity="0.5" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" />
    </svg>
  );
}

function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
