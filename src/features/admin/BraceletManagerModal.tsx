import React, { useState } from "react";
import { X, Tag, Plus, Check, Trash2 } from "lucide-react";
import { BraceletColor } from "../tickets/types";

interface BraceletManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: BraceletColor[];
  onSave: (updatedColors: BraceletColor[]) => void;
}

export function BraceletManagerModal({ isOpen, onClose, colors, onSave }: BraceletManagerModalProps) {
  const [list, setList] = useState<BraceletColor[]>(colors);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#004ea2");
  const [newColorDesc, setNewColorDesc] = useState("");

  if (!isOpen) return null;

  const handleUpdate = (id: string, field: "name" | "hex" | "description", val: string) => {
    setList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;
    const newEntry: BraceletColor = {
      id: `col-${Date.now()}`,
      name: newColorName.trim(),
      hex: newColorHex,
      description: newColorDesc.trim() || undefined,
    };
    setList((prev) => [...prev, newEntry]);
    setNewColorName("");
    setNewColorDesc("");
  };

  const handleDelete = (id: string) => {
    if (list.length <= 1) return;
    setList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveAll = () => {
    onSave(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a30] rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-teatro-navy-border overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100 transition-colors max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-teatro-navy-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-teatro-blue dark:text-blue-400" />
            <div>
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Catálogo de Brazaletes de Entrada</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Configure los colores y qué significa cada uno</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Lista de Colores Actuales */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 font-mono uppercase text-[10px] tracking-wider">
              Colores Registrados ({list.length})
            </h4>
            <div className="space-y-2.5">
              {list.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-[#1a3357] flex items-start gap-3"
                >
                  <input
                    type="color"
                    value={item.hex}
                    onChange={(e) => handleUpdate(item.id, "hex", e.target.value)}
                    className="w-8 h-8 rounded-xl border-0 cursor-pointer shrink-0 mt-0.5"
                    title="Seleccionar color"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
                      placeholder="Nombre del color (ej. Azul Rey)"
                      className="w-full font-semibold px-2 py-1 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
                      placeholder="Significado / uso (ej. Acceso Platea y Galas)"
                      className="w-full px-2 py-1 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-lg text-slate-500 dark:text-slate-400 text-[11px]"
                    />
                  </div>
                  {list.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Eliminar color"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Formulario para Agregar Nuevo Color */}
          <form onSubmit={handleAdd} className="p-4 bg-slate-100/70 dark:bg-[#061120] rounded-2xl border border-dashed border-slate-200 dark:border-teatro-navy-border space-y-3">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Agregar Nuevo Color al Catálogo</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-8 h-8 rounded-xl border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Nombre del Color (ej. Dorado)"
                className="flex-1 px-3 py-1.5 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
            <input
              type="text"
              value={newColorDesc}
              onChange={(e) => setNewColorDesc(e.target.value)}
              placeholder="Significado o uso asignado..."
              className="w-full px-3 py-1.5 bg-white dark:bg-[#0b1a30] border border-slate-200 dark:border-teatro-navy-border rounded-xl text-xs text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newColorName.trim()}
              className="w-full py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Color
            </button>
          </form>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-teatro-navy-border flex justify-end gap-2 bg-slate-50 dark:bg-[#071324]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-teatro-blue hover:bg-teatro-blue-hover text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" /> Guardar Catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
