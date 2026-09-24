import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../features/theme/theme-store";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "", showLabel = false }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo Claro" : "Modo Oscuro"}
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer select-none text-xs font-medium ${
        isDark
          ? "bg-[#0b1a30] border-teatro-navy-border text-amber-400 hover:text-amber-300 hover:border-amber-400/40"
          : "bg-white border-slate-200 text-slate-700 hover:text-teatro-blue hover:border-teatro-blue/30 shadow-xs"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-400 animate-in spin-in-12 duration-200" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 animate-in spin-in-12 duration-200" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs">
          {isDark ? "Modo Oscuro" : "Modo Claro"}
        </span>
      )}
    </button>
  );
};
