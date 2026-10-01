import React from 'react';
import { X, BookOpen } from 'lucide-react';

interface ReadingProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage?: (p: { bookId: string; chapter: number }) => void;
  [key: string]: any;
}

export const ReadingProgressModal: React.FC<ReadingProgressModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#000000] border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-pro-display text-base uppercase">Reading Progress</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-slate-300">Track and review your 66-book scripture consecration.</p>
      </div>
    </div>
  );
};

export default ReadingProgressModal;
