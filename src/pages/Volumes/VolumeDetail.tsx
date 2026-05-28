import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [volume, setVolume] = useState<Volume | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    getVolume(id)
      .then((data) => {
        if (cancelled) return;
        setVolume(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const fetchVolume = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await getVolume(id);
      setVolume(data);
    } catch {
      setVolume(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    await publishVolume(id);
    await fetchVolume();
  };

  const handleUnpublish = async () => {
    if (!id) return;
    await unpublishVolume(id);
    await fetchVolume();
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteVolume(id);
    navigate('/volumes');
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;
  if (!volume) return <Typography.Text type="danger">{t('volumes.notFound')}</Typography.Text>;

  const { spec, state } = volume;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/volumes')}>{t('common.back')}</Button>
      </Space>

      <Card title={<span>{t('volumes.detailTitle')} <Typography.Text copyable>{spec.uuid}</Typography.Text></span>}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('volumes.fields.status')}>
            <StatusBadge status={state.status} />
          </Descriptions.Item>
          <Descriptions.Item label={t('volumes.fields.size')}>{formatBytes(state.size)}</Descriptions.Item>
          <Descriptions.Item label={t('volumes.fields.desiredReplicas')}>{spec.replicas}</Descriptions.Item>
          <Descriptions.Item label={t('volumes.fields.publishStatus')}>
            {state.target
              ? <StatusBadge status="Online" text={t('volumes.values.published')} />
              : <StatusBadge status="Unknown" text={t('volumes.values.unpublished')} />}
          </Descriptions.Item>
          {state.target && (
            <>
              <Descriptions.Item label={t('volumes.fields.nexusNode')}>{state.target.node}</Descriptions.Item>
              <Descriptions.Item label={t('volumes.fields.deviceUri')}>{state.target.deviceUri || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('volumes.fields.nexusStatus')}>
                <StatusBadge status={state.target.status} />
              </Descriptions.Item>
              <Descriptions.Item label={t('volumes.fields.rebuilds')}>{state.target.rebuilds}</Descriptions.Item>
            </>
          )}
        </Descriptions>

        <div style={{ marginTop: 16 }}>
          <Space>
            {!state.target ? (
              <Button type="primary" onClick={handlePublish}>{t('volumes.actions.publish')}</Button>
            ) : (
              <Button onClick={handleUnpublish}>{t('volumes.actions.unpublish')}</Button>
            )}
            <Button danger onClick={handleDelete}>{t('volumes.actions.delete')}</Button>
          </Space>
        </div>
      </Card>

      {state.target && state.target.children && state.target.children.length > 0 && (
        <Card title={t('volumes.nexusChildrenTitle')} style={{ marginTop: 16 }}>
          {state.target.children.map((child, i) => (
            <Descriptions key={i} column={2} bordered size="small" style={{ marginBottom: 8 }}>
              <Descriptions.Item label={t('common.labels.uri')}>{child.uri}</Descriptions.Item>
              <Descriptions.Item label={t('volumes.fields.childStatus')}>
                <StatusBadge status={child.state} />
              </Descriptions.Item>
              {child.rebuildProgress !== undefined && (
                <Descriptions.Item label={t('volumes.fields.rebuildProgress')}>{child.rebuildProgress}%</Descriptions.Item>
              )}
            </Descriptions>
          ))}
        </Card>
      )}

      {state.replicaTopology && Object.keys(state.replicaTopology).length > 0 && (
        <Card title={t('volumes.replicaTopologyTitle')} style={{ marginTop: 16 }}>
          {Object.entries(state.replicaTopology).map(([replicaId, topology]) => (
            <Descriptions key={replicaId} column={3} bordered size="small" style={{ marginBottom: 8 }}>
              <Descriptions.Item label={t('volumes.fields.replicaId')}>{replicaId}</Descriptions.Item>
              <Descriptions.Item label={t('volumes.fields.node')}>{topology.node}</Descriptions.Item>
              <Descriptions.Item label={t('volumes.fields.pool')}>{topology.pool}</Descriptions.Item>
              <Descriptions.Item label={t('volumes.fields.status')}>
                <StatusBadge status={topology.status} />
              </Descriptions.Item>
            </Descriptions>
          ))}
        </Card>
      )}
    </div>
  );
}
