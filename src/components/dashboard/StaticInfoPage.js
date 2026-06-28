'use client';

import { Typography } from 'antd';
import EmptyState from './EmptyState';

export default function StaticInfoPage({ title, description }) {
  return (
    <div>
      <Typography.Title level={2}>{title}</Typography.Title>
      <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
      <EmptyState />
    </div>
  );
}
