'use client';

import { Button, Form, Input, Modal, Segmented, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { confirmFakePayment } from '@/lib/api/profile';
import { getApiError } from '@/lib/api/client';
import { SERVICE_PLANS } from '@/lib/constants/packages';
import { notifyError, notifySuccess } from '@/lib/notify';

const paymentMethods = [
  { label: 'Card', value: 'card' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
];

const pairFeatures = (features) => {
  const pairs = [];
  for (let index = 0; index < features.length; index += 2) {
    pairs.push(features.slice(index, index + 2).join(' and '));
  }
  return pairs;
};

export default function ServicesPlans() {
  const [billing, setBilling] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const paymentMethod = Form.useWatch('paymentMethod', form);

  const openPayment = (plan) => {
    setSelectedPlan(plan);
    form.setFieldsValue({ plan: plan.name, paymentMethod: 'card' });
  };

  const closePayment = () => {
    setSelectedPlan(null);
    form.resetFields();
  };

  const confirmPayment = async (values) => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      await confirmFakePayment({
        plan: selectedPlan.key,
        billing,
        email: values.email,
        paymentMethod: values.paymentMethod,
      });
      notifySuccess('Payment Confirmed', `${selectedPlan.name} package activated successfully. Dashboard access is updating now.`);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1300);
    } catch (error) {
      notifyError('Payment Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-services-page">
      {/* Hero Banner */}
      <div className="services-hero-banner">
        <div className="services-hero-glow" />
        <div className="services-hero-glow-2" />
        <div className="services-hero-content">
          <div className="services-hero-left">
            <span className="services-hero-badge">
              <RocketOutlined /> Nexlance Packages
            </span>
            <h1 className="services-hero-title">
              Upgrade your workspace with <span className="text-gradient">Premium.</span>
            </h1>
            <p className="services-hero-subtitle">
              Choose the package that fits your workflow. Unlock advanced pages, client boards, collaborative teams, and template options.
            </p>
          </div>
        </div>
      </div>

      <div className="services-pricing-toggle-container">
        <Segmented
          size="large"
          options={[{ label: 'Monthly billing', value: 'monthly' }, { label: 'Yearly billing (Save ~20%)', value: 'yearly' }]}
          value={billing}
          onChange={setBilling}
          className="services-segmented-toggle"
        />
      </div>

      <div className="compact-dashboard-plans-grid">
        {SERVICE_PLANS.map((plan) => (
          <article className={`compact-price-card ${plan.key}-card ${plan.highlighted ? 'featured' : ''}`} key={plan.key}>
            <div className="price-top-row">
              <span className="plan-tag">{plan.name}</span>
              {plan.popular && <span className="popular-tag">Popular</span>}
            </div>
            <div className="compact-pricing-price">
              ${plan[billing].toLocaleString()}
              <span>/{billing === 'yearly' ? 'year' : 'month'}</span>
            </div>
            <p className="compact-plan-text">Premium dashboard access based on selected package.</p>
            <ul className="compact-feature-list">
              {pairFeatures(plan.included).map((feature) => (
                <li key={feature}>
                  <CheckCircleOutlined className="included" />
                  <span>{feature}</span>
                </li>
              ))}
              {plan.excluded.map((feature) => (
                <li key={feature}>
                  <CloseCircleOutlined className="excluded" />
                  <span className="excluded-text">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              type="primary"
              className="compact-buy-btn"
              icon={<RocketOutlined />}
              onClick={() => openPayment(plan)}
            >
              Buy Now
            </Button>
          </article>
        ))}
      </div>

      <Modal
        title={null}
        open={Boolean(selectedPlan)}
        onCancel={closePayment}
        footer={null}
        centered
        width={560}
        className="proj-premium-modal"
        forceRender={true}
      >
        <div className="proj-modal-header">
          <span className="proj-modal-badge"><RocketOutlined /> Confirm Activation</span>
          <h2>Payment Checkout</h2>
          <p>Provide your payment credentials below to activate the {selectedPlan?.name} package.</p>
        </div>
        <Form form={form} layout="vertical" onFinish={confirmPayment} requiredMark={false}>
          <div className="payment-two-col">
            <Form.Item name="plan" label="Selected Plan">
              <Input size="large" disabled />
            </Form.Item>
            <Form.Item label="Billing Price">
              <Input size="large" value={`${billing === 'yearly' ? 'Yearly' : 'Monthly'} - $${selectedPlan?.[billing]?.toLocaleString() || 0}`} disabled />
            </Form.Item>
          </div>
          <Form.Item name="email" label="Payment Email" rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}>
            <Input size="large" placeholder="payment@example.com" />
          </Form.Item>
          <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true, message: 'Payment method is required' }]}>
            <Select size="large" options={paymentMethods} />
          </Form.Item>

          {paymentMethod === 'card' && (
            <div className="payment-method-fields">
              <Form.Item name="cardHolder" label="Card Holder Name" rules={[{ required: true, message: 'Card holder name is required' }]}>
                <Input size="large" placeholder="Name on card" />
              </Form.Item>
              <Form.Item name="cardNumber" label="Card Number" rules={[{ required: true, message: 'Card number is required' }]}>
                <Input size="large" placeholder="4242 4242 4242 4242" />
              </Form.Item>
              <div className="payment-two-col">
                <Form.Item name="expiry" label="Expiry" rules={[{ required: true, message: 'Expiry is required' }]}>
                  <Input size="large" placeholder="MM/YY" />
                </Form.Item>
                <Form.Item name="cvv" label="CVV" rules={[{ required: true, message: 'CVV is required' }]}>
                  <Input size="large" placeholder="123" />
                </Form.Item>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="payment-method-fields">
              <Form.Item name="paypalEmail" label="PayPal Email" rules={[{ required: true, type: 'email', message: 'Valid PayPal email is required' }]}>
                <Input size="large" placeholder="paypal@example.com" />
              </Form.Item>
              <Form.Item name="paypalTransaction" label="PayPal Transaction ID" rules={[{ required: true, message: 'Transaction ID is required' }]}>
                <Input size="large" placeholder="PAYPAL-TRANSACTION-ID" />
              </Form.Item>
            </div>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div className="payment-method-fields">
              <Form.Item name="accountName" label="Account Holder Name" rules={[{ required: true, message: 'Account holder name is required' }]}>
                <Input size="large" placeholder="Account holder name" />
              </Form.Item>
              <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true, message: 'Account number is required' }]}>
                <Input size="large" placeholder="Account number" />
              </Form.Item>
              <Form.Item name="bankName" label="Bank Name" rules={[{ required: true, message: 'Bank name is required' }]}>
                <Input size="large" placeholder="Bank name" />
              </Form.Item>
            </div>
          )}

          <Button type="primary" htmlType="submit" className="proj-submit-btn" loading={loading} block>Confirm Checkout</Button>
        </Form>
      </Modal>
    </div>
  );
}
