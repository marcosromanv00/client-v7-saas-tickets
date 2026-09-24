import { BraceletColor } from "./types";

export const DEFAULT_BRACELET_COLORS: BraceletColor[] = [
  {
    id: "azul-rey",
    name: "Azul Rey",
    hex: "#004ea2",
    description: "Brazalete Azul Rey Oficial - Municipalidad y Teatro de Alajuela",
  },
  {
    id: "plateado",
    name: "Plateado",
    hex: "#94a3b8",
    description: "Brazalete Plateado Cívico - Brillo satinado para acceso de gala",
  },
  {
    id: "rojo",
    name: "Rojo",
    hex: "#c8102e",
    description: "Brazalete Rojo Carmesí Institucional - Identidad Alajuela",
  },
  {
    id: "negro",
    name: "Negro",
    hex: "#0f172a",
    description: "Brazalete Negro Escénico - Acabado premium proscenio",
  },
];

const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Evita 'I' y 'O' para máxima legibilidad humana

/**
 * Genera un código de 4 caracteres: 2 letras mayúsculas y 2 dígitos (ej: "AL14", "TM82")
 */
export function generateShortCode(existingCodes?: Set<string>): string {
  let code = "";
  let attempts = 0;

  do {
    const l1 = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const l2 = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    code = `${l1}${l2}${n1}${n2}`;
    attempts++;
  } while (existingCodes && existingCodes.has(code) && attempts < 100);

  return code;
}
