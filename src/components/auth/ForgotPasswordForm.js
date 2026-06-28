'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, Select, Typography } from 'antd';
import { ArrowLeftOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { requestPasswordResetOtp, resetPasswordWithOtp } from '@/lib/api/auth';
import { getApiError } from '@/lib/api/client';
import { ACCOUNT_TYPES, LOGIN_ROLES } from '@/lib/constants/roles';
import { notifyError, notifySuccess } from '@/lib/notify';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [requestForm] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resetContext, setResetContext] = useState(null);
  const [role, setRole] = useState('admin');
  const isTeamRole = role !== 'admin';

  const requestOtp = async (values) => {
    setLoading(true);
    try {
      await requestPasswordResetOtp(values);
      setResetContext(values);
      setStep(1);
      notifySuccess('OTP Sent', 'OTP has been sent to the registered email.');
    } catch (error) {
      notifyError('OTP Request Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (values) => {
    setLoading(true);
    try {
      await resetPasswordWithOtp({ ...(resetContext || {}), ...values });
      notifySuccess('Password Reset', 'Password updated successfully. Please login with your new password.');
      router.push('/auth/login');
    } catch (error) {
      notifyError('Password Reset Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card forgot-password-card">
      <div className="forgot-password-header">
        <span><SafetyCertificateOutlined /> Secure password reset</span>
        <Typography.Title level={2}>Forgot password</Typography.Title>
        <Typography.Paragraph type="secondary">
          {step === 0
            ? 'Enter your registered email, account type, and role. OTP will be sent to that registered email.'
            : 'Enter the OTP and choose a new password for your account.'}
        </Typography.Paragraph>
      </div>
      <div className="forgot-password-progress">
        <span className={step === 0 ? 'active' : ''}>1. Send OTP</span>
        <span className={step === 1 ? 'active' : ''}>2. Reset Password</span>
      </div>

      {step === 0 ? (
        <Form
          form={requestForm}
          layout="vertical"
          initialValues={{ accountType: 'freelancer', role }}
          onFinish={requestOtp}
          requiredMark={false}
          className="responsive-auth-form"
        >
          <Form.Item name="accountType" label="Select Account" rules={[{ required: true }]}>
            <Select size="large" options={ACCOUNT_TYPES} />
          </Form.Item>
          <Form.Item name="role" label="Select Role" rules={[{ required: true }]}>
            <Select size="large" options={LOGIN_ROLES} onChange={setRole} />
          </Form.Item>
          <Form.Item name="email" label={isTeamRole ? 'Registered Member Email' : 'Registered Email'} rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}>
            <Input size="large" prefix={<MailOutlined />} placeholder={isTeamRole ? 'member@example.com' : 'you@example.com'} />
          </Form.Item>
          <Button className="auth-submit-btn" type="primary" htmlType="submit" loading={loading} block size="large">
            Send OTP
          </Button>
        </Form>
      ) : (
        <Form
          layout="vertical"
          onFinish={resetPassword}
          requiredMark={false}
          className="responsive-auth-form"
        >
          <Form.Item name="otp" label="6-digit OTP" rules={[{ required: true, pattern: /^\d{6}$/, message: 'Enter the 6-digit OTP' }]}>
            <Input size="large" maxLength={6} prefix={<SafetyCertificateOutlined />} placeholder="123456" />
          </Form.Item>
          <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8, message: 'Password must be at least 8 characters' }]}>
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="New password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Confirm password is required' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Confirm password" />
          </Form.Item>
          <div className="forgot-password-actions">
            <Button icon={<ArrowLeftOutlined />} onClick={() => setStep(0)} disabled={loading}>
              Back
            </Button>
            <Button className="auth-submit-btn" type="primary" htmlType="submit" loading={loading} size="large">
              Update Password
            </Button>
          </div>
        </Form>
      )}

      <Typography.Paragraph style={{ marginTop: 18, textAlign: 'center' }}>
        Remember your password? <Link href="/auth/login">Back to login</Link>
      </Typography.Paragraph>
    </Card>
  );
}
