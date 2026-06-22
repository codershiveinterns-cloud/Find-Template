'use client';

import { Button, Form, Input } from 'antd';
import { CustomerServiceOutlined, MailOutlined, RocketOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getApiError } from '@/lib/api/client';
import { submitInquiry } from '@/lib/api/dashboard';
import { notifyError, notifySuccess } from '@/lib/notify';

export default function InquirySection() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await submitInquiry(values);
      notifySuccess('Inquiry Submitted', 'Your inquiry has been submitted successfully.');
      form.resetFields();
    } catch (error) {
      notifyError('Inquiry Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="help-center" className="section help-section">
      <div className="section-header">
        <div className="section-kicker">Help Center</div>
        <h2 className="section-title">Let’s build your FindTemplates workspace.</h2>
        <p className="section-text">Send your inquiry and we will connect your requirements with the right project workflow.</p>
      </div>
      <div className="inquiry-card">
        <div className="inquiry-inner">
          <div className="inquiry-side">
            <CustomerServiceOutlined style={{ fontSize: 52 }} />
            <h2 style={{ fontSize: 44, lineHeight: 1.04 }}>Premium support for your digital business.</h2>
            <p style={{ color: '#dbeafe', lineHeight: 1.9 }}>
              Tell us what kind of workspace you want to launch. We can guide you around templates, dashboard access,
              projects, teams, clients, invoices, services, pricing, and company onboarding.
            </p>
            <div className="inquiry-points">
              <span><RocketOutlined /> Fast workspace setup</span>
              <span><SafetyCertificateOutlined /> Secure admin-first access</span>
            </div>
          </div>
          <div className="inquiry-form">
            <h3 style={{ marginTop: 0, fontSize: 28 }}>Send an inquiry</h3>
            <p className="section-text" style={{ marginTop: -8 }}>
              Share your name, email, and message. We will use your submitted details only for this inquiry workflow.
            </p>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                <Input size="large" placeholder="Your name" prefix={<CustomerServiceOutlined />} />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}>
                <Input size="large" placeholder="you@example.com" prefix={<MailOutlined />} />
              </Form.Item>
              <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Message is required' }]}>
                <Input.TextArea rows={7} placeholder="Tell us what you need" />
              </Form.Item>
              <Button className="inquiry-submit-btn" type="primary" size="large" htmlType="submit" loading={loading} block>Submit Inquiry</Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
