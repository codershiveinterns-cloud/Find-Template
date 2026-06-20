'use client';

import ProfileMenu from './ProfileMenu';

export default function DashboardTopbar({ user, onProfileUpdated }) {
  return (
    <header className="dashboard-topbar dashboard-topbar-simple">
      <span className="topbar-welcome-text">Welcome, {user?.name || 'Admin'}</span>
      <ProfileMenu user={user} onProfileUpdated={onProfileUpdated} />
    </header>
  );
}
