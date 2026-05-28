import { useEffect, useState } from 'react';
import { Table, Spin, Typography } from 'antd';
import { getReplicas } from '../../api';
import { Replica } from '../../types';
import StatusBadge from '../../components/StatusBadge';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function ReplicasPage() {
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getReplicas()
      .then((data) => { if (!cancelled) setReplicas(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;

  return (
    <div>
      <Typography.Title level={4}>副本</Typography.Title>
      <Table
        dataSource={replicas}
        rowKey="uuid"
        columns={[
          { title: 'UUID', dataIndex: 'uuid', key: 'uuid', width: 280 },
          { title: '节点', dataIndex: 'node', key: 'node' },
          { title: '存储池', dataIndex: 'pool', key: 'pool' },
          {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: '精简配置',
            dataIndex: 'thin',
            key: 'thin',
            render: (v: boolean) => (v ? '是' : '否'),
          },
          {
            title: '协议',
            dataIndex: 'share',
            key: 'share',
            render: (s: string) => (s === 'None' ? '未共享' : s),
          },
          { title: 'URI', dataIndex: 'uri', key: 'uri', ellipsis: true },
        ]}
      />
    </div>
  );
}
