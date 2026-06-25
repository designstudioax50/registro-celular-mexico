"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { DEADLINE_GROUPS, type DeadlineColumn } from "@/lib/deadlines";

type Props = {
  /** Mapa columna -> instante ISO (UTC). */
  deadlines: Record<DeadlineColumn, string>;
  timezone: string;
};

type Remaining = {
  d: number;
  h: number;
  m: number;
  s: number;
  done: boolean;
};

function getRemaining(targetMs: number): Remaining {
  const diff = Math.max(0, targetMs - Date.now());
  const total = Math.floor(diff / 1000);
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
    done: diff <= 0,
  };
}

export default function Deadlines({ deadlines, timezone }: Props) {
  const [mounted, setMounted] = useState(false);
  // Se actualiza cada segundo; "tick" fuerza el re-render de todas las tarjetas.
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DEADLINE_GROUPS.map((g, i) => {
        const iso = deadlines[g.col];
        const targetMs = iso ? new Date(iso).getTime() : 0;
        const r = getRemaining(targetMs);

        let dateLabel = "";
        try {
          dateLabel = DateTime.fromMillis(targetMs)
            .setZone(timezone)
            .setLocale("es")
            .toFormat("d 'de' LLLL 'de' yyyy");
        } catch {
          dateLabel = "";
        }

        const multi = g.badge.length > 1;

        return (
          <div
            key={g.col}
            className="glass animate-fade-up flex flex-col rounded-2xl p-5"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Cabecera: terminación */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
                Terminación
              </span>
              <PhoneIcon className="h-4 w-4 text-sky-glow/60" />
            </div>

            {/* Dígito(s) grande(s) */}
            <div
              className={`text-gradient mt-1 font-display font-extrabold leading-none ${
                multi ? "text-3xl" : "text-5xl"
              }`}
            >
              {g.badge}
            </div>

            {/* Fecha límite */}
            <div className="mt-3 flex items-start gap-1.5">
              <CalendarIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400/80" />
              <span className="text-[13px] font-semibold leading-snug text-amber-200/90">
                {dateLabel}
              </span>
            </div>

            {/* Contador */}
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
              ) : r.done ? (
                <div className="glass-soft rounded-lg px-3 py-3 text-center">
                  <span className="text-sm font-semibold text-ink/70">
                    Plazo finalizado
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1.5">
                  <Unit value={r.d} label="días" />
                  <Unit value={r.h} label="hrs" />
                  <Unit value={r.m} label="min" />
                  <Unit value={r.s} label="seg" />
                </div>
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
      <span className="text-[9px] font-semibold uppercase tracking-wide text-ink/45">
        {label}
      </span>
    </div>
  );
}

type IconProps = { className?: string };

function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4.5" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}
