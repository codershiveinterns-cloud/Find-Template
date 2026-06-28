'use client';

import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { setNotificationApi } from '@/lib/notify';

const ThemeContext = createContext(null);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
};

function NotificationBridge({ children }) {
  const { notification } = AntdApp.useApp();

  useEffect(() => {
    setNotificationApi(notification);
  }, [notification]);

  return children;
}

export default function AppThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
  }, []);

  const value = useMemo(() => ({
    mode: 'light',
    isDark: false,
    setMode: () => {},
    hydrateMode: () => {},
    toggleMode: () => {},
  }), []);

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#2563eb',
            colorSuccess: '#10b981',
            colorWarning: '#f59e0b',
            colorError: '#ef4444',
            borderRadius: 16,
            fontFamily: 'Arial, Helvetica, sans-serif',
          },
          components: {
            Button: {
              controlHeightLG: 46,
              borderRadius: 14,
            },
            Card: {
              borderRadiusLG: 24,
            },
            Modal: {
              borderRadiusLG: 24,
            },
          },
        }}
      >
        <AntdApp>
          <NotificationBridge>{children}</NotificationBridge>
        </AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
