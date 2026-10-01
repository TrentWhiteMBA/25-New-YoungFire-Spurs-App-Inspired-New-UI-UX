import React from 'react';
import { ArrowLeft, Flame, Send } from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';

interface PrayerDockProps {
  currentUser: CurrentUser | null;
  onBack?: () => void;
}

export const PrayerDock: React.FC<PrayerDockProps> = ({ currentUser, onBack }) => {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 text-white">
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="font-pro-display text-xl tracking-wider uppercase text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Prayer Dock & Intercession
          </h2>
          <p className="text-xs text-slate-400">Altar of Perpetual Incense & Corporate Prayer</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-black/80 border border-white/20 space-y-3">
        <h3 className="font-bold text-sm">Submit Altar Request</h3>
        <textarea 
          placeholder="Share your prayer petition with the intercession cohort..."
          className="w-full h-24 p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-110">
          <Send className="w-3.5 h-3.5" /> Submit to Prayer Watch
        </button>
      </div>
    </div>
  );
};

export default PrayerDock;
