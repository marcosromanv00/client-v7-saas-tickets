import React from "react";
import { motion } from "motion/react";
import { Seat } from "../tickets/types";
import { useTheme } from "../theme/theme-store";
import {
  USHER_SECTOR_LIST,
  UsherSectorConfig,
  UsherSectorId,
} from "./usher-sectors.config";
import { calculateSectorMetrics } from "./usher-sectors.utils";
import { UsherSvgDecorations } from "./UsherSvgDecorations";

interface UsherVectorSvgCanvasProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onSelectSector: (sectorId: UsherSectorId) => void;
}

export const UsherVectorSvgCanvas: React.FC<UsherVectorSvgCanvasProps> = ({
  seats,
  selectedSeatIds,
  onSelectSector,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Contenedor adaptativo: bg-white en tema claro, bg-[#070e1b] en tema oscuro */}
      <div className="w-full max-w-lg aspect-[540/640] relative rounded-2xl overflow-hidden bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-2xl p-1 sm:p-2 transition-colors">
        <svg
          viewBox="0 0 540 640"
          className="w-full h-full drop-shadow-xs"
          role="img"
          aria-label="Plano Arquitectónico Oficial del Teatro Municipal de Alajuela"
        >
          {/* Fondo arquitectónico adaptativo, proscenio y pasillos */}
          <UsherSvgDecorations />

          {/* Los 6 Polígonos Arquitectónicos con Animación Háptica Dinámica */}
          {USHER_SECTOR_LIST.map((sector: UsherSectorConfig) => {
            const metrics = calculateSectorMetrics(seats, selectedSeatIds, sector);
            const fill = isDark ? sector.themeColor.darkFill : sector.themeColor.lightFill;
            const stroke = isDark ? sector.themeColor.darkStroke : sector.themeColor.lightStroke;

            return (
              <motion.g
                key={sector.id}
                whileHover={{ scale: 1.02, filter: "brightness(1.15)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                onClick={() => onSelectSector(sector.id)}
                className="cursor-pointer group origin-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelectSector(sector.id);
                }}
              >
                {/* Polígono Vectorial */}
                <path
                  d={sector.svgPath}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="transition-colors duration-150 group-hover:stroke-teatro-blue dark:group-hover:stroke-white/80"
                />

                {/* Nivel en minicapitales */}
                <text
                  x={sector.labelPosition.x}
                  y={sector.labelPosition.y - 12}
                  textAnchor="middle"
                  className={`${isDark ? "fill-slate-400" : "fill-slate-500"} font-sans text-[9px] font-bold tracking-[0.16em] uppercase pointer-events-none`}
                >
                  {sector.levelLabel}
                </text>

                {/* Nombre de la Zona */}
                <text
                  x={sector.labelPosition.x}
                  y={sector.labelPosition.y + 6}
                  textAnchor="middle"
                  className={`${isDark ? "fill-white" : "fill-slate-900"} font-sans text-[13px] font-semibold tracking-tight pointer-events-none`}
                >
                  {sector.shortName}
                </text>

                {/* Disponibilidad con métricas sobrias */}
                <text
                  x={sector.statPosition.x}
                  y={sector.statPosition.y + 4}
                  textAnchor="middle"
                  className="font-mono text-[12px] pointer-events-none"
                >
                  <tspan className={`${isDark ? "fill-emerald-400" : "fill-emerald-600"} font-bold`}>
                    {metrics.available}
                  </tspan>
                  <tspan className={`${isDark ? "fill-slate-400" : "fill-slate-500"} font-normal`}>
                    {" "}
                    / {metrics.total} libres
                  </tspan>
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <p className="mt-2.5 text-xs font-sans text-slate-500 dark:text-slate-400 text-center font-medium">
        Toca cualquier sector arquitectónico para entrar al detalle de butacas
      </p>
    </div>
  );
};
