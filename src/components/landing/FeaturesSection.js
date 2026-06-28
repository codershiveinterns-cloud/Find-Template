'use client';

import { Card } from 'antd';
import { ApartmentOutlined, AuditOutlined, DollarOutlined, TeamOutlined, ToolOutlined } from '@ant-design/icons';

const features = [
  { title: 'Project Tracking', text: 'Keep every project organized with status, owner, and activity-ready structure.', icon: <ApartmentOutlined /> },
  { title: 'Team Management', text: 'Manage developers, designers, and future team members from one place.', icon: <TeamOutlined /> },
  { title: 'Client Workspace', text: 'Store client records from MongoDB and show clean empty states when no data exists.', icon: <AuditOutlined /> },
  { title: 'USD Invoices', text: 'Keep invoice amounts and pricing in USD for a simple business workflow.', icon: <DollarOutlined /> },
  { title: 'Services', text: 'Prepare your service catalog and prices without dummy frontend data.', icon: <ToolOutlined /> },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section">
      <div className="section-header">
        <div className="section-kicker">Features</div>
        <h2 className="section-title">Everything your workflow needs.</h2>
        <p className="section-text">A structured dashboard for projects, clients, teams, invoices, services, settings, and support.</p>
      </div>
      <div className="card-grid">
        {features.map((feature) => (
          <Card className="nex-card" key={feature.title}>
            <span className="icon-badge">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p className="section-text">{feature.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
