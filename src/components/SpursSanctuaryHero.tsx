import React, { useState } from 'react';
import { useFanDeckPhotos } from '../data/appCoverAssets';
import { AppTheme } from '../data/appThemes';
import { AppStyleSwitcher } from './AppStyleSwitcher';
import { RotatingUCollageFanDeck } from './RotatingUCollageFanDeck';
import { ScriptureCirclesRail } from './ScriptureCirclesRail';
import { 
  Flame, ArrowRight, Radio, ChevronDown, Download, ExternalLink, ChevronLeft, ChevronRight, X
} from 'lucide-react';

interface SpursSanctuaryHeroProps {
  onNavigate: (dest: string) => void;
  onOpenSettings: () => void;
  isRadioPlaying: boolean;
  onToggleRadio: () => void;
  currentStationName?: string;
  onNextStation?: () => void;
  onPrevStation?: () => void;
  onOpenRoster?: () => void;
  onOpenZoom?: () => void;
  onToggleRadioDock?: () => void;
  onToggleMusicDock?: () => void;
  onOpenWelcome?: () => void;
  onOpenThemeModal?: () => void;
  onCycleNextTheme?: () => void;
  onCyclePrevTheme?: () => void;
  onSelectTheme?: (themeId: string) => void;
  activeTheme?: AppTheme;
  backgroundMode?: 'map' | 'obsidian_glow';
  onToggleBackgroundMode?: () => void;
}

// Fellowship Gathering items for YoungFire Discipleship (No matchups, no 'vs')
// Only YoungFire Small Groups have Zoom meetings scheduled; Open Bible & Sunday Worship are In-Person
interface SanctuaryGathering {
  id: string;
  title: string;
  category: string;
  emblem: string;
  dateStr: string;
  fullDate: string;
  timeStr: string;
  timeCST: string;
  location: string;
  shortLabel: string;
  badgeColor: string;
  zoomAvailable: boolean;
}

const UPCOMING_GATHERINGS: SanctuaryGathering[] = [
  { 
    id: 'monday_small_group', 
    title: 'YOUNGFIRE SMALL GROUP HUDDLE',
    category: 'Weekly Discipleship & Intercessory Gathering',
    emblem: '🔥', 
    dateStr: 'OCT 5',
    fullDate: 'Monday, Oct 5',
    timeStr: '7:00 pm',
    timeCST: '7:00 PM - 8:30 PM CST',
    location: 'Joshua House of Worship • Sanctuary Hall • San Antonio, TX',
    shortLabel: 'SMALL GROUP',
    badgeColor: 'from-amber-600 to-orange-600 border-amber-400',
    zoomAvailable: true // Only YoungFire Small Group has Zoom Broadcast
  },
  { 
    id: 'open_bible_thursday', 
    title: 'OPEN BIBLE THURSDAYS',
    category: 'All-Day Expository Study & Altar Prayer',
    emblem: '📖', 
    dateStr: 'OCT 8',
    fullDate: 'Thursday, Oct 8',
    timeStr: 'All Day',
    timeCST: 'All Day (In-Person Fellowship)',
    location: 'Joshua House of Worship • Main Hall • San Antonio, TX',
    shortLabel: 'OPEN BIBLE',
    badgeColor: 'from-zinc-900 to-black border-white/40',
    zoomAvailable: false // In-Person Only
  },
  { 
    id: 'sunday_worship', 
    title: 'SUNDAY CORPORATE WORSHIP',
    category: 'Congregational Worship & Word Proclamation',
    emblem: '🕊️', 
    dateStr: 'OCT 11',
    fullDate: 'Sunday, Oct 11',
    timeStr: '11:00 am',
    timeCST: '11:00 AM CST (In-Person Worship)',
    location: 'Joshua House of Worship • Main Sanctuary • San Antonio, TX',
    shortLabel: 'SUNDAY WORSHIP',
    badgeColor: 'from-orange-600 to-amber-600 border-orange-400',
    zoomAvailable: false // In-Person Only
  }
];

const JHOW_OFFICIAL_URL = 'https://joshuahouseofworship.org/?gad_source=1&gad_campaignid=22511961809&gbraid=0AAAAAokP8Rtag-bQ4B5HexneQH2q_p6gR&gclid=CjwKCAjwifjVBhBKEiwAYx4K9KTNMzVQV4-sStkh5TAvmskt4kTQ9-W6OXXTR5fWVfJlrHlJor6TkRoCSoAQAvD_BwE';

export const SpursSanctuaryHero: React.FC<SpursSanctuaryHeroProps> = ({
  onNavigate,
  onOpenSettings,
  isRadioPlaying,
  onToggleRadio,
  currentStationName,
  onNextStation,
  onPrevStation,
  onOpenZoom,
  onOpenThemeModal,
  onCycleNextTheme,
  onCyclePrevTheme,
  onSelectTheme,
  activeTheme,
  backgroundMode,
  onToggleBackgroundMode
}) => {
  const [selectedGatheringId, setSelectedGatheringId] = useState<string>('monday_small_group');
  const [stationNotice, setStationNotice] = useState<string | null>(null);
  const [isBrandBannerOpen, setIsBrandBannerOpen] = useState<boolean>(false);
  const [fanDeckPhotos] = useFanDeckPhotos();
  const photos = fanDeckPhotos && fanDeckPhotos.length > 0 
    ? fanDeckPhotos 
    : ['/image_4.png', '/image_6.png', '/image_5.png', '/image_7.png', '/image_2.png'];

  const currentGathering = UPCOMING_GATHERINGS.find(g => g.id === selectedGatheringId) || UPCOMING_GATHERINGS[0];

  const accentColor = activeTheme?.accentHex || '#FFFFFF';
  const borderColor = activeTheme?.borderHex || `${accentColor}70`;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNextStation) {
      onNextStation();
      setStationNotice(currentStationName || 'Next Gospel Station');
      setTimeout(() => setStationNotice(null), 2500);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPrevStation) {
      onPrevStation();
      setStationNotice(currentStationName || 'Previous Gospel Station');
      setTimeout(() => setStationNotice(null), 2500);
    }
  };

  // 1-Tap Calendar Subscription (.ics generation for selected gathering)
  const handleDownloadICS = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isAllDay = currentGathering.id === 'open_bible_thursday';
    const dtStart = isAllDay ? 'DTSTART;VALUE=DATE:20261008' : (currentGathering.id === 'sunday_worship' ? 'DTSTART:20261011T110000' : 'DTSTART:20261005T190000');
    const dtEnd = isAllDay ? 'DTEND;VALUE=DATE:20261009' : (currentGathering.id === 'sunday_worship' ? 'DTEND:20261011T130000' : 'DTEND:20261005T203000');

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YoungFire Ministry//Sanctuary Gathering//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${currentGathering.title}`,
      `DESCRIPTION:${currentGathering.category}. ${currentGathering.timeCST}. YoungFire Sanctuary Fellowship.`,
      `LOCATION:${currentGathering.location}`,
      dtStart,
      dtEnd,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentGathering.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Google Calendar direct 1-tap link
  const handleOpenGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isAllDay = currentGathering.id === 'open_bible_thursday';
    const dates = isAllDay ? '20261008/20261009' : (currentGathering.id === 'sunday_worship' ? '20261011T110000/20261011T130000' : '20261005T190000/20261005T203000');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(currentGathering.title)}&dates=${dates}&details=${encodeURIComponent(currentGathering.category + ' • ' + currentGathering.timeCST)}&location=${encodeURIComponent(currentGathering.location)}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 select-none max-w-lg mx-auto relative font-['Outfit']">
      
      {/* 1. TOP HEADER BAR reflecting active theme */}
      <div className="relative z-10 px-4 pt-3 pb-1 flex items-center justify-between">
        
        {/* Left: Settings */}
        <div className="w-24 flex items-center">
          <button
            onClick={onOpenSettings}
            className="text-[10px] font-mono text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
            title="Sanctuary Settings & Voice"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline text-[9px] font-pro-mono text-slate-400">SETTINGS</span>
          </button>
        </div>

        {/* Center: YOUNGFIRE with Carrot Dropdown (Toggles small inline dropdown banner, NO popup window) */}
        <div 
          onClick={() => setIsBrandBannerOpen(prev => !prev)}
          className="flex items-center gap-1.5 cursor-pointer group py-1 px-2.5 rounded-xl hover:bg-white/10 transition-all select-none"
          title="Toggle YoungFire & Joshua House of Worship Info"
        >
          <div 
            className="w-5 h-5 rounded-md flex items-center justify-center transition-colors shadow-sm"
            style={{ backgroundColor: `${accentColor}25` }}
          >
            <Flame className="w-3.5 h-3.5" style={{ color: accentColor }} />
          </div>
          <h1 className="font-['Outfit'] font-black text-lg sm:text-xl tracking-[0.2em] text-white flex items-center gap-1 group-hover:text-amber-300 transition-colors">
            <span>YOUNG<span style={{ color: accentColor }}>FIRE</span></span>
          </h1>
          <ChevronDown 
            className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform stroke-[2.5] duration-300 ${
              isBrandBannerOpen ? 'rotate-180' : 'rotate-0'
            }`} 
            style={{ color: isBrandBannerOpen ? accentColor : undefined }}
          />
        </div>

        {/* Right: RADIO CONTROLS reflecting active theme */}
        <div className="w-24 flex justify-end items-center">
          <div 
            className="flex items-center rounded-full bg-black/80 px-1 py-0.5 shadow-sm border transition-colors"
            style={{ borderColor: `${accentColor}50` }}
          >
            {/* Prev station arrow */}
            <button
              onClick={handlePrev}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
              title="Previous Gospel Station"
              aria-label="Previous Station"
            >
              <ChevronLeft className="w-2.5 h-2.5" />
            </button>

            {/* Play/Pause Radio Micro Pill */}
            <button
              onClick={onToggleRadio}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-pro-mono font-bold tracking-wider transition-all cursor-pointer border"
              style={{
                backgroundColor: isRadioPlaying ? `${accentColor}25` : 'transparent',
                borderColor: isRadioPlaying ? accentColor : 'transparent',
                color: isRadioPlaying ? accentColor : '#CBD5E1',
                boxShadow: isRadioPlaying ? `0 0 10px ${accentColor}40` : 'none'
              }}
              title={isRadioPlaying ? 'Pause Radio' : 'Play 24/7 Gospel Radio'}
              aria-label="Toggle Radio"
            >
              <Radio className={`w-2.5 h-2.5 ${isRadioPlaying ? 'animate-pulse' : ''}`} style={{ color: isRadioPlaying ? accentColor : '#94A3B8' }} />
              <span>RADIO</span>
              {isRadioPlaying && (
                <span className="w-1 h-1 rounded-full animate-ping inline-block" style={{ backgroundColor: accentColor }} />
              )}
            </button>

            {/* Next station arrow */}
            <button
              onClick={handleNext}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
              title="Next Gospel Station"
              aria-label="Next Station"
            >
              <ChevronRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* INLINE DROP DOWN SMALL BANNER FOR YOUNGFIRE (Not a popup window!) */}
      {isBrandBannerOpen && (
        <div 
          className="relative z-30 mx-3 sm:mx-4 my-2 p-3 sm:p-4 rounded-2xl bg-black/95 backdrop-blur-2xl border shadow-2xl flex flex-col gap-3 animate-fadeIn"
          style={{
            borderColor: borderColor,
            boxShadow: `0 10px 30px ${accentColor}25`
          }}
        >
          {/* YoungFire Ministry Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                <Flame className="w-5 h-5 text-black fill-current" />
              </div>
              <div>
                <h4 className="font-['Outfit'] font-black text-sm tracking-wider text-white uppercase leading-tight">
                  YOUNGFIRE MINISTRY
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Official Discipleship &amp; Fellowship Sanctuary
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsBrandBannerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full h-px bg-white/15" />

          {/* Joshua House of Worship Info Below It with Direct Official Link */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/30 flex items-center justify-center text-white font-['Barlow_Condensed',sans-serif] font-black text-xs flex-shrink-0">
                JHOW
              </div>
              <div>
                <h4 className="font-['Outfit'] font-black text-sm tracking-wider text-white uppercase leading-tight">
                  JOSHUA HOUSE OF WORSHIP
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  San Antonio, Texas &bull; Senior Pastors
                </p>
              </div>
            </div>

            <a
              href={JHOW_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 flex-shrink-0"
              style={{
                backgroundColor: accentColor,
                color: activeTheme?.id === 'spurs_stealth' ? '#000000' : '#FFFFFF'
              }}
            >
              <span>Visit JHOW</span>
              <ExternalLink className="w-3 h-3 stroke-[2.5]" />
            </a>
          </div>
        </div>
      )}

      {/* 2. SMALL COLORED BANNER BY ITSELF: "Joshua House of Worship" adjusting to color themes */}
      <div 
        className="relative z-10 w-full py-1 px-4 flex items-center justify-center transition-colors shadow-md text-center"
        style={{ 
          backgroundColor: accentColor,
          color: activeTheme?.id === 'spurs_stealth' ? '#000000' : '#FFFFFF'
        }}
        title="Sanctuary Home Base"
      >
        <span className="font-['Outfit'] font-black text-xs sm:text-sm tracking-[0.24em] uppercase drop-shadow-sm">
          Joshua House of Worship
        </span>
      </div>

      {/* Micro Station Notification Ticker */}
      {stationNotice && (
        <div className="relative z-20 px-4 pt-1 flex justify-center animate-fadeIn">
          <div 
            className="px-2.5 py-0.5 rounded-full bg-black/95 text-[9px] font-mono text-white flex items-center gap-1.5 shadow-md border"
            style={{ borderColor: accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            <span className="uppercase tracking-wider">Tuning: {stationNotice}</span>
          </div>
        </div>
      )}

      {/* 3. COMBINED BLACK ENCLOSURE: SWITCH YOUR APP STYLE & 66-BOOK SCRIPTURE CANON RESTING ON BLACK BACKGROUND */}
      {/* Both the style switcher and the canon rail share this continuous black container when map or glow is in background */}
      <div className="relative z-10 px-3 sm:px-4 pt-2 pb-2 w-full">
        <div 
          className="w-full rounded-3xl bg-black/95 backdrop-blur-2xl border p-3.5 sm:p-4 shadow-2xl flex flex-col gap-3.5 transition-all"
          style={{
            borderColor: borderColor,
            boxShadow: `0 12px 40px ${accentColor}18`
          }}
        >
          {/* Top Section: SWITCH YOUR APP STYLE (Banner + Controls) */}
          <AppStyleSwitcher 
            onCycleNextTheme={onCycleNextTheme}
            onCyclePrevTheme={onCyclePrevTheme}
            onSelectTheme={onSelectTheme}
            onOpenThemeModal={onOpenThemeModal}
            activeTheme={activeTheme} 
            backgroundMode={backgroundMode}
            onToggleBackgroundMode={onToggleBackgroundMode}
          />

          {/* Divider between Switcher and Canon */}
          <div className="w-full h-px bg-white/10" />

          {/* Bottom Section: 66 DIAGONAL-SPLIT SCRIPTURE CIRCLES CANON */}
          <ScriptureCirclesRail 
            activeTheme={activeTheme}
            onSelectBook={(bookName, chapter) => {
              window.dispatchEvent(new CustomEvent('yf_read_scripture', { detail: { book: bookName, chapter } }));
              onNavigate('word');
            }}
          />
        </div>
      </div>

      {/* 4. HORIZONTAL GATHERINGS & COHORTS ROW with dynamic theme outline */}
      <div className="relative z-10 w-full px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {UPCOMING_GATHERINGS.map((gathering) => {
          const isSelected = gathering.id === selectedGatheringId;
          return (
            <button
              key={gathering.id}
              onClick={() => setSelectedGatheringId(gathering.id)}
              className="flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer border text-left"
              style={{
                borderColor: isSelected ? accentColor : 'rgba(255, 255, 255, 0.2)',
                backgroundColor: isSelected ? `${accentColor}25` : 'rgba(0, 0, 0, 0.65)',
                boxShadow: isSelected ? `0 0 14px ${accentColor}35` : 'none',
                color: isSelected ? '#FFFFFF' : '#CBD5E1'
              }}
              title={gathering.title}
            >
              <span className="text-xs">{gathering.emblem}</span>
              <span className="font-mono text-[10px] tracking-wider font-bold" style={{ color: isSelected ? accentColor : '#CBD5E1' }}>
                {gathering.dateStr}
              </span>
              <span className="font-['Outfit'] text-[11px] tracking-wider uppercase font-bold">
                {gathering.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. CLOCK-ARC ROTATING PHOTO DECK - Generous vertical separation so it does not crowd the scripture rail */}
      <div className="relative z-10 my-4 sm:my-6 w-full">
        <RotatingUCollageFanDeck 
          photos={photos} 
          autoRotateIntervalMs={2000}
          activeTheme={activeTheme}
        />
      </div>

      {/* 6. ENCLOSED SMALL GROUP HUDDLE ANNOUNCEMENT CARD (No 'vs', No matchups, dynamic outline) */}
      <div className="w-full px-3 sm:px-4 pt-1 pb-4 select-none relative z-10">
        <div 
          className="w-full rounded-3xl bg-[#000000]/85 backdrop-blur-2xl border overflow-hidden shadow-2xl transition-all"
          style={{
            borderColor: borderColor,
            boxShadow: `0 15px 45px ${accentColor}18`
          }}
        >
          <div className="pt-4 pb-2 px-4 flex flex-col items-center justify-center text-center">
            
            {/* Top Date */}
            <span className="font-mono text-xs tracking-[0.2em] text-slate-300 mb-1 drop-shadow uppercase font-bold">
              {currentGathering.fullDate}
            </span>

            {/* Title: YOUNGFIRE SMALL GROUP HUDDLE (No 'vs') */}
            <h3 className="font-['Outfit'] font-black text-base sm:text-lg tracking-wider text-white mb-0.5 drop-shadow-md uppercase">
              {currentGathering.title}
            </h3>
            
            {/* Fellowship Description */}
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-3 font-semibold">
              {currentGathering.category}
            </p>

            {/* Center Row: Sanctuary Seal, Large Time & Location, Discipleship Flame */}
            <div className="w-full max-w-sm mx-auto flex items-center justify-between px-2 sm:px-4 my-1">
              
              {/* Left Seal: Joshua House Sanctuary */}
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => onNavigate('team')}
                  className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer group"
                  style={{ borderColor: accentColor }}
                  title="Joshua House Sanctuary"
                >
                  <span className="font-['Barlow_Condensed',sans-serif] text-sm sm:text-base tracking-wider text-white font-bold">
                    JHOW
                  </span>
                </div>
                <span className="font-mono text-[9px] tracking-widest text-slate-400 mt-1 uppercase font-bold">
                  SANCTUARY
                </span>
              </div>

              {/* Center: Large gathering time e.g. 7:00 pm */}
              <div className="flex flex-col items-center px-2">
                <div className="font-['Outfit'] font-black text-3xl sm:text-4xl text-white tracking-normal drop-shadow-lg leading-none">
                  {currentGathering.timeStr}
                </div>
                <p className="font-mono text-[10px] text-slate-400 mt-1.5 max-w-[200px] leading-tight text-center">
                  {currentGathering.location}
                </p>
              </div>

              {/* Right Seal: YoungFire Discipleship */}
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => onNavigate('team')}
                  className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer group"
                  style={{ borderColor: activeTheme?.secondaryHex || accentColor }}
                  title="YoungFire Discipleship"
                >
                  <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-500/30 group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-mono text-[9px] tracking-widest text-slate-400 mt-1 uppercase font-bold">
                  DISCIPLES
                </span>
              </div>
            </div>

            {/* 1-Tap Calendar Reminder links */}
            <div className="flex items-center justify-center gap-3 mt-2.5 text-[10px] font-mono text-slate-400">
              <button
                onClick={handleOpenGoogleCalendar}
                className="hover:text-amber-300 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" style={{ color: accentColor }} />
                <span>Google Cal</span>
              </button>
              <span className="text-white/20">&bull;</span>
              <button
                onClick={handleDownloadICS}
                className="hover:text-amber-300 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" style={{ color: accentColor }} />
                <span>Apple/iCal (.ics)</span>
              </button>
            </div>
          </div>

          {/* 3-Stripe Fiesta / Theme Accent Band */}
          <div className="w-full flex flex-col gap-[2px] mt-2">
            <div className="w-full h-1 sm:h-1.5" style={{ backgroundColor: activeTheme?.stripes?.[0] || accentColor }} />
            <div className="w-full h-1 sm:h-1.5" style={{ backgroundColor: activeTheme?.stripes?.[1] || activeTheme?.secondaryHex || '#EF426F' }} />
            <div className="w-full h-1 sm:h-1.5" style={{ backgroundColor: activeTheme?.stripes?.[2] || activeTheme?.tertiaryHex || '#FF8200' }} />
          </div>

          {/* Action button across bottom of card: Zoom only for YoungFire Small Group */}
          <button
            onClick={() => {
              if (currentGathering.zoomAvailable) {
                if (onOpenZoom) onOpenZoom();
                else window.dispatchEvent(new CustomEvent('yf_open_zoom'));
              } else {
                onNavigate('schedule');
              }
            }}
            className="w-full py-3 bg-black hover:bg-white/10 text-white font-['Outfit'] text-xs sm:text-sm tracking-[0.25em] font-black uppercase text-center transition-colors cursor-pointer block"
            title={currentGathering.zoomAvailable ? "Join Small Group Zoom Broadcast" : "View Sanctuary Schedule & Details"}
          >
            {currentGathering.zoomAvailable ? 'JOIN SMALL GROUP HUDDLE (ZOOM)' : 'VIEW SANCTUARY DETAILS & CALENDAR'}
          </button>

        </div>
      </div>

      {/* 7. DUAL ACTION TILES with dynamic outline adjusting to color themes */}
      <div className="px-3 sm:px-4 space-y-4 relative z-10 w-full">
        <div className="grid grid-cols-2 gap-3">
          
          {/* Tile 1: MY DISCIPLESHIP • TRACK SWORD */}
          <button
            onClick={() => onNavigate('bibletracker')}
            className="p-4 rounded-2xl bg-[#000000]/90 backdrop-blur-xl border hover:scale-[1.02] transition-all group flex items-center justify-between text-left shadow-2xl shadow-black/90 cursor-pointer active:scale-98"
            style={{
              borderColor: borderColor,
              boxShadow: `0 4px 20px ${accentColor}15`
            }}
            title="My Discipleship • Track Sword"
          >
            <div className="flex flex-col gap-0.5 pr-2">
              <span className="font-['Outfit'] font-black text-base sm:text-lg leading-none text-white tracking-wide uppercase">
                MY DISCIPLESHIP
              </span>
              <span className="font-['Outfit'] font-bold text-xs sm:text-sm leading-tight text-slate-400 group-hover:text-slate-300 transition-colors uppercase">
                TRACK SWORD
              </span>
            </div>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all flex-shrink-0 shadow-md group-hover:scale-105"
              style={{ 
                backgroundColor: accentColor,
                color: activeTheme?.id === 'spurs_stealth' ? '#000000' : '#FFFFFF'
              }}
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>

          {/* Tile 2: PRAYER DOCK • ENTER INTERCESSION */}
          <button
            onClick={() => onNavigate('prayer_dock')}
            className="p-4 rounded-2xl bg-[#000000]/90 backdrop-blur-xl border hover:scale-[1.02] transition-all group flex items-center justify-between text-left shadow-2xl shadow-black/90 cursor-pointer active:scale-98"
            style={{
              borderColor: borderColor,
              boxShadow: `0 4px 20px ${accentColor}15`
            }}
            title="Prayer Dock • Enter Intercession"
          >
            <div className="flex flex-col gap-0.5 pr-2">
              <span className="font-['Outfit'] font-black text-base sm:text-lg leading-none text-white tracking-wide uppercase">
                PRAYER DOCK
              </span>
              <span className="font-['Outfit'] font-bold text-xs sm:text-sm leading-tight text-slate-400 group-hover:text-slate-300 transition-colors uppercase">
                ENTER INTERCESSION
              </span>
            </div>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all flex-shrink-0 shadow-md group-hover:scale-105"
              style={{ 
                backgroundColor: activeTheme?.secondaryHex || accentColor,
                color: activeTheme?.id === 'spurs_stealth' ? '#000000' : '#FFFFFF'
              }}
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};

export default SpursSanctuaryHero;
