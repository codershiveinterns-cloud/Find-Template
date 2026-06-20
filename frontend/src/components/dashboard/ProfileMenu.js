'use client';

import { Button, Drawer, Form, Input, Modal, Space } from 'antd';
import { EditOutlined, LockOutlined, LogoutOutlined, MailOutlined, SafetyCertificateOutlined, ShopOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/api/auth';
import { getApiError } from '@/lib/api/client';
import { updatePassword, updateProfile } from '@/lib/api/profile';
import { formatAccountType } from '@/lib/constants/roles';
import { formatPackage } from '@/lib/constants/packages';
import { notifyError, notifySuccess } from '@/lib/notify';

export default function ProfileMenu({ user, onProfileUpdated }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    await logoutUser();
    router.push('/auth/login');
  };

  const saveProfile = async (values) => {
    setLoading(true);
    try {
      const response = await updateProfile(values);
      notifySuccess('Profile Updated', 'Your profile name has been updated successfully.');
      onProfileUpdated(response.data);
      setEditOpen(false);
    } catch (error) {
      notifyError('Profile Update Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (values) => {
    setLoading(true);
    try {
      await updatePassword(values);
      notifySuccess('Password Updated', 'Your account password has been updated successfully.');
      setPasswordOpen(false);
    } catch (error) {
      notifyError('Password Update Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const profileDetails = [
    { label: 'Name', value: user?.name || 'Data not available', icon: <UserOutlined /> },
    { label: 'Email', value: user?.email || 'Data not available', icon: <MailOutlined /> },
    { label: 'Account Type', value: formatAccountType(user?.accountType), icon: <ShopOutlined /> },
    { label: 'Role', value: user?.role || 'Data not available', icon: <SafetyCertificateOutlined /> },
    ...(isAdmin ? [{ label: 'Package', value: formatPackage(user?.selectedPackage, user?.selectedPackageBilling, user?.selectedPackagePrice), icon: <ToolOutlined /> }] : []),
    { label: 'Company Email', value: user?.companyEmail || 'Data not available', icon: <MailOutlined /> },
  ];

  return (
    <>
      <button type="button" className="profile-trigger" onClick={() => setOpen(true)}>
        <span className="profile-avatar"><UserOutlined /></span>
        <span className="profile-trigger-text">
          <strong>{user?.name || 'Admin Profile'}</strong>
          <small>{user?.role || 'admin'}</small>
        </span>
      </button>

      <Drawer
        title={
          <div className="profile-drawer-title clean">
            <span className="profile-avatar large"><UserOutlined /></span>
            <div>
              <strong>{user?.name || 'Admin Profile'}</strong>
            </div>
          </div>
        }
        open={open}
        onClose={() => setOpen(false)}
        size="large"
        className="profile-drawer"
      >
        <div className="profile-details-grid">
          {profileDetails.map((detail) => (
            <div className="profile-detail-card" key={detail.label}>
              <span className="profile-detail-icon">{detail.icon}</span>
              <div>
                <small>{detail.label}</small>
                <strong>{detail.value}</strong>
              </div>
            </div>
          ))}
        </div>

        <Space className="profile-actions">
          <Button className="profile-action-btn" type="primary" icon={<EditOutlined />} onClick={() => setEditOpen(true)}>Edit Profile</Button>
          <Button className="profile-action-btn" icon={<LockOutlined />} onClick={() => setPasswordOpen(true)}>Update Password</Button>
          <Button className="profile-action-btn" danger icon={<LogoutOutlined />} onClick={logout}>Logout</Button>
        </Space>
      </Drawer>

      <Modal title="Edit Profile" open={editOpen} onCancel={() => setEditOpen(false)} footer={null} centered>
        <Form layout="vertical" initialValues={{ name: user?.name }} onFinish={saveProfile}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input size="large" />
          </Form.Item>
          <Button className="auth-submit-btn" type="primary" htmlType="submit" loading={loading} block>Save Profile</Button>
        </Form>
      </Modal>

      <Modal title="Update Password" open={passwordOpen} onCancel={() => setPasswordOpen(false)} footer={null} centered>
        <Form layout="vertical" onFinish={savePassword}>
          <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8 }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Button className="auth-submit-btn" type="primary" htmlType="submit" loading={loading} block>Update Password</Button>
        </Form>
      </Modal>
    </>
  );
}
