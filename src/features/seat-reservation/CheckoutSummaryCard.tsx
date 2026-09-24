import React from "react";
import { TheaterEvent, Seat } from "../tickets/types";

interface CheckoutSummaryCardProps {
  event: TheaterEvent;
  selectedDate: string;
  selectedTime: string;
  activeSeats: Seat[];
  totalPrice: number;
}

export const CheckoutSummaryCard: React.FC<CheckoutSummaryCardProps> = ({
  event,
  selectedDate,
  selectedTime,
  activeSeats,
  totalPrice,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Función:</span>
        <span className="text-slate-900 dark:text-white font-semibold">{event.title}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Fecha y Hora:</span>
        <span className="text-teatro-blue dark:text-blue-400 font-mono font-medium">
          {selectedDate} • {selectedTime} hrs
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Butacas Asignadas:</span>
        <span className="text-slate-900 dark:text-white font-mono font-bold">
          {activeSeats.length > 0 ? activeSeats.map((s) => s.label).join(", ") : "Entrada General"}
        </span>
      </div>
      <div className="pt-2 border-t border-slate-200 dark:border-[#1a3357] flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Total:</span>
        <span className="text-sm font-mono font-bold text-teatro-blue dark:text-blue-400">
          {event.isPrivate ? "₡0 (Acceso Subvencionado)" : `₡${totalPrice.toLocaleString("es-CR")}`}
        </span>
      </div>
    </div>
  );
};
