import { useEffect, useState } from 'react';
import { Table, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
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

function getNexusChildren(record: Nexus) {
  return Array.isArray(record.children) ? record.children : [];
}

export default function NexusesPage() {
  const { t } = useTranslation();
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
      <Typography.Title level={4}>{t('nexuses.title')}</Typography.Title>
      <Table
        dataSource={nexuses}
        rowKey="uuid"
        childrenColumnName="__children"
        onRow={(record) => ({
          onClick: () => navigate(`/nexuses/${record.uuid}`),
          style: { cursor: 'pointer' },
        })}
        columns={[
          { title: t('common.labels.uuid'), dataIndex: 'uuid', key: 'uuid', width: 280 },
          { title: t('nexuses.columns.node'), dataIndex: 'node', key: 'node' },
          {
            title: t('nexuses.columns.status'),
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => <StatusBadge status={s} />,
          },
          {
            title: t('nexuses.columns.size'),
            dataIndex: 'size',
            key: 'size',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: t('nexuses.columns.children'),
            key: 'children',
            render: (_: unknown, record: Nexus) => {
              const children = getNexusChildren(record);
              const online = children.filter((c) => c.state === 'Online').length;
              return `${online} / ${children.length}`;
            },
          },
          {
            title: t('nexuses.columns.rebuilds'),
            dataIndex: 'rebuilds',
            key: 'rebuilds',
          },
          {
            title: t('nexuses.columns.protocol'),
            dataIndex: 'share',
            key: 'share',
            render: (s: string) => (s === 'None' ? t('common.shared.notShared') : s),
          },
        ]}
      />
    </div>
  );
}
