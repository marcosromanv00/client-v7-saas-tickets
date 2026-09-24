import { TheaterEvent } from "./types";
import { buildEvent } from "./agenda-builder";

export const OFFICIAL_AGENDA_EVENTS: TheaterEvent[] = [
  // 1. REAPERTURA OFICIAL (ÚNICO EVENTO PRIVADO - VIERNES 25 SEPT)
  buildEvent({
    id: "evt-reapertura-25",
    title: "Concierto Luz Entre Notas: Gran Reapertura del Teatro Municipal",
    tagline: "Función de Honor con Coro del Conservatorio, Manuel Obregón, Tapao Vargas y Sonia Bruno",
    date: "2026-09-25", time: "19:15", durationMinutes: 120, genre: "Gala Patrimonial / Piano Clásico", isPrivate: true,
    description: "Reapertura oficial y acto protocolario de entrega patrimonial. Concierto de piano clásico con Manuel Obregón, Tapao Vargas, Sonia Bruno y el Coro del Conservatorio. Función privada con acceso exclusivo mediante invitación directa y lista de protocolo institucional.",
    posterUrl: "/posters/gala-inaugural.jpg",
  }),

  // 2. CONCIERTO PATO BARRAZA Y GAZEL (SÁBADO 26 SEPT)
  buildEvent({
    id: "evt-pato-barraza-26",
    title: "Entre Héroes y Amigos: 40 Años de Carrera",
    tagline: "Pato Barraza y Gazel en concierto de rock y música nacional costarricense",
    date: "2026-09-26", time: "19:00", durationMinutes: 105, genre: "Rock & Música Nacional", isPrivate: false,
    description: "Concierto en vivo con los cantautores Pato Barraza y Gazel conmemorando cuatro décadas de historia musical. Entrada gratuita con butaca numerada para la ciudadanía alajuelense.",
    posterUrl: "/posters/sinfonica.jpg",
  }),

  // 3. CONCIERTO ESCATS (DOMINGO 27 SEPT)
  buildEvent({
    id: "evt-escats-27",
    title: "¡Escats en Concierto!",
    tagline: "Kin Rivera y Escats celebrando las grandes baladas y el pop nacional",
    date: "2026-09-27", time: "18:00", durationMinutes: 100, genre: "Pop / Balada Costarricense", isPrivate: false,
    description: "Presentación exclusiva del grupo nacional Escats en el escenario del Teatro Municipal. Disfrute de éxitos emblemáticos del repertorio pop nacional en un ambiente acústico de primer nivel.",
    posterUrl: "/posters/sinfonica.jpg",
  }),

  // 4. TEATRO: EL ROPERO DE ELVIRILLA (SÁBADO 3 OCT)
  buildEvent({
    id: "evt-elvirilla-03",
    title: "El Ropero de Elvirilla",
    tagline: "Producción teatral profesional con la destacada actriz Guisella Solís",
    date: "2026-10-03", time: "19:00", durationMinutes: 85, genre: "Teatro Profesional", isPrivate: false,
    description: "Obra de teatro profesional galardonada que rescata la memoria, el humor y la calidez de las familias costarricenses a través de las historias guardadas en un viejo ropero de madera.",
    posterUrl: "/posters/titeres.jpg",
  }),

  // 5. CONCIERTO BERNARDO QUESADA (DOMINGO 4 OCT)
  buildEvent({
    id: "evt-bernardo-quesada-04",
    title: "El Eco de las Maderas",
    tagline: "Concierto de música acústica de autor con el maestro Bernardo Quesada",
    date: "2026-10-04", time: "18:00", durationMinutes: 95, genre: "Cantautor / Música Acústica", isPrivate: false,
    description: "Velada íntima de guitarras y arreglos orquestales donde el compositor costarricense Bernardo Quesada interpreta sus temas más queridos y composiciones dedicadas a la identidad cultural.",
    posterUrl: "/posters/sinfonica.jpg",
  }),

  // 6. CONCIERTO TÓTEM (SÁBADO 10 OCT)
  buildEvent({
    id: "evt-totem-10",
    title: "Una Sola Voz: Tótem en Concierto",
    tagline: "Vanguardia sonora y fusión folclórica costarricense contemporánea",
    date: "2026-10-10", time: "19:00", durationMinutes: 90, genre: "Fusión Folclórica / Rock", isPrivate: false,
    description: "Propuesta musical que une la percusión tradicional y raíces autóctonas costarricenses con arreglos contemporáneos de cuerdas para la comunidad alajuelense.",
    posterUrl: "/posters/sinfonica.jpg",
  }),

  // 7. MARTA FONSECA & SUITE DOBLE (DOMINGO 11 OCT)
  buildEvent({
    id: "evt-marta-fonseca-11",
    title: "Marta Fonseca & Alajuela: Suite Doble",
    tagline: "Voz icónica del rock acústico nacional en formato acústico de cámara",
    date: "2026-10-11", time: "18:00", durationMinutes: 95, genre: "Rock Pop Acústico", isPrivate: false,
    description: "Marta Fonseca regresa a los escenarios en el Teatro Municipal con una recopilación íntima de las canciones de Suite Doble y sus composiciones solistas más recordadas.",
    posterUrl: "/posters/sinfonica.jpg",
  }),

  // 8. FINAL DEL FESTIVAL DE LA CANCIÓN (SÁBADO 17 OCT)
  buildEvent({
    id: "evt-final-cancion-17",
    title: "Gran Final del Festival de la Canción",
    tagline: "Gala de clausura y premiación del certamen nacional de compositores",
    date: "2026-10-17", time: "19:00", durationMinutes: 120, genre: "Certamen Musical / Coproducción", isPrivate: false,
    description: "Gala definitiva donde los finalistas del Festival de la Canción presentan sus obras originales acompañados por ensamble musical en vivo ante el jurado calificador y el público alajuelense.",
    posterUrl: "/posters/sinfonica.jpg",
  }),

  // 9. CONCIERTO HUMBERTO VARGAS (DOMINGO 18 OCT)
  buildEvent({
    id: "evt-humberto-vargas-18",
    title: "Dilo de Una Vez: Humberto Vargas",
    tagline: "Concierto especial con el cantautor ganador de la Gaviota de Plata de Viña del Mar",
    date: "2026-10-18", time: "18:00", durationMinutes: 100, genre: "Trova / Música de Autor", isPrivate: false,
    description: "El cantautor costarricense Humberto Vargas comparte una velada inolvidable de poesía cantada, éxitos reconocidos y nuevas composiciones en el emblemático escenario municipal.",
    posterUrl: "/posters/sinfonica.jpg",
  }),

  // 10. TEATRO: LAS DEL ABANIKO (SÁBADO 24 Y DOMINGO 25 OCT)
  buildEvent({
    id: "evt-las-del-abaniko-24",
    title: "El Calor Es Lo De Menos: Las del Abaniko",
    tagline: "Comedia teatral protagonizada por Ale Portillo",
    date: "2026-10-24", time: "19:00", durationMinutes: 80, genre: "Comedia Teatral", isPrivate: false,
    description: "Risas garantizadas en esta divertidísima puesta en escena que aborda los desafíos cotidianos, la amistad y las situaciones inesperadas con un elenco de lujo.",
    posterUrl: "/posters/titeres.jpg",
    extraDates: ["2026-10-25"],
  }),

  // 11. FESTIVAL DE DANZAS DE LAS CULTURAS (31 OCT Y 1 NOV)
  buildEvent({
    id: "evt-festival-danzas-31",
    title: "Festival de Danzas en Conmemoración de las Culturas",
    tagline: "Encuentro coreográfico comunitario de agrupaciones alajuelenses",
    date: "2026-10-31", time: "19:00", durationMinutes: 90, genre: "Danza Contemporánea y Folclore", isPrivate: false,
    description: "Celebración del movimiento y la diversidad cultural con la participación de escuelas y colectivos de danza de Alajuela, integrando ritmos caribeños, folclóricos y modernos.",
    posterUrl: "/posters/sinfonica.jpg",
    extraDates: ["2026-11-01"],
  }),

  // 12. TEATRO: ECOS ESCÉNICOS (7 Y 8 NOV)
  buildEvent({
    id: "evt-ecos-escenicos-07",
    title: "Etiquetas Para Romper Mandatos",
    tagline: "Teatro sobre masculinidades por Ecos Escénicos bajo la dirección de Lucía Cortés Cantillo",
    date: "2026-11-07", time: "19:00", durationMinutes: 85, genre: "Teatro Contemporáneo", isPrivate: false,
    description: "Puesta en escena profunda y conmovedora que invita a reflexionar sobre los roles de género, la empatía y la construcción de vínculos saludables en nuestra sociedad.",
    posterUrl: "/posters/titeres.jpg",
    extraDates: ["2026-11-08"],
  }),

  // 13. CONCIERTO ÉDITUS (DOMINGO 15 NOV)
  buildEvent({
    id: "evt-editus-15",
    title: "Éditus en Concierto",
    tagline: "Gala musical con el prestigioso trío costarricense ganador de 3 premios Grammy",
    date: "2026-11-15", time: "18:00", durationMinutes: 105, genre: "World Music / Fusión Instrumental", isPrivate: false,
    description: "Edín Solís, Ricardo Ramírez y Carlos 'Tapao' Vargas presentan su virtuoso repertorio de violín, guitarra clásica y percusión que ha conquistado escenarios de todo el mundo.",
    posterUrl: "/posters/sinfonica.jpg",
  }),

  // 14. TEATRO: UN CUENTO DE NAVIDAD (DOMINGO 29 NOV)
  buildEvent({
    id: "evt-cuento-navidad-29",
    title: "Un Cuento de Navidad: Terruño Espressivo",
    tagline: "Fantasía musical navideña para toda la familia inspirada en el clásico de Charles Dickens",
    date: "2026-11-29", time: "16:00", durationMinutes: 90, genre: "Fantasía Musical Navideña", isPrivate: false,
    description: "Ebenezer Scrooge y los espíritus de la Navidad cobran vida con música original, vestuarios de época y un mensaje conmovedor de solidaridad y esperanza.",
    posterUrl: "/posters/titeres.jpg",
  }),

  // 15. TEATRO JUVENIL: CASCABELES Y BELLOTAS (12 Y 13 DIC)
  buildEvent({
    id: "evt-cascabeles-12",
    title: "Cascabeles y Bellotas",
    tagline: "Montaje teatral juvenil de temporada navideña",
    date: "2026-12-12", time: "16:00", durationMinutes: 75, genre: "Teatro Juvenil Navideño", isPrivate: false,
    description: "Comedia juvenil de invierno que narra las peripecias de una aldea mágica preparando los festivales de fin de año. Actuaciones frescas y llenas de entusiasmo.",
    posterUrl: "/posters/titeres.jpg",
    extraDates: ["2026-12-13"],
  }),

  // 16. TEATRO INFANTIL: AGENTES SECRETOS DE SANTA (19 Y 20 DIC)
  buildEvent({
    id: "evt-agentes-santa-19",
    title: "Agentes Secretos de Santa",
    tagline: "Aventura cómica e interactiva para la niñez y las familias alajuelenses",
    date: "2026-12-19", time: "16:00", durationMinutes: 75, genre: "Teatro Infantil / Comedia", isPrivate: false,
    description: "Divertida misión secreta donde los duendes agentes deben resolver un enigma antes de la Nochebuena. Espectáculo interactivo repleto de canciones y participación infantil.",
    posterUrl: "/posters/titeres.jpg",
    extraDates: ["2026-12-20"],
  }),
];
