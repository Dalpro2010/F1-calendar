
import React, { useState, useEffect, useRef } from 'react';
import { Race } from '../types';

interface RaceCardProps {
  race: Race;
  onClick: (race: Race) => void;
  index: number;
  isHighlighted?: boolean;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, onClick, index, isHighlighted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Una vez que es visible, dejamos de observar para mantener el estado
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      },
      {
        threshold: 0.1, // Se activa cuando el 10% de la tarjeta es visible
        rootMargin: '0px 0px -50px 0px' // Margen inferior para que se active justo antes de entrar del todo
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  // Función para buscar una sesión específica en cualquier día del horario
  const findSession = (sessionKey: string) => {
    for (const [day, sessions] of Object.entries(race.horarios)) {
      if (sessions && sessions[sessionKey]) {
        return {
          time: sessions[sessionKey],
          day: day.charAt(0).toUpperCase() + day.slice(1)
        };
      }
    }
    return null;
  };

  const p1 = findSession('practica_1');
  const qualy = findSession('clasificacion');
  const raceSession = race.horarios.domingo?.carrera 
    ? { time: race.horarios.domingo.carrera, day: 'Domingo' }
    : race.horarios.sabado?.carrera 
      ? { time: race.horarios.sabado.carrera, day: 'Sábado' }
      : null;

  return (
    <div 
      ref={cardRef}
      onClick={() => onClick(race)}
      className={`group relative bg-[#121212] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-1000 ease-out border-2 shadow-2xl ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95'
      } ${
        isHighlighted 
          ? 'border-f1-red ring-4 ring-f1-red/20 scale-105 z-30 shadow-[0_0_80px_rgba(225,6,0,0.5)]' 
          : 'border-white/10 hover:border-f1-red hover:shadow-[0_0_50px_rgba(225,6,0,0.3)] hover:-translate-y-3'
      }`}
    >
      {/* Indicador de Ronda de ALTO CONTRASTE */}
      <div className="absolute top-0 right-0 z-20">
        <div className={`bg-black border-l-2 border-b-2 transition-all duration-300 px-4 py-2 rounded-bl-2xl shadow-xl ${
          isHighlighted ? 'border-f1-red bg-f1-red' : 'border-white/20 group-hover:border-f1-red group-hover:bg-f1-red'
        }`}>
          <span className="text-3xl font-black text-white italic tracking-tighter block leading-none">
            #{index + 1}
          </span>
        </div>
      </div>

      {/* Franja superior decorativa */}
      <div className={`h-2 w-full bg-gradient-to-r from-f1-red to-transparent transition-opacity ${isHighlighted ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />

      <div className="p-7 pt-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-[3px] bg-f1-red shadow-[0_0_8px_#E10600]"></div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-f1-red">
              {race.pais}
            </h3>
          </div>
          <h2 className={`text-3xl font-black tracking-tighter leading-[0.9] transition-colors italic uppercase ${isHighlighted ? 'text-f1-red' : 'text-white group-hover:text-f1-red'}`}>
            {race.circuito}
          </h2>
          <div className="mt-4 inline-block px-4 py-1.5 bg-white/10 rounded-lg border border-white/10">
            <p className="text-white font-bold text-[10px] uppercase tracking-[0.2em]">{race.fechas}</p>
          </div>
        </div>

        {/* Cajas de Horarios */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-black p-4 rounded-xl border border-white/10 group-hover:border-f1-red/30 transition-all shadow-inner">
            <span className="text-[10px] text-f1-red font-black uppercase tracking-widest block mb-2">
              {p1?.day || 'Sesión'}
            </span>
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-black text-white/40 uppercase">P1</span>
              <span className="text-lg font-black text-white tracking-tighter">{p1?.time || '--:--'}</span>
            </div>
          </div>
          <div className="bg-black p-4 rounded-xl border border-white/10 group-hover:border-f1-red/30 transition-all shadow-inner">
            <span className="text-[10px] text-f1-red font-black uppercase tracking-widest block mb-2">
              {qualy?.day || 'Sesión'}
            </span>
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-black text-white/40 uppercase">Qualy</span>
              <span className="text-lg font-black text-white tracking-tighter">{qualy?.time || '--:--'}</span>
            </div>
          </div>
        </div>

        {/* Footer de la tarjeta con Carrera Principal */}
        <div className={`relative p-5 rounded-2xl bg-[#1a1a1a] border border-white/10 transition-all shadow-lg overflow-hidden ${isHighlighted ? 'border-f1-red/50 bg-[#222]' : 'group-hover:border-f1-red/40'}`}>
          {/* Overlay de brillo */}
          <div className={`absolute inset-0 bg-gradient-to-r from-f1-red/0 via-f1-red/10 to-f1-red/0 transition-transform duration-1000 ${isHighlighted ? 'translate-x-0' : 'translate-x-[-100%] group-hover:translate-x-[100%]'}`} />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-black tracking-[0.3em] text-f1-red mb-1">
                {raceSession?.day ? `Race ${raceSession.day}` : 'Race Day'}
              </span>
              <span className="text-3xl font-black tracking-tighter italic text-white leading-none">
                {raceSession?.time || '--:--'}
              </span>
            </div>
            <div className="flex flex-col items-end">
               {race.formato === 'Sprint' && (
                <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 rounded italic uppercase mb-2 tracking-tighter">
                  Sprint Week
                </span>
              )}
              <div className={`w-10 h-10 rounded-full border-2 transition-all shadow-lg flex items-center justify-center ${isHighlighted ? 'bg-f1-red border-f1-red' : 'border-white/20 group-hover:bg-f1-red group-hover:border-f1-red'}`}>
                <svg className={`w-5 h-5 text-white transform transition-transform ${isHighlighted ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barra de progreso inferior */}
      <div className="h-2 w-full bg-white/5">
        <div className={`h-full bg-f1-red transition-all duration-700 ease-in-out shadow-[0_0_20px_#E10600] ${isHighlighted ? 'w-full' : 'w-0 group-hover:w-full'}`} />
      </div>
    </div>
  );
};

export default RaceCard;
