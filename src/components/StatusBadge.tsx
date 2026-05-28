import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const statusColors: Record<string, string> = {
  Online: 'green',
  Unknown: 'default',
  Offline: 'red',
  Degraded: 'orange',
  Faulted: 'red',
  Pending: 'processing',
};

interface StatusBadgeProps {
  status: string;
  text?: string;
}

export default function StatusBadge({ status, text }: StatusBadgeProps) {
  const { t } = useTranslation();
  const color = statusColors[status] || 'default';
  const label = text || t(`common.status.${status}`, status);

  return <Tag color={color}>{label}</Tag>;
}
