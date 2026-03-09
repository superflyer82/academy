import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { trackReport } from '@/services/reports.service';
import { formatDateTime } from '@/lib/utils';
import { ReportStatus } from '@maengelmelder/shared-types';

const STATUS_ICONS: Record<ReportStatus, React.ReactNode> = {
  [ReportStatus.OPEN]: <Clock className="h-5 w-5 text-yellow-500" />,
  [ReportStatus.IN_PROGRESS]: <AlertCircle className="h-5 w-5 text-blue-500" />,
  [ReportStatus.RESOLVED]: <CheckCircle className="h-5 w-5 text-green-500" />,
  [ReportStatus.REJECTED]: <XCircle className="h-5 w-5 text-red-500" />,
  [ReportStatus.PENDING_RESPONSE]: <MessageSquare className="h-5 w-5 text-purple-500" />,
};

export default function TrackReport() {
  const { t } = useTranslation();
  const { publicToken: tokenParam } = useParams<{ publicToken?: string }>();
  const navigate = useNavigate();
  const [inputToken, setInputToken] = useState(tokenParam ?? '');
  const [searchToken, setSearchToken] = useState(tokenParam ?? '');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['track', searchToken],
    queryFn: () => trackReport(searchToken),
    enabled: !!searchToken,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputToken.trim();
    setSearchToken(trimmed);
    if (trimmed) navigate(`/verfolgen/${trimmed}`, { replace: true });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Meldung verfolgen</h1>
      <p className="text-muted-foreground mb-6">Geben Sie Ihre Ticket-ID ein, um den Status Ihrer Meldung zu prüfen.</p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="flex-1">
          <Label htmlFor="token" className="sr-only">Ticket-ID</Label>
          <Input
            id="token"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            placeholder="z.B. a1b2c3d4-..."
            className="font-mono"
          />
        </div>
        <Button type="submit" disabled={!inputToken.trim()}>
          <Search className="h-4 w-4 mr-1" />Suchen
        </Button>
      </form>

      {isLoading && <p className="text-center text-muted-foreground">{t('common.loading')}</p>}

      {isError && (
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
            <p className="font-medium">Meldung nicht gefunden</p>
            <p className="text-sm text-muted-foreground mt-1">Bitte prüfen Sie die Ticket-ID und versuchen Sie es erneut.</p>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Aktueller Status</span>
                <div className="flex items-center gap-2">
                  {STATUS_ICONS[data.status]}
                  <StatusBadge status={data.status} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Kategorie:</span>
                  <span className="font-medium">{data.category?.icon} {data.category?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Eingereicht:</span>
                  <span>{formatDateTime(data.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aktualisiert:</span>
                  <span>{formatDateTime(data.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          {data.statusHistory && data.statusHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Verlauf</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {data.statusHistory.map((entry) => (
                    <li key={entry.id} className="flex gap-3 text-sm">
                      <div className="flex flex-col items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1 shrink-0" />
                        <div className="flex-1 w-px bg-border mt-1" />
                      </div>
                      <div className="pb-2">
                        <div className="font-medium">{t(`status.${entry.toStatus}`)}</div>
                        {entry.note && <p className="text-muted-foreground">{entry.note}</p>}
                        <p className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
