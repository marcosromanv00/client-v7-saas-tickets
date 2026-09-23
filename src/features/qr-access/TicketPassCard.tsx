import React, { useState } from "react";
import { Landmark, Printer, Check, Share2, Calendar, Clock, Armchair } from "lucide-react";
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

  const handleShare = () => {
    const text = `Mi Tiquete para ${event.title} - Teatro Municipal: Butaca ${ticket.seatLabel || "Aforo General"}`;
    if (navigator.share) {
      navigator.share({ title: event.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} - Código: ${ticket.qrCodeValue}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-sm mx-auto select-none print:shadow-none animate-in zoom-in-95 duration-200">
      {/* Tarjeta de Tiquete Físico Troquelado */}
      <div className="relative bg-[#131b2e] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Mitad Superior: Portada Teatral con Scrim */}
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <img
            src={event.posterUrl || "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-[#131b2e]/60 to-transparent" />
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-white text-[10px]">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Teatro Municipal</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
              ticket.checkedIn ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40" : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
            }`}>
              {ticket.checkedIn ? "Ingresado" : "Pase Válido"}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-base font-serif font-medium text-white line-clamp-1">{event.title}</h3>
            <p className="text-[11px] text-amber-300 font-mono mt-0.5">{event.genre || "Función Teatral"}</p>
          </div>
        </div>

        {/* Separador Troquelado con Hendiduras Laterales (Notches) y Línea Punteada */}
        <div className="relative flex items-center h-8 bg-[#131b2e]">
          {/* Muesca Izquierda */}
          <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-[#0a0f1d] border-r border-slate-800 shadow-inner" />
          {/* Línea punteada de desgarro */}
          <div className="w-full border-t-2 border-dashed border-slate-700/80 mx-6" />
          {/* Muesca Derecha */}
          <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-[#0a0f1d] border-l border-slate-800 shadow-inner" />
        </div>

        {/* Mitad Inferior: Datos de Butaca, QR y Código de Barras */}
        <div className="p-6 pt-1 space-y-5 text-center">
          {/* Grid de Metadatos de la Función */}
          <div className="grid grid-cols-3 gap-2 text-left bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 text-[11px]">
            <div>
              <span className="text-slate-500 block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Fecha
              </span>
              <span className="font-medium text-slate-200 block mt-0.5">{event.date}</span>
            </div>
            <div>
              <span className="text-slate-500 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Hora
              </span>
              <span className="font-medium text-slate-200 block mt-0.5">{event.time}</span>
            </div>
            <div>
              <span className="text-slate-500 block flex items-center gap-1">
                <Armchair className="w-3 h-3 text-amber-400" /> Butaca
              </span>
              <span className="font-mono font-bold text-amber-400 block mt-0.5">
                {ticket.seatLabel ? ticket.seatLabel.replace("Platea ", "").replace("Balcón ", "") : "General"}
              </span>
            </div>
          </div>

          {/* Asistente */}
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Titular Acreditado</span>
            <p className="text-sm font-medium text-white">{ticket.citizenName}</p>
            <p className="text-[11px] font-mono text-slate-400">Doc: {ticket.citizenId}</p>
          </div>

          {/* Código QR Centralizado */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl max-w-44 mx-auto shadow-md">
            {qrUrl ? (
              <img src={qrUrl} alt={`QR ${ticket.id}`} className="w-36 h-36 rounded-lg" />
            ) : (
              <div className="w-36 h-36 bg-slate-200 animate-pulse rounded-lg" />
            )}
            <span className="text-[9px] font-mono text-slate-700 mt-1 font-bold">
              {ticket.seatLabel || ticket.zone}
            </span>
          </div>

          {/* Código de Barras Decorativo Inferior (1:1 con la referencia) */}
          <div className="pt-2">
            <div className="h-7 w-48 mx-auto flex items-end justify-between px-2 opacity-80">
              {[2, 4, 1, 3, 2, 5, 1, 4, 2, 1, 3, 4, 2, 5, 1, 3, 2, 4, 1, 3, 2, 4].map((h, i) => (
                <div key={i} className="bg-slate-400 w-1 rounded-xs" style={{ height: `${h * 5}px` }} />
              ))}
            </div>
            <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase block mt-1">
              {ticket.qrCodeValue}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="mt-4 flex items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-800 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
          <span>{copied ? "Copiado" : "Compartir Tiquete"}</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Guardar PDF</span>
        </button>
      </div>
    </div>
  );
}
