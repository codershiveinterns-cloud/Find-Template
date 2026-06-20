'use client';

import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ProjectOutlined,
  SyncOutlined,
  CalendarOutlined,
  UserOutlined,
  AppstoreOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  FolderOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getMe } from '@/lib/api/auth';
import { createProject, deleteProject, getProjects } from '@/lib/api/projects';
import { getApiError } from '@/lib/api/client';
import { notifyError, notifySuccess } from '@/lib/notify';

const statusOptions = [
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
];

const filterOptions = [
  { label: 'Total Projects', value: 'all' },
  ...statusOptions,
];

const statusLabel = (status) => statusOptions.find((item) => item.value === status)?.label || status;

const statusConfig = {
  in_progress: { color: '#0891b2', bg: '#ecfeff', border: 'rgba(34,211,238,0.3)', label: 'In Progress' },
  completed: { color: '#059669', bg: '#ecfdf5', border: 'rgba(5,150,105,0.3)', label: 'Completed' },
  pending: { color: '#d97706', bg: '#fffbeb', border: 'rgba(217,119,6,0.3)', label: 'Pending' },
};

export default function ProjectsDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [viewProject, setViewProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const selectedTemplate = Form.useWatch('templateName', form);
  const isAdmin = user?.role === 'admin';

  const loadProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      notifyError('Projects Load Failed', getApiError(error));
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe();
        setUser(response.data || null);
      } catch (error) {
        notifyError('Profile Load Failed', getApiError(error));
      }
    };

    loadUser();
    loadProjects();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const draft = localStorage.getItem('projectDraft');
    const template = localStorage.getItem('selectedProjectTemplate');

    if (draft || template) {
      if (draft) form.setFieldsValue(JSON.parse(draft));
      if (template) {
        const parsedTemplate = JSON.parse(template);
        form.setFieldsValue({
          templateKey: parsedTemplate.key,
          templateName: parsedTemplate.name,
          templateType: parsedTemplate.type,
        });
        localStorage.removeItem('selectedProjectTemplate');
      }
      setOpen(true);
    }
  }, [form, isAdmin]);

  const stats = useMemo(() => ({
    total: projects.length,
    in_progress: projects.filter((project) => project.status === 'in_progress').length,
    completed: projects.filter((project) => project.status === 'completed').length,
    pending: projects.filter((project) => project.status === 'pending').length,
  }), [projects]);

  const filteredProjects = filter === 'all' ? projects : projects.filter((project) => project.status === filter);

  const openFreshProjectForm = () => {
    localStorage.removeItem('projectDraft');
    localStorage.removeItem('selectedProjectTemplate');
    form.resetFields();
    form.setFieldsValue({ status: 'pending' });
    setOpen(true);
  };

  const openAddTemplate = () => {
    localStorage.setItem('projectDraft', JSON.stringify(form.getFieldsValue()));
    router.push('/dashboard/projects/add-template');
  };

  const submitProject = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        budget: Number(values.budget || 0),
      };
      await createProject(payload);
      notifySuccess('Project Added', 'Project added successfully.');
      localStorage.removeItem('projectDraft');
      form.resetFields();
      setOpen(false);
      await loadProjects();
    } catch (error) {
      notifyError('Project Add Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (project) => {
    try {
      await deleteProject(project._id);
      notifySuccess('Project Deleted', 'Project deleted successfully.');
      await loadProjects();
    } catch (error) {
      notifyError('Delete Failed', getApiError(error));
    }
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="proj-table-name">
          <FolderOutlined className="proj-table-name-icon" />
          {text}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status] || {};
        return (
          <Tag
            style={{
              color: config.color,
              background: config.bg,
              border: `1px solid ${config.border}`,
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 12,
              padding: '4px 14px',
            }}
          >
            {config.label || status}
          </Tag>
        );
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Data not available',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Data not available',
    },
    { title: 'Client Name', dataIndex: 'clientName', key: 'clientName' },
    {
      title: 'Assign Members',
      key: 'assignedMembers',
      render: (_, record) => {
        const count = record.assignedMembersCount ?? record.assignedMembers?.length ?? 0;
        return <Tag className="team-count-tag">{count} Members</Tag>;
      },
    },
    ...(isAdmin ? [
      {
        title: 'Budget',
        dataIndex: 'budget',
        key: 'budget',
        render: (value) => `$${Number(value || 0).toLocaleString()}`,
      },
    ] : []),
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            className="proj-go-btn"
            onClick={() => router.push(`/dashboard/projects/${record._id}`)}
          >
            Go to Project <ArrowRightOutlined />
          </Button>
          {isAdmin && (
            <Tooltip title="Delete Project">
              <Button
                className="proj-action-btn proj-delete-btn"
                icon={<DeleteOutlined />}
                onClick={() => removeProject(record)}
                danger
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const statCards = [
    { key: 'total', label: 'Total Projects', icon: <ProjectOutlined />, value: stats.total, theme: 'blue' },
    { key: 'in_progress', label: 'In Progress', icon: <SyncOutlined />, value: stats.in_progress, theme: 'cyan' },
    { key: 'completed', label: 'Completed', icon: <CheckCircleOutlined />, value: stats.completed, theme: 'emerald' },
    { key: 'pending', label: 'Pending', icon: <ClockCircleOutlined />, value: stats.pending, theme: 'amber' },
  ];

  return (
    <div className="proj-premium-page">
      {/* Hero Banner */}
      <div className="proj-hero-banner">
        <div className="proj-hero-glow" />
        <div className="proj-hero-glow-2" />
        <div className="proj-hero-content">
          <div className="proj-hero-left">
            <span className="proj-hero-badge">
              <RocketOutlined /> {isAdmin ? 'Project Management' : 'Assigned Projects'}
            </span>
            <h1 className="proj-hero-title">
              {isAdmin ? 'Track every project with ' : 'Open your assigned work with '}
              <span className="text-gradient">precision.</span>
            </h1>
            <p className="proj-hero-subtitle">
              {isAdmin
                ? 'Create, manage, and monitor all your projects in one organized workspace. Stay on top of deadlines and deliverables.'
                : 'Only projects assigned to your account are visible here. Open your assigned project and continue your work.'}
            </p>
          </div>
          {isAdmin && (
            <div className="proj-hero-right">
              <button type="button" className="proj-hero-add-btn" onClick={openFreshProjectForm}>
                <PlusOutlined /> New Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="proj-stats-section">
        <Row gutter={[16, 16]}>
          {statCards.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.key}>
              <div
                className={`proj-stat-card proj-stat-${item.theme}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setFilter(item.key === 'total' ? 'all' : item.key)}
              >
                <div className="proj-stat-card-inner">
                  <span className={`proj-stat-icon proj-stat-icon-${item.theme}`}>
                    {item.icon}
                  </span>
                  <div className="proj-stat-info">
                    <span className="proj-stat-label">{item.label}</span>
                    <strong className="proj-stat-value">{item.value}</strong>
                  </div>
                </div>
                <div className={`proj-stat-bar proj-stat-bar-${item.theme}`} />
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Toolbar + Table */}
      <div className="proj-table-section">
        <div className="proj-table-header">
          <div className="proj-table-header-left">
            <span className="proj-table-kicker">All Records</span>
            <h2 className="proj-table-title">Projects</h2>
          </div>
          <div className="proj-table-header-right">
            <Select
              value={filter}
              onChange={setFilter}
              options={filterOptions}
              size="large"
              className="proj-filter-select"
            />
          </div>
        </div>

        <div className="proj-table-wrapper">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={filteredProjects}
            pagination={{ pageSize: 6 }}
            className="proj-premium-table"
          />
        </div>
      </div>

      {/* Add Project Modal */}
      <Modal
        title={null}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width={760}
        className="proj-premium-modal"
        forceRender={true}
      >
        <div className="proj-modal-header">
          <span className="proj-modal-badge"><ProjectOutlined /> New Project</span>
          <h2>Create a new project</h2>
          <p>Fill in the details below to add a new project to your workspace.</p>
        </div>
        <Form form={form} layout="vertical" onFinish={submitProject} initialValues={{ status: 'pending' }} requiredMark={false}>
          <Form.Item name="name" label="Project Name" rules={[{ required: true, message: 'Project name is required' }]}>
            <Input size="large" placeholder="Enter project name" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
            <Select size="large" options={statusOptions} />
          </Form.Item>
          <div className="payment-two-col">
            <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
              <Input size="large" type="date" />
            </Form.Item>
            <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'End date is required' }]}>
              <Input size="large" type="date" />
            </Form.Item>
          </div>
          <Form.Item name="clientName" label="Client Name" rules={[{ required: true, message: 'Client name is required' }]}>
            <Input size="large" placeholder="Client name" />
          </Form.Item>
          <Form.Item name="budget" label="Project Budget ($)" rules={[{ required: true, message: 'Budget is required' }]}>
            <Input size="large" type="number" min={0} placeholder="Enter project budget" />
          </Form.Item>

          <Form.Item name="templateKey" hidden><Input /></Form.Item>
          <Form.Item name="templateName" hidden><Input /></Form.Item>
          <Form.Item name="templateType" hidden><Input /></Form.Item>

          <div className="selected-template-row">
            {selectedTemplate ? (
              <div className="proj-selected-template-pill">
                <AppstoreOutlined />
                <span>{form.getFieldValue('templateName')} ({form.getFieldValue('templateType')})</span>
              </div>
            ) : (
              <Button icon={<PlusOutlined />} onClick={openAddTemplate} className="proj-add-template-btn">
                Add Template
              </Button>
            )}
          </div>

          <Button type="primary" htmlType="submit" className="proj-submit-btn" loading={loading} block>
            Create Project <ArrowRightOutlined />
          </Button>
        </Form>
      </Modal>


    </div>
  );
}
