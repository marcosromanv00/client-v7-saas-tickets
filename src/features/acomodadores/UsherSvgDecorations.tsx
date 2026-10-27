import React from "react";
import { useTheme } from "../theme/theme-store";

export const UsherSvgDecorations: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <>
      <defs>
        {/* Gradiente del Proscenio del Escenario */}
        <linearGradient id="prosceniumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#1a2e4d" : "#002b5c"} />
          <stop offset="100%" stopColor={isDark ? "#0b172a" : "#004ea2"} />
        </linearGradient>

        {/* Haz de luz sutil del escenario */}
        <linearGradient id="stageLightBeam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "rgba(197, 146, 35, 0.14)" : "rgba(197, 146, 35, 0.08)"} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Patrón de cuadrícula arquitectónica adaptativa */}
        <pattern id="auditoriumGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke={isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.04)"}
            strokeWidth="0.8"
          />
        </pattern>
      </defs>

      {/* Cuadrícula arquitectónica de fondo */}
      <rect x="0" y="0" width="540" height="640" fill="url(#auditoriumGrid)" />

      {/* Haz de luz escénica hacia la platea */}
      <polygon points="120,56 420,56 490,225 50,225" fill="url(#stageLightBeam)" />

      {/* 1. Escenario Principal con Curva de Proscenio Oficial */}
      <g id="escenario-arquitectonico">
        <path
          d="M 50,20 Q 270,10 490,20 L 476,56 Q 270,66 64,56 Z"
          fill="url(#prosceniumGrad)"
          stroke="#c59223"
          strokeWidth="1.5"
        />
        <path d="M 64,56 Q 270,66 476,56" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.9" />
        <text
          x="270"
          y="42"
          textAnchor="middle"
          className="fill-amber-100 font-sans text-[11px] font-bold tracking-[0.25em]"
        >
          ESCENARIO
        </text>
      </g>

      {/* 2. Pasillo Central Vertical */}
      <line
        x1="270"
        y1="72"
        x2="270"
        y2="570"
        stroke={isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.14)"}
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />

      {/* 3. Pasillo Transversal Principal */}
      <rect
        x="35"
        y="234"
        width="470"
        height="24"
        rx="6"
        fill={isDark ? "rgba(15, 23, 42, 0.65)" : "rgba(241, 245, 249, 0.9)"}
        stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(203, 213, 225, 0.8)"}
        strokeWidth="1"
      />
      <text x="50" y="250" className={`${isDark ? "fill-emerald-400" : "fill-emerald-600"} font-sans text-[8.5px] font-semibold tracking-wider`}>
        ← SALIDA
      </text>
      <text
        x="270"
        y="250"
        textAnchor="middle"
        className={`${isDark ? "fill-slate-400" : "fill-slate-600"} font-sans text-[8.5px] uppercase tracking-[0.18em] font-medium`}
      >
        PASILLO TRANSVERSAL
      </text>
      <text x="490" y="250" textAnchor="end" className={`${isDark ? "fill-emerald-400" : "fill-emerald-600"} font-sans text-[8.5px] font-semibold tracking-wider`}>
        SALIDA →
      </text>

      {/* Espacio Accesible Ley 7600 (Platea Derecha Filas D-E) */}
      <rect
        x="422"
        y="148"
        width="52"
        height="32"
        rx="6"
        fill={isDark ? "rgba(2, 132, 199, 0.14)" : "rgba(224, 242, 254, 0.8)"}
        stroke={isDark ? "rgba(56, 189, 248, 0.35)" : "rgba(56, 189, 248, 0.6)"}
        strokeWidth="1"
      />
      <text x="448" y="169" textAnchor="middle" className={`${isDark ? "fill-sky-300" : "fill-sky-700"} font-sans text-[13px]`}>
        ♿ ♿
      </text>

      {/* Gradas Arquitectónicas en Sector Medio Izquierdo */}
      <g id="gradas-arquitectonicas" opacity={isDark ? 0.6 : 0.8}>
        <line x1="65" y1="268" x2="110" y2="268" stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1" />
        <line x1="65" y1="273" x2="110" y2="273" stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1" />
        <line x1="65" y1="278" x2="110" y2="278" stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1" />
        <line x1="65" y1="283" x2="110" y2="283" stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1" />
        <text x="87" y="278" textAnchor="middle" className={`${isDark ? "fill-slate-400" : "fill-slate-600"} font-sans text-[7.5px] font-medium`}>
          GRADAS
        </text>
      </g>

      {/* 4. Puertas de Entrada Principal / Foyer */}
      <g id="acceso-principal">
        <rect
          x="180"
          y="586"
          width="180"
          height="28"
          rx="6"
          fill={isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(241, 245, 249, 0.95)"}
          stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(203, 213, 225, 0.8)"}
          strokeWidth="1"
        />
        <text
          x="270"
          y="604"
          textAnchor="middle"
          className={`${isDark ? "fill-slate-300" : "fill-slate-700"} font-sans text-[8.5px] font-semibold uppercase tracking-[0.2em]`}
        >
          ▼ PUERTAS DE ACCESO ▼
        </text>
      </g>
    </>
  );
};
