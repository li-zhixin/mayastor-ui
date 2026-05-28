import { useEffect, useState } from 'react';
import { Table, Spin, Typography } from 'antd';
import { getNexuses } from '../../api';
import { Nexus } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import { useNavigate } from 'react-router-dom';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function NexusesPage() {
  const [nexuses, setNexuses] = useState<Nexus[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    getNexuses()
      .then((data) => { if (!cancelled) setNexuses(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;

  return (
    <div>
      <Typography.Title level={4}>Nexus</Typography.Title>
      <Table
        dataSource={nexuses}
        rowKey="uuid"
        onRow={(record) => ({
          onClick: () => navigate(`/nexuses/${record.uuid}`),
          style: { cursor: 'pointer' },
        })}
        columns={[
          { title: 'UUID', dataIndex: 'uuid', key: 'uuid', width: 280 },
          { title: '节点', dataIndex: 'node', key: 'node' },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => <StatusBadge status={s} />,
          },
          {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: '子设备',
            key: 'children',
            render: (_: unknown, record: Nexus) => {
              const online = record.children.filter((c) => c.state === 'Online').length;
              return `${online} / ${record.children.length}`;
            },
          },
          {
            title: '重建',
            dataIndex: 'rebuilds',
            key: 'rebuilds',
          },
          {
            title: '协议',
            dataIndex: 'share',
            key: 'share',
            render: (s: string) => (s === 'None' ? '未共享' : s),
          },
        ]}
      />
    </div>
  );
}
