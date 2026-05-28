import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, Typography, Button, Space, Table } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getNexus } from '../../api';
import { Nexus } from '../../types';
import StatusBadge from '../../components/StatusBadge';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function NexusDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nexus, setNexus] = useState<Nexus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getNexus(id)
      .then(setNexus)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;
  if (!nexus) return <Typography.Text type="danger">Nexus 未找到</Typography.Text>;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/nexuses')}>返回</Button>
      </Space>

      <Card title={<span>Nexus 详情 <Typography.Text copyable>{nexus.uuid}</Typography.Text></span>}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="节点">{nexus.node}</Descriptions.Item>
          <Descriptions.Item label="名称">{nexus.name}</Descriptions.Item>
          <Descriptions.Item label="状态"><StatusBadge status={nexus.status} /></Descriptions.Item>
          <Descriptions.Item label="大小">{formatBytes(nexus.size)}</Descriptions.Item>
          <Descriptions.Item label="设备 URI">{nexus.deviceUri || '-'}</Descriptions.Item>
          <Descriptions.Item label="重建任务">{nexus.rebuilds}</Descriptions.Item>
          <Descriptions.Item label="共享协议">{nexus.share === 'None' ? '未共享' : nexus.share}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="子设备" style={{ marginTop: 16 }}>
        <Table
          dataSource={nexus.children}
          rowKey="uri"
          pagination={false}
          columns={[
            { title: 'URI', dataIndex: 'uri', key: 'uri' },
            { title: '状态', dataIndex: 'state', key: 'state', render: (s: string) => <StatusBadge status={s} /> },
            {
              title: '重建进度',
              dataIndex: 'rebuildProgress',
              key: 'rebuildProgress',
              render: (v: number | undefined) => (v !== undefined ? `${v}%` : '-'),
            },
          ]}
        />
      </Card>
    </div>
  );
}
