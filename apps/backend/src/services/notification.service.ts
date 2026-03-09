import { ReportStatus } from '@maengelmelder/shared-types';
import { sendMail } from '../lib/mailer';

const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.OPEN]: 'Eingegangen',
  [ReportStatus.IN_PROGRESS]: 'In Bearbeitung',
  [ReportStatus.RESOLVED]: 'Gelöst',
  [ReportStatus.REJECTED]: 'Abgelehnt',
  [ReportStatus.PENDING_RESPONSE]: 'Rückfrage',
};

export async function notifyStatusChange(opts: {
  to: string;
  reportId: string;
  publicToken: string;
  newStatus: ReportStatus;
  note?: string | null;
  cityName?: string;
}): Promise<void> {
  const { to, publicToken, newStatus, note, cityName = 'Mängelmelder' } = opts;
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  const trackUrl = `${frontendUrl}/verfolgen/${publicToken}`;
  const statusLabel = STATUS_LABELS[newStatus];

  await sendMail({
    to,
    subject: `Ihre Meldung: Status geändert zu „${statusLabel}"`,
    html: `
      <h2>${cityName}</h2>
      <p>Der Status Ihrer Meldung wurde aktualisiert:</p>
      <p><strong>Neuer Status: ${statusLabel}</strong></p>
      ${note ? `<p><em>Hinweis: ${note}</em></p>` : ''}
      <p><a href="${trackUrl}">Meldung verfolgen</a></p>
      <hr/>
      <small>Diese E-Mail wurde automatisch verschickt. Bitte antworten Sie nicht direkt.</small>
    `,
  });
}
