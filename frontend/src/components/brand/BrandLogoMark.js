export default function BrandLogoMark({ className = '' }) {
  return (
    <span className={`brand-logo-mark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img" focusable="false">
        <defs>
          <linearGradient id="ftLogoBg" x1="6" y1="5" x2="43" y2="43" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1d4ed8" />
            <stop offset="0.48" stopColor="#0891b2" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="ftLogoCard" x1="13" y1="10" x2="31" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="45" height="45" rx="15.5" fill="#020617" />
        <rect x="4" y="4" width="40" height="40" rx="14" fill="url(#ftLogoBg)" />
        <path d="M14.4 12.5h16.2a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H14.4a3 3 0 0 1-3-3v-18a3 3 0 0 1 3-3Z" fill="rgba(255,255,255,0.26)" />
        <path d="M17.2 9.8h16.2a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H17.2a3 3 0 0 1-3-3v-18a3 3 0 0 1 3-3Z" fill="url(#ftLogoCard)" />
        <path d="M18.6 15.1h13.8M18.6 20h10.2M18.6 24.9h7.4" stroke="#2563eb" strokeWidth="2.35" strokeLinecap="round" />
        <circle cx="31.2" cy="30.4" r="6.1" fill="none" stroke="#020617" strokeWidth="3.1" />
        <path d="m35.8 35 4.3 4.3" stroke="#020617" strokeWidth="3.1" strokeLinecap="round" />
        <circle cx="31.2" cy="30.4" r="3.1" fill="rgba(34,211,238,0.38)" />
        <path d="M10.8 14.3 7.6 24l3.2 9.7" stroke="#bfdbfe" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
      </svg>
    </span>
  );
}
