import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import TransparentNavbar from '@/components/landing/TransparentNavbar';
import Footer from '@/components/landing/Footer';
import loginImage from '@/assets/images/images/dashboard.png';

export const metadata = {
  title: 'Login | FindTemplates',
};

export default function LoginPage() {
  return (
    <>
      <TransparentNavbar />
      <main className="auth-page auth-page-with-nav">
        <div className="auth-shell">
          <div className="auth-visual">
            <Image src={loginImage} alt="Login to FindTemplates dashboard" className="auth-visual-image" priority />
            <div className="auth-visual-content">
              <span className="hero-badge">Secure Dashboard</span>
              <h1 style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-0.06em' }}>Welcome back to FindTemplates.</h1>
              <p style={{ color: '#dbeafe', lineHeight: 1.8 }}>Access your admin dashboard, profile, projects, services, and role-based business workspace.</p>
            </div>
          </div>
          <div className="auth-form-panel">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
