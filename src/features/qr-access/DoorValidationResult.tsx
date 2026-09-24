import { CheckCircle2, AlertOctagon, XCircle, Armchair, User, Clock, AlertTriangle } from "lucide-react";
import { Ticket, TheaterEvent } from "../tickets/types";

export type ValidationOutcome = "SUCCESS" | "ALREADY_CHECKED_IN" | "INVALID_QR" | "RELEASED_NO_SHOW" | null;

interface DoorValidationResultProps {
  outcome: ValidationOutcome;
  ticket?: Ticket | null;
  event?: TheaterEvent | null;
  errorMessage?: string;
  onDismiss: () => void;
}

export function DoorValidationResult({ outcome, ticket, event, errorMessage, onDismiss }: DoorValidationResultProps) {
  if (!outcome) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a30] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-teatro-navy-border animate-in zoom-in-95 duration-150 text-center text-slate-900 dark:text-slate-100 transition-colors">
        {/* Resultado: Éxito */}
        {outcome === "SUCCESS" && ticket && (
          <div className="p-8 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">Acceso Autorizado</span>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">{ticket.citizenName}</h3>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Doc: {ticket.citizenId}</p>
            </div>

            {/* Brazalete Oficial a Entregar */}
            {event && (
              <div className="p-3 bg-slate-100 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357] flex items-center justify-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-xs"
                  style={{ backgroundColor: event.braceletColorHex || "#004ea2" }}
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Entregar Brazalete: <strong className="font-bold">{event.braceletColorName || "Azul Rey"}</strong>
                </span>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-[#071324] p-4 rounded-2xl border border-slate-200 dark:border-[#1a3357] text-left space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-white">
                <Armchair className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
                <span className="font-bold text-teatro-blue dark:text-blue-400">{ticket.seatLabel || "Aforo General"}</span>
                <span className="text-slate-500 dark:text-slate-400">({ticket.zone === "PLANTA_BAJA" ? "Platea" : "Balcón"})</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <User className="w-3.5 h-3.5" />
                <span>{ticket.isVipGuest ? "Invitado Protocolo (VIP)" : "Público General"}</span>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              autoFocus
            >
              Confirmar Ingreso y Brazalete
            </button>
          </div>
        )}

        {/* Resultado: Liberado por Inasistencia (15 min antes) */}
        {outcome === "RELEASED_NO_SHOW" && ticket && (
          <div className="p-8 space-y-5 bg-red-50/60 dark:bg-red-950/30">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 flex items-center justify-center">
              <Clock className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-700 dark:text-red-400 font-bold">Reserva Liberada por Inasistencia</span>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mt-1">{ticket.citizenName}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Este boleto no fue validado con al menos <strong>15 minutos de anticipación</strong>. La butaca <strong>{ticket.seatLabel || ticket.zone}</strong> fue liberada para público walk-in en taquilla.
              </p>
            </div>

            <div className="bg-white dark:bg-[#071324] p-3 rounded-2xl border border-red-200 dark:border-red-900/50 text-xs text-red-800 dark:text-red-300 text-left">
              <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Consulte en Taquilla Express por espacio remanente</span>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
              autoFocus
            >
              Entendido
            </button>
          </div>
        )}

        {/* Resultado: Ya Ingresado */}
        {outcome === "ALREADY_CHECKED_IN" && ticket && (
          <div className="p-8 space-y-5 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800 flex items-center justify-center">
              <AlertOctagon className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">Alerta: Tiquete Ya Ingresado</span>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mt-1">{ticket.citizenName}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Validado previamente a las {ticket.checkedInAt ? new Date(ticket.checkedInAt).toLocaleTimeString() : "la hora indicada"}.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#071324] p-3 rounded-2xl border border-slate-200 dark:border-[#1a3357] text-xs text-slate-700 dark:text-slate-300 text-left">
              <p className="font-mono text-[10px] text-slate-400">Pase: {ticket.id}</p>
              <p className="font-semibold mt-0.5 text-teatro-blue dark:text-blue-400">Butaca: {ticket.seatLabel || "General"}</p>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
              autoFocus
            >
              Cerrar Advertencia
            </button>
          </div>
        )}

        {/* Resultado: Código No Válido */}
        {outcome === "INVALID_QR" && (
          <div className="p-8 space-y-5 bg-red-50/50 dark:bg-red-950/20">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center justify-center">
              <XCircle className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 dark:text-red-400 font-bold">Código No Válido</span>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mt-1">Tiquete No Encontrado</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {errorMessage || "El código no corresponde a ningún pase emitido para el Teatro Municipal de Alajuela."}
              </p>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold text-xs transition-colors cursor-pointer"
              autoFocus
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
