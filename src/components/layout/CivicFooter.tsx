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
    <footer className="bg-[#100b1a] text-zinc-300 border-t border-white/10 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Columna 1: Identidad Institucional */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-white font-medium">Teatro Municipal</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Monumento Histórico Arquitectónico fundado en 1890. Epicentro cultural de la ciudadanía dedicado a la difusión de las artes escénicas.
            </p>
            <p className="text-zinc-500 text-xs">
              Acreditación Oficial: Registro Nacional de Espacios Escénicos N° CR-TM-1890.
            </p>
          </div>

          {/* Columna 2: Servicios y Programación */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-white font-medium">Temporada 2026</h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>Temporada Sinfónica Municipal</li>
              <li>Ciclo de Dramaturgia y Teatro Clásico</li>
              <li>Funciones Didácticas Comunitarias</li>
              <li>Gala Anual de Reapertura y Patrimonio</li>
              <li>Convocatorias Abiertas a Colectivos</li>
            </ul>
          </div>

          {/* Columna 3: Normativa y Operación de Sala */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-white font-medium">Operación y Acceso</h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <span>Apertura de puertas: 45 min antes de función. Se reserva el derecho de admisión al comenzar la obra.</span>
              </div>
              <p>Capacidad autorizada: 190 butacas (120 en Platea y 70 en Balcón Histórico).</p>
            </div>
          </div>

          {/* Columna 4: Sede Física & Contacto Verificable */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-white font-medium">Sede & Contacto Cívico</h3>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <span>Avenida Central, entre Calles 2 y 4, Costado Norte del Parque Central.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Boletería: +506 2440-1912</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>cultura@teatromunicipal.gob.cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Teatro Municipal de San José. Sistema de Tiquetería y Aforo.</p>
          <div className="flex items-center gap-6">
            {onSelectAdminTab && (
              <button
                type="button"
                onClick={() => onSelectAdminTab("admin")}
                className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" /> Portal de Operadores
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
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
