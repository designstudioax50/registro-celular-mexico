"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";

type Props = {
  /** Instante absoluto del plazo en ISO (UTC). */
  targetISO: string;
  /** Zona horaria IANA para mostrar la fecha legible. */
  timezone: string;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function getRemaining(targetMs: number): Remaining {
  const diff = Math.max(0, targetMs - Date.now());
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: diff <= 0,
  };
}

function Cell({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="glass relative flex h-[88px] w-[72px] items-center justify-center rounded-2xl sm:h-[120px] sm:w-[104px] md:h-[136px] md:w-[120px]">
        <span
          key={padded}
          className="text-gradient animate-tick font-display text-4xl font-bold tabular-nums sm:text-6xl md:text-7xl"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {padded}
        </span>
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
      <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ targetISO, timezone }: Props) {
  const targetMs = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [mounted, setMounted] = useState(false);
  const [r, setR] = useState<Remaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    done: false,
  });

  useEffect(() => {
    setMounted(true);
    setR(getRemaining(targetMs));
    const id = setInterval(() => setR(getRemaining(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const deadlineLabel = useMemo(() => {
    try {
      return DateTime.fromMillis(targetMs)
        .setZone(timezone)
        .setLocale("es")
        .toFormat("d 'de' LLLL 'de' yyyy · HH:mm 'hrs'");
    } catch {
      return "";
    }
  }, [targetMs, timezone]);

  if (mounted && r.done) {
    return (
      <div className="glass mx-auto max-w-xl rounded-3xl px-8 py-10 text-center">
        <p className="font-display text-2xl font-bold text-gradient sm:text-3xl">
          El plazo de registro ha finalizado
        </p>
        <p className="mt-3 text-sm text-ink/60">
          Si tu línea quedó suspendida, acércate con nosotros y te orientamos
          sobre cómo reactivarla con tu compañía.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-start gap-2 sm:gap-4"
        role="timer"
        aria-live="off"
        aria-label="Tiempo restante para el registro"
      >
        <Cell value={r.days} label="Días" />
        <Separator />
        <Cell value={r.hours} label="Horas" />
        <Separator />
        <Cell value={r.minutes} label="Minutos" />
        <Separator />
        <Cell value={r.seconds} label="Segundos" />
      </div>

      {deadlineLabel && (
        <p className="mt-7 text-center text-sm text-ink/55">
          Fecha límite:{" "}
          <span className="font-semibold text-ink/80">{deadlineLabel}</span>
        </p>
      )}
    </div>
  );
}

function Separator() {
  return (
    <div className="flex h-[88px] items-center sm:h-[120px] md:h-[136px]">
      <span className="font-display text-3xl font-bold text-sky-glow/50 sm:text-5xl">
        :
      </span>
    </div>
  );
}
