'use client';

import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd';
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { createInvoice, deleteInvoice, getInvoices, updateInvoice } from '@/lib/api/invoices';
import { getApiError } from '@/lib/api/client';
import { notifyError, notifySuccess } from '@/lib/notify';

const GST_RATE = 18;
const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'Data not available');
const formatForInput = (value) => (value ? new Date(value).toISOString().split('T')[0] : '');
const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;
const calculateGst = (amount) => Number(((Number(amount || 0) * GST_RATE) / 100).toFixed(2));
const calculateTotal = (amount) => Number((Number(amount || 0) + calculateGst(amount)).toFixed(2));

const statusOptions = [
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
];

const statusConfig = {
  paid: { color: '#059669', bg: '#ecfdf5', border: 'rgba(5,150,105,0.3)', label: 'Paid' },
  pending: { color: '#d97706', bg: '#fffbeb', border: 'rgba(217,119,6,0.3)', label: 'Pending' },
};

export default function InvoicesDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const amount = Form.useWatch('amount', form);

  const loadInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      notifyError('Invoices Load Failed', getApiError(error));
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    if (!open) return;

    const gstAmount = calculateGst(amount);
    form.setFieldsValue({
      gstAmount,
      totalAmount: calculateTotal(amount),
    });
  }, [amount, form, open]);

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    if (editingInvoice) {
      form.setFieldsValue({
        clientName: editingInvoice.clientName,
        projectName: editingInvoice.projectName,
        amount: editingInvoice.amount,
        gstAmount: editingInvoice.gstAmount ?? calculateGst(editingInvoice.amount),
        totalAmount: editingInvoice.totalAmount ?? calculateTotal(editingInvoice.amount),
        dueDate: formatForInput(editingInvoice.dueDate),
        status: ['paid', 'pending'].includes(editingInvoice.status) ? editingInvoice.status : 'pending',
      });
      return;
    }

    form.setFieldsValue({ status: 'pending', gstAmount: 0, totalAmount: 0 });
  }, [editingInvoice, form, open]);

  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter((invoice) => invoice.status === 'paid').length,
    pending: invoices.filter((invoice) => invoice.status !== 'paid').length,
  }), [invoices]);

  const openCreateForm = () => {
    setEditingInvoice(null);
    setOpen(true);
  };

  const openEditForm = (invoice) => {
    setEditingInvoice(invoice);
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setEditingInvoice(null);
  };

  const submitInvoice = async (values) => {
    setLoading(true);
    try {
      const payload = {
        clientName: values.clientName,
        projectName: values.projectName,
        amount: Number(values.amount || 0),
        dueDate: values.dueDate,
        status: values.status,
      };

      if (editingInvoice) {
        await updateInvoice(editingInvoice._id, payload);
        notifySuccess('Invoice Updated', 'Invoice details saved successfully.');
      } else {
        await createInvoice(payload);
        notifySuccess('Invoice Added', 'Invoice added successfully.');
      }

      form.resetFields();
      closeForm();
      await loadInvoices();
    } catch (error) {
      notifyError(editingInvoice ? 'Update Failed' : 'Invoice Add Failed', getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const removeInvoice = async (invoice) => {
    try {
      await deleteInvoice(invoice._id);
      notifySuccess('Invoice Deleted', 'Invoice deleted successfully.');
      await loadInvoices();
    } catch (error) {
      notifyError('Delete Failed', getApiError(error));
    }
  };

  const columns = [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      width: 220,
      render: (text) => (
        <span className="proj-table-name">
          <FileTextOutlined className="proj-table-name-icon" />
          {text}
        </span>
      ),
      exportValue: (record) => record.clientName,
    },
    { title: 'Project Name', dataIndex: 'projectName', key: 'projectName', width: 220 },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      render: formatCurrency,
      exportValue: (record) => formatCurrency(record.amount),
    },
    {
      title: 'GST (18%)',
      dataIndex: 'gstAmount',
      key: 'gstAmount',
      width: 140,
      render: formatCurrency,
      exportValue: (record) => formatCurrency(record.gstAmount),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 160,
      render: formatCurrency,
      exportValue: (record) => formatCurrency(record.totalAmount),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 140,
      render: formatDate,
      exportValue: (record) => formatDate(record.dueDate),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => {
        const config = statusConfig[status] || statusConfig.pending;
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
            {config.label}
          </Tag>
        );
      },
      exportValue: (record) => statusConfig[record.status]?.label || record.status,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      exportable: false,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Invoice">
            <Button className="proj-action-btn" icon={<EditOutlined />} onClick={() => openEditForm(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete invoice?"
            description="This invoice record will be removed."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => removeInvoice(record)}
          >
            <Button className="proj-action-btn proj-delete-btn" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const statCards = [
    { key: 'total', label: 'Total Invoices', icon: <FileTextOutlined />, value: stats.total, theme: 'blue' },
    { key: 'paid', label: 'Paid Invoices', icon: <CheckCircleOutlined />, value: stats.paid, theme: 'emerald' },
    { key: 'pending', label: 'Pending Invoices', icon: <ClockCircleOutlined />, value: stats.pending, theme: 'amber' },
  ];

  return (
    <div className="proj-premium-page invoices-premium-page">
      <div className="proj-hero-banner">
        <div className="proj-hero-glow" />
        <div className="proj-hero-glow-2" />
        <div className="proj-hero-content">
          <div className="proj-hero-left">
            <span className="proj-hero-badge">
              <RocketOutlined /> Invoice Management
            </span>
            <h1 className="proj-hero-title">
              Manage every invoice with <span className="text-gradient">premium precision.</span>
            </h1>
            <p className="proj-hero-subtitle">
              Create polished invoices, auto-calculate GST, and track paid or pending status from one clean workspace.
            </p>
          </div>
          <div className="proj-hero-right">
            <button type="button" className="proj-hero-add-btn" onClick={openCreateForm}>
              <PlusOutlined /> Add Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="proj-stats-section">
        <div className="overview-stats-grid clients-stats-grid">
          {statCards.map((item) => (
            <div className={`proj-stat-card proj-stat-${item.theme}`} key={item.key}>
              <div className="proj-stat-card-inner">
                <span className={`proj-stat-icon proj-stat-icon-${item.theme}`}>{item.icon}</span>
                <div className="proj-stat-info">
                  <span className="proj-stat-label">{item.label}</span>
                  <strong className="proj-stat-value">{item.value}</strong>
                </div>
              </div>
              <div className={`proj-stat-bar proj-stat-bar-${item.theme}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="proj-table-section">
        <div className="proj-table-header">
          <div className="proj-table-header-left">
            <span className="proj-table-kicker">Invoice Records</span>
            <h2 className="proj-table-title">Invoices</h2>
          </div>
        </div>
        <div className="proj-table-wrapper">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={invoices}
            pagination={{ pageSize: 6 }}
            scroll={{ x: 'max-content' }}
            className="proj-premium-table"
          />
        </div>
      </div>

      <Modal
        title={null}
        open={open}
        onCancel={closeForm}
        footer={null}
        centered
        width={820}
        className="proj-premium-modal"
        forceRender={true}
      >
        <div className="proj-modal-header">
          <span className="proj-modal-badge"><FileTextOutlined /> {editingInvoice ? 'Edit Invoice' : 'Add Invoice'}</span>
          <h2>{editingInvoice ? 'Update invoice details' : 'Create a new invoice'}</h2>
          <p>Enter the invoice amount and GST + total amount will be calculated automatically.</p>
        </div>
        <Form form={form} layout="vertical" onFinish={submitInvoice} requiredMark={false}>
          <div className="payment-two-col">
            <Form.Item name="clientName" label="Client Name" rules={[{ required: true, message: 'Client name is required' }]}>
              <Input size="large" placeholder="Enter client name" />
            </Form.Item>
            <Form.Item name="projectName" label="Project Name" rules={[{ required: true, message: 'Project name is required' }]}>
              <Input size="large" placeholder="Enter project name" />
            </Form.Item>
          </div>
          <div className="payment-two-col">
            <Form.Item name="amount" label="Amount ($)" rules={[{ required: true, message: 'Amount is required' }]}>
              <Input size="large" type="number" min={0} placeholder="Enter invoice amount" />
            </Form.Item>
            <Form.Item name="gstAmount" label="GST 18% ($)">
              <Input size="large" type="number" disabled prefix="$" />
            </Form.Item>
          </div>
          <div className="payment-two-col">
            <Form.Item name="totalAmount" label="Total Amount ($)">
              <Input size="large" type="number" disabled prefix="$" />
            </Form.Item>
            <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Due date is required' }]}>
              <Input size="large" type="date" />
            </Form.Item>
          </div>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
            <Select size="large" options={statusOptions} />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="proj-submit-btn" loading={loading} block>
            {editingInvoice ? 'Save Invoice' : 'Save Invoice'} <ArrowRightOutlined />
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
