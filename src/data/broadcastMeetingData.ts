export interface BroadcastMeetingPayload {
  id: string;
  title: string;
  scheduledTime?: string;
  dateTime?: string;
  speaker?: string;
  zoomUrl?: string;
  meetingId?: string;
  passcode?: string;
  targetAudience?: string;
  flyerUrl?: string;
  isActive?: boolean;
}

const DEFAULT_BROADCAST: BroadcastMeetingPayload = {
  id: 'broadcast-1',
  title: 'YoungFire Consecration Broadcast',
  scheduledTime: '7:00 PM CST',
  dateTime: 'Monday, 7:00 PM CST',
  speaker: 'Lead Facilitators Trent & Whitney',
  zoomUrl: 'https://zoom.us',
  meetingId: '777 0101 2026',
  passcode: 'FIRE2026',
  targetAudience: 'all',
  flyerUrl: '/youngfire_zoom_flyer.png',
  isActive: true
};

export function getBroadcastMeeting(): BroadcastMeetingPayload {
  try {
    const raw = localStorage.getItem('yf_broadcast_meeting');
    return raw ? JSON.parse(raw) : DEFAULT_BROADCAST;
  } catch {
    return DEFAULT_BROADCAST;
  }
}

export function saveBroadcastMeeting(payload: BroadcastMeetingPayload): void {
  try {
    localStorage.setItem('yf_broadcast_meeting', JSON.stringify(payload));
  } catch {}
}

export function deactivateBroadcastMeeting(): void {
  try {
    localStorage.removeItem('yf_broadcast_meeting');
  } catch {}
}

export function getActiveFlyerUrl(): string {
  try {
    return localStorage.getItem('yf_active_flyer') || '/youngfire_zoom_flyer.png';
  } catch {
    return '/youngfire_zoom_flyer.png';
  }
}

export function setActiveFlyer(url: string, filename?: string): void {
  try {
    localStorage.setItem('yf_active_flyer', url);
  } catch {}
}

export function downloadFlyer(url?: string, filename?: string): void {
  const link = document.createElement('a');
  link.href = url || getActiveFlyerUrl();
  link.download = filename || 'YoungFire_Sanctuary_Flyer.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function compressImageFile(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}

export function isBeaconBannerVisible(_meetingId?: string): boolean {
  return false;
}

export function dismissBeaconBanner(_meetingId?: string): void {}
