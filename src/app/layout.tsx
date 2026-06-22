import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Registro Celular Obligatorio — Te ayudamos",
  description:
    "Te ayudamos a registrar tu línea celular antes de la fecha límite, paso a paso y desde tu propio teléfono.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="app-bg" aria-hidden />
        <div className="app-grid" aria-hidden />
        {children}
      </body>
    </html>
  );
}
