import { useState, type FormEvent } from "react";
import { X, Lock, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "./useAuthStore";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, registerCitizen } = useAuth();
  const [tab, setTab] = useState<"admin" | "citizen">("admin");
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (tab === "citizen" && isRegistering) {
      const res = registerCitizen({ name, email, citizenId, passwordPlain: password });
      if (!res.success) return setError(res.error || "Error al crear cuenta");
      toast.success(`¡Bienvenido(a), ${res.user?.name}! Cuenta ciudadana creada.`);
      return onClose();
    }
    const res = login(email, password);
    if (!res.success) return setError(res.error || "Error de inicio de sesión");
    toast.success(`Sesión iniciada: ${res.user?.name} (${res.user?.role})`);
    onClose();
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    const res = login(quickEmail, quickPass);
    if (res.success) {
      toast.success(`Acceso concedido como ${res.user?.name}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-md w-full bg-[#11192b] border border-slate-800 rounded-3xl p-6 shadow-2xl text-left">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-white">Autenticación y Seguridad</h3>
            <p className="text-xs text-slate-400">Teatro Municipal • Control de Acceso</p>
          </div>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-5">
          <button type="button" onClick={() => { setTab("admin"); setIsRegistering(false); setError(null); }} className={`py-2 text-xs font-medium rounded-xl transition-all ${tab === "admin" ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20" : "text-slate-400"}`}>
            Personal Admin
          </button>
          <button type="button" onClick={() => { setTab("citizen"); setError(null); }} className={`py-2 text-xs font-medium rounded-xl transition-all ${tab === "citizen" ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20" : "text-slate-400"}`}>
            Cuenta Ciudadana
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-rose-500/10 text-rose-300 text-xs rounded-xl border border-rose-500/30 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "citizen" && isRegistering && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Nombre Completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Lucía Méndez" required className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Cédula</label>
                <input type="text" value={citizenId} onChange={(e) => setCitizenId(e.target.value)} placeholder="1-1456-0789" required className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correo.com" required className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
          </div>

          <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-amber-500/20">
            {tab === "citizen" && isRegistering ? "Crear Cuenta Ciudadana" : "Iniciar Sesión"}
          </motion.button>
        </form>

        {tab === "admin" ? (
          <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Acceso Rápido para Demostración:</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handleQuickLogin("marco@teatromunicipal.cr", "admin2026")} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-[11px] text-left flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Marco (Superadmin)</span>
              </button>
              <button type="button" onClick={() => handleQuickLogin("productora@teatromunicipal.cr", "teatro2026")} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] text-left flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Productora Global</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-amber-400 hover:underline">
              {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate gratis"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
