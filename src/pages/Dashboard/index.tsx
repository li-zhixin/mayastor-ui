import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography } from 'antd';
import {
  ClusterOutlined,
  DatabaseOutlined,
  HddOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { getClusterStats } from '../../api';
import { ClusterStats } from '../../types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function Dashboard() {
  const [stats, setStats] = useState<ClusterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const data = await getClusterStats();
        if (!cancelled) setStats(data);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : '获取数据失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }}>
        <Spin size="large" description="加载集群数据..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ padding: 24 }}>
        <Typography.Text type="danger">
          {error || '无法加载集群数据。请确认 REST API 服务（默认 http://localhost:8080）已启动。'}
        </Typography.Text>
      </div>
    );
  }

  const usedPct = stats.capacityBytes > 0
    ? ((stats.usedBytes / stats.capacityBytes) * 100).toFixed(1)
    : '0';

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>集群概览</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="节点"
              value={stats.nodesOnline}
              suffix={`/ ${stats.nodes}`}
              prefix={<ClusterOutlined />}
              styles={{ content: { color: stats.nodesOnline === stats.nodes ? '#3f8600' : '#faad14' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="存储池"
              value={stats.poolsOnline}
              suffix={`/ ${stats.pools}`}
              prefix={<DatabaseOutlined />}
              styles={{ content: { color: stats.poolsOnline === stats.pools ? '#3f8600' : '#faad14' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="卷"
              value={stats.volumesOnline}
              suffix={`/ ${stats.volumes}`}
              prefix={<HddOutlined />}
              styles={{ content: { color: stats.volumesOnline === stats.volumes ? '#3f8600' : '#faad14' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="副本"
              value={stats.replicas}
              prefix={<CopyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="存储使用">
            <Statistic
              title="已用 / 总容量"
              value={`${formatBytes(stats.usedBytes)} / ${formatBytes(stats.capacityBytes)}`}
              suffix={`(${usedPct}%)`}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
