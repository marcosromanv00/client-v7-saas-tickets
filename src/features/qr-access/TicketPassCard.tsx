import React, { useState } from "react";
import { Landmark, Printer, Check, Copy, Armchair, Calendar, Clock, MapPin } from "lucide-react";
import { Ticket, TheaterEvent } from "../tickets/types";
import { generateQrDataUrl } from "./qr-utils";

interface TicketPassCardProps {
  ticket: Ticket;
  event: TheaterEvent;
}

export function TicketPassCard({ ticket, event }: TicketPassCardProps) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    let isCurrent = true;
    generateQrDataUrl(ticket.qrCodeValue).then((url) => {
      if (isCurrent) setQrUrl(url);
    });
    return () => {
      isCurrent = false;
    };
  }, [ticket.qrCodeValue]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticket.qrCodeValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden print:shadow-none print:border-none">
      {/* Encabezado del Pase Teatral */}
      <div className="bg-[#1b2a4a] text-white p-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#233858] border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-sm tracking-wide text-white font-medium">Teatro Municipal</h2>
              <p className="text-[10px] text-amber-300 font-mono">Pase Oficial de Ingreso</p>
            </div>
          </div>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
            ticket.checkedIn ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
          }`}>
            {ticket.checkedIn ? "Ingresado a Sala" : "Acceso Válido"}
          </span>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-serif font-medium text-white line-clamp-1">{event.title}</h3>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{event.tagline}</p>
        </div>
      </div>

      {/* Cuerpo del Tiquete con Datos y Código QR */}
      <div className="p-6 space-y-6">
        {/* Datos Logísticos de Fecha y Hora */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5" /> Fecha
            </span>
            <p className="font-medium text-slate-800">{event.date}</p>
          </div>
          <div>
            <span className="text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5" /> Hora Función
            </span>
            <p className="font-medium text-slate-800">{event.time} hrs</p>
          </div>
        </div>

        {/* Titular y Butaca Asignada */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Asistente Acreditado</span>
            <p className="font-medium text-sm text-slate-900 leading-tight">{ticket.citizenName}</p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">Cédula: {ticket.citizenId}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-0.5">
              <Armchair className="w-3.5 h-3.5 text-amber-600" /> Ubicación
            </span>
            <p className="font-serif text-base font-medium text-[#1b2a4a]">
              {ticket.seatLabel || (ticket.zone === "PLANTA_BAJA" ? "Platea General" : "Balcón General")}
            </p>
            <p className="text-[10px] text-slate-500">
              {ticket.zone === "PLANTA_BAJA" ? "Planta Baja" : "Segunda Planta"}
            </p>
          </div>
        </div>

        {/* Render del Código QR */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
          {qrUrl ? (
            <img src={qrUrl} alt={`Código QR del tiquete ${ticket.id}`} className="w-48 h-48 rounded-lg shadow-2xs" />
          ) : (
            <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
              Generando QR...
            </div>
          )}
          <span className="font-mono text-[11px] text-slate-400 mt-2 tracking-wider">{ticket.qrCodeValue}</span>
        </div>

        {/* Nota Cívica de Acceso */}
        <div className="flex items-start gap-2 p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs text-amber-900">
          <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-snug">
            Presente este código QR en la entrada principal del Teatro Municipal. Las puertas cierran al dar inicio la función.
          </p>
        </div>

        {/* Acciones de Impresión y Copia */}
        <div className="flex items-center justify-between pt-2 print:hidden">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Código Copiado" : "Copiar Código"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1b2a4a] hover:bg-[#233858] rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
