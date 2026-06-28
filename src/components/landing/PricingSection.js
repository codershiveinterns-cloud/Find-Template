'use client';

import Link from 'next/link';
import { Segmented } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const prices = {
  Monthly: { plus: '$199/month', pro: '$299/month', business: '$399/month' },
  Yearly: { plus: '$1910.40/year', pro: '$2870.40/year', business: '$3830.40/year' },
};

const plans = [
  {
    key: 'plus',
    name: 'Plus',
    included: ['Projects page', 'Settings page', 'Support info page', 'Service page', 'Access 1 template'],
    excluded: ['Invoice page', 'Teams page', 'Clients page'],
  },
  {
    key: 'pro',
    name: 'Pro',
    highlighted: true,
    included: ['Projects page', 'Settings page', 'Support info page', 'Service page', 'Access 4 templates', 'Teams page'],
    excluded: ['Clients page'],
  },
  {
    key: 'business',
    name: 'Business',
    popular: true,
    included: [
      'Projects page and Settings page',
      'Support info page',
      'Service page and Invoice page',
      'Teams page and Clients page',
      'Access 8 templates',
      'Priority support facility',
    ],
    excluded: [],
    paired: true,
  },
];

export default function PricingSection() {
  const [billing, setBilling] = useState('Monthly');

  return (
    <section id="pricing" className="section alt-section">
      <div className="section-header">
        <div className="section-kicker">Pricing</div>
        <h2 className="section-title">Choose a plan that fits your workflow.</h2>
        <p className="section-text">Monthly and yearly billing in USD with clear access for each plan.</p>
      </div>
      <div className="pricing-toggle">
        <Segmented size="large" options={['Monthly', 'Yearly']} value={billing} onChange={setBilling} />
      </div>
      <div className="card-grid pricing-grid">
        {plans.map((plan) => (
          <article className={`price-card ${plan.highlighted ? 'featured' : ''}`} key={plan.name}>
            <div className="price-top-row">
              <span className="plan-tag">{plan.name}</span>
              {plan.popular && <span className="popular-tag">Popular</span>}
            </div>
            <div className="pricing-price">{prices[billing][plan.key]}</div>
            <p className="section-text" style={{ marginTop: 0 }}>{billing === 'Yearly' ? 'Yearly discounted billing' : 'Monthly flexible billing'}</p>
            <ul className={`feature-list ${plan.paired ? 'feature-list-paired' : ''}`}>
              {plan.included.map((feature) => (
                <li key={feature}><CheckCircleOutlined className="included" /> <span>{feature}</span></li>
              ))}
            </ul>
            {plan.excluded.length > 0 && (
              <ul className="feature-list excluded-list">
                {plan.excluded.map((feature) => (
                  <li key={feature}><CloseCircleOutlined className="excluded" /> <span>{feature}</span></li>
                ))}
              </ul>
            )}
            <Link href="/auth/signup" className="premium-btn-dark price-buy-btn">Buy Now</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
