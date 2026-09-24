import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { motion } from "motion/react";
import { Calendar, Clock, Armchair, Share2, Printer, Check, Landmark } from "lucide-react";
import { toast } from "sonner";
import { Ticket, TheaterEvent } from "../tickets/types";

interface TicketPassCardProps {
  ticket: Ticket;
  event: TheaterEvent;
}

export function TicketPassCard({ ticket, event }: TicketPassCardProps) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    QRCode.toDataURL(ticket.qrCodeValue || ticket.id, {
      width: 200,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error("Error generando QR", err));

    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, ticket.id, {
          format: "CODE128",
          width: 1.5,
          height: 38,
          displayValue: true,
          font: "monospace",
          fontSize: 10,
          textMargin: 3,
          lineColor: "#64748b",
        });
      } catch (err) {
        console.error("Error barcode", err);
      }
    }
  }, [ticket]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ticket.qrCodeValue);
      setCopied(true);
      toast.success("Código de tiquete copiado al portapapeles");
      setTimeout(() => setCopied(false), 2500);
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
      <div className="relative bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-xl overflow-hidden transition-colors">
        {/* Mitad Superior: Portada Teatral */}
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-white text-[10px]">
              <Landmark className="w-3.5 h-3.5 text-teatro-gold" />
              <span>Teatro Municipal de Alajuela</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
              ticket.checkedIn ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40" : "bg-teatro-blue text-white"
            }`}>
              {ticket.checkedIn ? "Ingresado" : "Pase Válido"}
            </span>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-base text-white font-bold tracking-tight line-clamp-1">{event.title}</h3>
            <p className="text-[11px] text-amber-300 font-mono mt-0.5">{event.genre || "Función Teatral"}</p>
          </div>
        </div>

        {/* Separador Troquelado con Hendiduras Laterales */}
        <div className="relative flex items-center h-8 bg-white dark:bg-[#0b1a30]">
          <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-slate-50 dark:bg-teatro-navy border-r border-slate-200 dark:border-teatro-navy-border" />
          <div className="w-full border-t-2 border-dashed border-slate-300 dark:border-slate-700 mx-6" />
          <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-slate-50 dark:bg-teatro-navy border-l border-slate-200 dark:border-teatro-navy-border" />
        </div>

        {/* Mitad Inferior: Datos, QR y Código de Barras Real */}
        <div className="p-6 pt-1 space-y-4 text-center">
          <div className="grid grid-cols-3 gap-2 text-left bg-slate-50 dark:bg-[#071324] p-3 rounded-2xl border border-slate-200 dark:border-[#1a3357] text-[11px]">
            <div>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3 text-teatro-blue dark:text-blue-400" /> Fecha</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{event.date}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3 text-teatro-blue dark:text-blue-400" /> Hora</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{event.time}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><Armchair className="w-3 h-3 text-teatro-blue dark:text-blue-400" /> Butaca</span>
              <span className="font-mono font-bold text-teatro-blue dark:text-blue-400 block mt-0.5">
                {ticket.seatLabel ? ticket.seatLabel.replace("Platea ", "").replace("Balcón ", "") : "General"}
              </span>
            </div>
          </div>

          {/* Brazalete Oficial de Entrada */}
          <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-100 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] text-[11px] font-medium text-slate-700 dark:text-slate-200">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white dark:ring-slate-900 shadow-xs"
              style={{ backgroundColor: event.braceletColorHex || "#004ea2" }}
            />
            <span>Brazalete Oficial: <strong>{event.braceletColorName || "Azul Rey"}</strong></span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Titular Acreditado</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{ticket.citizenName}</p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Doc: {ticket.citizenId}</p>
          </div>

          {/* QR de Alta Definición y Código Rápido (2L2D) */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl max-w-48 mx-auto shadow-xs border border-slate-200">
            {qrUrl ? (
              <img src={qrUrl} alt={`QR ${ticket.id}`} className="w-32 h-32 rounded-lg" />
            ) : (
              <div className="w-32 h-32 bg-slate-100 animate-pulse rounded-lg" />
            )}
            <span className="text-[9px] font-mono text-slate-800 mt-1 font-bold">
              {ticket.seatLabel || ticket.zone}
            </span>

            {ticket.shortCode && (
              <div className="mt-2 text-center w-full pt-2 border-t border-slate-100">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">
                  Código Rápido de Puerta
                </span>
                <span className="inline-block px-3 py-0.5 rounded-lg bg-slate-900 text-white font-mono text-sm font-bold tracking-widest">
                  {ticket.shortCode}
                </span>
              </div>
            )}
          </div>

          <div className="pt-1 flex flex-col items-center">
            <svg ref={barcodeRef} className="w-44 max-h-10 overflow-visible" />
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-4 flex items-center justify-between gap-3 print:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleShare}
          className="flex-1 py-3 px-4 bg-white dark:bg-[#0b1a30] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-teatro-navy-border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-teatro-blue dark:text-blue-400" />}
          <span>{copied ? "Copiado" : "Compartir Tiquete"}</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handlePrint}
          className="flex-1 py-3 px-4 bg-teatro-blue hover:bg-teatro-blue-hover text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Guardar PDF</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
