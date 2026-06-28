'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Modal } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import heroImage from '@/assets/images/images/dash.jpeg';

export default function HeroSection() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="hero-gradient">
      <div className="hero-content">
        <div className="hero-copy">
          <span className="hero-badge"><CheckCircleOutlined /> Premium project management system</span>
          <h1>Build your brand. <span className="text-gradient">Manage your future.</span></h1>
          <p>
            FindTemplates brings your projects, team, clients, services, and USD invoices into one premium dashboard — designed for freelancers, companies, and growing digital teams.
          </p>
          <div className="hero-actions">
            <Link href="/auth/signup" className="premium-btn-dark">Free Trial <ArrowRightOutlined /></Link>
            <button type="button" className="premium-btn" onClick={() => setDemoOpen(true)}><PlayCircleOutlined /> Watch Demo</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-wrap">
            <Image src={heroImage} alt="FindTemplates premium dashboard preview" className="hero-image" priority />
          </div>
          <div className="floating-card">
            <strong>Premium workspace</strong>
            <p style={{ margin: '8px 0 0', color: '#cbd5e1' }}>A clean base for templates, projects, services, and business growth.</p>
          </div>
        </div>
      </div>

      <Modal
        title="FindTemplates Demo"
        open={demoOpen}
        onCancel={() => setDemoOpen(false)}
        footer={null}
        width={980}
        centered
      >
        <video className="demo-video" src="/demo.mp4" controls autoPlay />
      </Modal>
    </section>
  );
}
