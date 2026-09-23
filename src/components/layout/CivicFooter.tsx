import { ArrowUp, MapPin, Phone, Mail, Clock } from "lucide-react";

export function CivicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#121c32] text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Columna 1: Identidad Institucional */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-white font-medium">Teatro Municipal</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Monumento Histórico Arquitectónico y epicentro cultural de la ciudadanía. Gestión y fomento de las artes escénicas bajo la administración del Departamento de Cultura Municipal.
            </p>
            <p className="text-slate-400 text-xs">
              Acreditación Oficial: Registro Nacional de Espacios Escénicos N° CR-TM-1912.
            </p>
          </div>

          {/* Columna 2: Servicios y Programación */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-white font-medium">Programación Cultural</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Temporada Sinfónica Municipal</li>
              <li>Ciclo de Dramaturgia y Teatro Clásico</li>
              <li>Funciones Didácticas Comunitarias</li>
              <li>Gala Anual de Reapertura y Patrimonio</li>
              <li>Convocatorias Abiertas a Colectivos Locales</li>
            </ul>
          </div>

          {/* Columna 3: Normativa y Operación de Sala */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-white font-medium">Operación y Acceso</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>Apertura de puertas: 45 minutos antes de cada función. Cierre de acceso al iniciar la obra.</span>
              </div>
              <p>Capacidad autorizada: 190 butacas (120 en Platea y 70 en Balcón).</p>
              <p>Eventos de acceso libre subvencionados por fondos municipales. No se permite el reingreso tras salida de sala.</p>
            </div>
          </div>

          {/* Columna 4: Sede Física & Contacto Verificable */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-white font-medium">Sede & Contacto Cívico</h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>Avenida Central, entre Calles 2 y 4, Costado Norte del Parque Central.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Taquilla y Administración: +506 2440-1912</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>cultura@teatromunicipal.gob.cr</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://waze.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-slate-300 hover:text-amber-300 underline underline-offset-4 transition-colors"
                >
                  Navegar con Waze / Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Teatro Municipal. Todos los derechos reservados. Sistema Cívico de Tiquetería v1.0.</p>
          <div className="flex items-center gap-6">
            <span>Accesibilidad WCAG 2.1 AAA</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
