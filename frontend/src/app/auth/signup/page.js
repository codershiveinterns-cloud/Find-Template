import Image from 'next/image';
import SignupForm from '@/components/auth/SignupForm';
import TransparentNavbar from '@/components/landing/TransparentNavbar';
import Footer from '@/components/landing/Footer';
import signupImage from '@/assets/images/images/business.jpg';

export const metadata = {
  title: 'Signup | FindTemplates',
};

export default function SignupPage() {
  return (
    <>
      <TransparentNavbar />
      <main className="auth-page auth-page-with-nav">
        <div className="auth-shell">
          <div className="auth-visual">
            <Image src={signupImage} alt="Create FindTemplates account" className="auth-visual-image" priority />
            <div className="auth-visual-content">
              <span className="hero-badge">Admin / Owner Access</span>
              <h1 style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-0.06em' }}>Create your premium workspace.</h1>
              <p style={{ color: '#dbeafe', lineHeight: 1.8 }}>Start with a secure admin account and manage projects, teams, clients, templates, services, and invoices from one dashboard.</p>
            </div>
          </div>
          <div className="auth-form-panel">
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
