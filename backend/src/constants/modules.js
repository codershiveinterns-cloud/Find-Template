export const DASHBOARD_MODULE_KEYS = [
  'overview',
  'projects',
  'teams',
  'clients',
  'invoices',
  'services',
  'settings',
  'support-info',
];

export const PLAN_ACCESS = {
  none: ['overview', 'services'],
  plus: ['overview', 'projects', 'services', 'settings', 'support-info'],
  pro: ['overview', 'projects', 'teams', 'services', 'settings', 'support-info'],
  business: ['overview', 'projects', 'teams', 'clients', 'invoices', 'services', 'settings', 'support-info'],
};

export const getPlanAllowedModules = (plan) => PLAN_ACCESS[plan || 'none'] || PLAN_ACCESS.none;

export const getInvalidModules = (modules = [], plan) => {
  const allowedModules = getPlanAllowedModules(plan);
  return modules.filter((moduleKey) => !allowedModules.includes(moduleKey));
};

export const filterAllowedModules = (modules = [], plan) => {
  const allowedModules = getPlanAllowedModules(plan);
  return modules.filter((moduleKey) => allowedModules.includes(moduleKey));
};
