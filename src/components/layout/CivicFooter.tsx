import React from "react";
import { ArrowUp, MapPin, Phone, Mail, Clock, Shield } from "lucide-react";

interface CivicFooterProps {
  onSelectAdminTab?: (tab: "taquilla" | "puerta" | "admin") => void;
}

export const CivicFooter: React.FC<CivicFooterProps> = ({ onSelectAdminTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 dark:bg-[#030914] text-slate-300 dark:text-slate-400 border-t border-slate-800 dark:border-[#10203a] text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Columna 1: Identidad Institucional */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base text-white font-semibold tracking-tight">Teatro Municipal de Alajuela</h3>
              <p className="text-xs text-[#c59223] font-medium font-mono">Municipalidad de Alajuela</p>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Monumento Histórico y Cultural de la Provincia de Alajuela. Un escenario cívico dedicado al patrimonio, la cultura y las artes escénicas.
            </p>
            <p className="text-slate-500 text-xs font-mono">
              Acreditación Oficial: Registro Cultural Alajuela N° AL-TMA-1890.
            </p>
          </div>

          {/* Columna 2: Servicios y Programación */}
          <div className="space-y-4">
            <h3 className="text-sm text-white font-semibold tracking-tight uppercase tracking-wider">Temporada 2026</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Agenda de Reapertura Teatral</li>
              <li>Entre Héroes y Amigos (40 Años)</li>
              <li>Escats en Concierto Sinfónico</li>
              <li>Temporada de Dramaturgia Juvenil</li>
              <li>Convocatorias Ciudadanas Alajuela</li>
            </ul>
          </div>

          {/* Columna 3: Normativa y Operación de Sala */}
          <div className="space-y-4">
            <h3 className="text-sm text-white font-semibold tracking-tight uppercase tracking-wider">Operación y Acceso</h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#c59223] mt-0.5 shrink-0" />
                <span>Apertura de puertas: 45 min antes de función. Se reserva el derecho de admisión al iniciar la obra.</span>
              </div>
              <p>Capacidad autorizada: 190 butacas (120 en Platea y 70 en Balcón Histórico).</p>
            </div>
          </div>

          {/* Columna 4: Sede Física & Contacto Verificable */}
          <div className="space-y-4">
            <h3 className="text-sm text-white font-semibold tracking-tight uppercase tracking-wider">Sede & Contacto Cívico</h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c59223] mt-0.5 shrink-0" />
                <span>Costado Oeste del Parque Central, Alajuela, Costa Rica.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c59223] shrink-0" />
                <span>Boletería: 2431-3961 / 8524-7247</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c59223] shrink-0" />
                <span>cultura@munialajuela.go.cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-16 pt-8 border-t border-slate-800 dark:border-[#10203a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Teatro Municipal de Alajuela • Municipalidad de Alajuela.</p>
          <div className="flex items-center gap-6">
            {onSelectAdminTab && (
              <button
                type="button"
                onClick={() => onSelectAdminTab("admin")}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#c59223]" /> Portal de Operadores
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
