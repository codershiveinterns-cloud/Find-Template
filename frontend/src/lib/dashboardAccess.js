import { PLAN_ACCESS } from './constants/packages';
import { dashboardMenu } from './constants/routes';

export const getPackageAllowedKeys = (user) => PLAN_ACCESS[user?.selectedPackage || 'none'] || PLAN_ACCESS.none;

export const getUserAllowedDashboardKeys = (user) => {
  if (!user) return [];

  const packageAllowedKeys = getPackageAllowedKeys(user);

  if (user.role === 'developer' || user.role === 'designer') {
    return packageAllowedKeys.includes('projects') ? ['projects'] : [];
  }

  if (user.role === 'manager') {
    const assignedModules = user.assignedModules || [];
    return assignedModules.filter((moduleKey) => packageAllowedKeys.includes(moduleKey));
  }

  if (user.role === 'admin') {
    return packageAllowedKeys;
  }

  return [];
};

export const getDashboardKeyFromPath = (pathname = '') => {
  const match = dashboardMenu
    .filter((item) => item.path !== '/dashboard')
    .find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));

  return match?.key || (pathname === '/dashboard' ? 'overview' : null);
};

export const getFirstAllowedDashboardPath = (user) => {
  const allowedKeys = getUserAllowedDashboardKeys(user);
  const firstItem = dashboardMenu.find((item) => allowedKeys.includes(item.key));
  return firstItem?.path || null;
};
