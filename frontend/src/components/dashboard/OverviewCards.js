'use client';

import { Select, Spin } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  AuditOutlined,
  DollarOutlined,
  FileTextOutlined,
  RocketOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { getMe } from '@/lib/api/auth';
import { getOverview, getChartData } from '@/lib/api/dashboard';
import { getApiError } from '@/lib/api/client';
import { getUserAllowedDashboardKeys } from '@/lib/dashboardAccess';
import { notifyError } from '@/lib/notify';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const statItems = [
  {
    key: 'projects',
    label: 'Total Projects',
    description: 'Active and completed',
    icon: <ProjectOutlined />,
    theme: 'blue',
  },
  {
    key: 'teams',
    label: 'Total Teams',
    description: 'Collaborating now',
    icon: <TeamOutlined />,
    theme: 'cyan',
  },
  {
    key: 'clients',
    label: 'Total Clients',
    description: 'Business relationships',
    icon: <AuditOutlined />,
    theme: 'purple',
  },
  {
    key: 'invoices',
    label: 'Total Invoices',
    description: 'Billing records',
    icon: <FileTextOutlined />,
    theme: 'amber',
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    description: 'All project budgets',
    icon: <DollarOutlined />,
    theme: 'emerald',
    isCurrency: true,
  },
];



function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`;
}

function ChartBar({ value, maxValue, className }) {
  const [height, setHeight] = useState('0%');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeight(`${(value / maxValue) * 100}%`);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, maxValue]);

  return (
    <div
      className={className}
      style={{ height }}
    />
  );
}

function BarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-state">
        <BarChartOutlined />
        <p>No project data available yet</p>
      </div>
    );
  }

  const maxProjects = Math.max(...data.map((d) => d.projects), 1);
  const maxBudget = Math.max(...data.map((d) => d.budget), 1);

  return (
    <div className="chart-bars-container">
      <div className="chart-legend">
        <span className="chart-legend-item">
          <span className="chart-legend-dot chart-legend-dot-blue" />
          Projects (Max: {maxProjects})
        </span>
        <span className="chart-legend-item">
          <span className="chart-legend-dot chart-legend-dot-emerald" />
          Budget (Max: ${maxBudget.toLocaleString()})
        </span>
      </div>
      <div className="chart-bars-scroll">
        <div className="chart-grid-lines">
          <div className="chart-grid-line" />
          <div className="chart-grid-line" />
          <div className="chart-grid-line" />
          <div className="chart-grid-line" />
          <div className="chart-grid-line" />
        </div>
        {data.map((item) => (
          <div className="chart-bar-group" key={item.month}>
            <div className="chart-bar-values">
              {item.projects === 0 && item.budget === 0 ? (
                <span className="chart-bar-val-empty">No Projects & Budget</span>
              ) : (
                <>
                  <span className="chart-bar-val-projects">Projects: {item.projects}</span>
                  <span className="chart-bar-val-budget">Budget: ${item.budget.toLocaleString()}</span>
                </>
              )}
            </div>
            <div className="chart-bar-tracks">
              <div className="chart-bar-track">
                <ChartBar
                  className="chart-bar chart-bar-blue"
                  value={item.projects}
                  maxValue={maxProjects}
                />
              </div>
              <div className="chart-bar-track">
                <ChartBar
                  className="chart-bar chart-bar-emerald"
                  value={item.budget}
                  maxValue={maxBudget}
                />
              </div>
            </div>
            <span className="chart-bar-label">{formatMonthLabel(item.month)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OverviewCards() {
  const [overview, setOverview] = useState({
    projects: 0,
    teams: 0,
    clients: 0,
    invoices: 0,
    services: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [user, setUser] = useState(null);
  const [chartFilter, setChartFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overviewRes, chartRes, profileRes] = await Promise.all([
          getOverview(),
          getChartData(),
          getMe(),
        ]);
        setOverview(
          overviewRes.data || {
            projects: 0,
            teams: 0,
            clients: 0,
            invoices: 0,
            services: 0,
            totalRevenue: 0,
          }
        );
        setChartData(Array.isArray(chartRes.data) ? chartRes.data : []);
        setUser(profileRes.data || null);
      } catch (error) {
        notifyError('Overview Load Failed', getApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filledChartData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (0 = Jan, 5 = Jun)

    const result = [];
    for (let m = 0; m <= currentMonth; m++) {
      const monthStr = String(m + 1).padStart(2, '0');
      const key = `${currentYear}-${monthStr}`;

      const existing = chartData.find((d) => d.month === key);
      if (existing) {
        result.push(existing);
      } else {
        result.push({
          month: key,
          projects: 0,
          budget: 0,
        });
      }
    }
    return result;
  }, [chartData]);

  const monthOptions = useMemo(() => {
    const options = [{ label: 'All Months', value: 'all' }];
    filledChartData.forEach((item) => {
      options.push({ label: formatMonthLabel(item.month), value: item.month });
    });
    return options;
  }, [filledChartData]);

  const filteredChartData = useMemo(() => {
    if (chartFilter === 'all') return filledChartData;
    return filledChartData.filter((item) => item.month === chartFilter);
  }, [filledChartData, chartFilter]);

  const visibleStatItems = useMemo(() => {
    const allowedKeys = getUserAllowedDashboardKeys(user);

    return statItems.filter((item) => {
      if (item.key === 'totalRevenue') return allowedKeys.includes('projects');
      return allowedKeys.includes(item.key);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="overview-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="overview-premium-page">
      {/* Hero Welcome Banner */}
      <div className="overview-hero-banner">
        <div className="overview-hero-glow" />
        <div className="overview-hero-glow-2" />
        <div className="overview-hero-content">
          <div className="overview-hero-left">
            <span className="overview-hero-badge">
              <RocketOutlined /> Dashboard Overview
            </span>
            <h1 className="overview-hero-title">
              Your workspace at a <span className="text-gradient">glance.</span>
            </h1>
            <p className="overview-hero-subtitle">
              Monitor your projects, teams, clients, and invoices — all from one premium command center.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="overview-stats-section">
        <div className="overview-section-label">
          <span>Live Statistics</span>
        </div>
        <div className="overview-stats-grid">
          {visibleStatItems.map((item) => (
            <div className={`overview-stat-card overview-stat-${item.theme}`} key={item.key}>
              <div className="overview-stat-card-inner">
                <span className={`overview-stat-icon overview-stat-icon-${item.theme}`}>
                  {item.icon}
                </span>
                <div className="overview-stat-info">
                  <span className="overview-stat-label">{item.label}</span>
                  <strong className="overview-stat-value">
                    {item.isCurrency
                      ? `$${Number(overview?.[item.key] || 0).toLocaleString()}`
                      : Number(overview?.[item.key] || 0).toLocaleString()}
                  </strong>
                  <small className="overview-stat-desc">{item.description}</small>
                </div>
              </div>
              <div className={`overview-stat-bar overview-stat-bar-${item.theme}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="overview-chart-section">
        <div className="overview-chart-header">
          <div className="overview-chart-header-left">
            <span className="overview-section-label-inline">Analytics</span>
            <h2 className="overview-chart-title">Monthly Projects & Budget</h2>
          </div>
          <Select
            value={chartFilter}
            onChange={setChartFilter}
            options={monthOptions}
            size="large"
            className="overview-chart-filter"
          />
        </div>
        <BarChart data={filteredChartData} />
      </div>    </div>
  );
}
