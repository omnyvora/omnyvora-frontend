/* Omnyvora Workspace — sample data */

const USER = {
  first: 'Elena', last: 'Park', name: 'Elena Park', email: 'elena.park@omnyvora.io', initials: 'EP',
  phone: '+1 (415) 555-0162', dob: '1994-03-12', location: 'San Francisco, CA', joined: 'March 2024',
  createdIso: '2024-03-08',
  bio: 'Product designer focused on design systems and developer tooling. Building one calm, consistent surface across every Omnyvora service.',
  completion: 80,
};

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
  { id: 'n4', title: 'Portfolio published', body: 'Your project "Q3 Launch site" is now live.', time: '2d ago', read: true },
  { id: 'n5', title: 'Password changed', body: 'Your password was updated successfully.', time: '5d ago', read: true },
  { id: 'n6', title: 'Weekly digest ready', body: 'A summary of everything that changed across your workspace.', time: '1w ago', read: true },
];

/* My Data — reshaped to match the real Project/Experience/Education/Certification/Skill models */
const IDENTITY = {
  projects: [
    { id: 'pr1', title: 'Omnyvora Design System', short_description: 'A token-driven design language powering every Omnyvora tool.',
      description: 'Built the shared design token architecture, component library, and theming model that lets every Omnyvora tool re-skin itself by swapping two accent tokens.',
      achievements: ['Cut new-tool theming time from weeks to under a day', 'Shipped a 20-component library adopted by 3 product teams', 'Documented a token → semantic → theme color pipeline'],
      technologies: ['Figma', 'Design Tokens', 'React', 'CSS'], github_url: '', live_url: 'https://omnyvora.io/design', is_featured: true,
      images: [{ id: 'im1', slotId: 'proj-pr1-im1', caption: 'Component library overview', isCover: true }, { id: 'im2', slotId: 'proj-pr1-im2', caption: 'Token architecture diagram', isCover: false }] },
    { id: 'pr2', title: 'Aurora — Fintech Onboarding', short_description: 'Mobile onboarding and identity-verification flow for a fintech startup.',
      description: 'End-to-end design for a mobile onboarding and KYC identity-verification flow used at account signup.',
      achievements: ['Reduced signup drop-off by 18%', 'Built a KYC flow now used by 40k+ users'],
      technologies: ['React Native', 'Figma', 'Segment'], github_url: 'https://github.com/elenapark/aurora-onboarding', live_url: '', is_featured: false, images: [] },
  ],
  experience: [
    { id: 'ex1', job_title: 'Senior Product Designer', company_name: 'Omnyvora', company_url: 'https://omnyvora.io', location: 'San Francisco, CA (Remote)',
      description: 'Lead design for the shared account, profile, and notification systems used across every Omnyvora tool.',
      technologies: ['Figma', 'Design Systems', 'React'], start_date: '2024-03-01', end_date: '', current: true },
    { id: 'ex2', job_title: 'Product Designer', company_name: 'Northwind Labs', company_url: '', location: 'San Francisco, CA',
      description: 'Designed onboarding and billing flows for a B2B analytics platform.',
      technologies: ['Figma', 'Sketch'], start_date: '2021-06-01', end_date: '2024-02-01', current: false },
  ],
  education: [
    { id: 'ed1', degree: 'B.S. Human-Computer Interaction', institution: 'University of Washington', department: 'Information School',
      start_date: '2015-09-01', end_date: '2019-06-01', gpa: '3.59', gpa_scale: '4.00', certification_id: null },
  ],
  certifications: [],
  skills: [
    { id: 'sk1', name: 'Product Design', category: 'Soft skills', proficiency: 90 },
    { id: 'sk2', name: 'Design Systems', category: 'Soft skills', proficiency: 88 },
    { id: 'sk3', name: 'Figma', category: 'Tools', proficiency: 95 },
    { id: 'sk4', name: 'Prototyping', category: 'Tools', proficiency: 85 },
    { id: 'sk5', name: 'User Research', category: 'Soft skills', proficiency: 75 },
    { id: 'sk6', name: 'React', category: 'Frameworks', proficiency: 60 },
    { id: 'sk7', name: 'HTML / CSS', category: 'Languages', proficiency: 80 },
    { id: 'sk8', name: 'Accessibility', category: 'Other', proficiency: 70 },
  ],
  socialLinks: [],
};

const TECH_SUGGESTIONS = ['React', 'React Native', 'Vue', 'Next.js', 'Figma', 'Sketch', 'CSS', 'HTML', 'JavaScript', 'TypeScript',
  'Design Tokens', 'Segment', 'Node.js', 'Python', 'Django', 'PostgreSQL', 'Redis', 'Celery', 'GraphQL', 'Framer Motion'];

const SKILL_CATEGORIES = ['Languages', 'Frameworks', 'Databases', 'Tools', 'Soft skills', 'Other'];
const SKILL_CATALOG = [
  { name: 'Product Design', category: 'Soft skills' }, { name: 'Design Systems', category: 'Soft skills' }, { name: 'User Research', category: 'Soft skills' },
  { name: 'Communication', category: 'Soft skills' }, { name: 'Figma', category: 'Tools' }, { name: 'Sketch', category: 'Tools' }, { name: 'Prototyping', category: 'Tools' },
  { name: 'Jira', category: 'Tools' }, { name: 'React', category: 'Frameworks' }, { name: 'Vue', category: 'Frameworks' }, { name: 'Django', category: 'Frameworks' },
  { name: 'Next.js', category: 'Frameworks' }, { name: 'HTML / CSS', category: 'Languages' }, { name: 'JavaScript', category: 'Languages' }, { name: 'Python', category: 'Languages' },
  { name: 'TypeScript', category: 'Languages' }, { name: 'PostgreSQL', category: 'Databases' }, { name: 'Redis', category: 'Databases' }, { name: 'MongoDB', category: 'Databases' },
  { name: 'Accessibility', category: 'Other' },
];

const PLATFORM_OPTIONS = ['GitHub', 'LinkedIn', 'Facebook', 'X', 'Website', 'Other'];

Object.assign(window, { USER, APPS, NOTIFICATIONS, IDENTITY, TECH_SUGGESTIONS, SKILL_CATEGORIES, SKILL_CATALOG, PLATFORM_OPTIONS });
