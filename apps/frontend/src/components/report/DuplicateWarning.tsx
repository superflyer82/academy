import { ReportPublic } from '@maengelmelder/shared-types';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';

interface DuplicateWarningProps {
  reports: ReportPublic[];
}

export function DuplicateWarning({ reports }: DuplicateWarningProps) {
  const { t } = useTranslation();
  if (reports.length === 0) return null;

  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-yellow-800">{t('report.duplicate')}</p>
          <p className="text-sm text-yellow-700 mt-1">{t('report.duplicateHint')}</p>
          <ul className="mt-2 space-y-1">
            {reports.map((r) => (
              <li key={r.id} className="text-sm text-yellow-700 flex items-center gap-2">
                <span>{r.category?.icon}</span>
                <span>{r.category?.name}</span>
                <StatusBadge status={r.status} />
                <span className="text-xs">({formatDate(r.createdAt)})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
