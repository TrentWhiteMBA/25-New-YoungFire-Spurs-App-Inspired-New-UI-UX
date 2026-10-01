import React, { useState } from 'react';
import { X, BookOpen, Save } from 'lucide-react';

interface StudyNotesHUDProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: { passage?: string; title?: string } | null;
  [key: string]: any;
}

export const StudyNotesHUD: React.FC<StudyNotesHUDProps> = ({ isOpen, onClose, prefill }) => {
  const [note, setNote] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#000000] border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-pro-display text-base uppercase">Study Notes HUD</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        {prefill?.passage && (
          <div className="text-xs font-mono text-amber-400">Passage: {prefill.passage}</div>
        )}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Record your scripture revelations, altar notes, and sermon points..."
          className="w-full h-32 p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <button 
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
        >
          <Save className="w-3.5 h-3.5" /> Save Sanctuary Note
        </button>
      </div>
    </div>
  );
};

export default StudyNotesHUD;
