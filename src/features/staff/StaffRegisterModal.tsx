import React, { useState } from "react";
import { UserPlus, X, AlertCircle } from "lucide-react";
import { useAuthStore } from "../auth/useAuthStore";
import { StaffDuty } from "./types";

interface StaffRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void;
}

export const StaffRegisterModal: React.FC<StaffRegisterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { registerStaff } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [duty, setDuty] = useState<StaffDuty>("PUERTA");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !citizenId.trim() || !password.trim()) {
      setError("Por favor complete todos los campos obligatorios (*).");
      return;
    }

    const res = registerStaff({
      name: name.trim(),
      email: email.trim(),
      citizenId: citizenId.trim(),
      phone: phone.trim() || undefined,
      passwordPlain: password,
      requestedDuty: duty,
    });

    if (res.success) {
      onSuccess(name);
      onClose();
    } else {
      setError(res.error || "Error al registrar el personal");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teatro-blue-light dark:bg-teatro-blue/20 text-teatro-blue dark:text-blue-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Registrar Nuevo Colaborador</h3>
              <p className="text-xs text-slate-500">Validación obligatoria por Cédula de Identidad</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nombre Completo *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ana Lucía Arguedas" className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cédula Oficial *</label>
              <input type="text" value={citizenId} onChange={(e) => setCitizenId(e.target.value)} placeholder="Ej. 204560789" className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Teléfono</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="8888-0000" className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Correo Electrónico *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ana@teatromunicipal.cr" className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contraseña *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Puesto Inicial</label>
              <select value={duty} onChange={(e) => setDuty(e.target.value as StaffDuty)} className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer">
                <option value="PUERTA">Puerta</option>
                <option value="TAQUILLA">Taquilla</option>
                <option value="SALA">Sala</option>
                <option value="INCIDENCIAS">Incidencias</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-teatro-blue hover:bg-teatro-blue-hover text-white font-semibold rounded-xl shadow-xs cursor-pointer">Registrar Solicitud</button>
          </div>
        </form>
      </div>
    </div>
  );
};
