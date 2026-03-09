import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { bulkUpdate } from '@/services/reports.service';
import { ReportStatus } from '@maengelmelder/shared-types';

interface BulkActionsProps {
  selectedIds: string[];
  onClear: () => void;
}

export function BulkActions({ selectedIds, onClear }: BulkActionsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [action, setAction] = useState('status');
  const [value, setValue] = useState<string>(ReportStatus.IN_PROGRESS);

  const mutation = useMutation({
    mutationFn: () => bulkUpdate(selectedIds, action, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      onClear();
    },
  });

  if (selectedIds.length === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-primary/5 border rounded-lg flex-wrap">
      <span className="text-sm font-medium">{selectedIds.length} ausgewählt</span>

      <Select value={action} onChange={(e) => setAction(e.target.value)} className="w-40">
        <option value="status">Status setzen</option>
        <option value="priority">Priorität setzen</option>
      </Select>

      {action === 'status' && (
        <Select value={value} onChange={(e) => setValue(e.target.value)} className="w-40">
          {Object.values(ReportStatus).map((s) => (
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          ))}
        </Select>
      )}

      {action === 'priority' && (
        <Select value={value} onChange={(e) => setValue(e.target.value)} className="w-40">
          <option value="LOW">{t('priority.LOW')}</option>
          <option value="MEDIUM">{t('priority.MEDIUM')}</option>
          <option value="HIGH">{t('priority.HIGH')}</option>
          <option value="URGENT">{t('priority.URGENT')}</option>
        </Select>
      )}

      <Button size="sm" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? 'Wird ausgeführt...' : t('dashboard.bulkActions')}
      </Button>
      <Button size="sm" variant="ghost" onClick={onClear}>Auswahl aufheben</Button>
    </div>
  );
}
