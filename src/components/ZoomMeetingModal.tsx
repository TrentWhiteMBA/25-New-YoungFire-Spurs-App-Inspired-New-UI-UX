import React from 'react';
import { X, Video, ExternalLink } from 'lucide-react';

interface ZoomMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  gatheringTitle?: string;
  zoomUrl?: string;
  [key: string]: any;
}

export const ZoomMeetingModal: React.FC<ZoomMeetingModalProps> = ({
  isOpen,
  onClose,
  gatheringTitle = 'YoungFire Gathering'
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#000000] border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-400" />
            <h3 className="font-pro-display text-base uppercase">Zoom Broadcast</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-sm">{gatheringTitle}</h4>
          <p className="text-xs text-slate-400">Join the live video broadcast room for interactive fellowship and prayer.</p>
        </div>
        <a 
          href="https://zoom.us" 
          target="_blank" 
          rel="noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
        >
          <span>Launch Zoom Meeting</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default ZoomMeetingModal;
