import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Ticket as TicketIcon, Printer, Share2, ArrowRight } from "lucide-react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import confetti from "canvas-confetti";
import { TheaterEvent, Ticket } from "../tickets/types";

interface Step4TicketSuccessProps {
  event: TheaterEvent;
  tickets: Ticket[];
  onResetToStart: () => void;
  onOpenMyTickets?: () => void;
}

export const Step4TicketSuccess: React.FC<Step4TicketSuccessProps> = ({
  event,
  tickets,
  onResetToStart,
  onOpenMyTickets,
}) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  const primaryTicket = tickets[0] || {
    id: "TM-000000",
    citizenName: "Ciudadano",
    citizenId: "1-0000-0000",
    qrCode: "TM-000000",
  };

  useEffect(() => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#004ea2", "#c8102e", "#c59223", "#ffffff"],
    });

    QRCode.toDataURL(
      primaryTicket.qrCodeValue || primaryTicket.id,
      { width: 180, margin: 1, color: { dark: "#0f172a", light: "#ffffff" } },
      (err, url) => {
        if (!err && url) setQrUrl(url);
      }
    );

    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, primaryTicket.id, {
          format: "CODE128",
          width: 1.5,
          height: 38,
          displayValue: false,
          lineColor: "#334155",
        });
      } catch {
        // ignore
      }
    }
  }, [primaryTicket]);

  const handlePrint = () => window.print();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Entrada: ${event.title}`,
        text: `Tengo reserva confirmada para ${event.title} en el Teatro Municipal de Alajuela.`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto mb-2 shadow-xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl text-slate-900 dark:text-white font-bold tracking-tight">¡Reserva Confirmada!</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Presenta este pase digital en la puerta del Teatro Municipal de Alajuela</p>
      </div>

      {/* BOLETO DIGITAL DE COLECCIÓN */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-teatro-navy-border bg-white dark:bg-[#0b1a30] shadow-lg transition-colors">
        <div className="relative h-44 w-full overflow-hidden">
          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover brightness-75" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-teatro-gold border border-teatro-gold/40 font-semibold">
            Teatro Municipal de Alajuela
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] font-mono uppercase text-amber-300 tracking-wider block font-semibold">{event.genre}</span>
            <h3 className="text-base text-white font-semibold line-clamp-1">{event.title}</h3>
          </div>
        </div>

        <div className="relative flex items-center justify-between px-3 py-2 bg-white dark:bg-[#0b1a30]">
          <div className="w-5 h-5 rounded-full bg-slate-50 dark:bg-teatro-navy -ml-5.5 border-r border-slate-200 dark:border-teatro-navy-border" />
          <div className="flex-1 border-b-2 border-dashed border-slate-300 dark:border-slate-700 mx-2" />
          <div className="w-5 h-5 rounded-full bg-slate-50 dark:bg-teatro-navy -mr-5.5 border-l border-slate-200 dark:border-teatro-navy-border" />
        </div>

        <div className="p-6 pt-2 space-y-4 bg-white dark:bg-[#0b1a30]">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Espectador</span>
              <span className="text-slate-900 dark:text-white font-medium line-clamp-1">{primaryTicket.citizenName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Identificación</span>
              <span className="text-slate-900 dark:text-white font-mono">{primaryTicket.citizenId}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Fecha y Hora</span>
              <span className="text-slate-900 dark:text-white font-mono font-medium">{event.date} • {event.time} hrs</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Butacas Asignadas</span>
              <span className="text-teatro-blue dark:text-blue-400 font-mono font-bold text-sm">
                {tickets.map((t) => t.seatLabel || t.seatId).join(", ")}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-teatro-navy-border flex flex-col items-center justify-center space-y-3">
            {qrUrl && (
              <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <img src={qrUrl} alt="QR de Ingreso" className="w-28 h-28" />
              </div>
            )}
            <svg ref={barcodeRef} className="w-full max-w-50" />
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">{primaryTicket.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handlePrint}
          className="py-3 px-4 bg-white dark:bg-[#0b1a30] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-teatro-navy-border rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Printer className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" /> Imprimir
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="py-3 px-4 bg-white dark:bg-[#0b1a30] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-teatro-navy-border rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" /> Compartir
        </button>
      </div>

      {onOpenMyTickets && (
        <button
          type="button"
          onClick={onOpenMyTickets}
          className="w-full py-3 bg-teatro-blue-light dark:bg-teatro-blue/20 hover:bg-teatro-blue/25 text-teatro-blue dark:text-blue-300 border border-teatro-blue/30 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <TicketIcon className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400" /> Ver en Mis Entradas
        </button>
      )}

      <button
        type="button"
        onClick={onResetToStart}
        className="w-full py-3.5 bg-teatro-blue hover:bg-teatro-blue-hover text-white font-semibold rounded-2xl text-xs shadow-md shadow-blue-900/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Explorar Otra Función en Cartelera</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
