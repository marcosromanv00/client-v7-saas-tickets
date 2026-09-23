import { useState, useEffect, useRef } from "react";
import { Landmark, Printer, Check, Share2, Calendar, Clock, Armchair } from "lucide-react";
import { motion } from "motion/react";
import JsBarcode from "jsbarcode";
import { toast } from "sonner";
import { Ticket, TheaterEvent } from "../tickets/types";
import { generateQrDataUrl } from "./qr-utils";

interface TicketPassCardProps {
  ticket: Ticket;
  event: TheaterEvent;
}

export function TicketPassCard({ ticket, event }: TicketPassCardProps) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let isCurrent = true;
    generateQrDataUrl(ticket.qrCodeValue).then((url) => {
      if (isCurrent) setQrUrl(url);
    });
    return () => { isCurrent = false; };
  }, [ticket.qrCodeValue]);

  useEffect(() => {
    if (barcodeRef.current) {
      try {
        const rawCode = ticket.citizenId.replace(/\D/g, "") || "948201847";
        JsBarcode(barcodeRef.current, `TM-${rawCode}`, {
          format: "CODE128",
          width: 1.5,
          height: 36,
          displayValue: true,
          background: "transparent",
          lineColor: "#94a3b8",
          fontSize: 10,
          font: "monospace",
          margin: 0,
        });
      } catch (err) {
        console.warn("JsBarcode render issue:", err);
      }
    }
  }, [ticket.citizenId, ticket.qrCodeValue]);

  const handleShare = () => {
    const text = `Mi Tiquete para ${event.title} - Teatro Municipal: Butaca ${ticket.seatLabel || "Aforo General"}`;
    if (navigator.share) {
      navigator.share({ title: event.title, text, url: window.location.href })
        .then(() => toast.success("Pase compartido con éxito"))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} • Código: ${ticket.qrCodeValue}`);
      setCopied(true);
      toast.success("Enlace y código copiados al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    toast.info("Preparando vista de impresión / PDF...");
    setTimeout(() => window.print(), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="max-w-sm mx-auto select-none print:shadow-none"
    >
      <div className="relative bg-[#131b2e] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Mitad Superior: Portada Teatral */}
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
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

        {/* Separador Troquelado con Hendiduras Laterales */}
        <div className="relative flex items-center h-8 bg-[#131b2e]">
          <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-[#0a0f1d] border-r border-slate-800 shadow-inner" />
          <div className="w-full border-t-2 border-dashed border-slate-700/80 mx-6" />
          <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-[#0a0f1d] border-l border-slate-800 shadow-inner" />
        </div>

        {/* Mitad Inferior: Datos, QR y Código de Barras Real */}
        <div className="p-6 pt-1 space-y-4 text-center">
          <div className="grid grid-cols-3 gap-2 text-left bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 text-[11px]">
            <div>
              <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3 text-amber-400" /> Fecha</span>
              <span className="font-medium text-slate-200 block mt-0.5">{event.date}</span>
            </div>
            <div>
              <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> Hora</span>
              <span className="font-medium text-slate-200 block mt-0.5">{event.time}</span>
            </div>
            <div>
              <span className="text-slate-500 flex items-center gap-1"><Armchair className="w-3 h-3 text-amber-400" /> Butaca</span>
              <span className="font-mono font-bold text-amber-400 block mt-0.5">
                {ticket.seatLabel ? ticket.seatLabel.replace("Platea ", "").replace("Balcón ", "") : "General"}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Titular Acreditado</span>
            <p className="text-sm font-medium text-white">{ticket.citizenName}</p>
            <p className="text-[11px] font-mono text-slate-400">Doc: {ticket.citizenId}</p>
          </div>

          {/* QR de Alta Definición */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl max-w-44 mx-auto shadow-md">
            {qrUrl ? (
              <img src={qrUrl} alt={`QR ${ticket.id}`} className="w-36 h-36 rounded-lg" />
            ) : (
              <div className="w-36 h-36 bg-slate-200 animate-pulse rounded-lg" />
            )}
            <span className="text-[9px] font-mono text-slate-800 mt-1 font-bold">
              {ticket.seatLabel || ticket.zone}
            </span>
          </div>

          {/* Código de Barras Real SVG con JsBarcode */}
          <div className="pt-2 flex flex-col items-center">
            <svg ref={barcodeRef} className="w-48 max-h-12 overflow-visible" />
          </div>
        </div>
      </div>

      {/* Indicadores de Carrusel */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
      </div>

      {/* Acciones */}
      <div className="mt-4 flex items-center justify-between gap-3 print:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleShare}
          className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-800 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
          <span>{copied ? "Copiado" : "Compartir Tiquete"}</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handlePrint}
          className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Guardar PDF</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
