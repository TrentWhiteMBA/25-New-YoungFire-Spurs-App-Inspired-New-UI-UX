import React from 'react';
import { Compass, ArrowLeft, MapPin } from 'lucide-react';

interface ImperialAtlasProps {
  onBack?: () => void;
  [key: string]: any;
}

export const ImperialAtlas: React.FC<ImperialAtlasProps> = ({ onBack }) => {
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
            <Compass className="w-5 h-5 text-amber-400" />
            66-Book Imperial Scripture Atlas
          </h2>
          <p className="text-xs text-slate-400">Biblical Topography & Historical Journeys</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-black/80 border border-white/20 text-center space-y-3">
        <MapPin className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="font-bold text-base">Biblical Cartography & Archaeological Maps</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Explore the journeys of Abraham, the Exodus route, the kingdoms of Israel & Judah, and Paul's missionary travels.
        </p>
      </div>
    </div>
  );
};

export default ImperialAtlas;
