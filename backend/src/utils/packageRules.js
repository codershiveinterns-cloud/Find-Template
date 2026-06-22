export const PACKAGE_TEMPLATE_LIMITS = {
  plus: 1,
  pro: 4,
  business: 8,
};

export const PACKAGE_PRICE_CENTS = {
  monthly: { plus: 19900, pro: 29900, business: 39900 },
  yearly: { plus: 191040, pro: 287040, business: 383040 },
};

export const getPackagePrice = (billing, plan) => Number(((PACKAGE_PRICE_CENTS[billing]?.[plan] || 0) / 100).toFixed(2));

export const getPackageExpiry = (billing, startDate = new Date()) => {
  const expiry = new Date(startDate);

  if (billing === 'yearly') {
    expiry.setFullYear(expiry.getFullYear() + 1);
    return expiry;
  }

  expiry.setMonth(expiry.getMonth() + 1);
  return expiry;
};

export const isPackageActive = (user) => {
  if (!user?.selectedPackage || !user?.selectedPackageExpiresAt) return false;
  return new Date(user.selectedPackageExpiresAt).getTime() > Date.now();
};

export const getPackageTemplateLimit = (plan) => PACKAGE_TEMPLATE_LIMITS[plan] || 0;

export const getPurchasedTemplateCount = (user) => new Set((user?.purchasedTemplates || []).map((template) => template.templateKey)).size;

export const hasPurchasedTemplate = (user, templateKey) => (user?.purchasedTemplates || []).some((template) => template.templateKey === templateKey);

export const getTemplateLimitMessage = (user) => {
  const limit = getPackageTemplateLimit(user?.selectedPackage);
  const planLabel = user?.selectedPackage ? `${user.selectedPackage.charAt(0).toUpperCase()}${user.selectedPackage.slice(1)}` : 'current';

  if (!user?.selectedPackage) {
    return 'Please update your plan to add project templates.';
  }

  if (!isPackageActive(user)) {
    return 'Your package has expired. Please update your plan to add or use project templates.';
  }

  return `Your ${planLabel} plan allows only ${limit} template${limit === 1 ? '' : 's'}. Please update your plan to add more templates.`;
};
