export interface BibleBook {
  id: string;
  name: string;
  testament: 'OT' | 'NT';
  category: string;
  section?: string;
  chapters: number;
  totalChapters?: number;
  chaptersCount?: number;
  purpose?: string;
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'purple' | 'amber';

export interface BookmarkedVerse {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  note?: string;
  color?: HighlightColor;
  highlightColor?: string;
  translation?: string;
  savedAt?: string;
  timestamp: number;
}
