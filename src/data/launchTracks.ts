export interface LaunchTrackOption {
  id: string;
  name: string;
  artist?: string;
  streamUrl: string;
  duration?: string;
  genre?: string;
}

export const AVAILABLE_LAUNCH_TRACKS: LaunchTrackOption[] = [
  {
    id: 'youngfire-theme',
    name: 'YoungFire Sanctuary Anthem',
    artist: 'Joshua House Collective',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    duration: '3:45',
    genre: 'Contemporary Praise'
  }
];
