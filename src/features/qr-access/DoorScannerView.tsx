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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Título de la Capa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Capa 2: Acreditación y Puerta</span>
          <h1 className="text-xl font-serif text-[#1b2a4a] font-medium mt-0.5">Control de Acceso y Lector QR</h1>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="door-event-select" className="text-xs font-medium text-slate-600">Función:</label>
          <select
            id="door-event-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-[#1b2a4a]"
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
        <div className="bg-[#121c32] rounded-2xl p-6 text-white flex flex-col items-center justify-center relative min-h-80 shadow-inner">
          <div className="relative w-60 h-60 border-2 border-dashed border-amber-400/50 rounded-2xl flex items-center justify-center overflow-hidden">
            {/* Retícula de Enfoque */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="w-48 h-48 text-amber-400/60 animate-pulse" />
            </div>
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

            <div className="z-10 text-center px-4">
              <Camera className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300">Apunte la cámara al código QR del tiquete del espectador</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setCameraActive(!cameraActive)}
              className="px-4 py-1.5 text-xs bg-[#233858] hover:bg-[#2c446c] text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              {cameraActive ? "Pausar Cámara Óptica" : "Activar Sensor de Cámara"}
            </button>
          </div>
        </div>

        {/* Lado Derecho: Entrada Manual e Inyección de Prueba Rápida */}
        <div className="space-y-4">
          {/* Ingreso manual de código */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-medium text-sm font-serif">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Validación Manual o Lector de Barra USB</span>
            </div>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Pegue o digite el código (ej: TM-evt-gala-25...)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b2a4a]"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#1b2a4a] hover:bg-[#233858] text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
              >
                Procesar e Ingresar
              </button>
            </form>
          </div>

          {/* Botones de Prueba Rápida con Tiquetes Existentes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-800">Simulación Rápida de Escáner</span>
              <span className="text-[11px] text-slate-400 font-mono">{eventTickets.length} tiquetes</span>
            </div>
            <p className="text-slate-500 text-[11px] mb-3">Haga clic en cualquier tiquete para simular el escaneo instantáneo:</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {eventTickets.slice(0, 6).map((tkt) => (
                <button
                  key={tkt.id}
                  onClick={() => processScan(tkt.qrCodeValue)}
                  className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-amber-400 hover:bg-amber-50/50 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-medium text-slate-800">{tkt.citizenName}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({tkt.seatLabel || tkt.zone})</span>
                  </div>
                  {tkt.checkedIn ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> En Sala
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
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
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500" />
          <span className="text-slate-700">Estado de Acceso: Entrada Principal habilitada.</span>
        </div>
        <div className="font-mono text-slate-800">
          <span>Ingresados a Sala: </span>
          <strong className="text-emerald-700 text-sm">{checkedInCount}</strong>
          <span className="text-slate-400"> / {currentEvent.totalCapacity}</span>
        </div>
      </div>

      {/* Modal de Resultado */}
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
