import { useEffect, useState } from 'react';
import { Table, Spin, Typography } from 'antd';
import { getNodes } from '../../api';
import { Node } from '../../types';
import StatusBadge from '../../components/StatusBadge';

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getNodes()
      .then((data) => { if (!cancelled) setNodes(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;

  return (
    <div>
      <Typography.Title level={4}>节点</Typography.Title>
      <Table
        dataSource={nodes}
        rowKey="id"
        columns={[
          { title: 'ID', dataIndex: 'id', key: 'id' },
          {
            title: '状态',
            dataIndex: ['state', 'status'],
            key: 'status',
            render: (s: string) => <StatusBadge status={s} />,
          },
          { title: 'gRPC 端点', dataIndex: ['state', 'grpcEndpoint'], key: 'grpcEndpoint' },
        ]}
      />
    </div>
  );
}
