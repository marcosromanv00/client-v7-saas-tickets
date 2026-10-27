import React from "react";
import { BraceletMetrics } from "./bracelet-counter-types";

interface CircularProgressGaugeProps {
  metrics: BraceletMetrics;
  size?: number;
}

export const CircularProgressGauge: React.FC<CircularProgressGaugeProps> = ({
  metrics,
  size = 168,
}) => {
  const radius = 42;
  const strokeWidth = 8.5;
  const fullCircumference = 2 * Math.PI * radius; // ~263.89
  const arcFraction = 220 / 360;
  const totalArcLength = fullCircumference * arcFraction; // ~161.27
  const gapLength = fullCircumference - totalArcLength; // ~102.62

  const clampedPercentage = Math.min(100, Math.max(0, metrics.percentageOccupied));
  const activeArcLength = (clampedPercentage / 100) * totalArcLength;

  const isFull = metrics.status === "FULL";
  const isWarning = metrics.status === "WARNING";

  const strokeColor = isFull
    ? "#c8102e" // Muni Red
    : isWarning
    ? "#f59e0b" // Amber Warning
    : "#004ea2"; // Teatro Blue Oficial

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size * 0.9 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Track de Fondo Físico de 220° con relieve visible aun al 0% */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${totalArcLength} ${gapLength}`}
          strokeLinecap="round"
          className="text-slate-200 dark:text-slate-700/80 transition-colors"
          style={{
            transformOrigin: "50% 50%",
            transform: "rotate(160deg)",
          }}
        />

        {/* Arco de Progreso Activo */}
        {clampedPercentage > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${activeArcLength} ${fullCircumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              transformOrigin: "50% 50%",
              transform: "rotate(160deg)",
            }}
          />
        )}
      </svg>

      {/* Núcleo Central: Porcentaje y Subtexto en minúsculas naturales */}
      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-2 pointer-events-none">
        <div className="flex items-baseline">
          <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-none">
            {metrics.percentageOccupied}
          </span>
          <span className="text-sm font-sans font-medium text-slate-400 dark:text-slate-500 ml-0.5">%</span>
        </div>
        <span className="text-2xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-1">
          {isFull ? "Aforo completo" : "Ocupación"}
        </span>
      </div>
    </div>
  );
};
