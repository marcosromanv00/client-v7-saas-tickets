import { TheaterEvent } from "../tickets/types";

interface EventPosterHeroProps {
  event: TheaterEvent;
  variant?: "mobile" | "desktop";
}

export function EventPosterHero({ event, variant = "mobile" }: EventPosterHeroProps) {
  if (variant === "desktop") {
    return (
      <div className="space-y-4">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-80">
          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/50 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">{event.genre}</span>
            <h1 className="text-xl font-serif font-medium text-white">{event.title}</h1>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          {event.description}
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-80 sm:h-96">
      <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/60 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono">
          {event.genre}
        </span>
        <h1 className="text-2xl font-serif font-medium text-white">{event.title}</h1>
        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}
