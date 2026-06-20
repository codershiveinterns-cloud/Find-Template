'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  AuditOutlined,
  CustomerServiceOutlined,
  DollarOutlined,
  ProjectOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { dashboardMenu } from '@/lib/constants/routes';
import { PLAN_ACCESS } from '@/lib/constants/packages';

const { Sider } = Layout;

const iconMap = {
  overview: <AppstoreOutlined />,
  projects: <ProjectOutlined />,
  teams: <TeamOutlined />,
  clients: <AuditOutlined />,
  invoices: <DollarOutlined />,
  'access-and-role': <SafetyCertificateOutlined />,
  services: <ToolOutlined />,
  settings: <SettingOutlined />,
  'support-info': <CustomerServiceOutlined />,
};

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const selected = dashboardMenu.find((item) => pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(`${item.path}/`)))?.key || 'overview';
  const [activeKey, setActiveKey] = useState(selected);
  const allowedKeys = PLAN_ACCESS[user?.selectedPackage || 'none'] || PLAN_ACCESS.none;

  const visibleMenu = useMemo(() => {
    if (user?.role === 'developer' || user?.role === 'designer') {
      return dashboardMenu.filter((item) => item.key === 'projects');
    }

    return dashboardMenu.filter((item) => allowedKeys.includes(item.key));
  }, [allowedKeys, user?.role]);

  useEffect(() => {
    setActiveKey(selected);
  }, [selected]);

  return (
    <Sider className="dashboard-sider" width={292} breakpoint="lg" collapsedWidth="0">
      <div className="dashboard-logo">
        <span className="dashboard-logo-mark">F</span>
        <div>
          <strong>FindTemplates</strong>
          <small>{user?.role === 'admin' ? (user?.selectedPackage ? `${user.selectedPackage} package` : 'No package selected') : `${user?.role || 'team'} account`}</small>
        </div>
      </div>
      <div className="sidebar-section-label">Main Menu</div>
      <Menu
        className="dashboard-menu"
        theme="dark"
        mode="inline"
        selectedKeys={[activeKey]}
        onClick={({ key }) => setActiveKey(key)}
        items={visibleMenu.map((item) => ({
          key: item.key,
          icon: iconMap[item.key],
          label: <Link href={item.path}>{item.label}</Link>,
        }))}
      />
    </Sider>
  );
}
