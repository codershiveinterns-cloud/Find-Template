'use client';

import { Button, Form, Input, Modal } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  LogoutOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/api/auth';
import { getApiError } from '@/lib/api/client';
import { deleteAccount, updatePassword, updateProfile } from '@/lib/api/profile';
import { formatPackage, formatPackageExpiry, getTemplateUsage } from '@/lib/constants/packages';
import { formatAccountType } from '@/lib/constants/roles';
import { notifyError, notifySuccess } from '@/lib/notify';
import { useDashboardUser } from '../DashboardUserContext';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'Data not available');
const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`;
const fallback = (value) => value || 'Data not available';

export default function SettingsPageClient() {
  const router = useRouter();
  const { user, setUser } = useDashboardUser();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [passwordForm] = Form.useForm();
  const [deleteForm] = Form.useForm();

  const isAdmin = user?.role === 'admin';
  const isCompanyAccount = user?.accountType === 'company_business';
  const loginEmail = user?.loginEmail || user?.ownerEmail || user?.email;
  const templateUsage = getTemplateUsage(user);

  const saveProfile = async (values) => {
    setProfileLoading(true);
    try {
      const response = await updateProfile(values);
      setUser(response.data);
      notifySuccess('Profile Updated', 'Your profile name has been updated successfully.');
    } catch (error) {
      notifyError('Profile Update Failed', getApiError(error));
    } finally {
      setProfileLoading(false);
    }
  };

  const savePassword = async (values) => {
    setPasswordLoading(true);
    try {
      await updatePassword(values);
      passwordForm.resetFields();
      notifySuccess('Password Updated', 'Your password has been updated successfully.');
    } catch (error) {
      notifyError('Password Update Failed', getApiError(error));
    } finally {
      setPasswordLoading(false);
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      await logoutUser();
      notifySuccess('Logged Out', 'You have been logged out successfully.');
      router.push('/auth/login');
    } catch (error) {
      notifyError('Logout Failed', getApiError(error));
    } finally {
      setLogoutLoading(false);
    }
  };

  const removeAccount = async (values) => {
    if (deleteConfirm !== 'DELETE') return;

    setDeleteLoading(true);
    try {
      await deleteAccount({ currentPassword: values.currentPassword });
      notifySuccess('Account Deleted', 'Your account has been deleted successfully.');
      router.push('/auth/login');
    } catch (error) {
      notifyError('Account Delete Failed', getApiError(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  const profileDetails = [
    { label: 'Email', value: fallback(user?.email), icon: <MailOutlined /> },
    { label: 'Account Type', value: formatAccountType(user?.accountType), icon: <ShopOutlined /> },
    { label: 'Role', value: fallback(user?.role), icon: <SafetyCertificateOutlined /> },
    ...(isCompanyAccount ? [
      { label: 'Company Name', value: fallback(user?.companyName), icon: <ToolOutlined /> },
    ] : []),
    ...(isAdmin ? [
      ...(isCompanyAccount ? [
        { label: 'Company Email', value: fallback(user?.companyEmail), icon: <MailOutlined /> },
      ] : []),
      { label: 'Package', value: formatPackage(user?.selectedPackage, user?.selectedPackageBilling, user?.selectedPackagePrice), icon: <CheckCircleOutlined /> },
      { label: 'Billing', value: fallback(user?.selectedPackageBilling), icon: <ToolOutlined /> },
      { label: 'Package Price', value: user?.selectedPackagePrice ? formatMoney(user.selectedPackagePrice) : 'Data not available', icon: <ToolOutlined /> },
      { label: 'Package Expires', value: formatPackageExpiry(user?.selectedPackageExpiresAt), icon: <CalendarOutlined /> },
      { label: 'Templates Used', value: `${templateUsage.used} / ${templateUsage.limit || 0} templates used`, icon: <ToolOutlined /> },
    ] : [
      { label: 'Login Email', value: fallback(loginEmail), icon: <MailOutlined /> },
    ]),
    { label: 'Joined', value: formatDate(user?.createdAt), icon: <CalendarOutlined /> },
    { label: 'Last Login', value: formatDate(user?.lastLoginAt), icon: <CalendarOutlined /> },
  ];

  return (
    <div className="settings-premium-page">
      <section className="settings-hero-banner">
        <div className="settings-hero-glow" />
        <div className="settings-hero-glow settings-hero-glow-secondary" />
        <div className="settings-hero-content">
          <div>
            <span className="settings-hero-badge"><ToolOutlined /> Premium Settings</span>
            <h1>Control your account with <span className="text-gradient">premium clarity.</span></h1>
            <p>Manage profile details, security, and account actions from one place.</p>
            <div className="settings-status-row">
              <span><UserOutlined /> {fallback(user?.name)}</span>
              <span><SafetyCertificateOutlined /> {fallback(user?.role)}</span>
              <span><ShopOutlined /> {formatAccountType(user?.accountType)}</span>
            </div>
          </div>
          <div className="settings-quick-actions">
            <a href="#profile-settings">Profile</a>
            <a href="#account-settings">Account</a>
          </div>
        </div>
      </section>

      <section id="profile-settings" className="settings-section-grid">
        <div className="settings-card settings-profile-card">
          <div className="settings-card-heading">
            <span><UserOutlined /></span>
            <div>
              <small>Account Profile Settings</small>
              <h2>Edit profile</h2>
              <p>Only your name is editable here. Other account details are view-only for safety.</p>
            </div>
          </div>

          <Form layout="vertical" initialValues={{ name: user?.name }} onFinish={saveProfile} className="settings-form">
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
              <Input size="large" prefix={<UserOutlined />} placeholder="Enter your name" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={profileLoading} className="settings-primary-btn">
              Save Profile
            </Button>
          </Form>
        </div>

        <div className="settings-card">
          <div className="settings-card-heading">
            <span><LockOutlined /></span>
            <div>
              <small>Security</small>
              <h2>Update password</h2>
              <p>Use a strong password with at least 8 characters.</p>
            </div>
          </div>

          <Form form={passwordForm} layout="vertical" onFinish={savePassword} className="settings-form">
            <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: 'Current password is required' }]}>
              <Input.Password size="large" placeholder="Current password" />
            </Form.Item>
            <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8, message: 'New password must be at least 8 characters' }]}>
              <Input.Password size="large" placeholder="New password" />
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
              <Input.Password size="large" placeholder="Confirm password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={passwordLoading} className="settings-primary-btn">
              Update Password
            </Button>
          </Form>
        </div>
      </section>

      <section className="settings-card settings-details-card">
        <div className="settings-card-heading">
          <span><SafetyCertificateOutlined /></span>
          <div>
            <small>View Only Details</small>
            <h2>Your account information</h2>
            <p>These details are protected and shown here for reference.</p>
          </div>
        </div>
        <div className="settings-detail-grid">
          {profileDetails.map((detail) => (
            <div className="settings-detail-tile" key={detail.label}>
              <span>{detail.icon}</span>
              <small>{detail.label}</small>
              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="account-settings" className="settings-section-grid">
        <div className="settings-card settings-action-card">
          <div className="settings-card-heading">
            <span><LogoutOutlined /></span>
            <div>
              <small>Account Settings</small>
              <h2>Logout</h2>
              <p>End your current session and return to the login page.</p>
            </div>
          </div>
          <Button size="large" icon={<LogoutOutlined />} loading={logoutLoading} onClick={logout} className="settings-secondary-btn">
            Logout Account
          </Button>
        </div>

        <div className="settings-card settings-danger-card">
          <div className="settings-card-heading">
            <span><DeleteOutlined /></span>
            <div>
              <small>Danger Zone</small>
              <h2>Delete account</h2>
              <p>This will permanently delete your login account. Use a test account before trying this action.</p>
            </div>
          </div>
          <Button danger size="large" icon={<DeleteOutlined />} onClick={() => setDeleteOpen(true)} className="settings-danger-btn">
            Delete Account
          </Button>
        </div>
      </section>

      <Modal
        title={null}
        open={deleteOpen}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteConfirm('');
          deleteForm.resetFields();
        }}
        footer={null}
        centered
        className="settings-delete-modal"
      >
        <div className="settings-delete-header">
          <span><ExclamationCircleOutlined /></span>
          <h2>Delete account?</h2>
          <p>This action cannot be undone. Enter your current password and type DELETE to confirm.</p>
        </div>
        <Form form={deleteForm} layout="vertical" onFinish={removeAccount}>
          <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: 'Current password is required' }]}>
            <Input.Password size="large" placeholder="Current password" />
          </Form.Item>
          <Form.Item label="Type DELETE to confirm" required>
            <Input size="large" value={deleteConfirm} onChange={(event) => setDeleteConfirm(event.target.value)} placeholder="DELETE" />
          </Form.Item>
          <Button danger type="primary" htmlType="submit" loading={deleteLoading} disabled={deleteConfirm !== 'DELETE'} block size="large">
            Permanently Delete Account
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
