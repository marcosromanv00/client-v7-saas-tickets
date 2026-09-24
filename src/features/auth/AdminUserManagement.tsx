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
      <div className="p-8 text-center text-zinc-400">
        <Lock className="w-10 h-10 text-amber-500/50 mx-auto mb-3" />
        <p>Solo el Superadministrador tiene permisos para gestionar cuentas de acceso.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">Crear Nuevo Administrador Delegado</h3>
            <p className="text-xs text-zinc-400">Genere accesos específicos para taquilla, puertas o producción externa</p>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 border ${msg.type === "success" ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-rose-950/40 border-rose-500/40 text-rose-300"}`}>
            {msg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">Nombre Completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Carlos Puerta Norte" className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">Correo Institucional</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="carlos@teatromunicipal.cr" className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">Contraseña Inicial</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Clave temporal" className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">Rol Operativo</label>
            <div className="flex gap-2">
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50">
                <option value="DELEGATED_ADMIN">Admin Delegado (Taquilla/Puerta)</option>
                <option value="PRODUCER">Productora General</option>
              </select>
              <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs rounded-lg transition-all shadow-lg shadow-amber-500/20 shrink-0">
                Crear
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Cuentas con Privilegios Administrativos ({adminUsers.length})</span>
          </div>
          <span className="text-[11px] text-zinc-500">Superadmin: {currentUser?.name}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/40 text-zinc-400 border-b border-zinc-800/50">
              <tr>
                <th className="py-3 px-4 font-medium">Usuario</th>
                <th className="py-3 px-4 font-medium">Correo</th>
                <th className="py-3 px-4 font-medium">Nivel de Acceso</th>
                <th className="py-3 px-4 font-medium">Estado</th>
                <th className="py-3 px-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {adminUsers.map((u: UserAccount) => {
                const isCurrent = u.id === currentUser?.id;
                const isSuper = u.role === "SUPERADMIN";
                const isProd = u.role === "PRODUCER";

                return (
                  <tr key={u.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-amber-300 font-bold border border-zinc-700">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                        {isCurrent && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">Tú</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-4">
                      {isSuper ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Superadmin (Marco)
                        </span>
                      ) : isProd ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Productora General
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Admin Delegado
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Activo
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isSuper && !isCurrent ? (
                        <button onClick={() => handleDelete(u.id, u.name)} className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Revocar Administrador">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-600 italic">Inmutable</span>
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
