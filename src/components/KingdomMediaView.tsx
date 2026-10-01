import React from 'react';
import { Tv, Play } from 'lucide-react';
import { VideoItem } from './KingdomVideoVault';

interface KingdomMediaViewProps {
  isPiP?: boolean;
  onExpandFromPiP?: () => void;
  onClosePiP?: () => void;
  activeVideo?: VideoItem | null;
  onSelectVideo?: (v: VideoItem) => void;
  [key: string]: any;
}

export const KingdomMediaView: React.FC<KingdomMediaViewProps> = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4 text-white">
      <div className="pb-3 border-b border-white/10">
        <h2 className="font-pro-display text-xl tracking-wider uppercase text-white flex items-center gap-2">
          <Tv className="w-5 h-5 text-amber-400" />
          Kingdom Media Broadcasts
        </h2>
        <p className="text-xs text-slate-400">Sermons, Word Exhortations & Consecration Videos</p>
      </div>
      <div className="p-6 rounded-2xl bg-black/80 border border-white/20 text-center space-y-2">
        <Play className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="font-bold text-sm">Joshua House Media Archive</h3>
        <p className="text-xs text-slate-400">Watch past services, revival messages, and small group studies.</p>
      </div>
    </div>
  );
};

export default KingdomMediaView;
