import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, Typography, Button, Space, Table } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getNexus } from '../../api';
import { Nexus } from '../../types';
import StatusBadge from '../../components/StatusBadge';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function getNexusChildren(nexus: Nexus) {
  return Array.isArray(nexus.children) ? nexus.children : [];
}

export default function NexusDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nexus, setNexus] = useState<Nexus | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    getNexus(id)
      .then((data) => {
        if (cancelled) return;
        setNexus(data);
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

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;
  if (!nexus) return <Typography.Text type="danger">{t('nexuses.notFound')}</Typography.Text>;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/nexuses')}>{t('common.back')}</Button>
      </Space>

      <Card title={<span>{t('nexuses.detailTitle')} <Typography.Text copyable>{nexus.uuid}</Typography.Text></span>}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('nexuses.fields.node')}>{nexus.node}</Descriptions.Item>
          <Descriptions.Item label={t('nexuses.fields.name')}>{nexus.name}</Descriptions.Item>
          <Descriptions.Item label={t('nexuses.fields.status')}><StatusBadge status={nexus.status} /></Descriptions.Item>
          <Descriptions.Item label={t('nexuses.fields.size')}>{formatBytes(nexus.size)}</Descriptions.Item>
          <Descriptions.Item label={t('nexuses.fields.deviceUri')}>{nexus.deviceUri || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('nexuses.fields.rebuilds')}>{nexus.rebuilds}</Descriptions.Item>
          <Descriptions.Item label={t('nexuses.fields.share')}>{nexus.share === 'None' ? t('common.shared.notShared') : nexus.share}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('nexuses.childrenTitle')} style={{ marginTop: 16 }}>
        <Table
          dataSource={getNexusChildren(nexus)}
          rowKey="uri"
          pagination={false}
          columns={[
            { title: t('nexuses.columns.uri'), dataIndex: 'uri', key: 'uri' },
            { title: t('nexuses.columns.status'), dataIndex: 'state', key: 'state', render: (s: string) => <StatusBadge status={s} /> },
            {
              title: t('nexuses.columns.rebuildProgress'),
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
