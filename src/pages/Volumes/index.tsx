import { useEffect, useState } from 'react';
import { Table, Spin, Typography, Button, Space, Modal, Form, InputNumber, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getVolumes, createVolume, deleteVolume } from '../../api';
import { Volume, CreateVolumeBody } from '../../types';
import StatusBadge from '../../components/StatusBadge';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function VolumesPage() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchVolumes = () => {
    setLoading(true);
    getVolumes()
      .then((data) => setVolumes(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVolumes(); }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setCreating(true);
      const body: CreateVolumeBody = {
        size: values.size * 1024 * 1024 * 1024, // GiB -> bytes
        replicas: values.replicas,
        policy: {},
        labels: values.labels ? { description: values.labels } : undefined,
      };
      await createVolume(body);
      setCreateOpen(false);
      form.resetFields();
      fetchVolumes();
    } catch {
      // validation errors are handled by antd
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (uuid: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除卷 ${uuid} 吗？`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteVolume(uuid);
        fetchVolumes();
      },
    });
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>卷</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          创建卷
        </Button>
      </div>

      <Table
        dataSource={volumes}
        rowKey={(r) => r.spec.uuid}
        onRow={(record) => ({
          onClick: () => navigate(`/volumes/${record.spec.uuid}`),
          style: { cursor: 'pointer' },
        })}
        columns={[
          { title: 'UUID', dataIndex: ['spec', 'uuid'], key: 'uuid', width: 280 },
          {
            title: '状态',
            dataIndex: ['state', 'status'],
            key: 'status',
            render: (s: string) => <StatusBadge status={s} />,
          },
          {
            title: '大小',
            dataIndex: ['state', 'size'],
            key: 'size',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: '副本数',
            dataIndex: ['spec', 'replicas'],
            key: 'replicas',
          },
          {
            title: '发布',
            key: 'published',
            render: (_: unknown, record: Volume) =>
              record.state.target ? <StatusBadge status="Online" text="已发布" /> : <StatusBadge status="Unknown" text="未发布" />,
          },
          {
            title: '操作',
            key: 'actions',
            render: (_: unknown, record: Volume) => (
              <Space>
                <Button
                  type="link"
                  size="small"
                  danger
                  onClick={(e) => { e.stopPropagation(); handleDelete(record.spec.uuid); }}
                >
                  删除
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="创建卷"
        open={createOpen}
        onOk={handleCreate}
        onCancel={() => { setCreateOpen(false); form.resetFields(); }}
        confirmLoading={creating}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="size"
            label="大小 (GiB)"
            rules={[{ required: true, message: '请输入大小' }, { type: 'number', min: 1, message: '最小 1 GiB' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="replicas"
            label="副本数"
            rules={[{ required: true, message: '请输入副本数' }, { type: 'number', min: 1, max: 10, message: '1-10' }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="labels" label="标签（可选）">
            <Input placeholder="描述性标签" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
