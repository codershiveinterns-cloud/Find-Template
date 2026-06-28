'use client';

import { Layout, Result, Spin } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '@/components/landing/Footer';
import { getMe } from '@/lib/api/auth';
import { getApiError } from '@/lib/api/client';
import {
  getDashboardKeyFromPath,
  getFirstAllowedDashboardPath,
  getUserAllowedDashboardKeys,
} from '@/lib/dashboardAccess';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import { DashboardUserProvider } from './DashboardUserContext';
import { notifyError } from '@/lib/notify';

export default function DashboardLayoutClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const applyUser = (nextUser) => {
    setUser(nextUser);
    return nextUser;
  };

  const refreshUser = async () => {
    const response = await getMe();
    return applyUser(response.data);
  };

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setBlocked(false);
        const response = await getMe();
        const currentUser = response.data;
        const role = currentUser?.role;
        if (!['admin', 'developer', 'designer', 'manager'].includes(role)) {
          router.push('/auth/login');
          return;
        }
        applyUser(currentUser);

        const allowedKeys = getUserAllowedDashboardKeys(currentUser);
        const currentKey = getDashboardKeyFromPath(pathname);
        const firstAllowedPath = getFirstAllowedDashboardPath(currentUser);

        if (!allowedKeys.length || !firstAllowedPath) {
          setBlocked(true);
          return;
        }

        if (!currentKey || !allowedKeys.includes(currentKey)) {
          router.replace(firstAllowedPath);
          return;
        }
      } catch (error) {
        notifyError('Session Expired', getApiError(error));
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="auth-page">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <DashboardUserProvider value={{ user, setUser: applyUser, refreshUser }}>
      <Layout className="dashboard-shell">
        <DashboardSidebar user={user} mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        <Layout>
          <DashboardTopbar user={user} onProfileUpdated={applyUser} onMenuClick={() => setMobileSidebarOpen(true)} />
          <main className="dashboard-content">
            {blocked ? (
              <Result
                status="403"
                title="No modules assigned"
                subTitle="Please contact the admin to assign a package module to this account."
              />
            ) : children}
          </main>
          <div className="dashboard-footer-wrap">
            <Footer />
          </div>
        </Layout>
      </Layout>
    </DashboardUserProvider>
  );
}
