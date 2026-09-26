import React, { useState } from "react";
import { X, Check, Palette, Plus } from "lucide-react";
import { BraceletColor } from "../tickets/types";
import { DEFAULT_BRACELET_COLORS } from "../tickets/bracelet-utils";
import { toast } from "sonner";

interface BraceletColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColorHex?: string;
  currentColorName?: string;
  availableColors?: BraceletColor[];
  onSaveColor: (color: BraceletColor) => void;
}

export const BraceletColorPickerModal: React.FC<BraceletColorPickerModalProps> = ({
  isOpen,
  onClose,
  currentColorHex = "#10b981",
  currentColorName = "Verde Neón",
  availableColors = DEFAULT_BRACELET_COLORS,
  onSaveColor,
}) => {
  const [selectedHex, setSelectedHex] = useState(currentColorHex);
  const [selectedName, setSelectedName] = useState(currentColorName);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customHex, setCustomHex] = useState("#10b981");

  if (!isOpen) return null;

  const handlePickPreset = (color: BraceletColor) => {
    setSelectedHex(color.hex);
    setSelectedName(color.name);
    setIsCustomMode(false);
  };

  const handleApply = () => {
    let finalColor: BraceletColor;
    if (isCustomMode && customName.trim()) {
      finalColor = {
        id: `custom-${Date.now()}`,
        name: customName.trim(),
        hex: customHex,
        description: `Brazalete personalizado: ${customName.trim()}`,
      };
    } else {
      const match = availableColors.find((c) => c.hex.toLowerCase() === selectedHex.toLowerCase());
      finalColor = match || {
        id: `color-${Date.now()}`,
        name: selectedName,
        hex: selectedHex,
      };
    }

    onSaveColor(finalColor);
    toast.success(`Color oficial de brazalete actualizado a: ${finalColor.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-[#071324] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teatro-blue/10 dark:bg-blue-500/20 text-teatro-blue dark:text-blue-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Cambiar Color de Brazalete</h3>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Sincronización instantánea en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vista Previa Activa */}
        <div className="p-4 bg-slate-50 dark:bg-[#0b1a30] border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Vista Previa de Brazalete:
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#071324] border border-slate-200 dark:border-slate-700 shadow-xs">
            <span
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900"
              style={{ backgroundColor: isCustomMode ? customHex : selectedHex }}
            />
            <span className="text-xs font-bold font-mono">
              {isCustomMode ? customName || "Personalizado" : selectedName}
            </span>
          </div>
        </div>

        {/* Cuadrícula de Colores Disponibles */}
        <div className="p-5 space-y-4 max-h-72 overflow-y-auto">
          <span className="text-2xs font-mono uppercase font-bold tracking-wider text-slate-400">
            Colores Tyvek Oficiales
          </span>

          <div className="grid grid-cols-2 gap-2">
            {availableColors.map((color) => {
              const isSelected =
                !isCustomMode && selectedHex.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handlePickPreset(color)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40 border-teatro-blue dark:border-blue-500 shadow-xs"
                      : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-800 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold truncate leading-tight">
                      {color.name}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teatro-blue dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Opción de Color Personalizado */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="flex items-center gap-2 text-xs font-medium text-teatro-blue dark:text-blue-400 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCustomMode ? "Usar color predefinido" : "Ingresar otro color físico"}</span>
            </button>

            {isCustomMode && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <input
                  type="text"
                  placeholder="Nombre (ej: Naranja Fluorescente)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-[#071324]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-white dark:bg-[#071324]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="p-4 bg-slate-50 dark:bg-[#0b1a30] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teatro-blue hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-xs cursor-pointer"
          >
            Aplicar Color
          </button>
        </div>
      </div>
    </div>
  );
};
