'use client';

import { MenuOutlined } from '@ant-design/icons';
import ProfileMenu from './ProfileMenu';

export default function DashboardTopbar({ user, onProfileUpdated, onMenuClick }) {
  return (
    <header className="dashboard-topbar dashboard-topbar-simple">
      <div className="dashboard-topbar-left">
        <button type="button" className="dashboard-mobile-menu-btn" aria-label="Open dashboard navigation" onClick={onMenuClick}>
          <MenuOutlined />
        </button>
        <span className="topbar-welcome-text">Welcome, {user?.name || 'Admin'}</span>
      </div>
      <ProfileMenu user={user} onProfileUpdated={onProfileUpdated} />
    </header>
  );
}
