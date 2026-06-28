'use client';

import { Empty } from 'antd';

export default function EmptyState({ description = 'Data not available' }) {
  return (
    <div className="empty-state">
      <Empty description={description} />
    </div>
  );
}
