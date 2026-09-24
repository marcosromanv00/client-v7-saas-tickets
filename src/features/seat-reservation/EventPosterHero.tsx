import { TheaterEvent } from "../tickets/types";

interface EventPosterHeroProps {
  event: TheaterEvent;
  variant?: "mobile" | "desktop";
}

export function EventPosterHero({ event, variant = "mobile" }: EventPosterHeroProps) {
  if (variant === "desktop") {
    return (
      <div className="bg-white dark:bg-[#0b1a30] rounded-3xl border border-slate-200 dark:border-[#1e355b] p-5 shadow-sm space-y-4 transition-colors">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1e355b] shadow-md aspect-[16/10]">
          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] font-mono text-[#004ea2] dark:text-blue-300 uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-950/70 border border-[#004ea2]/30 font-semibold">
              {event.genre}
            </span>
            <h1 className="text-lg font-bold text-white mt-1.5 line-clamp-1 tracking-tight">{event.title}</h1>
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {event.description}
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-[#1e355b] shadow-xl h-80 sm:h-96">
      <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#004ea2]/30 text-[#004ea2] dark:text-blue-300 border border-[#004ea2]/30 text-[10px] font-mono font-semibold">
          {event.genre}
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight">{event.title}</h1>
        <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}
