import { CheckCircle2, AlertOctagon, XCircle, Armchair, User } from "lucide-react";
import { Ticket } from "../tickets/types";

export type ValidationOutcome = "SUCCESS" | "ALREADY_CHECKED_IN" | "INVALID_QR" | null;

interface DoorValidationResultProps {
  outcome: ValidationOutcome;
  ticket?: Ticket | null;
  errorMessage?: string;
  onDismiss: () => void;
}

export function DoorValidationResult({ outcome, ticket, errorMessage, onDismiss }: DoorValidationResultProps) {
  if (!outcome) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#111827] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-150 text-center text-slate-100">
        {/* Resultado: Éxito */}
        {outcome === "SUCCESS" && ticket && (
          <div className="p-8 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">Acceso Autorizado</span>
              <h3 className="text-xl font-serif font-medium text-white mt-1">{ticket.citizenName}</h3>
              <p className="text-xs font-mono text-slate-400">Doc: {ticket.citizenId}</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs text-white">
                <Armchair className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-400">{ticket.seatLabel || "Aforo General"}</span>
                <span className="text-slate-400">({ticket.zone === "PLANTA_BAJA" ? "Platea" : "Balcón"})</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User className="w-3.5 h-3.5" />
                <span>{ticket.isVipGuest ? "Invitado Protocolo (VIP)" : "Público General"}</span>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              autoFocus
            >
              Confirmar y Continuar
            </button>
          </div>
        )}

        {/* Resultado: Ya Ingresado */}
        {outcome === "ALREADY_CHECKED_IN" && ticket && (
          <div className="p-8 space-y-5 bg-[#1b1522]/90">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <AlertOctagon className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">Alerta: Tiquete Ya Ingresado</span>
              <h3 className="text-lg font-serif font-medium text-white mt-1">{ticket.citizenName}</h3>
              <p className="text-xs text-slate-300 mt-1">
                Validado previamente a las {ticket.checkedInAt ? new Date(ticket.checkedInAt).toLocaleTimeString() : "la hora indicada"}.
              </p>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left">
              <p className="font-mono text-[10px] text-slate-400">Pase: {ticket.id}</p>
              <p className="font-medium mt-0.5 text-amber-400">Butaca: {ticket.seatLabel || "General"}</p>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
              autoFocus
            >
              Cerrar Advertencia
            </button>
          </div>
        )}

        {/* Resultado: Código No Válido */}
        {outcome === "INVALID_QR" && (
          <div className="p-8 space-y-5 bg-rose-950/40">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <XCircle className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-semibold">Código No Válido</span>
              <h3 className="text-lg font-serif font-medium text-white mt-1">Tiquete No Encontrado</h3>
              <p className="text-xs text-slate-300 mt-1">
                {errorMessage || "El código no corresponde a ningún pase emitido para el Teatro Municipal."}
              </p>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-medium text-xs transition-colors"
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
