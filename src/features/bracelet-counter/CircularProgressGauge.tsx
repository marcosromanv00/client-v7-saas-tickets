import React from "react";
import { BraceletMetrics } from "./bracelet-counter-types";

interface CircularProgressGaugeProps {
  metrics: BraceletMetrics;
  size?: number;
}

export const CircularProgressGauge: React.FC<CircularProgressGaugeProps> = ({
  metrics,
  size = 148,
}) => {
  const radius = 42;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, metrics.percentageOccupied));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  const isFull = metrics.status === "FULL";
  const isWarning = metrics.status === "WARNING";

  const strokeColor = isFull
    ? "#c8102e" // Muni Red
    : isWarning
    ? "#f59e0b" // Amber Warning
    : "#004ea2"; // Teatro Blue Oficial

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Anillo de Fondo */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800/80 transition-colors"
        />

        {/* Anillo de Progreso Activo */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Contenido Central: Porcentaje y Subtexto */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-mono font-bold tracking-tight text-slate-900 dark:text-white leading-none">
          {metrics.percentageOccupied}
          <span className="text-sm font-sans font-medium text-slate-400 ml-0.5">%</span>
        </span>
        <span className="text-3xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
          {isFull ? "Completo" : "En Sala"}
        </span>
      </div>
    </div>
  );
};
