import React from 'react';

export interface VideoItem {
  id: string;
  title: string;
  speaker: string;
  youtubeId: string;
  date?: string;
  category?: string;
  thumbnailUrl?: string;
}

export const KingdomVideoVault: React.FC = () => {
  return null;
};

export default KingdomVideoVault;
