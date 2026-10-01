import React from 'react';
import { BookOpen } from 'lucide-react';

interface ScriptureViewerProps {
  initialBookId?: string;
  initialChapter?: number;
  onOpenNotesWithPassage?: (p: { passage: string; title: string }) => void;
  onOpenAtlasForLocation?: (loc: string) => void;
  onOpenAIMentor?: (q: string) => void;
  [key: string]: any;
}

export const ScriptureViewer: React.FC<ScriptureViewerProps> = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4 text-white">
      <div className="pb-3 border-b border-white/10">
        <h2 className="font-pro-display text-xl tracking-wider uppercase text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Scripture Viewer
        </h2>
        <p className="text-xs text-slate-400">Expository Scripture Reading & Concordance</p>
      </div>
      <div className="p-5 rounded-2xl bg-black/80 border border-white/20 text-center">
        <p className="text-xs text-slate-300">Select any of the 66 inspired books to read and meditate.</p>
      </div>
    </div>
  );
};

export default ScriptureViewer;
