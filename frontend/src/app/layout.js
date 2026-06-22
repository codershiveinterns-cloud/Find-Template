import 'antd/dist/reset.css';
import AppThemeProvider from '@/components/theme/AppThemeProvider';
import './globals.css';

export const metadata = {
  title: 'FindTemplates | Project Management System',
  description: 'Manage projects, teams, clients, invoices, and services in one workspace.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
