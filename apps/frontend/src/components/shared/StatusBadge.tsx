import { ReportStatus } from '@maengelmelder/shared-types';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const statusVariant: Record<ReportStatus, 'default' | 'info' | 'warning' | 'success' | 'destructive' | 'secondary'> = {
  [ReportStatus.OPEN]: 'info',
  [ReportStatus.IN_PROGRESS]: 'warning',
  [ReportStatus.RESOLVED]: 'success',
  [ReportStatus.REJECTED]: 'destructive',
  [ReportStatus.PENDING_RESPONSE]: 'secondary',
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  const { t } = useTranslation();
  return <Badge variant={statusVariant[status]}>{t(`status.${status}`)}</Badge>;
}
