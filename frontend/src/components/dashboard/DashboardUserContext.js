'use client';

import { createContext, useContext } from 'react';

const DashboardUserContext = createContext(null);

export const DashboardUserProvider = ({ children, value }) => (
  <DashboardUserContext.Provider value={value}>{children}</DashboardUserContext.Provider>
);

export const useDashboardUser = () => {
  const context = useContext(DashboardUserContext);
  if (!context) {
    throw new Error('useDashboardUser must be used within DashboardUserProvider');
  }
  return context;
};
