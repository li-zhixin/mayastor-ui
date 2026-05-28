import { useEffect, useState } from 'react';
import { Table, Spin, Typography, Progress } from 'antd';
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
      <Typography.Title level={4}>存储池</Typography.Title>
      <Table
        dataSource={pools}
        rowKey={(r) => r.id}
        columns={[
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: '节点', dataIndex: ['state', 'node'], key: 'node' },
          {
            title: '状态',
            dataIndex: ['state', 'status'],
            key: 'status',
            render: (s: string) => <StatusBadge status={s} />,
          },
          {
            title: '容量',
            dataIndex: ['state', 'capacity'],
            key: 'capacity',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: '已用',
            dataIndex: ['state', 'used'],
            key: 'used',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: '使用率',
            key: 'usage',
            render: (_: unknown, record: Pool) => {
              const cap = record.state?.capacity || 0;
              const used = record.state?.used || 0;
              const pct = cap > 0 ? Math.round((used / cap) * 100) : 0;
              return <Progress percent={pct} size="small" />;
            },
          },
          {
            title: '磁盘',
            dataIndex: ['state', 'disks'],
            key: 'disks',
            render: (disks: string[]) => disks?.join(', ') || '-',
          },
        ]}
      />
    </div>
  );
}
