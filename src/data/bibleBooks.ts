import { BibleBook } from '../types/scripture';

export const BIBLE_BOOKS: BibleBook[] = [
  { id: 'GEN', name: 'Genesis', testament: 'OT', category: 'Law / Pentateuch', chapters: 50 },
  { id: 'EXO', name: 'Exodus', testament: 'OT', category: 'Law / Pentateuch', chapters: 40 },
  { id: 'LEV', name: 'Leviticus', testament: 'OT', category: 'Law / Pentateuch', chapters: 27 },
  { id: 'NUM', name: 'Numbers', testament: 'OT', category: 'Law / Pentateuch', chapters: 36 },
  { id: 'DEU', name: 'Deuteronomy', testament: 'OT', category: 'Law / Pentateuch', chapters: 34 },
  { id: 'JOS', name: 'Joshua', testament: 'OT', category: 'Historical', chapters: 24 },
  { id: 'PSA', name: 'Psalms', testament: 'OT', category: 'Poetry & Wisdom', chapters: 150 },
  { id: 'PRO', name: 'Proverbs', testament: 'OT', category: 'Poetry & Wisdom', chapters: 31 },
  { id: 'ISA', name: 'Isaiah', testament: 'OT', category: 'Major Prophets', chapters: 66 },
  { id: 'MAT', name: 'Matthew', testament: 'NT', category: 'Gospels', chapters: 28 },
  { id: 'MRK', name: 'Mark', testament: 'NT', category: 'Gospels', chapters: 16 },
  { id: 'LUK', name: 'Luke', testament: 'NT', category: 'Gospels', chapters: 24 },
  { id: 'JHN', name: 'John', testament: 'NT', category: 'Gospels', chapters: 21 },
  { id: 'ACT', name: 'Acts', testament: 'NT', category: 'History', chapters: 28 },
  { id: 'ROM', name: 'Romans', testament: 'NT', category: 'Epistles', chapters: 16 },
  { id: '1CO', name: '1 Corinthians', testament: 'NT', category: 'Epistles', chapters: 16 },
  { id: 'EPH', name: 'Ephesians', testament: 'NT', category: 'Epistles', chapters: 6 },
  { id: 'REV', name: 'Revelation', testament: 'NT', category: 'Apocalyptic', chapters: 22 }
];
