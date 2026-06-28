'use client';

import { useEffect } from 'react';

export default function PageScrollHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('scroll');

    if (!target) return;

    window.requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '/');
    });
  }, []);

  return null;
}
