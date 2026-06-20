'use client';

import { Layout, Spin } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMe } from '@/lib/api/auth';
import { getApiError } from '@/lib/api/client';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import { notifyError } from '@/lib/notify';

export default function DashboardLayoutClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe();
        const role = response.data?.role;
        if (!['admin', 'developer', 'designer'].includes(role)) {
          router.push('/auth/login');
          return;
        }
        setUser(response.data);
        if (role !== 'admin' && !pathname.startsWith('/dashboard/projects')) {
          router.replace('/dashboard/projects');
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
    <Layout className="dashboard-shell">
      <DashboardSidebar user={user} />
      <Layout>
        <DashboardTopbar user={user} onProfileUpdated={setUser} />
        <main className="dashboard-content">{children}</main>
      </Layout>
    </Layout>
  );
}
