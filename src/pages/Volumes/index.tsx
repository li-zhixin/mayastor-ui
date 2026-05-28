import { useEffect, useState } from 'react';
import { Table, Spin, Typography, Button, Space, Modal, Form, InputNumber, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    getVolumes()
      .then((data) => {
        if (!cancelled) {
          setVolumes(data);
        }
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
  }, []);

  const fetchVolumes = async () => {
    setLoading(true);
    try {
      const data = await getVolumes();
      setVolumes(data);
    } catch {
      setVolumes([]);
    } finally {
      setLoading(false);
    }
  };

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
      await fetchVolumes();
    } catch {
      // validation errors are handled by antd
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (uuid: string) => {
    Modal.confirm({
      title: t('volumes.modal.deleteTitle'),
      content: t('volumes.modal.deleteContent', { uuid }),
      okText: t('volumes.modal.confirm'),
      cancelText: t('volumes.modal.cancel'),
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteVolume(uuid);
        await fetchVolumes();
      },
    });
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>{t('volumes.title')}</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          {t('volumes.actions.create')}
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
          { title: t('common.labels.uuid'), dataIndex: ['spec', 'uuid'], key: 'uuid', width: 280 },
          {
            title: t('volumes.columns.status'),
            dataIndex: ['state', 'status'],
            key: 'status',
            render: (s: string) => <StatusBadge status={s} />,
          },
          {
            title: t('volumes.columns.size'),
            dataIndex: ['state', 'size'],
            key: 'size',
            render: (v: number) => formatBytes(v || 0),
          },
          {
            title: t('volumes.columns.replicas'),
            dataIndex: ['spec', 'replicas'],
            key: 'replicas',
          },
          {
            title: t('volumes.columns.published'),
            key: 'published',
            render: (_: unknown, record: Volume) =>
              record.state.target
                ? <StatusBadge status="Online" text={t('volumes.values.published')} />
                : <StatusBadge status="Unknown" text={t('volumes.values.unpublished')} />,
          },
          {
            title: t('volumes.columns.actions'),
            key: 'actions',
            render: (_: unknown, record: Volume) => (
              <Space>
                <Button
                  type="link"
                  size="small"
                  danger
                  onClick={(e) => { e.stopPropagation(); handleDelete(record.spec.uuid); }}
                >
                  {t('volumes.actions.delete')}
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={t('volumes.createTitle')}
        open={createOpen}
        onOk={handleCreate}
        onCancel={() => { setCreateOpen(false); form.resetFields(); }}
        confirmLoading={creating}
        okText={t('volumes.modal.create')}
        cancelText={t('volumes.modal.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="size"
            label={t('volumes.form.size')}
            rules={[
              { required: true, message: t('volumes.form.validation.sizeRequired') },
              { type: 'number', min: 1, message: t('volumes.form.validation.sizeMin') },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="replicas"
            label={t('volumes.form.replicas')}
            rules={[
              { required: true, message: t('volumes.form.validation.replicasRequired') },
              { type: 'number', min: 1, max: 10, message: t('volumes.form.validation.replicasRange') },
            ]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="labels" label={t('volumes.form.labels')}>
            <Input placeholder={t('volumes.form.labelsPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
