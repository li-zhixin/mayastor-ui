import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getVolume, publishVolume, unpublishVolume, deleteVolume } from '../../api';
import { Volume } from '../../types';
import StatusBadge from '../../components/StatusBadge';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function VolumeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [volume, setVolume] = useState<Volume | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVolume = () => {
    if (!id) return;
    setLoading(true);
    getVolume(id)
      .then(setVolume)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVolume(); }, [id]);

  const handlePublish = async () => {
    if (!id) return;
    await publishVolume(id);
    fetchVolume();
  };

  const handleUnpublish = async () => {
    if (!id) return;
    await unpublishVolume(id);
    fetchVolume();
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteVolume(id);
    navigate('/volumes');
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;
  if (!volume) return <Typography.Text type="danger">卷未找到</Typography.Text>;

  const { spec, state } = volume;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/volumes')}>返回</Button>
      </Space>

      <Card title={<span>卷详情 <Typography.Text copyable>{spec.uuid}</Typography.Text></span>}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="状态">
            <StatusBadge status={state.status} />
          </Descriptions.Item>
          <Descriptions.Item label="大小">{formatBytes(state.size)}</Descriptions.Item>
          <Descriptions.Item label="期望副本数">{spec.replicas}</Descriptions.Item>
          <Descriptions.Item label="发布状态">
            {state.target ? <StatusBadge status="Online" text="已发布" /> : <StatusBadge status="Unknown" text="未发布" />}
          </Descriptions.Item>
          {state.target && (
            <>
              <Descriptions.Item label="Nexus 节点">{state.target.node}</Descriptions.Item>
              <Descriptions.Item label="设备 URI">{state.target.deviceUri || '-'}</Descriptions.Item>
              <Descriptions.Item label="Nexus 状态">
                <StatusBadge status={state.target.status} />
              </Descriptions.Item>
              <Descriptions.Item label="重建任务">{state.target.rebuilds}</Descriptions.Item>
            </>
          )}
        </Descriptions>

        <div style={{ marginTop: 16 }}>
          <Space>
            {!state.target ? (
              <Button type="primary" onClick={handlePublish}>发布</Button>
            ) : (
              <Button onClick={handleUnpublish}>取消发布</Button>
            )}
            <Button danger onClick={handleDelete}>删除卷</Button>
          </Space>
        </div>
      </Card>

      {state.target && state.target.children && state.target.children.length > 0 && (
        <Card title="Nexus 子设备" style={{ marginTop: 16 }}>
          {state.target.children.map((child, i) => (
            <Descriptions key={i} column={2} bordered size="small" style={{ marginBottom: 8 }}>
              <Descriptions.Item label="URI">{child.uri}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <StatusBadge status={child.state} />
              </Descriptions.Item>
              {child.rebuildProgress !== undefined && (
                <Descriptions.Item label="重建进度">{child.rebuildProgress}%</Descriptions.Item>
              )}
            </Descriptions>
          ))}
        </Card>
      )}

      {state.replicaTopology && Object.keys(state.replicaTopology).length > 0 && (
        <Card title="副本拓扑" style={{ marginTop: 16 }}>
          {Object.entries(state.replicaTopology).map(([replicaId, topology]) => (
            <Descriptions key={replicaId} column={3} bordered size="small" style={{ marginBottom: 8 }}>
              <Descriptions.Item label="副本 ID">{replicaId}</Descriptions.Item>
              <Descriptions.Item label="节点">{topology.node}</Descriptions.Item>
              <Descriptions.Item label="存储池">{topology.pool}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <StatusBadge status={topology.status} />
              </Descriptions.Item>
            </Descriptions>
          ))}
        </Card>
      )}
    </div>
  );
}
