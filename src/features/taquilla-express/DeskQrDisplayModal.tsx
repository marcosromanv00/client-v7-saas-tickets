import React, { useEffect, useState } from "react";
import { X, QrCode, Copy, ExternalLink, Check } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { TheaterEvent } from "../tickets/types";

interface DeskQrDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TheaterEvent;
}

export const DeskQrDisplayModal: React.FC<DeskQrDisplayModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const kioskUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?mode=walkin-kiosk&eventId=${event.id}`
    : `https://teatro.alajuela.go.cr/?mode=walkin-kiosk&eventId=${event.id}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(kioskUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#004ea2",
          light: "#ffffff",
        },
      })
        .then(setQrDataUrl)
        .catch((err) => console.error("Error generating desk QR", err));
    }
  }, [isOpen, kioskUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(kioskUrl);
    setCopied(true);
    toast.success("Enlace de Auto-Registro copiado al portapapeles.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenKiosk = () => {
    window.open(kioskUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a30] rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-teatro-navy-border overflow-hidden animate-in fade-in zoom-in-95 text-slate-900 dark:text-slate-100 text-center">
        <div className="px-5 py-4 bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-teatro-navy-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-teatro-blue dark:text-blue-400" />
            <h3 className="text-sm font-bold tracking-tight">QR de Auto-Registro en Mesa</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357]">
            <p className="font-bold text-xs text-slate-900 dark:text-white">{event.title}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Boletería Presencial • Función {event.time} hrs</p>
          </div>

          <div className="flex justify-center p-3 bg-white rounded-2xl shadow-inner border border-slate-200 inline-block mx-auto">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Auto-Registro en Mesa" className="w-52 h-52 object-contain" />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400">Generando QR...</div>
            )}
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed px-2">
            Coloque este código visible en la mesa. Los asistentes pueden escanearlo con su teléfono para solicitar su entrada directamente in-situ y pasar a sala.
          </p>

          <div className="flex gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copiado" : "Copiar Enlace"}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenKiosk}
              className="flex-1 py-2 px-3 bg-teatro-blue hover:bg-teatro-blue-hover text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir Kiosco</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
