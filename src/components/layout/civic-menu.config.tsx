import React from "react";
import {
  Home,
  Ticket as TicketIcon,
  QrCode,
  Zap,
  Armchair,
  Shield,
  AlertTriangle,
  Users,
  Clock,
  Wrench,
} from "lucide-react";
import { ActiveTab } from "./CivicHeader";

export interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const getRoleLabel = (role?: string): string => {
  if (role === "SUPERADMIN") return "Superadministrador";
  if (role === "PRODUCER") return "Productor / Staff";
  if (role === "DELEGATED_ADMIN") return "Admin Delegado";
  return "Ciudadano";
};

export const getMainItems = (): NavItem[] => [
  { id: "home", label: "Panel Central / Inicio", icon: <Home className="w-4 h-4 text-teatro-blue" /> },
  { id: "public", label: "Cartelera de Obras", icon: <TicketIcon className="w-4 h-4 text-rose-500" /> },
];

export const getOpsItems = (): NavItem[] => [
  { id: "sala", label: "Control de Sala & Acomodadores", icon: <Armchair className="w-4 h-4 text-emerald-500" /> },
  { id: "puerta", label: "Control de Puerta & Brazaletes", icon: <QrCode className="w-4 h-4 text-teal-500" /> },
  { id: "taquilla", label: "Taquilla Express & Venta", icon: <Zap className="w-4 h-4 text-amber-500" /> },
];

export const getAdminItems = (openIncidentsCount: number): NavItem[] => [
  { id: "incidencias", label: "Mesa de Incidencias en Sala", icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, badge: openIncidentsCount },
  { id: "personal", label: "Personal, Roles & Mi Turno", icon: <Users className="w-4 h-4 text-indigo-500" /> },
  { id: "admin", label: "Administración de Aforo", icon: <Shield className="w-4 h-4 text-blue-500" /> },
];

export const getToolsItems = (): NavItem[] => [
  { id: "registro-horas", label: "Registro de Horarios (Personal)", icon: <Clock className="w-4 h-4 text-teal-500" /> },
  { id: "reporte-incidencias", label: "Reporte Rápido de Averías", icon: <Wrench className="w-4 h-4 text-slate-400" /> },
];
