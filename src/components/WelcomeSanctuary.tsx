import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';

interface WelcomeSanctuaryProps {
  onEnterSanctuary: () => void;
  onClose?: () => void;
  [key: string]: any;
}

export const WelcomeSanctuary: React.FC<WelcomeSanctuaryProps> = ({ onEnterSanctuary }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md bg-[#000000] border border-white/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl text-white">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-300/50">
          <Flame className="w-9 h-9 text-black fill-current drop-shadow" />
        </div>
        <div>
          <h2 className="font-pro-display text-2xl tracking-[0.2em] uppercase text-white font-black">
            YOUNG<span className="text-amber-400">FIRE</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
            JOSHUA HOUSE OF WORSHIP &bull; SAN ANTONIO, TX
          </p>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Welcome to the consecrated sanctuary space for YoungFire discipleship, corporate prayer, expository study, and spiritual fellowship.
        </p>
        <button
          onClick={onEnterSanctuary}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <span>Enter Sanctuary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeSanctuary;
