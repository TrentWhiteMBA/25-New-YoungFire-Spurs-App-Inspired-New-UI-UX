export interface MinistryRole {
  id: string;
  title: string;
  label: string;
  category: string;
  description: string;
  badge: string;
  badgeBg?: string;
  borderColor?: string;
  badgeText?: string;
  calling: string;
  defaultCalling: string;
}

export const ADMIN_SECURITY_PASSCODE = '7777';

export const MINISTRY_ROLES: MinistryRole[] = [
  {
    id: 'disciple',
    title: 'Sanctuary Disciple',
    label: 'Sanctuary Disciple',
    category: 'General Fellowship',
    description: 'Active participant in small group huddles and prayer meetings.',
    badge: 'Disciple',
    badgeBg: 'bg-amber-500/20',
    borderColor: 'border-amber-400/40',
    badgeText: 'text-amber-300',
    calling: 'Consecrated Disciple',
    defaultCalling: 'Consecrated Disciple'
  },
  {
    id: 'facilitator',
    title: 'Discipleship Facilitator',
    label: 'Discipleship Facilitator',
    category: 'Leadership',
    description: 'Small group leader and spiritual mentor for cohorts.',
    badge: 'Leader',
    badgeBg: 'bg-orange-500/20',
    borderColor: 'border-orange-400/40',
    badgeText: 'text-orange-300',
    calling: 'Cohort Facilitator',
    defaultCalling: 'Cohort Facilitator'
  },
  {
    id: 'intercessor',
    title: 'Prayer Watch Intercessor',
    label: 'Prayer Watch Intercessor',
    category: 'Altar Ministry',
    description: 'Standing on the prayer watch for the church and city.',
    badge: 'Prayer',
    badgeBg: 'bg-rose-500/20',
    borderColor: 'border-rose-400/40',
    badgeText: 'text-rose-300',
    calling: 'Intercessor',
    defaultCalling: 'Intercessor'
  },
  {
    id: 'worship',
    title: 'Praise & Worship Psalmist',
    label: 'Praise & Worship Psalmist',
    category: 'Music Ministry',
    description: 'Leading contemporary worship and prophetic praise.',
    badge: 'Psalmist',
    badgeBg: 'bg-purple-500/20',
    borderColor: 'border-purple-400/40',
    badgeText: 'text-purple-300',
    calling: 'Worship Leader',
    defaultCalling: 'Worship Leader'
  }
];

export function getRoleById(id: string): MinistryRole {
  return MINISTRY_ROLES.find(r => r.id === id) || MINISTRY_ROLES[0];
}
