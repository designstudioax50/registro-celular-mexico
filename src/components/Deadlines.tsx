"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { DEADLINE_GROUPS, type DeadlineColumn } from "@/lib/deadlines";

const GRACE_DAYS = 3; // 72 horas de gracia antes de la suspensión
const DAY_MS = 86_400_000;

type Props = {
  deadlines: Record<DeadlineColumn, string>;
  timezone: string;
  colorStart: string;
  colorMid: string;
  colorEnd: string;
};

type Remaining = { d: number; h: number; m: number; s: number };
type Phase = "normal" | "grace" | "suspended";

function getRemaining(targetMs: number): Remaining {
  const diff = Math.max(0, targetMs - Date.now());
  const total = Math.floor(diff / 1000);
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function hexToRgb(hex: string): [number, number, number] {
  const h = (hex || "").replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (isNaN(n) || full.length !== 6) return [56, 189, 248];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g] = [c, x];
  else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x];
  else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [r, b] = [x, c];
  else [r, b] = [c, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function lerpHue(h1: number, h2: number, t: number) {
  let d = h2 - h1;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  let h = h1 + d * t;
  if (h < 0) h += 360;
  if (h >= 360) h -= 360;
  return h;
}

/**
 * Color en la posición t (0..1) del degradado de 3 colores, interpolando en
 * HSV (por matiz) para transiciones limpias: start → mid (t=0.5) → end (t=1).
 */
function colorAt(
  hex1: string,
  hex2: string,
  hex3: string,
  t: number
): [number, number, number] {
  const [a, b] = t <= 0.5 ? [hex1, hex2] : [hex2, hex3];
  const u = t <= 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
  const h1 = rgbToHsv(...hexToRgb(a));
  const h2 = rgbToHsv(...hexToRgb(b));
  const H = lerpHue(h1[0], h2[0], u);
  const S = lerp(h1[1], h2[1], u);
  const V = lerp(h1[2], h2[2], u);
  return hsvToRgb(H, S, V);
}

export default function Deadlines({
  deadlines,
  timezone,
  colorStart,
  colorMid,
  colorEnd,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const c1 = colorStart;
  const c2 = colorMid;
  const c3 = colorEnd;
  const now = Date.now();

  // Escala automática: la fecha más lejana define el "100% azul".
  const futures = DEADLINE_GROUPS.map(
    (g) => new Date(deadlines[g.col]).getTime() - now
  ).filter((ms) => ms > 0);
  const maxDays = Math.max(
    futures.length ? Math.max(...futures) / DAY_MS : 1,
    1
  );

  function fmt(ms: number) {
    try {
      return DateTime.fromMillis(ms)
        .setZone(timezone)
        .setLocale("es")
        .toFormat("d 'de' LLLL yyyy");
    } catch {
      return "";
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DEADLINE_GROUPS.map((g, i) => {
        const deadlineMs = new Date(deadlines[g.col]).getTime();
        const graceMs = deadlineMs + GRACE_DAYS * DAY_MS;

        let phase: Phase;
        let target: number;
        if (now < deadlineMs) {
          phase = "normal";
          target = deadlineMs;
        } else if (now < graceMs) {
          phase = "grace";
          target = graceMs;
        } else {
          phase = "suspended";
          target = graceMs;
        }

        // Progreso de color (0 = lejos/azul, 1 = fecha/rojo)
        const daysLeft = (deadlineMs - now) / DAY_MS;
        const p =
          phase === "normal" ? clamp(1 - daysLeft / maxDays, 0, 1) : 1;

        const [r, gg, b] = colorAt(c1, c2, c3, p);
        const aTop = 0.12 + 0.26 * p;
        const aBot = 0.04 + 0.12 * p;
        const aBorder = 0.35 + 0.45 * p;

        const cardStyle: React.CSSProperties = {
          animationDelay: `${i * 0.05}s`,
          background: `linear-gradient(160deg, rgba(${r},${gg},${b},${aTop.toFixed(
            3
          )}) 0%, rgba(${r},${gg},${b},${aBot.toFixed(3)}) 100%)`,
          borderColor: `rgba(${r},${gg},${b},${aBorder.toFixed(3)})`,
          ...(phase !== "normal"
            ? {
                boxShadow: `0 10px 40px rgba(2,6,18,0.5), 0 0 26px rgba(${r},${gg},${b},0.30)`,
              }
            : {}),
        };

        const rem = getRemaining(target);
        const multi = g.badge.length > 1;

        return (
          <div
            key={g.col}
            className="glass animate-fade-up flex flex-col rounded-2xl p-5"
            style={cardStyle}
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                Terminación
              </span>
              <PhoneIcon className="h-4 w-4 text-ink/55" />
            </div>

            {/* Dígito(s) */}
            <div
              className={`text-gradient mt-1 font-display font-extrabold leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] ${
                multi ? "text-3xl" : "text-5xl"
              }`}
            >
              {g.badge}
            </div>

            {/* Estado / fecha */}
            <div className="mt-3 flex items-start gap-1.5">
              {phase === "normal" && (
                <>
                  <CalendarIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                  <span className="text-[13px] font-semibold leading-snug text-amber-100/90">
                    {fmt(deadlineMs)}
                  </span>
                </>
              )}
              {phase === "grace" && (
                <>
                  <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                  <span className="text-[13px] font-semibold leading-snug text-red-100">
                    Suspensión: {fmt(graceMs)}
                  </span>
                </>
              )}
              {phase === "suspended" && (
                <>
                  <BanIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                  <span className="text-[13px] font-semibold leading-snug text-red-100">
                    Servicio suspendido
                  </span>
                </>
              )}
            </div>

            {/* Contador / mensajes */}
            <div className="mt-4">
              {!mounted ? (
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map((k) => (
                    <div
                      key={k}
                      className="glass-soft h-[52px] animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : phase === "suspended" ? (
                <div className="glass-soft rounded-lg px-3 py-3 text-center">
                  <span className="text-xs font-medium leading-snug text-ink/70">
                    Solo llamadas de emergencia y alertas sísmicas hasta
                    completar tu registro.
                  </span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-1.5">
                    <Unit value={rem.d} label="días" />
                    <Unit value={rem.h} label="hrs" />
                    <Unit value={rem.m} label="min" />
                    <Unit value={rem.s} label="seg" />
                  </div>
                  {phase === "grace" && (
                    <p className="mt-3 flex items-center gap-1.5 rounded-lg border border-red-400/30 bg-red-500/10 px-2.5 py-2 text-[11px] font-semibold leading-snug text-red-100">
                      <AlertIcon className="h-3.5 w-3.5 shrink-0" />
                      Tiempo restante para no perder tu servicio
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="glass-soft flex flex-col items-center justify-center rounded-lg py-2">
      <span className="font-display text-lg font-bold tabular-nums text-ink">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-ink/50">
        {label}
      </span>
    </div>
  );
}

type IconProps = { className?: string };

function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

function AlertIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function BanIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  );
}
