
import React from 'react';
import { Race } from '../types';

interface RaceModalProps {
  race: Race | null;
  onClose: () => void;
}

const sessionFullLabels: Record<string, string> = {
  practica_1: 'Práctica Libre 1',
  practica_2: 'Práctica Libre 2',
  practica_3: 'Práctica Libre 3',
  clasificacion: 'Clasificación Principal',
  clasificacion_sprint: 'Sprint Shootout',
  carrera_sprint: 'Carrera Sprint',
  carrera: 'Gran Premio (Carrera)'
};

const RaceModal: React.FC<RaceModalProps> = ({ race, onClose }) => {
  if (!race) return null;

  const renderSessions = (day: string, sessions: Record<string, string>) => (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-3 mb-4">
        <h4 className="text-white text-sm font-black uppercase tracking-[0.3em]">
          {day}
        </h4>
        <div className="h-px flex-1 bg-gradient-to-r from-f1-red/50 to-transparent"></div>
      </div>
      <div className="grid gap-3">
        {Object.entries(sessions).map(([name, time]) => (
          <div key={name} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-f1-red/30 transition-all group/item">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-f1-red uppercase tracking-widest mb-0.5">
                {name.includes('practica') ? 'Free Practice' : 'Session'}
              </span>
              <span className="text-sm font-bold text-white group-hover/item:text-white transition-colors">
                {sessionFullLabels[name] || name.replace('_', ' ')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black italic tracking-tighter">
                {time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-12 md:py-20">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#0d0d0d] w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 animate-in fade-in zoom-in duration-300 my-auto">
        {/* Header con diseño F1 */}
        <div className="relative h-48 bg-f1-red flex flex-col justify-end p-8 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-8xl font-black text-black/10 italic select-none">F1</div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 bg-black/40 hover:bg-white hover:text-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 group"
          >
            <span className="transform group-hover:rotate-90 transition-transform font-bold text-lg">✕</span>
          </button>

          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black rounded uppercase italic">{race.formato || 'Standard'}</span>
                <span className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">{race.pais}</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{race.circuito}</h2>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-wrap gap-8 mb-10 pb-8 border-b border-white/5">
             <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Calendario Evento</span>
                <span className="text-xl font-bold italic tracking-tight">{race.fechas}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Local Timezone</span>
                <span className="text-xl font-bold italic tracking-tight">Race Time: {race.horarios.domingo?.carrera || race.horarios.sabado?.carrera}</span>
             </div>
          </div>

          <div className="space-y-10 pb-4">
            {race.horarios.jueves && renderSessions('Jueves', race.horarios.jueves)}
            {race.horarios.viernes && renderSessions('Viernes', race.horarios.viernes)}
            {race.horarios.sabado && renderSessions('Sábado', race.horarios.sabado)}
            {race.horarios.domingo && renderSessions('Domingo', race.horarios.domingo)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceModal;
