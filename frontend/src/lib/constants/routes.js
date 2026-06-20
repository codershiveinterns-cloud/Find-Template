export const routes = {
  home: '/',
  signup: '/auth/signup',
  login: '/auth/login',
  dashboard: '/dashboard',
};

export const dashboardMenu = [
  { label: 'Overview', path: '/dashboard', key: 'overview' },
  { label: 'Projects', path: '/dashboard/projects', key: 'projects' },
  { label: 'Teams', path: '/dashboard/teams', key: 'teams' },
  { label: 'Clients', path: '/dashboard/clients', key: 'clients' },
  { label: 'Invoices', path: '/dashboard/invoices', key: 'invoices' },
  { label: 'Access and Role', path: '/dashboard/access-and-role', key: 'access-and-role' },
  { label: 'Services', path: '/dashboard/services', key: 'services' },
  { label: 'Settings', path: '/dashboard/settings', key: 'settings' },
  { label: 'Support Info', path: '/dashboard/support-info', key: 'support-info' },
];
