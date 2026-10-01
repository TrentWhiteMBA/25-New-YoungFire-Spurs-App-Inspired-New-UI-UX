import React from 'react';
import { X, Users } from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';

export interface RosterMember {
  id: string;
  fullName: string;
  name: string;
  role: string;
  ministryRole?: string;
  calling: string;
  group: string;
  gender?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  churchMembership: string;
  residence: string;
  accountType?: string;
  isAdmin?: boolean;
  prayerRequests?: string;
  notes?: string;
}

interface MemberRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: CurrentUser | null;
}

export const MemberRosterModal: React.FC<MemberRosterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#000000] border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-pro-display text-base uppercase">Discipleship Roster</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-slate-300">Sanctuary fellowship members and discipleship cohort leaders.</p>
      </div>
    </div>
  );
};

export default MemberRosterModal;
