import React, { useState } from "react";
import { X, Lock, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, registerCitizen } = useAuthStore();
  const [tab, setTab] = useState<"admin" | "citizen">("admin");
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === "citizen" && isRegistering) {
      if (!name || !citizenId || !email || !password) {
        setError("Todos los campos son requeridos.");
        return;
      }
      const res = registerCitizen({ name, citizenId, email, passwordPlain: password });
      if (!res.success) {
        setError(res.error || "Error al registrar cuenta.");
      } else {
        toast.success("¡Cuenta ciudadana creada con éxito!");
        onClose();
      }
    } else {
      const res = login(email, password);
      if (!res.success) {
        setError(res.error || "Credenciales incorrectas.");
      } else {
        toast.success(`Bienvenido(a), ${res.user?.name}`);
        onClose();
      }
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    const res = login(quickEmail, quickPass);
    if (res.success) {
      toast.success(`Acceso concedido como ${res.user?.name}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-md w-full bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] rounded-3xl p-6 shadow-2xl text-left text-slate-900 dark:text-slate-100 transition-colors">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#ebf3fc] dark:bg-[#004ea2]/20 border border-[#004ea2]/30 dark:border-blue-500/30 flex items-center justify-center text-[#004ea2] dark:text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Autenticación y Seguridad</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Teatro Municipal de Alajuela • Plataforma Cívica</p>
          </div>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357] mb-5">
          <button type="button" onClick={() => { setTab("admin"); setIsRegistering(false); setError(null); }} className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${tab === "admin" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`}>
            Personal Admin
          </button>
          <button type="button" onClick={() => { setTab("citizen"); setError(null); }} className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${tab === "citizen" ? "bg-[#004ea2] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`}>
            Cuenta Ciudadana
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-900/50 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "citizen" && isRegistering && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Lucía Méndez" required className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]" />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1">Cédula</label>
                <input type="text" value={citizenId} onChange={(e) => setCitizenId(e.target.value)} placeholder="1-1456-0789" required className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correo.com" required className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]" />
          </div>

          <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-3 bg-[#c8102e] hover:bg-[#a60c25] text-white font-semibold rounded-2xl text-xs shadow-md shadow-red-900/20 transition-all cursor-pointer">
            {tab === "citizen" && isRegistering ? "Crear Cuenta Ciudadana" : "Iniciar Sesión"}
          </motion.button>
        </form>

        {tab === "admin" ? (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Acceso Rápido para Demostración:</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handleQuickLogin("marco@teatromunicipal.cr", "admin2026")} className="p-2 rounded-xl bg-slate-50 dark:bg-[#071324] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[11px] text-left flex items-center gap-1.5 cursor-pointer">
                <ShieldCheck className="w-3.5 h-3.5 text-[#004ea2] dark:text-blue-400 shrink-0" />
                <span className="truncate">Marco (Superadmin)</span>
              </button>
              <button type="button" onClick={() => handleQuickLogin("productora@teatromunicipal.cr", "teatro2026")} className="p-2 rounded-xl bg-slate-50 dark:bg-[#071324] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[11px] text-left flex items-center gap-1.5 cursor-pointer">
                <UserCheck className="w-3.5 h-3.5 text-[#004ea2] dark:text-blue-400 shrink-0" />
                <span className="truncate">Productora Global</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-[#004ea2] dark:text-blue-400 hover:underline cursor-pointer">
              {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate gratis"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
