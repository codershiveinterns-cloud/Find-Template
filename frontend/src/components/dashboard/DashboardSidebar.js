'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drawer, Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  AuditOutlined,
  CustomerServiceOutlined,
  DollarOutlined,
  ProjectOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { dashboardMenu } from '@/lib/constants/routes';
import { getUserAllowedDashboardKeys } from '@/lib/dashboardAccess';
import BrandLogoMark from '@/components/brand/BrandLogoMark';

const { Sider } = Layout;

const iconMap = {
  overview: <AppstoreOutlined />,
  projects: <ProjectOutlined />,
  teams: <TeamOutlined />,
  clients: <AuditOutlined />,
  invoices: <DollarOutlined />,
  services: <ToolOutlined />,
  settings: <SettingOutlined />,
  'support-info': <CustomerServiceOutlined />,
};

export default function DashboardSidebar({ user, mobileOpen = false, onClose }) {
  const pathname = usePathname();
  const selected = dashboardMenu.find((item) => pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(`${item.path}/`)))?.key || 'overview';
  const [activeKey, setActiveKey] = useState(selected);

  const visibleMenu = useMemo(() => {
    const allowedKeys = getUserAllowedDashboardKeys(user);
    return dashboardMenu.filter((item) => allowedKeys.includes(item.key));
  }, [user]);

  useEffect(() => {
    setActiveKey(selected);
  }, [selected]);

  const handleMenuClick = ({ key }) => {
    setActiveKey(key);
    onClose?.();
  };

  const sidebarContent = (
    <>
      <div className="dashboard-logo">
        <BrandLogoMark className="dashboard-logo-mark" />
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
        onClick={handleMenuClick}
        items={visibleMenu.map((item) => ({
          key: item.key,
          icon: iconMap[item.key],
          label: <Link href={item.path}>{item.label}</Link>,
        }))}
      />
    </>
  );

  return (
    <>
      <Sider className="dashboard-sider dashboard-sider-desktop" width={292} breakpoint="lg" collapsedWidth="0">
        {sidebarContent}
      </Sider>
      <Drawer
        title={null}
        placement="left"
        open={mobileOpen}
        onClose={onClose}
        size={292}
        className="dashboard-sidebar-drawer"
        closable={false}
      >
        <aside className="dashboard-sider dashboard-sider-mobile">
          {sidebarContent}
        </aside>
      </Drawer>
    </>
  );
}
