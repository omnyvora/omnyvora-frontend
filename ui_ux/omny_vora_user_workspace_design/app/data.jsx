/* Omnyvora Workspace — sample data */

const USER = {
  first: 'Elena',
  last: 'Park',
  name: 'Elena Park',
  email: 'elena.park@omnyvora.io',
  initials: 'EP',
  phone: '+1 (415) 555-0162',
  dob: '1994-03-12',
  location: 'San Francisco, CA',
  joined: 'March 2024',
  createdIso: '2024-03-08',
  bio: 'Product designer focused on design systems and developer tooling. Building one calm, consistent surface across every Omnyvora service.',
  completion: 80,
};

/* App tiles — brand colors are DS primitives, one per service */
const APPS = [
  { id: 'portfolio', name: 'Portfolio', icon: 'layers', desc: 'Build and showcase your work in a polished public profile.', category: 'Creative', bg: 'var(--purple-50)', fg: 'var(--purple-600)' },
  { id: 'photo', name: 'Photo', icon: 'image', desc: 'Organize every shoot into albums and share with anyone.', category: 'Creative', bg: 'var(--teal-50)', fg: 'var(--teal-600)' },
  { id: 'productivity', name: 'Productivity', icon: 'zap', desc: 'Plan tasks, run sprints, and track your focus time.', category: 'Work', bg: 'var(--blue-50)', fg: 'var(--blue-600)' },
  { id: 'drive', name: 'Drive', icon: 'hardDrive', desc: 'Store, sync, and share files across every Omnyvora tool.', category: 'Storage', bg: 'var(--indigo-50)', fg: 'var(--indigo-600)' },
  { id: 'calendar', name: 'Calendar', icon: 'calendar', desc: 'One schedule that spans tasks, shoots, and deadlines.', category: 'Work', bg: 'var(--amber-50)', fg: '#b9770e' },
  { id: 'analytics', name: 'Analytics', icon: 'barChart', desc: 'Track views, engagement, and trends across your projects.', category: 'Insights', bg: 'var(--green-50)', fg: '#0b7a52' },
];

const NOTIFICATIONS = [
  { id: 'n1', title: 'Welcome to Omnyvora', body: 'Your account is ready. Explore the tools available to you.', time: '2h ago', read: false },
  { id: 'n2', title: 'New device sign-in', body: 'A new sign-in from Chrome on macOS in San Francisco.', time: '5h ago', read: false },
  { id: 'n3', title: 'Photo storage at 80%', body: 'You have used 64 GB of 80 GB. Consider upgrading your plan.', time: '1d ago', read: false },
  { id: 'n4', title: 'Portfolio published', body: 'Your project “Q3 Launch site” is now live.', time: '2d ago', read: true },
  { id: 'n5', title: 'Password changed', body: 'Your password was updated successfully.', time: '5d ago', read: true },
  { id: 'n6', title: 'Weekly digest ready', body: 'A summary of everything that changed across your workspace.', time: '1w ago', read: true },
];

/* Identity tabs — Projects & Skills pre-filled; Education & Experience empty */
const IDENTITY = {
  projects: [
    { id: 'p1', title: 'Omnyvora Design System', role: 'Lead Designer', period: '2024 — Present', desc: 'A token-driven design language powering every Omnyvora tool, themed by swapping two accent tokens.', link: 'omnyvora.io/design' },
    { id: 'p2', title: 'Aurora — Fintech Onboarding', role: 'Product Designer', period: '2023 — 2024', desc: 'End-to-end design for a mobile onboarding and identity-verification flow.', link: '' },
  ],
  skills: ['Product Design', 'Design Systems', 'Figma', 'Prototyping', 'User Research', 'Front-end (HTML/CSS)', 'Accessibility', 'Design Tokens'],
  education: [],
  experience: [],
};

Object.assign(window, { USER, APPS, NOTIFICATIONS, IDENTITY });
