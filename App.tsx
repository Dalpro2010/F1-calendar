
import React, { useState, useEffect, useRef } from 'react';
import { F1_DATA } from './constants';
import { Race } from './types';
import RaceCard from './components/RaceCard';
import RaceModal from './components/RaceModal';

const App: React.FC = () => {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // La lista principal de carreras ahora siempre muestra todos los datos
  const allRaces = F1_DATA;

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRace = (race: Race, index: number) => {
    const elementId = `race-card-${index}`;
    const element = document.getElementById(elementId);
    
    setSearchTerm('');
    setShowSuggestions(false);

    if (element) {
      // Scroll suave hasta la posición de la carta
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Añadimos un efecto de resaltado temporal
      setHighlightedId(elementId);
      
      // El resaltado durará 4 segundos para que se note bien la llegada
      setTimeout(() => setHighlightedId(null), 4000);
      
      // NOTA: Se ha eliminado setSelectedRace(race) para evitar que se abra el modal rojo automáticamente
    }
  };

  const suggestions = searchTerm.length > 0 
    ? F1_DATA.filter(race => 
        race.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.circuito.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5) 
    : [];

  return (
    <div className="min-h-screen pb-20 selection:bg-f1-red selection:text-white bg-[#030303]">
      {/* Hero Section */}
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541447237128-f4bcb61083ca?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="F1 Track"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/80 to-[#030303]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-f1-red text-white text-[11px] font-black px-5 py-2 rounded-full uppercase tracking-[0.5em] mb-10 shadow-2xl shadow-f1-red/40 animate-pulse">
            Season 2026 Live
          </div>
          <h1 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter mb-8 leading-[0.8] italic text-white">
            F1 <span className="text-f1-red">Elite</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-bold tracking-[0.2em] max-w-2xl mx-auto leading-relaxed uppercase italic">
            La máxima precisión en cada sesión. <br/>
            <span className="text-f1-red">Donde cada milésima cuenta.</span>
          </p>
        </div>
      </header>

      {/* Main Content - Se ha eliminado el margen negativo para dar separación del Hero */}
      <main className="max-w-7xl mx-auto px-6 mt-20 relative z-20">
        {/* Contenedor de Buscador con Z-INDEX elevado */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-32 bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.9)] backdrop-blur-xl relative z-40">
          <div className="flex items-center gap-5">
            <div className="w-2 h-16 bg-f1-red rounded-full shadow-[0_0_20px_rgba(225,6,0,0.6)]"></div>
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-white">
                Race <span className="text-f1-red">Schedule</span>
              </h2>
              <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mt-2">World Championship Calendar</p>
            </div>
          </div>
          
          {/* BUSCADOR CON SUGERENCIAS */}
          <div className="relative group flex-1 max-w-lg" ref={searchRef}>
            <div className="relative rounded-2xl">
              <input 
                type="text" 
                placeholder="BUSCAR GRAN PREMIO..." 
                value={searchTerm}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                className="bg-white/10 border-2 border-white/20 text-white px-8 py-6 rounded-2xl w-full outline-none focus:border-f1-red focus:bg-black/80 transition-all pl-16 font-black text-sm tracking-widest placeholder:text-white/40 shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:border-white/30"
              />
              <svg 
                className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-white/50 group-focus-within:text-f1-red transition-colors" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sugerencias flotantes */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-[#0d0d0d] border-2 border-f1-red/50 rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,1)] z-[100] animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-3xl">
                <div className="p-3 bg-f1-red/10 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-f1-red">
                  ¿A dónde quieres ir?
                </div>
                {suggestions.map((race) => {
                   const originalIndex = F1_DATA.findIndex(r => r.circuito === race.circuito);
                   return (
                    <button
                      key={race.circuito + originalIndex}
                      onClick={() => handleSelectRace(race, originalIndex)}
                      className="w-full flex items-center justify-between p-5 hover:bg-f1-red group/item transition-all border-b border-white/5 last:border-0"
                    >
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-widest text-f1-red group-hover/item:text-white/80 transition-colors">
                          {race.pais}
                        </div>
                        <div className="text-white font-black uppercase italic tracking-tighter group-hover/item:text-white transition-colors">
                          {race.circuito}
                        </div>
                      </div>
                      <div className="bg-white/10 group-hover/item:bg-white/20 p-2 rounded-lg text-white/40 group-hover/item:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Grid de Carreras - Ajustado a 2 por fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {allRaces.map((race, index) => (
            <div key={race.circuito + index} id={`race-card-${index}`}>
              <RaceCard 
                race={race} 
                index={index}
                onClick={setSelectedRace} 
                isHighlighted={highlightedId === `race-card-${index}`}
              />
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-80 pt-32 pb-16 border-t border-white/5 px-6 bg-black">
        <div className="max-w-7xl mx-auto text-center">
           <div className="text-6xl font-black italic tracking-tighter mb-12 text-white">F1 <span className="text-f1-red">ELITE</span></div>
           <div className="flex flex-wrap justify-center gap-16 mb-20">
             {['Twitter', 'Instagram', 'Youtube', 'TikTok'].map(social => (
               <a key={social} href="#" className="text-white/20 hover:text-f1-red transition-all text-xs font-black uppercase tracking-[0.5em] hover:scale-110">{social}</a>
             ))}
           </div>
           <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"></div>
           <p className="text-white/10 text-xs font-black uppercase tracking-[0.5em]">
             © 2026 F1 Elite Experience • Editorial Layout
           </p>
        </div>
      </footer>

      <RaceModal 
        race={selectedRace} 
        onClose={() => setSelectedRace(null)} 
      />
    </div>
  );
};

export default App;
