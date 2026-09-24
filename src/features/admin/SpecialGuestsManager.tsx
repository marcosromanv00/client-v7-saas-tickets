import React, { useState } from "react";
import { Plus, ShieldCheck, Ticket } from "lucide-react";
import { SpecialGuestEntry, TheaterEvent } from "../tickets/types";
import { useTheaterStore } from "../tickets/useTheaterStore";

interface SpecialGuestsManagerProps {
  event: TheaterEvent;
}

export function SpecialGuestsManager({ event }: SpecialGuestsManagerProps) {
  const store = useTheaterStore();
  const [name, setName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [count, setCount] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const eventGuests = store.specialGuests.filter((g) => g.eventId === event.id);

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: SpecialGuestEntry = {
      id: `sp-${Date.now()}`,
      eventId: event.id,
      name: name.trim() || "Bloque de Invitaciones de Protocolo",
      citizenId: citizenId.trim() || null,
      seatId: null,
      ticketsCount: Math.max(1, count),
      notes: notes.trim() || undefined,
      redeemedCount: 0,
    };
    store.addSpecialGuest(newEntry);
    setName("");
    setCitizenId("");
    setCount(1);
    setNotes("");
    setIsAdding(false);
  };

  const handleRedeemPass = (guest: SpecialGuestEntry) => {
    const res = store.bookTicket({
      eventId: event.id,
      citizenName: guest.name || `Invitado Institucional (${guest.notes || "Protocolo"})`,
      citizenId: guest.citizenId || `VIP-${Math.floor(Math.random() * 10000)}`,
      seatId: null,
      zone: "PLANTA_BAJA",
      isVipGuest: true,
      notes: `Protocolo Especial: ${guest.notes || "Lista Privada"}`,
    });
    if (res.success) {
      guest.redeemedCount = Math.min(guest.ticketsCount, guest.redeemedCount + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-[#1e355b] p-6 shadow-sm space-y-5 text-left transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#1e355b] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#004ea2] dark:text-blue-400" />
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Lista Especial y Cupos de Protocolo</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gestión de invitaciones directas con nombre o bloques de entradas reservadas del Teatro Municipal.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#004ea2] hover:bg-[#003c80] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? "Cerrar Formulario" : "Precargar Invitación"}</span>
        </button>
      </div>

      {/* Formulario de Alta de Invitados */}
      {isAdding && (
        <form onSubmit={handleAddGuest} className="p-5 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1">
                Nombre de Titular o Delegación
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Ministerio de Cultura o Don Fernando Solís"
                className="w-full px-3 py-2 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1">
                Cédula (Opcional si es bloque sin nombre)
              </label>
              <input
                type="text"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                placeholder="Ej: 1-0422-0911 (o dejar vacío)"
                className="w-full px-3 py-2 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1">Cupos Reservados</label>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1">Notas de Protocolo / Ubicación</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Fila A Presidencial, Autoridades cantonales"
                className="w-full px-3 py-2 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-[#c8102e] hover:bg-[#a60c25] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Guardar en Lista Especial
            </button>
          </div>
        </form>
      )}

      {/* Lista de Invitados y Bloques Especiales */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {eventGuests.map((guest) => {
          const isFull = guest.redeemedCount >= guest.ticketsCount;
          return (
            <div key={guest.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{guest.name || "Bloque sin nombre asignado"}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ebf3fc] dark:bg-[#004ea2]/20 text-[#004ea2] dark:text-blue-300 border border-[#004ea2]/30 font-mono text-[10px] font-semibold">
                    {guest.ticketsCount} {guest.ticketsCount === 1 ? "cupo" : "cupos"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                  {guest.citizenId && <span>Doc: {guest.citizenId}</span>}
                  <span>{guest.notes || "Invitación de protocolo"}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Redimidos: {guest.redeemedCount} / {guest.ticketsCount}
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  disabled={isFull}
                  onClick={() => handleRedeemPass(guest)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-[#071324] hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Ticket className="w-3.5 h-3.5 text-[#004ea2] dark:text-blue-400" />
                  <span>{isFull ? "Completado" : "Emitir Pase"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
