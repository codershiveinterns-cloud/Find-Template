export const ACCOUNT_TYPES = [
  { label: 'Freelancer', value: 'freelancer' },
  { label: 'Individual', value: 'individual' },
  { label: 'Company / Business', value: 'company_business' },
];

export const SIGNUP_ROLES = [{ label: 'Admin / Owner', value: 'admin' }];
export const LOGIN_ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'Developer', value: 'developer' },
  { label: 'Manager', value: 'manager' },
];

export const formatAccountType = (accountType) => {
  if (accountType === 'company_business') return 'Company / Business';
  if (accountType === 'freelancer') return 'Freelancer';
  if (accountType === 'individual') return 'Individual';
  return 'Freelancer / Individual';
};
