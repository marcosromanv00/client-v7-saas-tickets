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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 text-white h-full overflow-y-auto flex flex-col z-10 shadow-2xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-black text-sm shadow-lg shadow-amber-500/20">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">{currentUser.name}</h2>
              <p className="text-xs text-zinc-400">{currentUser.email}</p>
              {currentUser.citizenId && <p className="text-[10px] text-amber-400 font-mono">Cédula: {currentUser.citizenId}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Notificaciones y Alertas de Eventos</h3>
            </div>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-zinc-300">Avisos por WhatsApp (Recordatorio de Función)</span>
                <input
                  type="checkbox"
                  checked={prefs.whatsapp}
                  onChange={(e) => updateNotifications({ whatsapp: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-zinc-300">Copia de Pase Digital por Correo</span>
                <input
                  type="checkbox"
                  checked={prefs.email}
                  onChange={(e) => updateNotifications({ email: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-zinc-300">Mensajes de Texto SMS</span>
                <input
                  type="checkbox"
                  checked={prefs.sms}
                  onChange={(e) => updateNotifications({ sms: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Mis Tiquetes Registrados ({userTickets.length})</h3>
              </div>
            </div>

            {userTickets.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                <TicketIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Aún no tienes tiquetes vinculados a esta cuenta.</p>
                <p className="text-[11px] text-zinc-600 mt-1">Al reservar en taquilla o en línea con tu cédula aparecerán aquí automáticamente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userTickets.map((ticket: Ticket) => {
                  const ev = events.find((e: TheaterEvent) => e.id === ticket.eventId);
                  const isUsed = ticket.checkedIn;

                  return (
                    <div key={ticket.id} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between hover:border-zinc-700 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400 text-xs">Butaca {ticket.seatLabel || ticket.seatId}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isUsed ? "bg-zinc-800 text-zinc-400" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`}>
                            {isUsed ? "Ingresado" : "Confirmado"}
                          </span>
                        </div>
                        <p className="text-xs text-white font-medium line-clamp-1">{ev?.title || "Función Teatro Municipal"}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{ticket.id}</p>
                      </div>

                      {onSelectTicketForQr && (
                        <button
                          onClick={() => {
                            onSelectTicketForQr(ticket);
                            onClose();
                          }}
                          className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1.5 text-xs"
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

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
