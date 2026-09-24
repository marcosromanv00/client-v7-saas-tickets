import React from "react";
import { useAuthStore } from "./useAuthStore";
import { useTheaterStore } from "../tickets/useTheaterStore";
import { Ticket, TheaterEvent } from "../tickets/types";
import { X, Bell, Ticket as TicketIcon, QrCode, LogOut } from "lucide-react";

interface CitizenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicketForQr?: (ticket: Ticket) => void;
}

export const CitizenAccountDrawer: React.FC<CitizenDrawerProps> = ({ isOpen, onClose, onSelectTicketForQr }) => {
  const { currentUser, logout, updateNotifications } = useAuthStore();
  const store = useTheaterStore();
  const { tickets, events } = store;

  if (!isOpen || !currentUser) return null;

  const userTickets = tickets.filter(
    (t: Ticket) =>
      (currentUser.citizenId && t.citizenId === currentUser.citizenId) ||
      (currentUser.name && t.citizenName.toLowerCase().includes(currentUser.name.toLowerCase()))
  );

  const prefs = currentUser.notifications;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#071324] border-l border-slate-200 dark:border-[#192f52] text-slate-900 dark:text-slate-100 h-full overflow-y-auto flex flex-col z-10 shadow-2xl transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-[#192f52] flex items-center justify-between bg-slate-50 dark:bg-[#0b1a30]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#004ea2] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">{currentUser.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
              {currentUser.citizenId && <p className="text-[10px] text-[#004ea2] dark:text-blue-400 font-mono font-semibold">Cédula: {currentUser.citizenId}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-6">
          <div className="bg-slate-50 dark:bg-[#0b1a30] border border-slate-200 dark:border-[#192f52] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-[#004ea2] dark:text-blue-400" />
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Notificaciones y Alertas de Eventos</h3>
            </div>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Avisos por WhatsApp (Recordatorio de Función)</span>
                <input
                  type="checkbox"
                  checked={prefs.whatsapp}
                  onChange={(e) => updateNotifications({ whatsapp: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-700 text-[#004ea2] focus:ring-0 w-4 h-4 accent-[#004ea2]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Copia de Pase Digital por Correo</span>
                <input
                  type="checkbox"
                  checked={prefs.email}
                  onChange={(e) => updateNotifications({ email: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-700 text-[#004ea2] focus:ring-0 w-4 h-4 accent-[#004ea2]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Mensajes de Texto SMS</span>
                <input
                  type="checkbox"
                  checked={prefs.sms}
                  onChange={(e) => updateNotifications({ sms: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-700 text-[#004ea2] focus:ring-0 w-4 h-4 accent-[#004ea2]"
                />
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-[#004ea2] dark:text-blue-400" />
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Mis Tiquetes Registrados ({userTickets.length})</h3>
              </div>
            </div>

            {userTickets.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/40">
                <TicketIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">Aún no tienes tiquetes vinculados a esta cuenta.</p>
                <p className="text-[11px] text-slate-400 mt-1">Al reservar en taquilla o en línea con tu cédula aparecerán aquí automáticamente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userTickets.map((ticket: Ticket) => {
                  const ev = events.find((e: TheaterEvent) => e.id === ticket.eventId);
                  const isUsed = ticket.checkedIn;

                  return (
                    <div key={ticket.id} className="p-3 bg-slate-50 dark:bg-[#0b1a30] border border-slate-200 dark:border-[#192f52] rounded-xl flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#004ea2] dark:text-blue-400 text-xs">Butaca {ticket.seatLabel || ticket.seatId}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isUsed ? "bg-slate-200 dark:bg-slate-800 text-slate-500" : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}`}>
                            {isUsed ? "Ingresado" : "Confirmado"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-900 dark:text-white font-medium line-clamp-1">{ev?.title || "Función Teatro Municipal"}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{ticket.id}</p>
                      </div>

                      {onSelectTicketForQr && (
                        <button
                          onClick={() => {
                            onSelectTicketForQr(ticket);
                            onClose();
                          }}
                          className="p-2 bg-[#ebf3fc] dark:bg-[#004ea2]/20 hover:bg-[#004ea2]/25 text-[#004ea2] dark:text-blue-300 rounded-lg border border-[#004ea2]/30 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
                          title="Ver Pase QR"
                        >
                          <QrCode className="w-4 h-4" />
                          <span className="hidden sm:inline">Pase</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-[#192f52] bg-slate-50 dark:bg-[#0b1a30]">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
