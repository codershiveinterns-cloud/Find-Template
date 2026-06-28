import Image from 'next/image';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import TransparentNavbar from '@/components/landing/TransparentNavbar';
import Footer from '@/components/landing/Footer';
import loginImage from '@/assets/images/images/dashboard.png';

export const metadata = {
  title: 'Forgot Password | FindTemplates',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <TransparentNavbar />
      <main className="auth-page auth-page-with-nav">
        <div className="auth-shell">
          <div className="auth-visual">
            <Image src={loginImage} alt="Reset FindTemplates password" className="auth-visual-image" priority />
            <div className="auth-visual-content">
              <span className="hero-badge">Secure Reset</span>
              <h1 style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-0.06em' }}>Reset access safely.</h1>
              <p style={{ color: '#dbeafe', lineHeight: 1.8 }}>Use your email OTP to update only your password and return to your workspace securely.</p>
            </div>
          </div>
          <div className="auth-form-panel">
            <ForgotPasswordForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
