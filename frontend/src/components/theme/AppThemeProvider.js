'use client';

import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setNotificationApi } from '@/lib/notify';

const STORAGE_KEY = 'nexlance_theme';
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
  const [mode, setModeState] = useState('light');
  const isDark = mode === 'dark';

  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_KEY);
    if (storedMode === 'dark' || storedMode === 'light') {
      setModeState(storedMode);
      document.documentElement.dataset.theme = storedMode;
      return;
    }

    document.documentElement.dataset.theme = 'light';
  }, []);

  const setMode = useCallback((nextMode) => {
    const safeMode = nextMode === 'dark' ? 'dark' : 'light';
    setModeState(safeMode);
    window.localStorage.setItem(STORAGE_KEY, safeMode);
    document.documentElement.dataset.theme = safeMode;
  }, []);

  const value = useMemo(() => ({
    mode,
    isDark,
    setMode,
    toggleMode: () => setMode(isDark ? 'light' : 'dark'),
  }), [isDark, mode, setMode]);

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: isDark ? '#60a5fa' : '#2563eb',
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
