'use client';

import { Card, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getApiError } from '@/lib/api/client';
import { getCollection } from '@/lib/api/dashboard';
import EmptyState from './EmptyState';
import { notifyError } from '@/lib/notify';

export default function CollectionPage({ title, resource, description }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getCollection(resource);
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        notifyError('Data Load Failed', getApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [resource]);

  if (loading) return <Spin />;

  return (
    <div>
      <Typography.Title level={2}>{title}</Typography.Title>
      <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="collection-grid">
          {items.map((item) => (
            <Card className="nex-card" title={item.name || item.invoiceNumber || 'Data not available'} key={item._id || item.id || item.name}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{JSON.stringify(item, null, 2)}</pre>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
