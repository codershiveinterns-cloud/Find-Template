import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';

export const metadata = {
  title: 'Dashboard | FindTemplates',
};

export default function DashboardLayout({ children }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
