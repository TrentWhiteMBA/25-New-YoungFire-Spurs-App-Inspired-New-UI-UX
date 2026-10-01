export interface HighlightColorItem {
  id: string;
  name: string;
  label: string;
  dotColor: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export const HIGHLIGHT_COLORS: HighlightColorItem[] = [
  { id: 'amber', name: 'Amber Flame', label: 'Amber Flame', dotColor: '#F59E0B', bgClass: 'bg-amber-400/20', borderClass: 'border-amber-400', textClass: 'text-amber-300' },
  { id: 'yellow', name: 'Golden Word', label: 'Golden Word', dotColor: '#EAB308', bgClass: 'bg-yellow-400/20', borderClass: 'border-yellow-400', textClass: 'text-yellow-300' },
  { id: 'green', name: 'Life & Grace', label: 'Life & Grace', dotColor: '#10B981', bgClass: 'bg-emerald-400/20', borderClass: 'border-emerald-400', textClass: 'text-emerald-300' },
  { id: 'blue', name: 'Living Water', label: 'Living Water', dotColor: '#3B82F6', bgClass: 'bg-blue-400/20', borderClass: 'border-blue-400', textClass: 'text-blue-300' },
  { id: 'purple', name: 'Royal Shekinah', label: 'Royal Shekinah', dotColor: '#A855F7', bgClass: 'bg-purple-400/20', borderClass: 'border-purple-400', textClass: 'text-purple-300' }
];
