import React, { useState } from "react";
import { useAuthStore } from "./useAuthStore";
import { UserRole, UserAccount } from "./types";
import { UserPlus, Trash2, Shield, Lock, CheckCircle2, AlertCircle } from "lucide-react";

export const AdminUserManagement: React.FC = () => {
  const { users, currentUser, isSuperAdmin, createAdminUser, deleteAdminUser } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("DELEGATED_ADMIN");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const adminUsers = users.filter((u: UserAccount) => u.role !== "CITIZEN");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMsg({ type: "error", text: "Complete todos los campos obligatorios." });
      return;
    }
    const res = createAdminUser({ name, email, passwordPlain: password, role });
    if (res.success) {
      setMsg({ type: "success", text: `Administrador ${name} creado con éxito.` });
      setName("");
      setEmail("");
      setPassword("");
    } else {
      setMsg({ type: "error", text: res.error || "Error al crear usuario" });
    }
  };

  const handleDelete = (id: string, adminName: string) => {
    if (!confirm(`¿Eliminar al administrador ${adminName}? Perderá acceso inmediato.`)) return;
    const res = deleteAdminUser(id);
    if (res.success) {
      setMsg({ type: "success", text: `Usuario ${adminName} revocado.` });
    } else {
      setMsg({ type: "error", text: res.error || "No se pudo eliminar." });
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <Lock className="w-10 h-10 text-[#004ea2]/50 dark:text-blue-500/50 mx-auto mb-3" />
        <p>Solo el Superadministrador tiene permisos para gestionar cuentas de acceso.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] rounded-2xl p-5 shadow-sm transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[#ebf3fc] dark:bg-[#004ea2]/20 text-[#004ea2] dark:text-blue-400 border border-[#004ea2]/30">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base tracking-tight">Crear Nuevo Administrador Delegado</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Genere accesos específicos para taquilla, puertas o producción externa</p>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 border ${msg.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300"}`}>
            {msg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">Nombre Completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Carlos Puerta Norte" className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#004ea2]" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">Correo Institucional</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="carlos@teatromunicipal.cr" className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#004ea2]" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">Contraseña Inicial</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Clave temporal" className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#004ea2]" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">Rol Operativo</label>
            <div className="flex gap-2">
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="flex-1 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-[#1a3357] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#004ea2]">
                <option value="DELEGATED_ADMIN">Admin Delegado (Taquilla/Puerta)</option>
                <option value="PRODUCER">Productora General</option>
              </select>
              <button type="submit" className="px-4 py-2 bg-[#004ea2] hover:bg-[#003c80] text-white font-semibold text-xs rounded-lg transition-all shadow-xs shrink-0 cursor-pointer">
                Crear
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-[#1e355b] rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-[#1e355b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#004ea2] dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Cuentas con Privilegios Administrativos ({adminUsers.length})</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Superadmin: {currentUser?.name}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#071324] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">Usuario</th>
                <th className="py-3 px-4 font-medium">Correo</th>
                <th className="py-3 px-4 font-medium">Nivel de Acceso</th>
                <th className="py-3 px-4 font-medium">Estado</th>
                <th className="py-3 px-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adminUsers.map((u: UserAccount) => {
                const isCurrent = u.id === currentUser?.id;
                const isSuper = u.role === "SUPERADMIN";
                const isProd = u.role === "PRODUCER";

                return (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-[#004ea2] dark:text-blue-300 font-bold border border-slate-300 dark:border-slate-700">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                        {isCurrent && <span className="text-[10px] bg-[#ebf3fc] dark:bg-[#004ea2]/20 text-[#004ea2] dark:text-blue-300 px-1.5 py-0.5 rounded border border-[#004ea2]/30 font-semibold">Tú</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-4">
                      {isSuper ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fdf2f4] dark:bg-red-950/40 text-[#c8102e] dark:text-red-300 border border-[#c8102e]/30">
                          Superadmin (Marco)
                        </span>
                      ) : isProd ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          Productora General
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ebf3fc] dark:bg-[#004ea2]/20 text-[#004ea2] dark:text-blue-300 border border-[#004ea2]/30">
                          Admin Delegado
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Activo
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isSuper && !isCurrent ? (
                        <button onClick={() => handleDelete(u.id, u.name)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer" title="Revocar Administrador">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Inmutable</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
