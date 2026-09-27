import React from "react";
import { ArrowUpRight } from "lucide-react";

interface HomeBentoCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const HomeBentoCard: React.FC<HomeBentoCardProps> = ({
  title,
  subtitle,
  imageSrc,
  icon,
  badge,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 text-left transition-all duration-300 hover:shadow-2xl hover:border-teatro-blue/60 dark:hover:border-blue-500/60 active:scale-[0.99] cursor-pointer ${className}`}
    >
      {/* Imagen Inmersiva con Scrim Gradiente (WCAG AAA) */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/75 to-slate-950/25 transition-opacity" />

      {/* Contenido Editorial Serena */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between h-full min-h-48 sm:min-h-56">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xs group-hover:bg-white/25 transition-colors">
            {icon}
          </div>
          <div className="flex items-center gap-2">
            {badge}
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/25 transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-4">
          <h3 className="text-base sm:text-lg font-medium text-white tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-300/85 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </button>
  );
};
