import { useEffect, useState } from 'react';
import { Table, Spin, Typography, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { getPools } from '../../api';
import { Pool } from '../../types';
import StatusBadge from '../../components/StatusBadge';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function PoolsPage() {
  const { t } = useTranslation();
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPools()
      .then((data) => { if (!cancelled) setPools(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;

  return (
    <div>
      <Typography.Title level={4}>{t('pools.title')}</Typography.Title>
      <Table
        dataSource={pools}
        rowKey={(r) => r.id}
        columns={[
          { title: t('common.labels.id'), dataIndex: 'id', key: 'id' },
          { title: t('pools.columns.node'), dataIndex: ['state', 'node'], key: 'node' },
          {
            title: t('pools.columns.status'),
            dataIndex: ['state', 'status'],
            key: 'status',
            render: (s: string) => <StatusBadge status={s} />,
          },
          {
            title: t('pools.columns.capacity'),
            dataIndex: ['state', 'capacity'],
            key: 'capacity',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: t('pools.columns.used'),
            dataIndex: ['state', 'used'],
            key: 'used',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: t('pools.columns.usage'),
            key: 'usage',
            render: (_: unknown, record: Pool) => {
              const cap = record.state?.capacity || 0;
              const used = record.state?.used || 0;
              const pct = cap > 0 ? Math.round((used / cap) * 100) : 0;
              return <Progress percent={pct} size="small" />;
            },
          },
          {
            title: t('pools.columns.disks'),
            dataIndex: ['state', 'disks'],
            key: 'disks',
            render: (disks: string[]) => disks?.join(', ') || '-',
          },
        ]}
      />
    </div>
  );
}
