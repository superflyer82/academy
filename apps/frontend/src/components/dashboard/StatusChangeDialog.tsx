import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { updateReportStatus } from '@/services/reports.service';
import { ReportStatus } from '@maengelmelder/shared-types';

const ALLOWED_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  [ReportStatus.OPEN]: [ReportStatus.IN_PROGRESS, ReportStatus.REJECTED],
  [ReportStatus.IN_PROGRESS]: [ReportStatus.RESOLVED, ReportStatus.REJECTED, ReportStatus.PENDING_RESPONSE],
  [ReportStatus.PENDING_RESPONSE]: [ReportStatus.IN_PROGRESS, ReportStatus.RESOLVED, ReportStatus.REJECTED],
  [ReportStatus.RESOLVED]: [],
  [ReportStatus.REJECTED]: [],
};

interface StatusChangeDialogProps {
  reportId: string;
  currentStatus: ReportStatus;
  open: boolean;
  onClose: () => void;
}

export function StatusChangeDialog({ reportId, currentStatus, open, onClose }: StatusChangeDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? [];

  const [status, setStatus] = useState<ReportStatus>(allowed[0] ?? currentStatus);
  const [note, setNote] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const mutation = useMutation({
    mutationFn: () => updateReportStatus(reportId, status, note || undefined, sendEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
      onClose();
    },
  });

  if (allowed.length === 0) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('dashboard.changeStatus')}</DialogTitle>

      <div className="space-y-4">
        <div>
          <Label htmlFor="new-status">Neuer Status</Label>
          <Select
            id="new-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ReportStatus)}
            className="mt-1"
          >
            {allowed.map((s) => (
              <option key={s} value={s}>{t(`status.${s}`)}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="status-note">Notiz (optional)</Label>
          <Textarea
            id="status-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Kurze Begründung oder Info für den Bürger..."
            className="mt-1"
            rows={3}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
            className="rounded"
          />
          E-Mail-Benachrichtigung senden (falls Kontakt hinterlegt)
        </label>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Wird gespeichert...' : 'Status ändern'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
