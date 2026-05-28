import { Tag } from 'antd';

const statusColors: Record<string, string> = {
  Online: 'green',
  Unknown: 'default',
  Offline: 'red',
  Degraded: 'orange',
  Faulted: 'red',
  Pending: 'processing',
};

const statusText: Record<string, string> = {
  Online: '在线',
  Unknown: '未知',
  Offline: '离线',
  Degraded: '降级',
  Faulted: '故障',
  Pending: '待定',
  None: '无',
  Nvmf: 'NVMe-oF',
  Iscsi: 'iSCSI',
  Nbd: 'NBD',
};

interface StatusBadgeProps {
  status: string;
  text?: string;
}

export default function StatusBadge({ status, text }: StatusBadgeProps) {
  const color = statusColors[status] || 'default';
  const label = text || statusText[status] || status;

  return <Tag color={color}>{label}</Tag>;
}
