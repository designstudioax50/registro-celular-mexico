"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodePanel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fallback =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    setUrl(fallback);
  }, []);

  function downloadPng() {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "codigo-qr-registro.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="qr-url" className="text-sm font-medium text-ink/70">
          Dirección a la que apunta el QR
        </label>
        <input
          id="qr-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://tu-dominio.vercel.app"
          className="glass-input px-4 py-3 text-sm"
        />
        <p className="text-xs text-ink/40">
          Por defecto es la URL de tu sitio. Descárgalo e imprímelo en tus
          carteles para que la gente lo escanee.
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <div
          ref={wrapRef}
          className="rounded-2xl bg-white p-4 shadow-lg"
          aria-label="Código QR"
        >
          {url ? (
            <QRCodeCanvas
              value={url}
              size={168}
              level="M"
              marginSize={1}
              fgColor="#060914"
              bgColor="#ffffff"
            />
          ) : (
            <div className="h-[168px] w-[168px]" />
          )}
        </div>

        <button
          type="button"
          onClick={downloadPng}
          disabled={!url}
          className="btn-glass inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 font-semibold text-ink disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Descargar PNG
        </button>
      </div>
    </div>
  );
}
