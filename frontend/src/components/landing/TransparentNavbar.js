'use client';

import Link from 'next/link';

const navItems = [
  { label: 'Templates', target: 'templates' },
  { label: 'Features', target: 'features' },
  { label: 'Pricing', target: 'pricing' },
  { label: 'Help Center', target: 'help-center' },
];

export default function TransparentNavbar() {
  const scrollToSection = (target) => {
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    window.location.href = `/?scroll=${target}`;
  };

  return (
    <nav className="transparent-nav">
      <Link href="/" className="nav-brand">FindTemplates</Link>
      <div className="nav-links">
        {navItems.map((item) => (
          <button type="button" className="nav-scroll-btn" key={item.target} onClick={() => scrollToSection(item.target)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <Link href="/auth/signup" className="premium-btn-dark">Signup</Link>
        <Link href="/auth/login" className="premium-btn">Login</Link>
      </div>
    </nav>
  );
}
