/**
 * Lista curada de zonas horarias (IANA) para el selector del dashboard.
 * México primero, luego algunas comunes. Puedes agregar las que quieras.
 */
export const TIMEZONES: { value: string; label: string }[] = [
  { value: "America/Mexico_City", label: "México (Centro) — CDMX, Mérida, Guadalajara" },
  { value: "America/Cancun", label: "México (Quintana Roo) — Cancún" },
  { value: "America/Monterrey", label: "México (Noreste) — Monterrey" },
  { value: "America/Mazatlan", label: "México (Pacífico) — Mazatlán, Sinaloa" },
  { value: "America/Chihuahua", label: "México (Chihuahua)" },
  { value: "America/Hermosillo", label: "México (Sonora) — Hermosillo" },
  { value: "America/Tijuana", label: "México (Noroeste) — Tijuana" },
  { value: "America/Bahia_Banderas", label: "México — Bahía de Banderas" },
  { value: "America/New_York", label: "EE. UU. — Nueva York (Este)" },
  { value: "America/Chicago", label: "EE. UU. — Chicago (Centro)" },
  { value: "America/Denver", label: "EE. UU. — Denver (Montaña)" },
  { value: "America/Los_Angeles", label: "EE. UU. — Los Ángeles (Pacífico)" },
  { value: "America/Bogota", label: "Colombia — Bogotá" },
  { value: "America/Lima", label: "Perú — Lima" },
  { value: "America/Argentina/Buenos_Aires", label: "Argentina — Buenos Aires" },
  { value: "Europe/Madrid", label: "España — Madrid" },
  { value: "UTC", label: "UTC (Tiempo Universal)" },
];
