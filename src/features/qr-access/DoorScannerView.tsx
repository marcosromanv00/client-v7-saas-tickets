import React, { useState, useEffect } from "react";
import { ScanLine, Camera, KeyRound, ShieldAlert, Check, Zap } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { DoorValidationResult, ValidationOutcome } from "./DoorValidationResult";
import { DoorEventHeader } from "./DoorEventHeader";
import { Ticket } from "../tickets/types";

export function DoorScannerView() {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [inputCode, setInputCode] = useState("");
  const [validationOutcome, setValidationOutcome] = useState<ValidationOutcome>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [cameraActive, setCameraActive] = useState(false);

  // Ejecución automática de liberación 15 minutos antes según reloj real
  useEffect(() => {
    store.checkAndReleaseUnclaimed();
  }, [selectedEventId]);

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
  const eventTickets = store.tickets.filter((t) => t.eventId === currentEvent.id);
  const checkedInCount = eventTickets.filter((t) => t.checkedIn).length;

  const processScan = (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    const res = store.checkInByCode(code);
    if (res.status === "VALID" && res.ticket) {
      setValidationOutcome("SUCCESS");
      setActiveTicket(res.ticket);
    } else if (res.status === "RELEASED_NO_SHOW" && res.ticket) {
      setValidationOutcome("RELEASED_NO_SHOW");
      setActiveTicket(res.ticket);
    } else if (res.status === "ALREADY_CHECKED_IN" && res.ticket) {
      setValidationOutcome("ALREADY_CHECKED_IN");
      setActiveTicket(res.ticket);
    } else {
      setValidationOutcome("INVALID_QR");
      setActiveTicket(null);
      setErrorMessage(res.error || `El código "${code}" no fue encontrado en la base de datos.`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setInputCode(val);

    // Auto-validación instantánea al teclear exactamente 4 caracteres (ej. "AL14", "TM08")
    if (val.trim().length === 4 && /^[A-Z]{2}[0-9]{2}$/.test(val.trim())) {
      processScan(val.trim());
      setInputCode("");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processScan(inputCode);
    setInputCode("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      <DoorEventHeader
        events={store.events}
        selectedEventId={selectedEventId}
        onSelectEventId={setSelectedEventId}
        currentEvent={currentEvent}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visor de Cámara */}
        <div className="bg-white dark:bg-[#0b1a30] rounded-3xl p-6 border border-slate-200 dark:border-teatro-navy-border flex flex-col items-center justify-center relative min-h-80 shadow-sm">
          <div className="relative w-60 h-60 border-2 border-dashed border-teatro-blue/40 dark:border-blue-400/40 rounded-3xl flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#071324]">
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="w-48 h-48 text-teatro-blue/50 dark:text-blue-400/60 animate-pulse" />
            </div>
            <div className="z-10 text-center px-4">
              <Camera className="w-8 h-8 text-teatro-blue dark:text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 dark:text-slate-300">Enfoque el QR o digite el código de 4 caracteres</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setCameraActive(!cameraActive)}
              className="px-4 py-2 text-xs bg-slate-100 dark:bg-[#071324] hover:bg-slate-200 dark:hover:bg-slate-800 text-teatro-blue dark:text-blue-400 rounded-xl border border-slate-200 dark:border-[#1a3357] transition-colors font-semibold cursor-pointer"
            >
              {cameraActive ? "Pausar Cámara" : "Activar Sensor Óptico"}
            </button>
          </div>
        </div>

        {/* Entrada Rápida de 4 Caracteres (Auto-Submit) & Simulación */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0b1a30] p-6 rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs font-mono">
                <KeyRound className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
                <span>Código Rápido (2 Letras + 2 Dígitos)</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-mono font-semibold">
                <Zap className="w-3 h-3" /> Auto-valida
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Escriba el código corto (ej: <strong>AL14</strong>). Se valida automáticamente al escribir el 4to caracter.
            </p>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                type="text"
                value={inputCode}
                onChange={handleInputChange}
                maxLength={40}
                placeholder="Ej. AL14 o pegue QR..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-sm font-mono tracking-wider uppercase text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teatro-blue"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-teatro-blue hover:bg-teatro-blue-hover text-white font-semibold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                Procesar e Ingresar
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-[#0b1a30] p-5 rounded-3xl border border-slate-200 dark:border-teatro-navy-border text-xs shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900 dark:text-white">Pases Emitidos para esta Función</span>
              <span className="text-[10px] text-teatro-blue dark:text-blue-400 font-mono font-semibold">{eventTickets.length} pases</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {eventTickets.slice(0, 6).map((tkt) => (
                <button
                  key={tkt.id}
                  onClick={() => processScan(tkt.shortCode || tkt.qrCodeValue)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teatro-blue dark:hover:border-blue-500 hover:bg-teatro-blue-light dark:hover:bg-teatro-blue/15 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-teatro-blue dark:text-blue-400 border border-slate-200 dark:border-slate-700">
                      {tkt.shortCode || "QR"}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{tkt.citizenName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({tkt.seatLabel || tkt.zone})</span>
                  </div>
                  {tkt.status === "RELEASED_NO_SHOW" ? (
                    <span className="text-[10px] text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/40 px-2 py-0.5 rounded-full font-mono font-semibold">
                      Liberado
                    </span>
                  ) : tkt.checkedIn ? (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-mono flex items-center gap-0.5 font-semibold">
                      <Check className="w-3 h-3" /> En Sala
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                      Validar
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monitor de Aforo en Puerta */}
      <div className="bg-white dark:bg-[#0b1a30] p-4 rounded-2xl border border-slate-200 dark:border-teatro-navy-border flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teatro-gold dark:text-amber-400" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Puerta y Acreditación. Corte de butacas no registradas a los 15 min antes.
          </span>
        </div>
        <div className="font-mono text-slate-600 dark:text-slate-300">
          <span>Ingresados a Sala: </span>
          <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{checkedInCount}</strong>
          <span className="text-slate-400"> / {currentEvent.totalCapacity}</span>
        </div>
      </div>

      <DoorValidationResult
        outcome={validationOutcome}
        ticket={activeTicket}
        event={currentEvent}
        errorMessage={errorMessage}
        onDismiss={() => {
          setValidationOutcome(null);
          setActiveTicket(null);
        }}
      />
    </div>
  );
}
