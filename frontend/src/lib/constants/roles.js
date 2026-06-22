export const ACCOUNT_TYPES = [
  { label: 'Freelancer / Individual', value: 'freelancer_individual' },
  { label: 'Company / Business', value: 'company_business' },
];

export const SIGNUP_ROLES = [{ label: 'Admin / Owner', value: 'admin' }];
export const LOGIN_ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Manager', value: 'manager' },
];

export const formatAccountType = (accountType) => {
  if (accountType === 'company_business') return 'Company / Business';
  return 'Freelancer / Individual';
};
