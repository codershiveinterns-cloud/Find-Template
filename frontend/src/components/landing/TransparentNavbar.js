'use client';

import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { label: 'Templates', target: 'templates' },
  { label: 'Features', target: 'features' },
  { label: 'Pricing', target: 'pricing' },
  { label: 'Help Center', target: 'help-center' },
];

export default function TransparentNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (target) => {
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    window.location.href = `/?scroll=${target}`;
  };

  const handleNavClick = (target) => {
    setMobileOpen(false);
    scrollToSection(target);
  };

  return (
    <nav className="transparent-nav">
      <Link href="/" className="nav-brand" onClick={() => setMobileOpen(false)}>FindTemplates</Link>
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
      <button
        type="button"
        className={`nav-mobile-toggle ${mobileOpen ? 'is-open' : ''}`}
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <button type="button" className="nav-mobile-link" key={item.target} onClick={() => handleNavClick(item.target)}>
            {item.label}
          </button>
        ))}
        <div className="nav-mobile-actions">
          <Link href="/auth/signup" className="premium-btn-dark" onClick={() => setMobileOpen(false)}>Signup</Link>
          <Link href="/auth/login" className="premium-btn" onClick={() => setMobileOpen(false)}>Login</Link>
        </div>
      </div>
    </nav>
  );
}
