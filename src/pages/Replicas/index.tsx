import { useEffect, useState } from 'react';
import { Table, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { getReplicas } from '../../api';
import { Replica } from '../../types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function ReplicasPage() {
  const { t } = useTranslation();
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
      <Typography.Title level={4}>{t('replicas.title')}</Typography.Title>
      <Table
        dataSource={replicas}
        rowKey="uuid"
        columns={[
          { title: t('common.labels.uuid'), dataIndex: 'uuid', key: 'uuid', width: 280 },
          { title: t('replicas.columns.node'), dataIndex: 'node', key: 'node' },
          { title: t('replicas.columns.pool'), dataIndex: 'pool', key: 'pool' },
          {
            title: t('replicas.columns.size'),
            dataIndex: 'size',
            key: 'size',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: t('replicas.columns.thin'),
            dataIndex: 'thin',
            key: 'thin',
            render: (v: boolean) => (v ? t('replicas.values.yes') : t('replicas.values.no')),
          },
          {
            title: t('replicas.columns.share'),
            dataIndex: 'share',
            key: 'share',
            render: (s: string) => (s === 'None' ? t('common.shared.notShared') : s),
          },
          { title: t('replicas.columns.uri'), dataIndex: 'uri', key: 'uri', ellipsis: true },
        ]}
      />
    </div>
  );
}
