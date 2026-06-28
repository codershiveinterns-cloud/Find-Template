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
  plus: ['overview', 'projects', 'services', 'settings', 'support-info'],
  pro: ['overview', 'projects', 'teams', 'services', 'settings', 'support-info'],
  business: ['overview', 'projects', 'teams', 'clients', 'invoices', 'services', 'settings', 'support-info'],
};

export const PLAN_TEMPLATE_LIMITS = {
  plus: 1,
  pro: 4,
  business: 8,
};

export const isPackageActive = (user) => Boolean(user?.selectedPackage && user?.selectedPackageExpiresAt && new Date(user.selectedPackageExpiresAt).getTime() > Date.now());

export const getTemplateUsage = (user) => {
  const limit = PLAN_TEMPLATE_LIMITS[user?.selectedPackage] || 0;
  const used = new Set((user?.purchasedTemplates || []).map((template) => template.templateKey)).size;
  return { used, limit, reached: limit > 0 && used >= limit };
};

export const formatPackageExpiry = (value) => {
  if (!value) return 'No active package expiry';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No active package expiry';
  const formatted = date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  return date.getTime() <= Date.now() ? `Expired at ${formatted}` : formatted;
};

export const SERVICE_PLANS = [
  {
    key: 'plus',
    name: 'Plus',
    monthly: 199,
    yearly: 1910.4,
    included: ['Projects page', 'Settings page', 'Support info page', 'Service page', 'Access 1 template'],
    excluded: ['Invoice page', 'Teams page', 'Clients page'],
  },
  {
    key: 'pro',
    name: 'Pro',
    monthly: 299,
    yearly: 2870.4,
    included: ['Projects page', 'Settings page', 'Support info page', 'Service page', 'Access 4 templates', 'Teams page'],
    excluded: ['Clients page'],
    highlighted: true,
  },
  {
    key: 'business',
    name: 'Business',
    monthly: 399,
    yearly: 3830.4,
    included: ['Projects page', 'Settings page', 'Support info page', 'Service page', 'Invoice page', 'Teams page', 'Clients page', 'Access 8 templates', 'Priority support facility'],
    excluded: [],
    popular: true,
  },
];

export const formatPackage = (plan, billing, price) => {
  if (!plan) return 'No package selected';
  const suffix = billing === 'yearly' ? 'per year' : 'per month';
  return `${PLAN_LABELS[plan] || plan} ($${price || PLAN_PRICES[billing || 'monthly']?.[plan] || 0} ${suffix})`;
};
