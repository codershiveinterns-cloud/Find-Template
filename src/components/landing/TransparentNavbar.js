'use client';

import Link from 'next/link';
import BrandLogoMark from '@/components/brand/BrandLogoMark';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMe } from '@/lib/api/auth';

const navItems = [
  { label: 'Templates', target: 'templates' },
  { label: 'Features', target: 'features' },
  { label: 'Pricing', target: 'pricing' },
  { label: 'Help Center', target: 'help-center' },
];

export default function TransparentNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const isLegalPage = ['/terms-and-conditions', '/privacy-policy', '/refund-policy'].includes(pathname);
  const showPublicNavItems = !loggedIn || !isLegalPage;

  useEffect(() => {
    let mounted = true;

    getMe()
      .then((response) => {
        if (mounted) setLoggedIn(Boolean(response?.data));
      })
      .catch(() => {
        if (mounted) setLoggedIn(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

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

  const renderActions = (isMobile = false) => (
    loggedIn ? (
      <Link href="/dashboard" className="premium-btn" onClick={() => isMobile && setMobileOpen(false)}>Dashboard</Link>
    ) : (
      <>
        <Link href="/auth/signup" className="premium-btn-dark" onClick={() => isMobile && setMobileOpen(false)}>Signup</Link>
        <Link href="/auth/login" className="premium-btn" onClick={() => isMobile && setMobileOpen(false)}>Login</Link>
      </>
    )
  );

  return (
    <nav className="transparent-nav">
      <Link href={loggedIn ? '/dashboard' : '/'} className="nav-brand" onClick={() => setMobileOpen(false)}>
        <BrandLogoMark className="nav-brand-mark" />
        <span>FindTemplates</span>
      </Link>
      {showPublicNavItems && (
        <div className="nav-links">
          {navItems.map((item) => (
            <button type="button" className="nav-scroll-btn" key={item.target} onClick={() => scrollToSection(item.target)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
      <div className="nav-actions">
        {renderActions()}
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
        {showPublicNavItems && navItems.map((item) => (
          <button type="button" className="nav-mobile-link" key={item.target} onClick={() => handleNavClick(item.target)}>
            {item.label}
          </button>
        ))}
        <div className="nav-mobile-actions">
          {renderActions(true)}
        </div>
      </div>
    </nav>
  );
}
