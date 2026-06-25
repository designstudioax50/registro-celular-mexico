/**
 * Definición central de los 8 plazos de registro según el último dígito
 * del número de teléfono. La página y el dashboard usan esto como fuente
 * única de verdad.
 *
 * Las claves (col) coinciden con los nombres de columna en Supabase.
 */

export type DeadlineColumn =
  | "deadline_0"
  | "deadline_1"
  | "deadline_2"
  | "deadline_3"
  | "deadline_4"
  | "deadline_5"
  | "deadline_6"
  | "deadline_789";

export type DeadlineGroup = {
  col: DeadlineColumn;
  /** Lo que se muestra grande en la tarjeta (el/los dígito/s). */
  badge: string;
  /** Texto descriptivo. */
  label: string;
};

export const DEADLINE_GROUPS: DeadlineGroup[] = [
  { col: "deadline_0", badge: "0", label: "Termina en 0" },
  { col: "deadline_1", badge: "1", label: "Termina en 1" },
  { col: "deadline_2", badge: "2", label: "Termina en 2" },
  { col: "deadline_3", badge: "3", label: "Termina en 3" },
  { col: "deadline_4", badge: "4", label: "Termina en 4" },
  { col: "deadline_5", badge: "5", label: "Termina en 5" },
  { col: "deadline_6", badge: "6", label: "Termina en 6" },
  { col: "deadline_789", badge: "7·8·9", label: "Termina en 7, 8 o 9" },
];

export const DEADLINE_COLUMNS: DeadlineColumn[] = DEADLINE_GROUPS.map(
  (g) => g.col
);

/**
 * Valores por defecto (instante UTC). Calculados como las 23:59 hora del
 * Centro de México (UTC-6):
 *   0 → 15 ago | 1 → 15 sep | 2 → 15 oct | 3 → 31 oct
 *   4 → 15 nov | 5 → 30 nov | 6 → 15 dic | 7,8,9 → 31 dic (2026)
 */
export const DEADLINE_DEFAULTS: Record<DeadlineColumn, string> = {
  deadline_0: "2026-08-16T05:59:00.000Z",
  deadline_1: "2026-09-16T05:59:00.000Z",
  deadline_2: "2026-10-16T05:59:00.000Z",
  deadline_3: "2026-11-01T05:59:00.000Z",
  deadline_4: "2026-11-16T05:59:00.000Z",
  deadline_5: "2026-12-01T05:59:00.000Z",
  deadline_6: "2026-12-16T05:59:00.000Z",
  deadline_789: "2027-01-01T05:59:00.000Z",
};
