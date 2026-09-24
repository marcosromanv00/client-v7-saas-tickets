export interface CutoffStatus {
  isWebLocked: boolean;
  isReleaseActive: boolean;
  minutesRemaining: number;
  statusText: string;
}

/**
 * Evalúa si faltan 20 minutos o menos para una función.
 * Si isWebLocked es true, la boletería web pública no permite nuevas reservas remotas.
 */
export function evaluateEventCutoff(
  eventDate: string,
  eventTime: string,
  cutoffMinutes: number = 20,
  currentTime: Date = new Date()
): CutoffStatus {
  try {
    const [hours, minutes] = eventTime.split(":").map(Number);
    const [year, month, day] = eventDate.split("-").map(Number);
    const eventStart = new Date(year, month - 1, day, hours, minutes, 0);

    const diffMs = eventStart.getTime() - currentTime.getTime();
    const minutesRemaining = Math.floor(diffMs / (60 * 1000));

    const isWebLocked = minutesRemaining <= cutoffMinutes;
    const isReleaseActive = minutesRemaining <= 15;

    let statusText = "Boletería Web Abierta";
    if (minutesRemaining <= 0) {
      statusText = "Función Iniciada";
    } else if (isReleaseActive) {
      statusText = "Butacas Liberadas en Taquilla (A falta de 15 min)";
    } else if (isWebLocked) {
      statusText = "Boletería Web Cerrada (Solicite en Taquilla Física)";
    }

    return {
      isWebLocked,
      isReleaseActive,
      minutesRemaining,
      statusText,
    };
  } catch {
    return {
      isWebLocked: false,
      isReleaseActive: false,
      minutesRemaining: 999,
      statusText: "Horario regular",
    };
  }
}
