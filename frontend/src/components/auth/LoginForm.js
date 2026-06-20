'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, Select, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { loginUser } from '@/lib/api/auth';
import { getApiError } from '@/lib/api/client';
import { ACCOUNT_TYPES, LOGIN_ROLES } from '@/lib/constants/roles';
import { notifyError, notifySuccess } from '@/lib/notify';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('freelancer_individual');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await loginUser(values);
      notifySuccess('Login Successfully', 'Welcome back! Your dashboard is opening now.');
      router.push('/dashboard');
    } catch (error) {
      notifyError('Login Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card">
      <Typography.Title level={2} style={{ marginTop: 0, letterSpacing: '-0.04em' }}>Login</Typography.Title>
      <Typography.Paragraph type="secondary">Enter your details to open your protected dashboard.</Typography.Paragraph>
      <Form layout="vertical" initialValues={{ accountType, role: 'admin' }} onFinish={onFinish} requiredMark={false}>
        <Form.Item name="accountType" label="Select Account" rules={[{ required: true }]}>
          <Select size="large" options={ACCOUNT_TYPES} onChange={setAccountType} />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}>
          <Input size="large" placeholder="admin@example.com" />
        </Form.Item>
        {accountType === 'company_business' && (
          <Form.Item name="companyEmail" label="Company Email" rules={[{ required: true, type: 'email', message: 'Valid company email is required' }]}>
            <Input size="large" placeholder="company@example.com" />
          </Form.Item>
        )}
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>
        <Form.Item name="role" label="Select Role" rules={[{ required: true }]}>
          <Select size="large" options={LOGIN_ROLES} />
        </Form.Item>
        <Button className="auth-submit-btn" type="primary" htmlType="submit" loading={loading} block size="large" icon={<ArrowRightOutlined />}>Login</Button>
      </Form>
      <Typography.Paragraph style={{ marginTop: 18, textAlign: 'center' }}>
        Need an account? <Link href="/auth/signup">Create Account</Link>
      </Typography.Paragraph>
    </Card>
  );
}
