import React from "react";
import { BraceletColor } from "../tickets/types";

interface EventBraceletSelectorProps {
  braceletColors: BraceletColor[];
  selectedColorId: string;
  onSelectColorId: (id: string) => void;
}

export const EventBraceletSelector: React.FC<EventBraceletSelectorProps> = ({
  braceletColors,
  selectedColorId,
  onSelectColorId,
}) => {
  return (
    <div>
      <label className="block font-mono text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
        Brazalete Oficial para esta Función
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {braceletColors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelectColorId(color.id)}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedColorId === color.id
                ? "border-teatro-blue bg-blue-50/50 dark:bg-blue-950/30 text-teatro-blue dark:text-blue-400 font-semibold ring-1 ring-teatro-blue"
                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#071324] text-slate-700 dark:text-slate-300"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: color.hex }}
            />
            <span className="truncate text-[11px]">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
