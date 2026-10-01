import React from 'react';
import { ArrowLeft, Flame, Heart } from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';

interface WomenIgnitedHubProps {
  currentUser: CurrentUser | null;
  onBack?: () => void;
  [key: string]: any;
}

export const WomenIgnitedHub: React.FC<WomenIgnitedHubProps> = ({ currentUser, onBack }) => {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 text-white">
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        {onBack && (
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="font-pro-display text-xl tracking-wider uppercase text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-400" />
            Women Ignited Sisterhood
          </h2>
          <p className="text-xs text-slate-400">Sisterhood of Prayer, Consecration & Grace</p>
        </div>
      </div>
      <div className="p-5 rounded-2xl bg-black/80 border border-white/20 space-y-2">
        <h3 className="font-bold text-sm text-white">Women Ignited Circle</h3>
        <p className="text-xs text-slate-400">Walking in holiness and kingdom purpose. Bi-weekly sisterhood study led by Whitney White.</p>
      </div>
    </div>
  );
};

export default WomenIgnitedHub;
