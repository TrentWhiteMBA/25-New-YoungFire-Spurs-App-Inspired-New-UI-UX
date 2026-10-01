import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AVAILABLE_LAUNCH_TRACKS, LaunchTrackOption } from './data/launchTracks';
import { GOSPEL_STATIONS, RadioStation } from './data/radioStations';
import { SpursSanctuaryHero } from './components/SpursSanctuaryHero';
import { ImperialAtlas } from './components/ImperialAtlas';
import { FellowshipHub } from './components/FellowshipHub';
import { DiscipleshipVault } from './components/DiscipleshipVault';
import { PrayerDock } from './components/PrayerDock';
import { DailyBreadHub } from './components/DailyBreadHub';
import { MenOnFireHub } from './components/MenOnFireHub';
import { WomenIgnitedHub } from './components/WomenIgnitedHub';
import { BottomNavBar } from './components/BottomNavBar';
import { BroadcastStingerWipe } from './components/BroadcastStingerWipe';
import { SettingsHUDModal, CurrentUser } from './components/SettingsHUDModal';
import { AuthSecurityPortal, generateMonogramBadge } from './components/AuthSecurityPortal';
import { PhysicalBibleTracker } from './components/PhysicalBibleTracker';
import { AIMentorCounselor } from './components/AIMentorCounselor';
import { KingdomVideoVault, VideoItem } from './components/KingdomVideoVault';
import { LiveVoiceSanctuary } from './components/LiveVoiceSanctuary';
import { AdminCMSModal } from './components/AdminCMSModal';
import { ReadingProgressModal } from './components/ReadingProgressModal';
import { ScriptureViewer } from './components/ScriptureViewer';
import { LiveRadioPlayer } from './components/LiveRadioPlayer';
import { FloatingVideoPlayer } from './components/FloatingVideoPlayer';
import { KingdomMediaView } from './components/KingdomMediaView';
import { SpotifyYouTubePlayer } from './components/SpotifyYouTubePlayer';
import { MemberRosterModal } from './components/MemberRosterModal';
import { ZoomMeetingModal } from './components/ZoomMeetingModal';
import { StudyNotesHUD } from './components/StudyNotesHUD';
import { APP_THEMES, getStoredThemes, AppTheme } from './data/appThemes';
import { VersionUpdateNotifier } from './components/VersionUpdateNotifier';
import { AppSplashScreen } from './components/AppSplashScreen';
import { WelcomeSanctuary } from './components/WelcomeSanctuary';
import { SanctuaryTeamHub } from './components/SanctuaryTeamHub';
import { SanctuaryScheduleView } from './components/SanctuaryScheduleView';
import { SlidingNavDrawer } from './components/SlidingNavDrawer';
import { MinistryBroadcastModal } from './components/MinistryBroadcastModal';
import { FloatingStudyNotesWidget } from './components/FloatingStudyNotesWidget';
import { WordDimensionPickerSheet } from './components/WordDimensionPickerSheet';
import { SanAntonioVectorMap } from './components/SanAntonioVectorMap';
import { 
  BroadcastMeetingPayload, 
  getBroadcastMeeting, 
  isBeaconBannerVisible, 
  dismissBeaconBanner 
} from './data/broadcastMeetingData';
import { initFirebaseRealtimeSync } from './services/firebaseSyncService';
import { Radio, Volume2, VolumeX, Sparkles, BookOpen, Compass, Music, Bell, X, CheckCircle2, Headphones, Flame, Sliders, PenTool } from 'lucide-react';

interface ActiveAudioStream {
  id: string;
  name: string;
  genreOrArtist: string;
  streamUrl: string;
  isRadio: boolean;
  accentColor?: string;
}

export default function App() {
  // 1. Authentication State (Device-isolated session under youngfire_device_session_v1, defaults to null for welcome page preview)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    try {
      const saved = localStorage.getItem('youngfire_device_session_v1') || localStorage.getItem('youngfire_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.gender) {
          parsed.gender = parsed.email?.toLowerCase().includes('whitney') ? 'female' : 'male';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Welcome Gate state for unauthenticated devices ('welcome' | 'auth')
  const [unauthStage, setUnauthStage] = useState<'welcome' | 'auth'>('welcome');
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'register'>('signin');

  // Permanent Welcome Hub modal for authenticated disciples
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);

  // Lock scrolling on background canvas completely when nav drawer is open
  useEffect(() => {
    if (isNavDrawerOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isNavDrawerOpen]);

  // 2. Navigation State ('sanctuary' | 'word' | 'fellowship' | 'mentor' | 'bibletracker' | 'tv' | 'radio')
  const [activeTab, setActiveTab] = useState<string>('sanctuary');
  const [wordSubView, setWordSubView] = useState<'bible' | 'atlas'>('bible');
  const [scripturePassage, setScripturePassage] = useState<{ bookId: string; chapter: number }>({
    bookId: 'EPH',
    chapter: 4
  });
  const [fellowshipInitialDrillDown, setFellowshipInitialDrillDown] = useState<string | null>(null);

  // Broadcast Stinger Wipe
  const [stingerActive, setStingerActive] = useState<boolean>(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  // New Global Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isVoiceSanctuaryOpen, setIsVoiceSanctuaryOpen] = useState<boolean>(false);
  const [isProgressOpen, setIsProgressOpen] = useState<boolean>(false);
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState<boolean>(false);
  const [isRosterOpen, setIsRosterOpen] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [notesPrefill, setNotesPrefill] = useState<{ passage?: string; title?: string } | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem('youngfire_theme_id') || 'spurs_stealth';
  });

  // Background canvas choice: 'map' = San Antonio street map, 'obsidian_glow' = pure black with theme blurred colors
  const [backgroundMode, setBackgroundMode] = useState<'map' | 'obsidian_glow'>(() => {
    try {
      return (localStorage.getItem('youngfire_bg_mode') as 'map' | 'obsidian_glow') || 'map';
    } catch {
      return 'map';
    }
  });

  const handleToggleBackgroundMode = () => {
    setBackgroundMode(prev => {
      const next = prev === 'map' ? 'obsidian_glow' : 'map';
      try {
        localStorage.setItem('youngfire_bg_mode', next);
      } catch {}
      return next;
    });
  };

  // Half-screen slide-up sheet state for Word HUD
  const [isWordPickerOpen, setIsWordPickerOpen] = useState<boolean>(false);

  // New Global Modals: Broadcast Meeting & Zoom Flyer Hub
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [broadcastMeeting, setBroadcastMeeting] = useState<BroadcastMeetingPayload>(() => getBroadcastMeeting());

  // Module 2: Persistent 24/7 Gospel Radio & Gospel Praise Docks
  const [isMusicDockOpen, setIsMusicDockOpen] = useState<boolean>(false);
  const [isRadioDockOpen, setIsRadioDockOpen] = useState<boolean>(false);

  // Meeting Alerts Beacon state (Module 2 + Sanctuary Broadcasts)
  const [hasMeetingAlert, setHasMeetingAlert] = useState<boolean>(() => {
    try {
      const bSaved = localStorage.getItem('youngfire_admin_broadcast_meeting');
      const b = bSaved ? JSON.parse(bSaved) : getBroadcastMeeting();
      if (b && isBeaconBannerVisible(b)) return true;
      
      const saved = localStorage.getItem('youngfire_calendar_overrides');
      if (saved) {
        const obj = JSON.parse(saved);
        const hasCalAlert = Object.values(obj).some((v: any) => v.status === 'canceled' || v.status === 'rescheduled');
        if (hasCalAlert) return true;
      }
    } catch {}
    return isBeaconBannerVisible();
  });

  const [meetingAlertText, setMeetingAlertText] = useState<string | null>(() => {
    try {
      const bSaved = localStorage.getItem('youngfire_admin_broadcast_meeting');
      const b = bSaved ? JSON.parse(bSaved) : getBroadcastMeeting();
      if (b && isBeaconBannerVisible(b)) {
        return `🔥 Special Ministry Zoom Scheduled: ${b.dateTime} • Tap to View Flyer & Join`;
      }
      const saved = localStorage.getItem('youngfire_calendar_overrides');
      if (saved) {
        const obj = JSON.parse(saved);
        const alert = Object.values(obj).find((v: any) => v.status === 'canceled' || v.status === 'rescheduled') as any;
        if (alert) {
          return alert.status === 'canceled'
            ? `⚠️ Meeting Update: Gathering Canceled by Facilitators (${alert.updateNote || 'See calendar for details'}).`
            : `⚠️ Meeting Update: Gathering Rescheduled to ${alert.rescheduleDate || 'new date'} at ${alert.rescheduleTime || '7:00 PM CST'}.`;
        }
      }
    } catch {}
    return null;
  });

  const [availableThemes, setAvailableThemes] = useState<AppTheme[]>(() => getStoredThemes());

  useEffect(() => {
    const handleThemesUpdate = (e: Event) => {
      const customEv = e as CustomEvent<{ themes: AppTheme[] }>;
      if (customEv?.detail?.themes) {
        setAvailableThemes(customEv.detail.themes);
      } else {
        setAvailableThemes(getStoredThemes());
      }
    };
    window.addEventListener('yf_themes_list_updated', handleThemesUpdate);
    return () => window.removeEventListener('yf_themes_list_updated', handleThemesUpdate);
  }, []);

  const activeTheme = useMemo(() => {
    return availableThemes.find(t => t.id === currentThemeId) || availableThemes[0] || APP_THEMES[0];
  }, [currentThemeId, availableThemes]);

  // Synchronize color palette across app, localStorage, and CSS custom properties
  useEffect(() => {
    const handleThemeApplied = (e: Event) => {
      const customEv = e as CustomEvent<{ themeId: string }>;
      if (customEv?.detail?.themeId) {
        setCurrentThemeId(customEv.detail.themeId);
      }
    };
    window.addEventListener('yf_theme_applied', handleThemeApplied);
    return () => window.removeEventListener('yf_theme_applied', handleThemeApplied);
  }, []);

  const handleCycleNextTheme = () => {
    const currentIndex = availableThemes.findIndex(t => t.id === currentThemeId);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    const nextTheme = availableThemes[nextIndex];
    setCurrentThemeId(nextTheme.id);
    try {
      localStorage.setItem('youngfire_sanctuary_theme_id', nextTheme.id);
    } catch {}
  };

  const handleCyclePrevTheme = () => {
    const currentIndex = availableThemes.findIndex(t => t.id === currentThemeId);
    const prevIndex = (currentIndex - 1 + availableThemes.length) % availableThemes.length;
    const prevTheme = availableThemes[prevIndex];
    setCurrentThemeId(prevTheme.id);
    try {
      localStorage.setItem('youngfire_sanctuary_theme_id', prevTheme.id);
    } catch {}
  };

  const handleSelectTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    try {
      localStorage.setItem('youngfire_sanctuary_theme_id', themeId);
    } catch {}
  };

  useEffect(() => {
    if (activeTheme) {
      document.documentElement.style.setProperty('--theme-bg', activeTheme.bgHex);
      document.documentElement.style.setProperty('--theme-card', activeTheme.cardHex);
      document.documentElement.style.setProperty('--theme-accent', activeTheme.accentHex);
      document.documentElement.style.setProperty('--theme-border', activeTheme.borderHex);
      document.body.style.backgroundColor = activeTheme.bgHex;
      if (activeTheme.fontFamily) {
        document.body.style.fontFamily = activeTheme.fontFamily;
        document.documentElement.style.fontFamily = activeTheme.fontFamily;
      }
    }
  }, [activeTheme]);

  // Floating Mini-Player for Kingdom Videos
  const [floatingVideo, setFloatingVideo] = useState<VideoItem | null>(null);
  const [activeTheaterVideo, setActiveTheaterVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const handlePlayVideo = (e: any) => {
      if (e.detail?.video) {
        setFloatingVideo(e.detail.video);
      }
    };
    window.addEventListener('yf_play_video', handlePlayVideo);
    return () => window.removeEventListener('yf_play_video', handlePlayVideo);
  }, []);

  // Notification Banner
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Sound Controls
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.85);

  // Contemporary Worship Radio Station
  const contemporaryStation = useMemo(() => {
    return GOSPEL_STATIONS.find(s => s.id === 'worship-lift') || GOSPEL_STATIONS[0];
  }, []);

  // 3. Centralized Audio Stream State (Default to Contemporary Worship Radio on sanctuary entrance)
  const [selectedLaunchTrack, setSelectedLaunchTrack] = useState<LaunchTrackOption>(() => {
    return AVAILABLE_LAUNCH_TRACKS[0];
  });

  const [activeAudio, setActiveAudio] = useState<ActiveAudioStream>(() => {
    const contemporary = GOSPEL_STATIONS.find(s => s.id === 'worship-lift') || GOSPEL_STATIONS[0];
    return {
      id: contemporary.id,
      name: contemporary.name,
      genreOrArtist: `${contemporary.genre} • ${contemporary.location}`,
      streamUrl: contemporary.streamUrl,
      isRadio: true,
      accentColor: contemporary.accentColor || '#0EA5E9'
    };
  });

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper to start contemporary worship radio stream
  const startContemporaryWorshipAutoplay = () => {
    const station = GOSPEL_STATIONS.find(s => s.id === 'worship-lift') || GOSPEL_STATIONS[0];
    setActiveAudio({
      id: station.id,
      name: station.name,
      genreOrArtist: `${station.genre} • ${station.location}`,
      streamUrl: station.streamUrl,
      isRadio: true,
      accentColor: station.accentColor
    });
    if (audioRef.current) {
      audioRef.current.src = station.streamUrl;
      audioRef.current.loop = false;
      audioRef.current.play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => {
          // If browser blocks without gesture, trigger on first tap/click in sanctuary
          const unlockAudio = () => {
            if (audioRef.current) {
              audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
            }
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
          };
          window.addEventListener('click', unlockAudio, { once: true });
          window.addEventListener('touchstart', unlockAudio, { once: true });
        });
    }
  };

  // Initialize and synchronize persistent background audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(activeAudio.streamUrl);
      audioRef.current.loop = !activeAudio.isRadio;
    } else {
      audioRef.current.src = activeAudio.streamUrl;
      audioRef.current.loop = !activeAudio.isRadio;
      if (isAudioPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
    audioRef.current.volume = masterVolume;
  }, [activeAudio.streamUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = masterVolume;
    }
  }, [masterVolume]);

  // Autoplay handler: ONLY play AFTER the user signs in or registers; NOT on welcome or register screens.
  useEffect(() => {
    if (!currentUser) {
      // Unauthenticated: explicitly ensure audio is stopped
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsAudioPlaying(false);
      return;
    }

    let triggered = false;
    const startLaunchAudio = () => {
      if (!triggered && audioRef.current) {
        startContemporaryWorshipAutoplay();
        triggered = true;
        window.removeEventListener('click', startLaunchAudio);
        window.removeEventListener('touchstart', startLaunchAudio);
      }
    };

    const timer = setTimeout(startLaunchAudio, 700);
    window.addEventListener('click', startLaunchAudio);
    window.addEventListener('touchstart', startLaunchAudio);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', startLaunchAudio);
      window.removeEventListener('touchstart', startLaunchAudio);
    };
  }, [currentUser?.id]);

  // Listen to Global Custom Events
  useEffect(() => {
    const handleOpenRoster = () => setIsRosterOpen(true);
    const handleOpenZoom = () => setIsZoomOpen(true);
    const handleOpenNotes = (e?: any) => {
      if (e?.detail) {
        setNotesPrefill({
          passage: e.detail.passage || `${e.detail.book || ''} ${e.detail.chapter || ''}`.trim(),
          title: e.detail.title
        });
      }
      setIsNotesOpen(true);
    };
    const handleOpenTheme = () => handleCycleNextTheme();
    const handleNotifications = () => {
      if (hasMeetingAlert && meetingAlertText) {
        setNotificationToast(meetingAlertText);
      } else {
        setNotificationToast("🔔 YoungFire Sanctuary Alert: Small Group meets every other Monday at 7:00 PM CST (In-Person & Zoom). 2026 Theme: Rebuilding Better Together (Ephesians 4:16).");
      }
      setTimeout(() => setNotificationToast(null), 7000);
    };

    const handleMeetingStatusUpdate = (e: any) => {
      const detail = e.detail;
      if (detail && (detail.count > 0 || detail.isBroadcast)) {
        setHasMeetingAlert(true);
        setMeetingAlertText(detail.message);
        setNotificationToast(detail.message);
        if (detail.meeting) {
          setBroadcastMeeting(detail.meeting);
        }
      } else {
        setHasMeetingAlert(false);
        setMeetingAlertText(null);
      }
    };

    const handleBroadcastMeetingUpdate = (e: any) => {
      if (e.detail) {
        setBroadcastMeeting(e.detail);
      }
    };

    const handleOpenBroadcast = () => setIsBroadcastModalOpen(true);

    const handleNavigateScripture = (e: any) => {
      if (e.detail?.bookId && e.detail?.chapter) {
        handleDeepLinkToScripture(e.detail.bookId, e.detail.chapter);
      }
    };

    const handleToggleMusic = () => setIsMusicDockOpen(prev => !prev);
    const handleToggleRadio = () => setIsRadioDockOpen(prev => !prev);
    const handleOpenWelcome = () => setIsWelcomeModalOpen(true);

    const handleStopRadio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsAudioPlaying(false);
    };

    const handleBeaconVisibilityChange = (e: any) => {
      const visible = e.detail?.visible;
      if (visible === false) {
        setHasMeetingAlert(false);
      } else if (visible === true) {
        setHasMeetingAlert(true);
      } else {
        setHasMeetingAlert(isBeaconBannerVisible());
      }
    };

    window.addEventListener('yf_beacon_visibility_changed', handleBeaconVisibilityChange);
    window.addEventListener('yf_stop_radio', handleStopRadio);
    window.addEventListener('yf_open_welcome', handleOpenWelcome);
    window.addEventListener('yf_open_roster', handleOpenRoster);
    window.addEventListener('yf_open_zoom', handleOpenZoom);
    window.addEventListener('yf_open_broadcast', handleOpenBroadcast);
    window.addEventListener('yf_broadcast_meeting_updated', handleBroadcastMeetingUpdate);
    window.addEventListener('yf_open_study_notes', handleOpenNotes);
    window.addEventListener('yf_open_notes_hud', handleOpenNotes);
    window.addEventListener('yf_open_theme_hud', handleOpenTheme);
    window.addEventListener('yf_open_notifications', handleNotifications);
    window.addEventListener('yf_meeting_status_updated', handleMeetingStatusUpdate);
    window.addEventListener('yf_navigate_scripture', handleNavigateScripture);
    window.addEventListener('yf_toggle_music_dock', handleToggleMusic);
    window.addEventListener('yf_toggle_radio_dock', handleToggleRadio);
    const handleOpenNavDrawer = () => setIsNavDrawerOpen(true);
    window.addEventListener('yf_open_nav_drawer', handleOpenNavDrawer);

    const handleOpenPrayerDock = () => {
      setFellowshipInitialDrillDown('prayer_dock');
      handleNavigateWithStinger('fellowship');
    };
    const handleOpenDiscipleship = () => {
      setFellowshipInitialDrillDown('discipleship');
      handleNavigateWithStinger('fellowship');
    };
    window.addEventListener('yf_open_prayer_dock', handleOpenPrayerDock);
    window.addEventListener('yf_open_discipleship', handleOpenDiscipleship);

    // Initialize global real-time cross-device sync listeners
    const cleanupSync = initFirebaseRealtimeSync();

    return () => {
      cleanupSync();
      window.removeEventListener('yf_open_nav_drawer', handleOpenNavDrawer);
      window.removeEventListener('yf_open_prayer_dock', handleOpenPrayerDock);
      window.removeEventListener('yf_open_discipleship', handleOpenDiscipleship);
      window.removeEventListener('yf_stop_radio', handleStopRadio);
      window.removeEventListener('yf_open_welcome', handleOpenWelcome);
      window.removeEventListener('yf_open_roster', handleOpenRoster);
      window.removeEventListener('yf_open_zoom', handleOpenZoom);
      window.removeEventListener('yf_open_broadcast', handleOpenBroadcast);
      window.removeEventListener('yf_broadcast_meeting_updated', handleBroadcastMeetingUpdate);
      window.removeEventListener('yf_open_study_notes', handleOpenNotes);
      window.removeEventListener('yf_open_notes_hud', handleOpenNotes);
      window.removeEventListener('yf_open_theme_hud', handleOpenTheme);
      window.removeEventListener('yf_open_notifications', handleNotifications);
      window.removeEventListener('yf_meeting_status_updated', handleMeetingStatusUpdate);
      window.removeEventListener('yf_navigate_scripture', handleNavigateScripture);
      window.removeEventListener('yf_toggle_music_dock', handleToggleMusic);
      window.removeEventListener('yf_toggle_radio_dock', handleToggleRadio);
    };
  }, []);

  // Audio Ducking (for Video Vault, AI Voice Mentor, or Scripture Narration)
  const handleAudioDucking = (shouldDuck: boolean) => {
    if (!audioRef.current) return;
    if (shouldDuck) {
      audioRef.current.volume = 0.1;
    } else {
      audioRef.current.volume = masterVolume;
    }
  };

  // Toggle Audio Playback
  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      // Dual-stream mutual exclusion: pause active video & praise dock when radio starts
      setFloatingVideo(null);
      window.dispatchEvent(new CustomEvent('yf_pause_video'));
      window.dispatchEvent(new CustomEvent('yf_pause_praise_dock'));

      audioRef.current.play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => {});
    }
  };

  // Switch Radio Station (keeps playing across all tabs)
  const handleSelectRadioStation = (station: RadioStation) => {
    // Dual-stream mutual exclusion: pause active video & praise dock when radio starts
    setFloatingVideo(null);
    window.dispatchEvent(new CustomEvent('yf_pause_video'));
    window.dispatchEvent(new CustomEvent('yf_pause_praise_dock'));

    setActiveAudio({
      id: station.id,
      name: station.name,
      genreOrArtist: `${station.genre} • ${station.location}`,
      streamUrl: station.streamUrl,
      isRadio: true,
      accentColor: station.accentColor
    });
    if (audioRef.current) {
      audioRef.current.src = station.streamUrl;
      audioRef.current.loop = false;
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
    }
  };

  // Next Radio Station
  const handleNextRadioStation = () => {
    const currentIndex = GOSPEL_STATIONS.findIndex(s => s.id === activeAudio.id);
    const nextIndex = (currentIndex + 1) % GOSPEL_STATIONS.length;
    handleSelectRadioStation(GOSPEL_STATIONS[nextIndex]);
  };

  // Previous Radio Station
  const handlePrevRadioStation = () => {
    const currentIndex = GOSPEL_STATIONS.findIndex(s => s.id === activeAudio.id);
    const prevIndex = (currentIndex - 1 + GOSPEL_STATIONS.length) % GOSPEL_STATIONS.length;
    handleSelectRadioStation(GOSPEL_STATIONS[prevIndex]);
  };

  // Stinger Wipe Navigation Transition
  const handleNavigateWithStinger = (targetTab: string, subView?: 'bible' | 'atlas') => {
    let effectiveTab = targetTab;
    if (targetTab === 'discipleship') {
      setFellowshipInitialDrillDown('discipleship');
      effectiveTab = 'discipleship';
    } else if (targetTab === 'prayer' || targetTab === 'prayer_dock') {
      setFellowshipInitialDrillDown('prayer_dock');
      effectiveTab = 'prayer_dock';
    } else if (targetTab === 'dailybread' || targetTab === 'daily_bread') {
      setFellowshipInitialDrillDown('daily_bread');
      effectiveTab = 'dailybread';
    } else if (targetTab === 'men') {
      setFellowshipInitialDrillDown('men');
      effectiveTab = 'men';
    } else if (targetTab === 'women') {
      setFellowshipInitialDrillDown('women');
      effectiveTab = 'women';
    }

    if (effectiveTab === activeTab && !subView) return;
    if (subView) setWordSubView(subView);

    // Background Video Playback (PiP): Retain video in floating window when navigating away from tv
    if (activeTab === 'tv' && effectiveTab !== 'tv' && activeTheaterVideo && !floatingVideo) {
      setFloatingVideo(activeTheaterVideo);
    }

    if (effectiveTab === 'word' && !subView) {
      setIsWordPickerOpen(true);
      return;
    }

    if (effectiveTab === 'bibletracker' || (activeTab === 'word' && effectiveTab === 'word')) {
      setActiveTab(effectiveTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setPendingTab(effectiveTab);
    setStingerActive(true);
  };

  const handleStingerMidpoint = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStingerComplete = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setStingerActive(false);
  };

  // Direct Scripture Deep-Linking
  const handleDeepLinkToScripture = (bookId: string, chapter: number) => {
    setScripturePassage({ bookId, chapter });
    setWordSubView('bible');
    setActiveTab('word');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.dispatchEvent(new CustomEvent('yf_navigate_scripture', { detail: { bookId, chapter } }));
    } catch {}
  };

  // User Authentication Logout
  const handleLogout = () => {
    localStorage.removeItem('youngfire_device_session_v1');
    localStorage.removeItem('youngfire_user_session');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsAudioPlaying(false);
    setCurrentUser(null);
    setIsSettingsOpen(false);
    setUnauthStage('welcome');
  };

  // If not logged in, render Welcome Center and Security Login screen before entering sanctuary
  if (!currentUser) {
    if (unauthStage === 'welcome') {
      return (
        <>
          <AppSplashScreen />
          <WelcomeSanctuary
            onEnterSanctuary={() => {
              const defaultLeadUser: CurrentUser = {
                id: 'roster_lead_trent',
                name: 'Lead Facilitator Trent D. White',
                email: 'trentwhite0308@gmail.com',
                gender: 'male',
                avatar: '/image_4.png',
                isAdmin: true,
                accountType: 'administrator',
                role: 'Lead Facilitator',
                ministryRoleId: 'lead_facilitator',
                ministryRoleLabel: 'Lead Facilitator',
                calling: 'Sanctuary Leadership & Overseer',
                churchMembership: 'Joshua House of Worship',
                residence: 'San Antonio, TX',
                phone: '(210) 555-0144',
                birthday: '03-08',
                joinedAt: '2024-01-01T00:00:00.000Z'
              };
              localStorage.setItem('youngfire_device_session_v1', JSON.stringify(defaultLeadUser));
              setCurrentUser(defaultLeadUser);
              setTimeout(() => {
                startContemporaryWorshipAutoplay();
              }, 350);
            }}
            onRegister={() => {
              setAuthInitialMode('register');
              setUnauthStage('auth');
            }}
            onSignIn={() => {
              setAuthInitialMode('signin');
              setUnauthStage('auth');
            }}
            onExploreGuest={() => {
              const guestUser: CurrentUser = {
                id: `guest_${Date.now()}`,
                name: 'YoungFire Guest Disciple',
                email: 'guest@youngfire.org',
                gender: 'male',
                avatar: generateMonogramBadge('Guest Disciple'),
                isAdmin: false,
                accountType: 'member',
                role: 'Sanctuary Guest',
                ministryRoleId: 'disciple',
                ministryRoleLabel: 'Disciple',
                calling: 'Word Discipleship & Sanctuary Exploration',
                birthday: '01-01'
              };
              localStorage.setItem('youngfire_device_session_v1', JSON.stringify(guestUser));
              setCurrentUser(guestUser);
              setTimeout(() => {
                startContemporaryWorshipAutoplay();
              }, 350);
            }}
            onOpenRoster={() => {
              setIsRosterOpen(true);
            }}
            onToggleRadio={handleToggleAudio}
            isRadioPlaying={isAudioPlaying}
            onOpenThemeModal={handleCycleNextTheme}
            onCycleNextTheme={handleCycleNextTheme}
            onCyclePrevTheme={handleCyclePrevTheme}
            onSelectTheme={handleSelectTheme}
            activeTheme={activeTheme}
            backgroundMode={backgroundMode}
            onToggleBackgroundMode={handleToggleBackgroundMode}
            isAuthenticated={false}
          />
        </>
      );
    }
    return (
      <>
        <AppSplashScreen />
        <AuthSecurityPortal
          initialMode={authInitialMode}
          onAuthenticated={(user) => {
            localStorage.setItem('youngfire_device_session_v1', JSON.stringify(user));
            localStorage.setItem('youngfire_user_session', JSON.stringify(user));
            setCurrentUser(user);
            // Only play the auto play after the user signs in or registers; default to contemporary worship radio
            setTimeout(() => {
              startContemporaryWorshipAutoplay();
            }, 350);
          }}
          onBackToWelcome={() => setUnauthStage('welcome')}
        />
      </>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-[#000000] text-white relative selection:bg-amber-500 selection:text-black ${isNavDrawerOpen ? 'h-screen max-h-screen overflow-hidden' : 'overflow-x-hidden'}`}
      style={{ fontFamily: activeTheme.fontFamily || "'Outfit', sans-serif" }}
    >
      {/* 0. Stationary San Antonio City Street Map Backdrop (Fixed to screen viewport - Never moves when scrolling) */}
      {backgroundMode === 'map' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <SanAntonioVectorMap opacity={0.92} />
        </div>
      )}

      {/* 1. 3D CANVAS PUSH TRANSFORMATION CONTAINER (Tilts out at an angle zoomed out when drawer opens) */}
      <div 
        className={`text-white flex flex-col relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isNavDrawerOpen 
            ? 'h-screen max-h-screen rounded-[44px] overflow-hidden shadow-[-40px_0_100px_rgba(0,0,0,0.98)] border-2 border-white/30 pointer-events-none ring-1 ring-white/10 touch-none select-none fixed inset-0' 
            : 'min-h-screen scale-100 translate-x-0 rounded-none border-0'
        }`}
        style={{ 
          backgroundColor: isNavDrawerOpen ? '#000000' : 'transparent',
          transformOrigin: 'left center',
          perspective: isNavDrawerOpen ? '1400px' : 'none',
          transform: isNavDrawerOpen 
            ? 'perspective(1400px) rotateY(-14deg) rotateX(2deg) scale(0.66) translateX(-84%)' 
            : 'none',
          willChange: isNavDrawerOpen ? 'transform, border-radius' : 'auto',
          filter: isNavDrawerOpen ? 'brightness(0.9) contrast(1.05)' : 'none',
        }}
      >

      {/* Signature App Boot Loading Splash Screen */}
      <AppSplashScreen />
      {/* Dynamic Multi-Color Ambient Theme Glows matching the screenshot */}
      {/* 1. Primary Left-Lateral Luminous Glow (prominent cyan/teal bleed on the left in screenshot) */}
      <div 
        className="fixed top-[15%] -left-28 w-[420px] h-[540px] pointer-events-none z-0 rounded-full blur-[115px] transition-all duration-700"
        style={{ 
          backgroundColor: activeTheme.ambientGlows?.[0]?.color || activeTheme.accentHex,
          opacity: activeTheme.ambientGlows?.[0]?.opacity ?? 0.35
        }}
      />
      
      {/* 2. Secondary Right-Lateral Glow (hot pink / silver / secondary accent) */}
      <div 
        className="fixed top-[32%] -right-24 w-[380px] h-[480px] pointer-events-none z-0 rounded-full blur-[110px] transition-all duration-700"
        style={{ 
          backgroundColor: activeTheme.ambientGlows?.[1]?.color || activeTheme.secondaryHex || activeTheme.accentHex,
          opacity: activeTheme.ambientGlows?.[1]?.opacity ?? 0.28
        }}
      />

      {/* 3. Lower / Bottom Ambient Color Glow (fiesta orange / warm accent) */}
      <div 
        className="fixed bottom-[10%] left-[8%] w-[440px] h-[400px] pointer-events-none z-0 rounded-full blur-[100px] transition-all duration-700"
        style={{ 
          backgroundColor: activeTheme.ambientGlows?.[2]?.color || activeTheme.tertiaryHex || activeTheme.cardHex,
          opacity: activeTheme.ambientGlows?.[2]?.opacity ?? 0.22
        }}
      />

      {/* 4. Top Crown Ambient Radiance */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[320px] pointer-events-none z-0 opacity-20 blur-3xl transition-all duration-700"
        style={{ 
          background: `radial-gradient(circle at 50% 0%, ${activeTheme.accentHex} 0%, ${activeTheme.secondaryHex || activeTheme.cardHex} 50%, transparent 80%)` 
        }}
      />
      
      {/* 0. Global Deployment Auto-Refresh & Cache Busting Listener */}
      <VersionUpdateNotifier />

      {/* 1. Notification Toast */}
      {notificationToast && (
        <div className="fixed top-4 inset-x-4 max-w-lg mx-auto z-50 p-4 rounded-2xl bg-[#0B1329] border border-amber-500/60 text-white shadow-2xl flex items-start justify-between gap-3 animate-slideDown">
          <div className="flex items-start gap-2.5">
            <Bell className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-slate-200 leading-relaxed">{notificationToast}</p>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1.5. Meeting Update / Sanctuary Broadcast Notification Beacon */}
      {hasMeetingAlert && (
        <div 
          className="mx-3 sm:mx-6 mt-3 max-w-5xl mx-auto p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-500 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:bg-amber-900/90 transition-all animate-pulse relative z-30"
        >
          <div 
            onClick={() => {
              if (meetingAlertText?.includes('Special Ministry Zoom') || meetingAlertText?.includes('Flyer') || meetingAlertText?.includes('Tap to View Flyer')) {
                setIsBroadcastModalOpen(true);
              } else {
                setActiveTab('fellowship');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 cursor-pointer flex-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-amber-500/30">
              <Flame className="w-5 h-5 text-slate-950 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-amber-300 block tracking-widest">
                🔥 SANCTUARY MINISTRY BROADCAST BEACON
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">
                {meetingAlertText || "🔥 Special Ministry Zoom Scheduled • Tap to View Flyer & Join"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
            <button
              onClick={() => {
                if (meetingAlertText?.includes('Special Ministry Zoom') || meetingAlertText?.includes('Flyer') || meetingAlertText?.includes('Tap to View Flyer')) {
                  setIsBroadcastModalOpen(true);
                } else {
                  setActiveTab('fellowship');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="text-xs font-mono font-bold text-amber-300 underline cursor-pointer"
            >
              {meetingAlertText?.includes('Special Ministry Zoom') || meetingAlertText?.includes('Flyer') || meetingAlertText?.includes('Tap to View Flyer')
                ? "Tap to View Flyer & Join →"
                : "Open Sanctuary Calendar →"}
            </button>

            {/* Direct Dismiss Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissBeaconBanner();
                setHasMeetingAlert(false);
              }}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/80 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
              title="Dismiss / Hide Broadcast Banner"
              aria-label="Dismiss Broadcast Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Spurs-Style Full Screen Broadcast Stinger Wipe (Stays on screen for ~2.6 seconds) */}
      <BroadcastStingerWipe 
        show={stingerActive} 
        onComplete={handleStingerComplete}
        onMidpoint={handleStingerMidpoint}
        durationMs={2600}
        activeTheme={activeTheme}
        destinationLabel={pendingTab ? pendingTab.toUpperCase() : 'SANCTUARY'}
      />

      {/* 2.5. Dedicated Top Header Bar with Radio Tower & Headphones/Flame Docks */}
      <header className="sticky top-0 z-30 bg-[#070C1C]/90 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div 
            onClick={() => handleNavigateWithStinger('sanctuary')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            title="YoungFire Sanctuary Home"
          >
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md border group-hover:scale-105 transition-transform flex-shrink-0"
              style={{
                backgroundColor: activeTheme.accentHex,
                borderColor: `${activeTheme.accentHex}80`,
                boxShadow: `0 4px 14px ${activeTheme.accentHex}30`
              }}
            >
              <Flame className="w-4 h-4 fill-current" style={{ color: activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black tracking-widest uppercase font-['Outfit'] text-white">
                  YOUNG<span style={{ color: activeTheme.accentHex }}>FIRE</span>
                </h1>
                <span 
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase hidden xs:inline-block"
                  style={{
                    backgroundColor: `${activeTheme.accentHex}20`,
                    borderColor: `${activeTheme.accentHex}50`,
                    color: activeTheme.accentHex
                  }}
                >
                  {activeTab === 'sanctuary' ? 'SANCTUARY' : activeTab === 'tv' ? 'WORSHIP TV' : activeTab.toUpperCase()}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase hidden sm:block">
                Joshua House of Worship &bull; SA, TX
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Radio Tower Icon: Toggles 24/7 Gospel Radio Dock */}
            <button
              onClick={() => setIsRadioDockOpen(prev => !prev)}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              style={{
                backgroundColor: isRadioDockOpen || (isAudioPlaying && activeAudio.isRadio) ? `${activeTheme.accentHex}25` : 'rgba(255,255,255,0.05)',
                borderColor: isRadioDockOpen || (isAudioPlaying && activeAudio.isRadio) ? activeTheme.accentHex : 'rgba(255,255,255,0.1)',
                color: isRadioDockOpen || (isAudioPlaying && activeAudio.isRadio) ? activeTheme.accentHex : '#CBD5E1',
                boxShadow: isRadioDockOpen || (isAudioPlaying && activeAudio.isRadio) ? `0 0 10px ${activeTheme.accentHex}30` : 'none'
              }}
              title="Toggle 24/7 Gospel Radio Dock"
              aria-label="Toggle 24/7 Gospel Radio Dock"
            >
              <Radio className={`w-3.5 h-3.5 ${isAudioPlaying && activeAudio.isRadio ? 'animate-pulse' : ''}`} style={{ color: isAudioPlaying && activeAudio.isRadio ? activeTheme.accentHex : '#94A3B8' }} />
              <span className="hidden xs:inline text-[11px] font-bold">Radio</span>
            </button>

            {/* Headphones / Flame Icon: Expands bottom persistent Gospel Track Dock */}
            <button
              onClick={() => setIsMusicDockOpen(prev => !prev)}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              style={{
                backgroundColor: isMusicDockOpen ? activeTheme.accentHex : 'rgba(255,255,255,0.05)',
                borderColor: isMusicDockOpen ? activeTheme.accentHex : 'rgba(255,255,255,0.1)',
                color: isMusicDockOpen ? (activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF') : activeTheme.accentHex,
                boxShadow: isMusicDockOpen ? `0 0 12px ${activeTheme.accentHex}40` : 'none'
              }}
              title="Toggle Gospel Track Dock (200+ Praise Anthems)"
              aria-label="Toggle Gospel Track Dock"
            >
              <Headphones className="w-3.5 h-3.5" style={{ color: isMusicDockOpen ? (activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF') : activeTheme.accentHex }} />
              <span className="hidden xs:inline text-[11px] font-bold">Praise</span>
            </button>

            {/* Sticky Minimized Notes Pen Icon: Opens Global Study Notes HUD */}
            <button
              onClick={() => setIsNotesOpen(true)}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              style={{
                backgroundColor: isNotesOpen ? activeTheme.accentHex : 'rgba(255,255,255,0.05)',
                borderColor: isNotesOpen ? activeTheme.accentHex : 'rgba(255,255,255,0.1)',
                color: isNotesOpen ? (activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF') : activeTheme.accentHex,
                boxShadow: isNotesOpen ? `0 0 12px ${activeTheme.accentHex}40` : 'none'
              }}
              title="Open Floating Study Notes & Revelation HUD"
              aria-label="Open Study Notes"
            >
              <PenTool className="w-3.5 h-3.5" style={{ color: isNotesOpen ? (activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF') : activeTheme.accentHex }} />
              <span className="hidden xs:inline text-[11px] font-bold">Notes</span>
            </button>

            {/* Ministry Broadcast & Zoom Flyer Quick Beacon Button */}
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: `${activeTheme.accentHex}15`,
                borderColor: `${activeTheme.accentHex}50`,
                color: activeTheme.accentHex
              }}
              title="Official Ministry Zoom Assembly & Flyer"
              aria-label="Ministry Zoom Flyer"
            >
              <Flame className="w-3.5 h-3.5 fill-current" style={{ color: activeTheme.accentHex }} />
              <span className="hidden xs:inline text-[11px] font-bold">Zoom Flyer</span>
            </button>

            {/* Permanent Welcome Sanctuary Hub Button */}
            <button
              onClick={() => setIsWelcomeModalOpen(true)}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              style={{
                backgroundColor: isWelcomeModalOpen ? activeTheme.accentHex : 'rgba(255,255,255,0.05)',
                borderColor: isWelcomeModalOpen ? activeTheme.accentHex : 'rgba(255,255,255,0.1)',
                color: isWelcomeModalOpen ? (activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF') : activeTheme.accentHex,
                boxShadow: isWelcomeModalOpen ? `0 0 12px ${activeTheme.accentHex}40` : 'none'
              }}
              title="Open Welcome Sanctuary & Connect Hub"
              aria-label="Welcome Hub"
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: isWelcomeModalOpen ? (activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF') : activeTheme.accentHex }} />
              <span className="hidden xs:inline text-[11px] font-bold">Welcome</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Sanctuary Settings & Voice"
              aria-label="Settings"
            >
              <Sliders className="w-4 h-4" style={{ color: activeTheme.accentHex }} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Content Views */}
      <main className="flex-1 pb-36">
        {/* PILLAR 1: SANCTUARY (HOME) */}
        {activeTab === 'sanctuary' && (
          <SpursSanctuaryHero
            onOpenWelcome={() => setIsWelcomeModalOpen(true)}
            onOpenThemeModal={handleCycleNextTheme}
            onCycleNextTheme={handleCycleNextTheme}
            onCyclePrevTheme={handleCyclePrevTheme}
            onSelectTheme={handleSelectTheme}
            activeTheme={activeTheme}
            backgroundMode={backgroundMode}
            onToggleBackgroundMode={handleToggleBackgroundMode}
            onNavigate={(dest) => {
              if (dest === 'bibletracker') setActiveTab('bibletracker');
              else if (dest === 'maps') {
                setWordSubView('atlas');
                handleNavigateWithStinger('word');
              } else if (dest === 'counselor') {
                handleNavigateWithStinger('mentor');
              } else if (dest === 'tv') {
                setActiveTab('tv');
              } else if (dest === 'radio') {
                setActiveTab('radio');
              } else if (dest === 'team') {
                handleNavigateWithStinger('team');
              } else if (dest === 'schedule') {
                handleNavigateWithStinger('schedule');
              } else if (dest === 'men') {
                if (currentUser?.isAdmin || currentUser?.gender === 'male') {
                  handleNavigateWithStinger('men');
                } else {
                  alert("Men On Fire is a consecrated space for brothers.");
                }
              } else if (dest === 'women') {
                if (currentUser?.isAdmin || currentUser?.gender === 'female') {
                  handleNavigateWithStinger('women');
                } else {
                  alert("Women Ignited is a sacred space for sisters.");
                }
              } else if (dest === 'discipleship') {
                handleNavigateWithStinger('discipleship');
              } else if (dest === 'prayer' || dest === 'prayer_dock') {
                handleNavigateWithStinger('prayer_dock');
              } else if (dest === 'dailybread' || dest === 'daily_bread') {
                handleNavigateWithStinger('dailybread');
              } else if (dest === 'hub' || dest === 'groups') {
                setFellowshipInitialDrillDown(null);
                handleNavigateWithStinger('fellowship');
              } else {
                handleNavigateWithStinger(dest);
              }
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isRadioPlaying={isAudioPlaying}
            onToggleRadio={handleToggleAudio}
            currentStationName={activeAudio.name}
            onNextStation={handleNextRadioStation}
            onPrevStation={handlePrevRadioStation}
            onOpenRoster={() => handleNavigateWithStinger('team')}
            onOpenZoom={() => setIsZoomOpen(true)}
          />
        )}

        {/* PILLAR 2: SCHEDULE (Sanctuary Fellowship Calendar) */}
        {activeTab === 'schedule' && (
          <SanctuaryScheduleView
            onOpenZoom={() => setIsZoomOpen(true)}
            onNavigate={handleNavigateWithStinger}
            activeTheme={activeTheme}
          />
        )}

        {/* PILLAR 4: TEAM (Sanctuary Team & Dynamic Roster Hub) */}
        {activeTab === 'team' && (
          <SanctuaryTeamHub
            currentUser={currentUser}
            onNavigateToScripture={handleDeepLinkToScripture}
            onNavigate={handleNavigateWithStinger}
          />
        )}

        {/* PILLAR 2: WORD & MAP (Scripture Reader & Imperial Atlas) */}
        {activeTab === 'word' && (
          <div className="p-3 sm:p-5 space-y-4 max-w-5xl mx-auto">
            {/* Top 2-Way Switcher: [ 📖 66-Book Scripture ] | [ 🗺️ Imperial Atlas ] */}
            <div className="flex bg-[#0B1329] p-1.5 rounded-2xl border border-white/10 shadow-lg">
              <button
                onClick={() => setWordSubView('bible')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all font-['Outfit'] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 ${
                  wordSubView === 'bible'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>📖 66-Book Scripture</span>
              </button>
              <button
                onClick={() => setWordSubView('atlas')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all font-['Outfit'] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 ${
                  wordSubView === 'atlas'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>🗺️ Imperial Atlas</span>
              </button>
            </div>

            {/* Sub-view: 66-Book Scripture Reader */}
            {wordSubView === 'bible' ? (
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white text-slate-900">
                <ScriptureViewer
                  initialBookId={scripturePassage.bookId}
                  initialChapter={scripturePassage.chapter}
                  onBack={() => setActiveTab('sanctuary')}
                  onOpenNotes={(passage: any, title: any) => {
                    setNotesPrefill({ passage, title });
                    setIsNotesOpen(true);
                  }}
                />
              </div>
            ) : (
              /* Sub-view: Imperial Atlas */
              <ImperialAtlas
                onBack={() => setActiveTab('sanctuary')}
                onNavigateToScripture={handleDeepLinkToScripture}
              />
            )}
          </div>
        )}

        {/* PILLAR 3: FELLOWSHIP (Hubs & Sister Ministries) */}
        {activeTab === 'fellowship' && (
          <div className="p-3 sm:p-5 max-w-5xl mx-auto">
            <FellowshipHub
              onNavigate={(dest, subView) => {
                if (dest === 'tv') setActiveTab('tv');
                else if (dest === 'radio') setActiveTab('radio');
                else if (dest === 'bibletracker') setActiveTab('bibletracker');
                else if (dest === 'mentor') setActiveTab('mentor');
                else handleNavigateWithStinger(dest, subView as 'atlas' | 'bible' | undefined);
              }}
              onBack={() => {
                setFellowshipInitialDrillDown(null);
                setActiveTab('sanctuary');
              }}
              initialDrillDown={fellowshipInitialDrillDown}
              currentUser={currentUser}
            />
          </div>
        )}

        {/* PILLAR 4: COUNSEL (AI Young Adult Mentor) */}
        {activeTab === 'mentor' && (
          <div className="p-3 sm:p-5 max-w-3xl mx-auto">
            <AIMentorCounselor
              onBack={() => setActiveTab('sanctuary')}
              onAudioDucking={handleAudioDucking}
              onNavigateToScripture={handleDeepLinkToScripture}
              currentUser={currentUser}
            />
          </div>
        )}

        {/* DIRECT SUB-VIEW: PHYSICAL BIBLE TRACKER */}
        {activeTab === 'bibletracker' && (
          <div className="p-4 max-w-lg mx-auto">
            <PhysicalBibleTracker onBack={() => setActiveTab('sanctuary')} />
          </div>
        )}

        {/* DIRECT SUB-VIEW: KINGDOM VIDEO VAULT & TV (PERSISTENT PIP PLAYBACK) */}
        {(activeTab === 'tv' || activeTheaterVideo !== null) && (
          <div className={activeTab === 'tv' ? "p-3 sm:p-5 max-w-5xl mx-auto" : "contents"}>
            <KingdomMediaView
              isPiP={activeTab !== 'tv'}
              onExpandToTheater={() => setActiveTab('tv')}
              onCloseVideo={() => setActiveTheaterVideo(null)}
              onBack={() => setActiveTab('sanctuary')}
              onAudioDucking={handleAudioDucking}
              onFloatVideo={(video: any) => {
                setActiveTheaterVideo(video);
                setActiveTab('sanctuary');
              }}
              onActiveVideoChange={(video: any) => setActiveTheaterVideo(video as any)}
              onNavigateToScripture={handleDeepLinkToScripture}
              onPlayTrackInDock={(video: any) => {
                if (audioRef.current) audioRef.current.pause();
                setIsAudioPlaying(false);
                setIsMusicDockOpen(true);
                window.dispatchEvent(new CustomEvent('yf_play_dock_track', { 
                  detail: { track: video, autoPlay: true } 
                }));
              }}
            />
          </div>
        )}

        {/* DIRECT SUB-VIEW: 24/7 GOSPEL RADIO ECOSYSTEM (8 STATIONS) */}
        {activeTab === 'radio' && (
          <div className="p-3 sm:p-5 max-w-4xl mx-auto">
            <LiveRadioPlayer
              onBack={() => setActiveTab('sanctuary')}
              onAudioDucking={handleAudioDucking}
              activeStationId={activeAudio.isRadio ? activeAudio.id : undefined}
              isPlaying={isAudioPlaying}
              onTogglePlay={handleToggleAudio}
              onSelectStation={handleSelectRadioStation}
              volume={masterVolume}
              onVolumeChange={setMasterVolume}
            />
          </div>
        )}

        {/* DIRECT SUB-VIEW: DISCIPLESHIP VAULT */}
        {activeTab === 'discipleship' && (
          <div className="p-3 sm:p-5 max-w-5xl mx-auto">
            <DiscipleshipVault
              currentUser={currentUser}
              onBack={() => setActiveTab('sanctuary')}
              onNavigateToScripture={handleDeepLinkToScripture}
            />
          </div>
        )}

        {/* DIRECT SUB-VIEW: 24/7 PRAYER DOCK & SACRED INTERCESSION */}
        {(activeTab === 'prayer' || activeTab === 'prayer_dock') && (
          <div className="p-3 sm:p-5 max-w-4xl mx-auto">
            <PrayerDock
              currentUser={currentUser}
              onBack={() => setActiveTab('sanctuary')}
            />
          </div>
        )}

        {/* DIRECT SUB-VIEW: DAILY BREAD HUB (MORNING MANNA & EVENING SOLACE) */}
        {(activeTab === 'dailybread' || activeTab === 'daily_bread') && (
          <div className="p-3 sm:p-5 max-w-4xl mx-auto">
            <DailyBreadHub
              currentUser={currentUser}
              onBack={() => setActiveTab('sanctuary')}
              onNavigateToScripture={handleDeepLinkToScripture}
            />
          </div>
        )}

        {/* DIRECT SUB-VIEW: MEN ON FIRE HUB */}
        {activeTab === 'men' && (
          <div className="p-3 sm:p-5 max-w-5xl mx-auto">
            <MenOnFireHub
              currentUser={currentUser}
              onBack={() => setActiveTab('sanctuary')}
              onNavigateToScripture={handleDeepLinkToScripture}
            />
          </div>
        )}

        {/* DIRECT SUB-VIEW: WOMEN IGNITED HUB */}
        {activeTab === 'women' && (
          <div className="p-3 sm:p-5 max-w-5xl mx-auto">
            <WomenIgnitedHub
              currentUser={currentUser}
              onBack={() => setActiveTab('sanctuary')}
              onNavigateToScripture={handleDeepLinkToScripture}
            />
          </div>
        )}
      </main>

      {/* 4. Persistent SpotifyYouTubePlayer Dock (Mounted outside active router) */}
      <SpotifyYouTubePlayer
        isOpen={isMusicDockOpen}
        onToggleOpen={() => setIsMusicDockOpen(prev => !prev)}
        onNavigateToScripture={handleDeepLinkToScripture}
        isDucked={false}
        masterVolume={masterVolume}
        onMasterVolumeChange={setMasterVolume}
        onSwitchToRadio={() => {
          setIsMusicDockOpen(false);
          setIsRadioDockOpen(true);
        }}
      />

      {/* 5.5. Persistent 24/7 Gospel Radio Dock (Mounted outside active router) */}
      {isRadioDockOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
          onClick={() => setIsRadioDockOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-[#070B18] border border-amber-500/50 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 text-white animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-base font-black uppercase font-['Outfit'] text-white">
                  24/7 GOSPEL RADIO TOWER DOCK
                </h3>
              </div>
              <button 
                onClick={() => setIsRadioDockOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <LiveRadioPlayer
              onBack={() => setIsRadioDockOpen(false)}
              onAudioDucking={handleAudioDucking}
              activeStationId={activeAudio.isRadio ? activeAudio.id : undefined}
              isPlaying={isAudioPlaying}
              onTogglePlay={handleToggleAudio}
              onSelectStation={handleSelectRadioStation}
              volume={masterVolume}
              onVolumeChange={setMasterVolume}
            />
          </div>
        </div>
      )}

      {/* 5. Persistent Background Radio / Music Player Dock (Positioned cleanly above bottom nav bar) */}
      {!stingerActive && (
        <div 
          className="fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 max-w-md w-[94%] pb-[env(safe-area-inset-bottom)] bg-[#0B1329]/95 rounded-2xl p-2.5 backdrop-blur-xl shadow-2xl flex items-center justify-between z-30 select-none border border-t border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          style={{
            borderColor: activeTheme.borderHex || `${activeTheme.accentHex}70`,
            boxShadow: `0 8px 30px ${activeTheme.accentHex}25`
          }}
        >
          <div 
            onClick={() => setActiveTab('radio')}
            className="flex items-center gap-2.5 truncate cursor-pointer group flex-1 mr-2"
            title="Open 24/7 Gospel Radio Player"
          >
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-md"
              style={{ 
                backgroundColor: activeTheme.accentHex,
                color: activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF'
              }}
            >
              <Radio className={`w-4 h-4 ${isAudioPlaying ? 'animate-pulse' : ''}`} />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 truncate">
                <h5 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors font-['Outfit']">
                  {activeAudio.name}
                </h5>
                <span 
                  className="text-[9px] font-mono px-1.5 py-0.2 rounded border flex-shrink-0 font-bold"
                  style={{
                    backgroundColor: `${activeTheme.accentHex}20`,
                    borderColor: `${activeTheme.accentHex}40`,
                    color: activeTheme.accentHex
                  }}
                >
                  24/7 Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {activeAudio.genreOrArtist} &bull; Tap for Radio Hub
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Animated Equalizer: 4-bar animated theme equalizer whenever audio is playing */}
            {isAudioPlaying ? (
              <div className="flex items-end gap-0.5 h-3 px-1" title="Broadcasting 24/7 Praise">
                <span className="w-0.5 animate-[bounce_1s_infinite_100ms] h-full" style={{ backgroundColor: activeTheme.accentHex }}></span>
                <span className="w-0.5 animate-[bounce_1s_infinite_300ms] h-2/3" style={{ backgroundColor: activeTheme.accentHex }}></span>
                <span className="w-0.5 animate-[bounce_1s_infinite_200ms] h-4/5" style={{ backgroundColor: activeTheme.accentHex }}></span>
                <span className="w-0.5 animate-[bounce_1s_infinite_400ms] h-1/2" style={{ backgroundColor: activeTheme.accentHex }}></span>
              </div>
            ) : (
              <div className="flex items-end gap-0.5 h-3 px-1 opacity-40">
                <span className="w-0.5 bg-slate-500 h-1"></span>
                <span className="w-0.5 bg-slate-500 h-2"></span>
                <span className="w-0.5 bg-slate-500 h-1.5"></span>
                <span className="w-0.5 bg-slate-500 h-1"></span>
              </div>
            )}

            {/* Play/Pause Button */}
            <button 
              onClick={handleToggleAudio}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-transform shadow-md active:scale-95"
              style={{
                backgroundColor: activeTheme.accentHex,
                color: activeTheme.id === 'spurs_stealth' ? '#000000' : '#FFFFFF'
              }}
              title={isAudioPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isAudioPlaying ? '❚❚' : '▶'}
            </button>
          </div>
        </div>
      )}

      {/* 6. Sticky 5-Pillar Bottom Navigation Bar */}
      {!stingerActive && (
        <BottomNavBar 
          currentTab={['sanctuary', 'schedule', 'word', 'team'].includes(activeTab) ? activeTab : (activeTab === 'tv' || activeTab === 'bibletracker' || activeTab === 'radio' ? 'sanctuary' : activeTab)} 
          onSelectTab={handleNavigateWithStinger} 
          onOpenMoreDrawer={() => setIsNavDrawerOpen(true)}
          onOpenNotes={() => setIsNotesOpen(true)}
        />
      )}
      </div>

      {/* Tap or touch-dismiss on exposed left edge to immediately close drawer and slide canvas back */}
      {isNavDrawerOpen && (
        <div 
          onClick={() => setIsNavDrawerOpen(false)}
          onTouchEnd={() => setIsNavDrawerOpen(false)}
          className="fixed inset-y-0 left-0 w-[20%] sm:w-[24%] z-50 cursor-pointer pointer-events-auto touch-none"
          title="Return to Sanctuary"
          aria-label="Close Navigation Drawer"
        />
      )}

      {/* The 3D Parallax Sliding Drawer (Mounted behind / alongside the canvas) */}
      <SlidingNavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        onNavigate={handleNavigateWithStinger}
        onOpenThemeModal={handleCycleNextTheme}
        onOpenNotesModal={() => setIsNotesOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onOpenWelcomeModal={() => setIsWelcomeModalOpen(true)}
        currentUser={currentUser}
      />

      {/* 7. Solid Settings HUD Modal */}
      <SettingsHUDModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        selectedTrack={selectedLaunchTrack}
        onSelectTrack={(t: any) => {
          setSelectedLaunchTrack(t);
          localStorage.setItem('youngfire_launch_track_id', t.id);
          setActiveAudio({
            id: t.id,
            name: t.title,
            genreOrArtist: t.artist,
            streamUrl: t.audioUrl,
            isRadio: true,
            accentColor: '#F59E0B'
          });
          if (audioRef.current) {
            audioRef.current.src = t.audioUrl;
            audioRef.current.loop = false;
            audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
          }
        }}
        appVolume={masterVolume}
        onVolumeChange={setMasterVolume}
        soundEnabled={soundEffectsEnabled}
        onToggleSound={setSoundEffectsEnabled}
        onOpenVoiceSanctuary={() => setIsVoiceSanctuaryOpen(true)}
        onOpenProgress={() => setIsProgressOpen(true)}
        onOpenAdminCMS={() => setIsAdminCMSOpen(true)}
        onOpenWelcome={() => setIsWelcomeModalOpen(true)}
        onUpdateUser={(updated: any) => {
          setCurrentUser(updated);
          try {
            localStorage.setItem('youngfire_device_session_v1', JSON.stringify(updated));
            localStorage.setItem('youngfire_user_session', JSON.stringify(updated));
          } catch {}
        }}
        onLogout={handleLogout}
      />

      {/* 8. Relocated Modal: Live Voice Sanctuary */}
      <LiveVoiceSanctuary
        isOpen={isVoiceSanctuaryOpen}
        onClose={() => setIsVoiceSanctuaryOpen(false)}
        onAudioDucking={handleAudioDucking}
      />

      {/* 9. Relocated Modal: Discipleship Reading Progress */}
      <ReadingProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        onNavigateToBook={(bId: any) => {
          handleDeepLinkToScripture(bId, 1);
        }}
      />

      {/* 10. Relocated Modal: Admin CMS Portal (For Administrators Only) */}
      <AdminCMSModal
        isOpen={isAdminCMSOpen}
        onClose={() => setIsAdminCMSOpen(false)}
        currentUser={currentUser}
      />

      {/* 11. Member Roster Modal */}
      <MemberRosterModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        currentUser={currentUser}
      />

      {/* 12. Zoom Meeting Modal */}
      <ZoomMeetingModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        currentUser={currentUser}
      />

      {/* 13. Study Notes & Journal HUD Modal (Accessible across all tabs with z-[9999]) */}
      <StudyNotesHUD
        isOpen={isNotesOpen}
        onClose={() => {
          setIsNotesOpen(false);
          setNotesPrefill(null);
        }}
        onOpen={() => setIsNotesOpen(true)}
        onNavigateToScripture={handleDeepLinkToScripture}
        prefill={notesPrefill}
      />

      {/* 15. Permanent Welcome Sanctuary Modal Overlay (Accessible at all times) */}
      {isWelcomeModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl overflow-y-auto animate-fadeIn">
          <WelcomeSanctuary
            onClose={() => setIsWelcomeModalOpen(false)}
            onEnterSanctuary={() => setIsWelcomeModalOpen(false)}
            isAuthenticated={true}
            onOpenRoster={() => {
              setIsWelcomeModalOpen(false);
              setIsRosterOpen(true);
            }}
            onToggleRadio={handleToggleAudio}
            isRadioPlaying={isAudioPlaying}
            onOpenThemeModal={handleCycleNextTheme}
            activeTheme={activeTheme}
          />
        </div>
      )}

      {/* 16. Ministry Broadcast Modal (Zoom Flyer Hub & Calendar Sync) */}
      <MinistryBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        meeting={broadcastMeeting}
      />

    </div>
  );
}
