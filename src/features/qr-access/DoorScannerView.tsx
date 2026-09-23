import React, { useState } from "react";
import { ScanLine, Camera, KeyRound, ShieldAlert, Check } from "lucide-react";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { DoorValidationResult, ValidationOutcome } from "./DoorValidationResult";
import { Ticket } from "../tickets/types";

export function DoorScannerView() {
  const store = useTheaterStore();
  const [selectedEventId, setSelectedEventId] = useState(store.events[0]?.id || "");
  const [manualCode, setManualCode] = useState("");
  const [validationOutcome, setValidationOutcome] = useState<ValidationOutcome>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [cameraActive, setCameraActive] = useState(false);

  const currentEvent = store.events.find((e) => e.id === selectedEventId) || store.events[0];
  const eventTickets = store.tickets.filter((t) => t.eventId === currentEvent.id);
  const checkedInCount = eventTickets.filter((t) => t.checkedIn).length;

  const processScan = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    const existingTicket = store.tickets.find((t) => t.qrCodeValue === cleanCode);
    if (!existingTicket) {
      setValidationOutcome("INVALID_QR");
      setActiveTicket(null);
      setErrorMessage(`El código "${cleanCode}" no fue encontrado en la base de datos.`);
      return;
    }

    if (existingTicket.checkedIn) {
      setValidationOutcome("ALREADY_CHECKED_IN");
      setActiveTicket(existingTicket);
      return;
    }

    const res = store.checkInTicket(existingTicket.id);
    if (res.success && res.ticket) {
      setValidationOutcome("SUCCESS");
      setActiveTicket(res.ticket);
    } else {
      setValidationOutcome("INVALID_QR");
      setActiveTicket(null);
      setErrorMessage(res.error || "Error al validar.");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processScan(manualCode);
    setManualCode("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 space-y-6 text-slate-100">
      {/* Título de la Capa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e1626]/90 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest">Capa 2 • Acreditación y Puerta</span>
          <h1 className="text-xl font-serif text-white font-medium mt-0.5">Control de Acceso y Lector QR</h1>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="door-event-select" className="text-xs font-mono text-slate-400">Función:</label>
          <select
            id="door-event-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {store.events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.time} hrs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visor del Escáner y Simulación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lado Izquierdo: Visor de Cámara */}
        <div className="bg-[#111827] rounded-3xl p-6 border border-slate-800 text-white flex flex-col items-center justify-center relative min-h-80 shadow-2xl">
          <div className="relative w-60 h-60 border-2 border-dashed border-amber-400/40 rounded-3xl flex items-center justify-center overflow-hidden bg-slate-950/60">
            {/* Retícula de Enfoque */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="w-48 h-48 text-amber-400/60 animate-pulse" />
            </div>
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-400 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-400 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-400 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-400 rounded-br-sm" />

            <div className="z-10 text-center px-4">
              <Camera className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300">Apunte la cámara al código QR del tiquete del espectador</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setCameraActive(!cameraActive)}
              className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl border border-slate-700 transition-colors font-medium"
            >
              {cameraActive ? "Pausar Cámara Óptica" : "Activar Sensor de Cámara"}
            </button>
          </div>
        </div>

        {/* Lado Derecho: Entrada Manual e Inyección de Prueba Rápida */}
        <div className="space-y-4">
          {/* Ingreso manual de código */}
          <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-3 text-white font-medium text-xs font-mono">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Validación Manual o Lector de Barra USB</span>
            </div>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Pegue o digite el código (ej: TM-evt-gala-25...)"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/20"
              >
                Procesar e Ingresar
              </button>
            </form>
          </div>

          {/* Botones de Prueba Rápida con Tiquetes Existentes */}
          <div className="bg-[#111827] p-5 rounded-3xl border border-slate-800 text-xs shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">Simulación Rápida de Escáner</span>
              <span className="text-[10px] text-amber-400 font-mono">{eventTickets.length} pases emitidos</span>
            </div>
            <p className="text-slate-400 text-[11px] mb-3">Haga clic en cualquier tiquete para simular el escaneo:</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {eventTickets.slice(0, 6).map((tkt) => (
                <button
                  key={tkt.id}
                  onClick={() => processScan(tkt.qrCodeValue)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-800/80 hover:border-amber-400 hover:bg-amber-500/10 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-medium text-slate-200">{tkt.citizenName}</span>
                    <span className="text-[10px] text-amber-400 ml-1.5 font-mono">({tkt.seatLabel || tkt.zone})</span>
                  </div>
                  {tkt.checkedIn ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> En Sala
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                      Escanear
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monitor de Aforo en Puerta */}
      <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">Entrada Principal y Protocolo activos.</span>
        </div>
        <div className="font-mono text-slate-300">
          <span>Ingresados a Sala: </span>
          <strong className="text-emerald-400 text-sm">{checkedInCount}</strong>
          <span className="text-slate-500"> / {currentEvent.totalCapacity}</span>
        </div>
      </div>

      <DoorValidationResult
        outcome={validationOutcome}
        ticket={activeTicket}
        errorMessage={errorMessage}
        onDismiss={() => {
          setValidationOutcome(null);
          setActiveTicket(null);
        }}
      />
    </div>
  );
}
