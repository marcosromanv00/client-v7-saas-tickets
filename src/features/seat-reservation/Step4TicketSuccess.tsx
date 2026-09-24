import React, { useEffect, useRef, useState } from "react";
import { TheaterEvent, Ticket } from "../tickets/types";
import { CheckCircle2, Printer, ArrowRight, Share2, Ticket as TicketIcon } from "lucide-react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import { toast } from "sonner";

interface Step4TicketSuccessProps {
  tickets: Ticket[];
  event: TheaterEvent;
  onResetToStart: () => void;
  onOpenMyTickets?: () => void;
}

export const Step4TicketSuccess: React.FC<Step4TicketSuccessProps> = ({
  tickets,
  event,
  onResetToStart,
  onOpenMyTickets,
}) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const barcodeRef = useRef<SVGSVGElement | null>(null);
  const primaryTicket = tickets[0];

  useEffect(() => {
    if (primaryTicket) {
      QRCode.toDataURL(primaryTicket.qrCodeValue, {
        width: 140,
        margin: 1,
        color: { dark: "#0f0a17", light: "#ffffff" },
      }).then(setQrUrl);

      if (barcodeRef.current) {
        try {
          const rawCode = primaryTicket.citizenId.replace(/\D/g, "") || "948201847";
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
        } catch {}
      }
    }
  }, [primaryTicket]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Boleto: ${event.title}`,
        text: `Tengo mis butacas para ${event.title} en el Teatro Municipal.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  if (!primaryTicket) return null;

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif text-white font-medium">¡Reserva Confirmada!</h2>
        <p className="text-xs text-zinc-400">Presenta este pase digital en la puerta de acceso</p>
      </div>

      {/* BOLETO DIGITAL DE COLECCIÓN CON TROQUELADO LATERAL */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#161122] shadow-2xl">
        <div className="relative h-44 w-full overflow-hidden">
          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161122] via-[#161122]/40 to-transparent" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-400/30">
            Teatro Municipal 1890
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] font-mono uppercase text-rose-400 tracking-wider block">{event.genre}</span>
            <h3 className="font-serif text-base text-white font-medium line-clamp-1">{event.title}</h3>
          </div>
        </div>

        <div className="relative flex items-center justify-between px-3 py-2 bg-[#161122]">
          <div className="w-5 h-5 rounded-full bg-[#0e0a16] -ml-5.5 border-r border-white/10" />
          <div className="flex-1 border-b-2 border-dashed border-zinc-700/60 mx-2" />
          <div className="w-5 h-5 rounded-full bg-[#0e0a16] -mr-5.5 border-l border-white/10" />
        </div>

        <div className="p-6 pt-2 space-y-4 bg-[#161122]">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Espectador</span>
              <span className="text-white font-medium line-clamp-1">{primaryTicket.citizenName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Identificación</span>
              <span className="text-zinc-300 font-mono">{primaryTicket.citizenId}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Fecha y Hora</span>
              <span className="text-white font-mono">{event.date} • {event.time} hrs</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Butacas Asignadas</span>
              <span className="text-rose-400 font-mono font-bold text-sm">
                {tickets.map((t) => t.seatLabel || t.seatId).join(", ")}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col items-center justify-center space-y-3">
            {qrUrl && (
              <div className="p-2 rounded-2xl bg-white shadow-md">
                <img src={qrUrl} alt="QR de Ingreso" className="w-28 h-28" />
              </div>
            )}
            <svg ref={barcodeRef} className="w-full max-w-[200px]" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{primaryTicket.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handlePrint}
          className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" /> Imprimir
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" /> Compartir
        </button>
      </div>

      {onOpenMyTickets && (
        <button
          type="button"
          onClick={onOpenMyTickets}
          className="w-full py-3 bg-zinc-900/80 hover:bg-zinc-800 text-rose-300 border border-rose-500/20 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <TicketIcon className="w-3.5 h-3.5 text-rose-400" /> Ver en Mis Entradas
        </button>
      )}

      <button
        type="button"
        onClick={onResetToStart}
        className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Explorar Otra Función en Cartelera</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
