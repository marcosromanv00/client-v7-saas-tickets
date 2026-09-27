import { z } from "zod";

export const StaffApprovalStatusSchema = z.enum(["PENDING_APPROVAL", "APPROVED", "REJECTED"]);
export type StaffApprovalStatus = z.infer<typeof StaffApprovalStatusSchema>;

export const StaffDutySchema = z.enum(["PUERTA", "TAQUILLA", "SALA", "INCIDENCIAS", "GENERAL"]);
export type StaffDuty = z.infer<typeof StaffDutySchema>;

export const StaffDutyInfo: Record<
  StaffDuty,
  { name: string; shortName: string; description: string; badgeClass: string }
> = {
  PUERTA: {
    name: "Atención de Puerta",
    shortName: "Puerta",
    description: "Escaneo de códigos QR y entrega de brazaletes",
    badgeClass: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
  },
  TAQUILLA: {
    name: "Taquilla Express",
    shortName: "Taquilla",
    description: "Emisión de boletos rápidos y cortesías institucionales",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  SALA: {
    name: "Acomodador de Sala",
    shortName: "Sala",
    description: "Guía de espectadores a butacas y verificación de acomodo",
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  INCIDENCIAS: {
    name: "Mesa de Incidencias",
    shortName: "Incidencias",
    description: "Atención rápida a contingencias y reportes en sala",
    badgeClass: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  },
  GENERAL: {
    name: "Supervisión / Apoyo",
    shortName: "General",
    description: "Apoyo transversal al equipo y logística del teatro",
    badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
};

export const StaffTimeEntrySchema = z.object({
  id: z.string(),
  staffId: z.string(),
  staffName: z.string(),
  staffCitizenId: z.string(),
  eventId: z.string(),
  eventTitle: z.string(),
  assignedDuty: StaffDutySchema,
  clockIn: z.string(),
  clockOut: z.string().optional(),
  totalMinutes: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});
export type StaffTimeEntry = z.infer<typeof StaffTimeEntrySchema>;
