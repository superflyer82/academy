import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackReport } from '@/services/reports.service';
import { useState } from 'react';

export default function ReportSuccess() {
  const { t } = useTranslation();
  const { publicToken } = useParams<{ publicToken: string }>();
  const [copied, setCopied] = useState(false);

  const { data } = useQuery({
    queryKey: ['track', publicToken],
    queryFn: () => trackReport(publicToken!),
    enabled: !!publicToken,
  });

  const copyToken = () => {
    navigator.clipboard.writeText(publicToken ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-2xl font-bold mb-2">{t('report.success')}</h1>
      <p className="text-muted-foreground mb-8">Ihre Meldung wurde erfolgreich übermittelt.</p>

      <div className="rounded-lg border bg-muted/50 p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-2">{t('report.ticketId')}</p>
        <div className="flex items-center justify-center gap-2">
          <code className="font-mono text-sm break-all">{publicToken}</code>
          <Button size="icon" variant="ghost" onClick={copyToken} aria-label="Ticket-ID kopieren">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {copied && <p className="text-xs text-green-600 mt-1">Kopiert!</p>}
      </div>

      <p className="text-sm text-muted-foreground mb-6">{t('report.trackHint')}</p>

      <div className="flex flex-col gap-3">
        <Button asChild variant="outline">
          <Link to={`/verfolgen/${publicToken}`}>Status verfolgen</Link>
        </Button>
        <Button asChild>
          <Link to="/melden">Weitere Meldung einreichen</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/">Zur Startseite</Link>
        </Button>
      </div>

      {data && (
        <div className="mt-6 text-sm text-muted-foreground">
          Kategorie: {data.category?.icon} {data.category?.name}
        </div>
      )}
    </div>
  );
}
