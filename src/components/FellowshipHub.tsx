import React from 'react';
import { Users, Flame, BookOpen, Shield } from 'lucide-react';

interface FellowshipHubProps {
  onNavigate?: (dest: string, subView?: string) => void;
  initialDrillDown?: string | null;
  [key: string]: any;
}

export const FellowshipHub: React.FC<FellowshipHubProps> = ({ onNavigate, initialDrillDown }) => {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 text-white">
      <div className="pb-3 border-b border-white/10">
        <h2 className="font-pro-display text-xl tracking-wider uppercase text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          YoungFire Fellowship Hub
        </h2>
        <p className="text-xs text-slate-400">Cohorts, Ministry Circles & Discipleship Huddles</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate && onNavigate('men')}
          className="p-4 rounded-2xl bg-black/80 border border-white/20 hover:border-amber-400/80 transition-all text-left space-y-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm">Men On Fire</div>
          <div className="text-[10px] text-slate-400">Brotherhood Consecration</div>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('women')}
          className="p-4 rounded-2xl bg-black/80 border border-white/20 hover:border-orange-400/80 transition-all text-left space-y-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm">Women Ignited</div>
          <div className="text-[10px] text-slate-400">Sisterhood & Prayer</div>
        </button>
      </div>
    </div>
  );
};

export default FellowshipHub;
