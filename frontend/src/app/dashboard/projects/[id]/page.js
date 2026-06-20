'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Form, Input, Select, Spin, Tabs, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DollarOutlined,
  EditOutlined,
  ProjectOutlined,
  SaveOutlined,
  SyncOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { getMe } from '@/lib/api/auth';
import { getProject, updateProject, updateProjectStatus } from '@/lib/api/projects';
import { getApiError } from '@/lib/api/client';
import { notifyError, notifySuccess } from '@/lib/notify';
import { TEMPLATE_CATALOG } from '@/lib/constants/templateCatalog';

const statusOptions = [
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
];

const statusLabel = (status) => statusOptions.find((item) => item.value === status)?.label || status;

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const isAdmin = user?.role === 'admin';

  const loadProject = async () => {
    try {
      const [projectResponse, profileResponse] = await Promise.all([
        getProject(id),
        getMe(),
      ]);
      setUser(profileResponse.data || null);
      const projData = projectResponse.data || null;
      setProject(projData);
    } catch (error) {
      notifyError('Failed to load project details', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  useEffect(() => {
    if (!project) return;

    const formatForInput = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toISOString().split('T')[0];
    };

    form.setFieldsValue({
      name: project.name,
      clientName: project.clientName,
      status: project.status,
      startDate: formatForInput(project.startDate),
      endDate: formatForInput(project.endDate),
      budget: project.budget,
    });
  }, [form, project]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (isAdmin) {
        const payload = {
          ...values,
          budget: Number(values.budget || 0),
        };
        await updateProject(id, payload);
        notifySuccess('Project Updated', 'Project details saved successfully.');
      } else {
        await updateProjectStatus(id, { status: values.status });
        notifySuccess('Status Updated', 'Project status updated successfully.');
      }
      setIsEditing(false);
      await loadProject();
    } catch (error) {
      notifyError('Failed to save details', getApiError(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="overview-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-no-template">
        <h2>Project not found</h2>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/dashboard/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const templateObj = TEMPLATE_CATALOG.find(
    (t) =>
      (project.templateKey && t.key?.toLowerCase() === project.templateKey?.toLowerCase()) ||
      (project.templateName && t.name?.toLowerCase() === project.templateName?.toLowerCase())
  ) || TEMPLATE_CATALOG.find(
    (t) =>
      (project.templateKey && t.key?.toLowerCase().includes(project.templateKey?.toLowerCase())) ||
      (project.templateName && t.name?.toLowerCase().includes(project.templateName?.toLowerCase()))
  );

  const hasTemplate = !!(project.templateKey || project.templateName);
  const displayName = templateObj?.name || project.templateName || '';
  const displayType = templateObj?.type || project.templateType || 'Template';
  const displayImage = templateObj?.image || TEMPLATE_CATALOG[0].image;

  return (
    <div className="project-detail-page">
      {/* Hero Welcome Banner */}
      <div className="project-detail-hero">
        <div className="project-detail-hero-content">
          <span className="project-detail-badge" onClick={() => router.push('/dashboard/projects')}>
            <ArrowLeftOutlined /> Back to Projects
          </span>
          <h1 className="project-detail-title">{project.name}</h1>
          <p className="project-detail-subtitle">
            Client: <strong>{project.clientName}</strong> &bull; Status: <strong>{statusLabel(project.status)}</strong>
          </p>
        </div>
      </div>

      <div className="project-tab-card">
        <Tabs
          defaultActiveKey="details"
          items={[
            {
              key: 'details',
              label: (
                <span>
                  <ProjectOutlined /> Project Details
                </span>
              ),
              children: (
                <div className="project-tab-content">
                  <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
                    {isEditing ? (
                      <>
                        <div className="project-detail-grid">
                          {isAdmin ? (
                            <>
                              <Form.Item name="name" label="Project Name" rules={[{ required: true, message: 'Project name is required' }]}>
                                <Input size="large" />
                              </Form.Item>
                              <Form.Item name="clientName" label="Client Name" rules={[{ required: true, message: 'Client name is required' }]}>
                                <Input size="large" />
                              </Form.Item>
                              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                                <Select size="large" options={statusOptions} />
                              </Form.Item>
                              <Form.Item name="budget" label="Project Budget ($)" rules={[{ required: true, message: 'Budget is required' }]}>
                                <Input size="large" type="number" min={0} />
                              </Form.Item>
                              <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
                                <Input size="large" type="date" />
                              </Form.Item>
                              <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'End date is required' }]}>
                                <Input size="large" type="date" />
                              </Form.Item>
                            </>
                          ) : (
                            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                              <Select size="large" options={statusOptions} />
                            </Form.Item>
                          )}
                        </div>
                        <div className="project-edit-actions">
                          <Button size="large" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button type="primary" size="large" icon={<SaveOutlined />} htmlType="submit" loading={saving}>
                            {isAdmin ? 'Save Changes' : 'Update Status'}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="project-detail-grid">
                          <div className="project-detail-item">
                            <div className="project-detail-item-icon project-detail-item-blue"><ProjectOutlined /></div>
                            <div className="project-detail-item-info">
                              <small>Project Name</small>
                              <strong>{project.name}</strong>
                            </div>
                          </div>
                          <div className="project-detail-item">
                            <div className="project-detail-item-icon project-detail-item-cyan"><UserOutlined /></div>
                            <div className="project-detail-item-info">
                              <small>Client Name</small>
                              <strong>{project.clientName}</strong>
                            </div>
                          </div>
                          {isAdmin && (
                            <div className="project-detail-item">
                              <div className="project-detail-item-icon project-detail-item-emerald"><DollarOutlined /></div>
                              <div className="project-detail-item-info">
                                <small>Budget</small>
                                <strong>${Number(project.budget || 0).toLocaleString()}</strong>
                              </div>
                            </div>
                          )}
                          <div className="project-detail-item">
                            <div className="project-detail-item-icon project-detail-item-amber"><SyncOutlined /></div>
                            <div className="project-detail-item-info">
                              <small>Status</small>
                              <strong>{statusLabel(project.status)}</strong>
                            </div>
                          </div>
                          <div className="project-detail-item">
                            <div className="project-detail-item-icon project-detail-item-blue"><CalendarOutlined /></div>
                            <div className="project-detail-item-info">
                              <small>Start Date</small>
                              <strong>{new Date(project.startDate).toLocaleDateString()}</strong>
                            </div>
                          </div>
                          <div className="project-detail-item">
                            <div className="project-detail-item-icon project-detail-item-cyan"><CalendarOutlined /></div>
                            <div className="project-detail-item-info">
                              <small>End Date</small>
                              <strong>{new Date(project.endDate).toLocaleDateString()}</strong>
                            </div>
                          </div>
                          <div className="project-detail-item project-assigned-members-card">
                            <div className="project-detail-item-icon project-detail-item-blue"><UserOutlined /></div>
                            <div className="project-detail-item-info">
                              <small>Assign Members</small>
                              {project.assignedMembers?.length ? (
                                <div className="project-assigned-members-list">
                                  {project.assignedMembers.map((member) => (
                                    <Tag key={member._id || member.email} className="team-count-tag">
                                      {member.name} — {member.role}
                                    </Tag>
                                  ))}
                                </div>
                              ) : (
                                <strong>No members assigned</strong>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="project-edit-actions">
                          <Button type="primary" size="large" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                            {isAdmin ? 'Edit Details' : 'Edit Status'}
                          </Button>
                        </div>
                      </>
                    )}
                  </Form>
                </div>
              ),
            },
            {
              key: 'template',
              label: (
                <span>
                  <AppstoreOutlined /> {isAdmin ? 'Edit Template' : 'View Template'}
                </span>
              ),
              children: (
                <div className="project-tab-content">
                  {hasTemplate ? (
                    <div className="project-template-view">
                      <div className="project-template-info">
                        <h3>{displayName}</h3>
                        <span className="project-template-type-tag">{displayType}</span>
                      </div>
                      <div className="project-template-img-container">
                        <Image src={displayImage} alt={displayName} className="project-template-image" />
                      </div>
                    </div>
                  ) : (
                    <div className="project-no-template">
                      <p>No template attached to this project.</p>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
