import React, { useState } from "react";
import { X, ShieldCheck, FileText, Clock, AlertTriangle, Scale, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "terms" | "privacy";
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "terms",
}) => {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">(defaultTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-teatro-navy-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900 dark:text-slate-100"
        >
          {/* Cabecera */}
          <div className="p-5 border-b border-slate-200 dark:border-teatro-navy-border flex items-center justify-between bg-slate-50/50 dark:bg-[#071324]/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teatro-blue/10 dark:bg-blue-900/30 flex items-center justify-center text-teatro-blue dark:text-blue-400">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight">Marco Legal y Normativa Cívica</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Teatro Municipal de Alajuela • Municipalidad de Alajuela</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pestañas */}
          <div className="flex border-b border-slate-200 dark:border-teatro-navy-border px-6 gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("terms")}
              className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "terms"
                  ? "border-teatro-blue text-teatro-blue dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Términos y Condiciones de Acceso</span>
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "privacy"
                  ? "border-teatro-blue text-teatro-blue dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Política de Privacidad (Ley N° 8968)</span>
            </button>
          </div>

          {/* Contenido con Scroll */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {activeTab === "terms" ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[12px]">Cláusula Inviolable: Liberación de Butacas 15 Minutos Antes</h3>
                    <p className="mt-0.5 text-[11px] leading-normal">
                      Las entradas son gratuitas y patrimoniales. Toda reserva que no sea registrada (check-in con QR o código) en puerta con al menos <strong>15 minutos de antelación</strong> a la hora de función será <strong>liberada de forma automática e irrevocable</strong> para los asistentes presentes en lista de espera (walk-ins).
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teatro-blue dark:text-blue-400" />
                    1. Gratuidad y Prohibición de Reventa
                  </h4>
                  <p>
                    Las entradas emitidas para el Teatro Municipal de Alajuela son de carácter público, gratuito y cultural. Queda terminantemente prohibida su reventa, cesión comercial o lucro bajo apercibimiento de acciones civiles y penales pertinentes.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-muni-red" />
                    2. Límite de Entradas por Ciudadano
                  </h4>
                  <p>
                    Para democratizar el acceso y evitar el acaparamiento de espacios, cada ciudadano podrá reservar un <strong>máximo de 2 entradas por evento</strong> vinculadas a su número de documento de identidad oficial.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">3. Normativa de Sala y Patrimonio Histórico</h4>
                  <p>
                    No se permite el ingreso con alimentos ni bebidas a la sala principal. Se solicita mantener los dispositivos celulares en modo silencioso y respetar las instrucciones del personal de acomodación y protocolo. La administración se reserva el derecho de admisión.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-2xl flex items-start gap-3 text-blue-950 dark:text-blue-200">
                  <Lock className="w-5 h-5 text-teatro-blue dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[12px]">Protección de Datos Personales (Ley N° 8968 Costa Rica)</h3>
                    <p className="mt-0.5 text-[11px] leading-normal">
                      En cumplimiento de la legislación costarricense, sus datos personales son recolectados de forma legítima, transparente y proporcional exclusivamente para fines de acreditación y aforo.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">1. Responsable del Tratamiento</h4>
                  <p>
                    La Municipalidad de Alajuela y la Administración del Teatro Municipal, sita en Costado Oeste del Parque Central de Alajuela, son los custodios de la base de datos de reservas culturales.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">2. Finalidad Exclusiva</h4>
                  <p>
                    La información recolectada (Nombre, Documento de Identidad, Teléfono y Correo Electrónico) se utiliza única y exclusivamente para:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400">
                    <li>Emisión del tiquete con código QR y código corto de verificación.</li>
                    <li>Control de aforo y seguridad humana en puerta de acceso.</li>
                    <li>Contacto preventivo en caso de reprogramación o contingencia del evento.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">3. Confidencialidad y Derechos ARCO</h4>
                  <p>
                    Sus datos no serán transferidos, vendidos ni cedidos a terceros. Podrá ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición remitiendo su solicitud a <em>cultura@munialajuela.go.cr</em>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pie */}
          <div className="p-4 border-t border-slate-200 dark:border-teatro-navy-border flex justify-end bg-slate-50/50 dark:bg-[#071324]/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-teatro-blue hover:bg-teatro-blue-hover text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              Comprendido y Aceptado
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
