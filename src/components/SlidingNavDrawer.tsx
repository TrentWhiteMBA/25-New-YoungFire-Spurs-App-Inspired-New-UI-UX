import React, { useState, useRef } from 'react';
import { 
  Flame, 
  BookOpen, 
  Compass, 
  Tv, 
  Radio, 
  PenTool, 
  Heart, 
  Settings, 
  ShieldAlert, 
  Sparkles,
  Users
} from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';

interface SlidingNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, subView?: any) => void;
  onOpenSettingsModal: () => void;
  onOpenNotesModal: () => void;
  onOpenThemeModal: () => void;
  onOpenWelcomeModal: () => void;
  currentUser?: CurrentUser | null;
}

export const SlidingNavDrawer: React.FC<SlidingNavDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSettingsModal,
  onOpenNotesModal,
  onOpenThemeModal,
  onOpenWelcomeModal,
  currentUser
}) => {
  const [dragOffset, setDragOffset] = useState<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  if (!isOpen) return null;

  const isLeader = Boolean(
    currentUser?.isAdmin ||
    currentUser?.role?.toLowerCase().includes('facilitator') ||
    currentUser?.email?.toLowerCase().includes('trent') ||
    currentUser?.email?.toLowerCase().includes('whitney')
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // If dragging rightwards and predominantly horizontal
    if (deltaX > 0 && deltaX > Math.abs(deltaY) * 0.7) {
      isDraggingRef.current = true;
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current && dragOffset > 60) {
      onClose();
    }
    setDragOffset(0);
    touchStartRef.current = null;
    isDraggingRef.current = false;
  };

  const menuItems = [
    {
      id: 'fellowship',
      label: 'Sanctuary Fellowship Hub',
      icon: Users,
      action: () => { onNavigate('fellowship'); onClose(); }
    },
    {
      id: 'word-bible',
      label: '66-Book Scripture Reader',
      icon: BookOpen,
      action: () => { onNavigate('word', 'bible'); onClose(); }
    },
    {
      id: 'word-atlas',
      label: 'Imperial Scripture Atlas',
      icon: Compass,
      action: () => { onNavigate('word', 'atlas'); onClose(); }
    },
    {
      id: 'tv',
      label: 'Worship Sanctuary TV & Vault',
      icon: Tv,
      action: () => { onNavigate('tv'); onClose(); }
    },
    {
      id: 'radio',
      label: '24/7 Gospel Radio Player',
      icon: Radio,
      action: () => { onNavigate('radio'); onClose(); }
    },
    {
      id: 'prayer',
      label: 'Prayer Dock & Intercession',
      icon: Heart,
      action: () => { onNavigate('prayer_dock'); onClose(); }
    },
    {
      id: 'notes',
      label: 'Study Notes HUD',
      icon: PenTool,
      action: () => { onOpenNotesModal(); onClose(); }
    },
    {
      id: 'welcome',
      label: 'Welcome Sanctuary Portal',
      icon: Sparkles,
      action: () => { onOpenWelcomeModal(); onClose(); }
    },
    {
      id: 'settings',
      label: 'Settings & Device Profile',
      icon: Settings,
      action: () => { onOpenSettingsModal(); onClose(); }
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-40 text-white flex select-none overflow-hidden font-['Outfit'] pointer-events-none"
    >
      {/* 1. SLIDING RIGHT DRAWER CONTENT with swipe-to-close & drag support */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: dragOffset > 0 ? `translateX(${dragOffset}px)` : 'none',
          transition: isDraggingRef.current ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="ml-auto w-[88%] sm:w-[84%] max-w-2xl h-full bg-[#000000] border-l border-white/20 shadow-[-30px_0_70px_rgba(0,0,0,0.95)] flex flex-col justify-between py-8 px-6 sm:px-10 relative z-10 overflow-y-auto no-scrollbar pointer-events-auto"
      >
        {/* Swipe Handle Indicator on Left Edge */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-white/20 rounded-full sm:hidden pointer-events-none" />

        {/* Top Centered Brand Insignia */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1 pb-3 relative z-20">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.5)] border border-amber-300/50 ring-2 ring-amber-400/30">
            <Flame className="w-7 h-7 text-black fill-current drop-shadow" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-[0.25em] text-white font-['Anton',sans-serif] leading-tight">
              YOUNG<span className="text-amber-400">FIRE</span>
            </h3>
            <p className="text-[9px] font-mono tracking-[0.25em] uppercase text-slate-400 mt-0.5">
              JOSHUA HOUSE OF WORSHIP &bull; EST. 2026
            </p>
          </div>
        </div>

        {/* Vertical Left-Aligned Menu Options */}
        <nav className="space-y-3.5 my-auto py-2 relative z-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center gap-3.5 text-left text-slate-200 hover:text-white group cursor-pointer transition-colors py-0.5"
              >
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide font-['Barlow_Condensed',sans-serif] uppercase truncate">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Facilitators Executive Admin CMS */}
          {isLeader && (
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('yf_open_admin_cms'));
                onClose();
              }}
              className="w-full flex items-center gap-3.5 text-left text-amber-300 hover:text-amber-200 group cursor-pointer transition-colors pt-2.5 border-t border-white/10"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-wider font-['Barlow_Condensed',sans-serif] uppercase truncate">
                Executive Admin CMS
              </span>
            </button>
          )}
        </nav>

        {/* Bottom Leadership Sign-Off & Close Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400 relative z-20">
          <span className="truncate">Swipe right &rarr; or tap</span>
          <button 
            onClick={onClose}
            className="text-amber-400 hover:underline uppercase tracking-wider cursor-pointer ml-2 flex-shrink-0 font-bold"
          >
            Close &larr;
          </button>
        </div>

        {/* Artistic HD Black & White Photography */}
        <div 
          className="absolute right-0 bottom-0 w-80 sm:w-[480px] h-[380px] sm:h-[500px] pointer-events-none z-0 overflow-hidden select-none"
          style={{
            maskImage: 'radial-gradient(circle at 88% 88%, black 25%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.2) 72%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at 88% 88%, black 25%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.2) 72%, transparent 95%)',
          }}
        >
          <img
            src="/image_4.png"
            alt="Sanctuary Word - Black and White HD"
            loading="eager"
            decoding="sync"
            className="w-full h-full object-cover object-bottom-right"
            style={{
              filter: 'grayscale(100%) contrast(140%) brightness(108%)',
              imageRendering: '-webkit-optimize-contrast',
              mixBlendMode: 'screen',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black pointer-events-none" />
        </div>

      </div>

    </div>
  );
};

export default SlidingNavDrawer;
