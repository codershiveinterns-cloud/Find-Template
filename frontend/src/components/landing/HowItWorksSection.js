'use client';

import { LoginOutlined, RocketOutlined, SafetyCertificateOutlined, DatabaseOutlined } from '@ant-design/icons';

const steps = [
  { title: 'Create account', text: 'Signup as Admin / Owner with freelancer or company account type.', icon: <LoginOutlined /> },
  { title: 'Secure admin login', text: 'Login with role, account type, and company email when needed.', icon: <SafetyCertificateOutlined /> },
  { title: 'Launch workspace', text: 'Manage projects, teams, clients, invoices, services, support, and access.', icon: <RocketOutlined /> },
  { title: 'Use real data', text: 'MongoDB data appears in dashboard; empty records show Data not available.', icon: <DatabaseOutlined /> },
];

export default function HowItWorksSection() {
  return (
    <section className="section">
      <div className="section-header">
        <div className="section-kicker">How it works</div>
        <h2 className="section-title">From signup to dashboard in minutes.</h2>
        <p className="section-text">A premium flow that keeps account creation simple and the admin workspace clean.</p>
      </div>
      <div className="work-grid">
        {steps.map((step, index) => (
          <article className="work-card" key={step.title}>
            <div className="work-number">0{index + 1}</div>
            <span className="icon-badge">{step.icon}</span>
            <h3>{step.title}</h3>
            <p className="section-text">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
