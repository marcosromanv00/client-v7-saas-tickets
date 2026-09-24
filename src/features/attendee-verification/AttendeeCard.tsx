import React from "react";
import { Check, Undo2, Crown, Compass, AlertCircle, Users } from "lucide-react";
import { AttendeeItem } from "./attendee-types";
import { getSeatOrientationInfo } from "./attendee-utils";

interface AttendeeCardProps {
  item: AttendeeItem;
  onCheckIn: (item: AttendeeItem) => void;
  onUndo: (item: AttendeeItem) => void;
  onRedeemGuest: (guestId: string, count: number) => void;
}

export const AttendeeCard: React.FC<AttendeeCardProps> = ({
  item,
  onCheckIn,
  onUndo,
  onRedeemGuest,
}) => {
  const orientation = getSeatOrientationInfo(item.seatLabel, item.zone);

  return (
    <div
      className={`rounded-2xl border p-3.5 sm:p-4 transition-all ${
        item.status === "CHECKED_IN"
          ? "bg-slate-50/70 dark:bg-[#071324]/50 border-slate-200/60 dark:border-slate-800/60 opacity-80"
          : item.status === "RELEASED_NO_SHOW"
          ? "bg-red-50/30 dark:bg-red-950/15 border-red-200/50 dark:border-red-900/40"
          : "bg-white dark:bg-[#0c1a2f] border-slate-200 dark:border-slate-800 hover:border-teatro-blue/60 dark:hover:border-blue-500/60 shadow-xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Info Principal */}
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {item.name}
            </h4>

            {item.isVip && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40">
                <Crown className="w-2.5 h-2.5" />
                <span>Protocolo</span>
              </span>
            )}

            {item.type === "SPECIAL_GUEST" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                <Users className="w-2.5 h-2.5" />
                <span>Delegación ({item.redeemedCount}/{item.ticketsCount})</span>
              </span>
            )}

            {item.shortCode && (
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {item.shortCode}
              </span>
            )}
          </div>

          {/* Subtítulos: Cédula & Puesto & Indicación */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {item.citizenId && (
              <span className="font-mono text-[11px]">ID: {item.citizenId}</span>
            )}

            {item.seatLabel ? (
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {item.seatLabel}
              </span>
            ) : (
              <span className="italic text-slate-400">Entrada General</span>
            )}

            <div className="flex items-center gap-1 text-[11px] text-teatro-blue dark:text-blue-400">
              <Compass className="w-3 h-3 shrink-0" />
              <span>{orientation.doorDirection}</span>
            </div>
          </div>

          {item.notes && (
            <p className="text-[11px] text-slate-400 italic">{item.notes}</p>
          )}
        </div>

        {/* Acciones y Estados de Verificación */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {item.status === "RELEASED_NO_SHOW" ? (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-100/70 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Liberada a 15 min</span>
            </div>
          ) : item.status === "CHECKED_IN" ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>En Sala</span>
              </div>
              <button
                onClick={() => onUndo(item)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Deshacer ingreso si fue un error"
              >
                <Undo2 className="w-3 h-3" />
                <span className="hidden sm:inline">Deshacer</span>
              </button>
            </div>
          ) : item.type === "SPECIAL_GUEST" ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => item.specialGuestId && onRedeemGuest(item.specialGuestId, 1)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Acreditar 1 Pase
              </button>
              {item.ticketsCount - item.redeemedCount > 1 && (
                <button
                  onClick={() =>
                    item.specialGuestId &&
                    onRedeemGuest(item.specialGuestId, item.ticketsCount - item.redeemedCount)
                  }
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Resto ({item.ticketsCount - item.redeemedCount})
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => onCheckIn(item)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
