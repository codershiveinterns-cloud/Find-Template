export const PLAN_PRICES = {
  monthly: { plus: 199, pro: 299, business: 399 },
  yearly: { plus: 1910.4, pro: 2870.4, business: 3830.4 },
};

export const PLAN_LABELS = {
  plus: 'Plus',
  pro: 'Pro',
  business: 'Business',
};

export const PLAN_ACCESS = {
  none: ['overview', 'services'],
  plus: ['overview', 'projects', 'access-and-role', 'services', 'settings', 'support-info'],
  pro: ['overview', 'projects', 'teams', 'access-and-role', 'services', 'settings', 'support-info'],
  business: ['overview', 'projects', 'teams', 'clients', 'invoices', 'access-and-role', 'services', 'settings', 'support-info'],
};

export const SERVICE_PLANS = [
  {
    key: 'plus',
    name: 'Plus',
    monthly: 199,
    yearly: 1910.4,
    included: ['Projects page', 'Settings page', 'Support info page', 'Access / Role page', 'Service page', 'Access 1 template'],
    excluded: ['Invoice page', 'Teams page', 'Clients page'],
  },
  {
    key: 'pro',
    name: 'Pro',
    monthly: 299,
    yearly: 2870.4,
    included: ['Projects page', 'Settings page', 'Support info page', 'Access / Role page', 'Service page', 'Access 4 templates', 'Teams page'],
    excluded: ['Clients page'],
    highlighted: true,
  },
  {
    key: 'business',
    name: 'Business',
    monthly: 399,
    yearly: 3830.4,
    included: ['Projects page', 'Settings page', 'Support info page', 'Access / Role page', 'Service page', 'Invoice page', 'Teams page', 'Clients page', 'Access 8 templates', 'Priority support facility'],
    excluded: [],
    popular: true,
  },
];

export const formatPackage = (plan, billing, price) => {
  if (!plan) return 'No package selected';
  const suffix = billing === 'yearly' ? 'per year' : 'per month';
  return `${PLAN_LABELS[plan] || plan} ($${price || PLAN_PRICES[billing || 'monthly']?.[plan] || 0} ${suffix})`;
};
