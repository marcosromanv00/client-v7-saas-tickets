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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 text-center">
        {/* Resultado: Éxito */}
        {outcome === "SUCCESS" && ticket && (
          <div className="p-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-semibold">Acceso Permitido</span>
              <h3 className="text-xl font-serif font-medium text-slate-900 mt-1">{ticket.citizenName}</h3>
              <p className="text-xs font-mono text-slate-500">Cédula: {ticket.citizenId}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-800">
                <Armchair className="w-4 h-4 text-amber-600" />
                <span className="font-semibold">{ticket.seatLabel || "Aforo General"}</span>
                <span className="text-xs text-slate-500">({ticket.zone === "PLANTA_BAJA" ? "Platea" : "Balcón"})</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <User className="w-3.5 h-3.5" />
                <span>{ticket.isVipGuest ? "Invitado Especial (VIP)" : "Público General"}</span>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
              autoFocus
            >
              Confirmar y Siguiente
            </button>
          </div>
        )}

        {/* Resultado: Ya Ingresado */}
        {outcome === "ALREADY_CHECKED_IN" && ticket && (
          <div className="p-8 space-y-4 bg-amber-50/50">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">Alerta: Tiquete Ya Utilizado</span>
              <h3 className="text-lg font-serif font-medium text-slate-900 mt-1">{ticket.citizenName}</h3>
              <p className="text-xs text-slate-600 mt-1">
                Este tiquete ya fue validado e ingresó a las {ticket.checkedInAt ? new Date(ticket.checkedInAt).toLocaleTimeString() : "la hora previa"}.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs text-slate-700 text-left">
              <p className="font-mono text-[11px] text-slate-500">Tiquete: {ticket.id}</p>
              <p className="font-medium mt-1">Ubicación: {ticket.seatLabel || "Aforo General"}</p>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
              autoFocus
            >
              Entendido / Cerrar
            </button>
          </div>
        )}

        {/* Resultado: Código No Válido */}
        {outcome === "INVALID_QR" && (
          <div className="p-8 space-y-4 bg-red-50/50">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <XCircle className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-red-600 font-semibold">Código No Válido</span>
              <h3 className="text-lg font-serif font-medium text-slate-900 mt-1">Tiquete Desconocido</h3>
              <p className="text-xs text-slate-600 mt-1">
                {errorMessage || "El código escaneado no corresponde a ningún tiquete emitido para las funciones del Teatro Municipal."}
              </p>
            </div>

            <button
              onClick={onDismiss}
              className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
              autoFocus
            >
              Reintentar Escaneo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
