import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { fetchCitizenReports } from '@/services/reports.service';
import { ReportFull } from '@maengelmelder/shared-types';
import { formatDate } from '@/lib/utils';

export default function MyReports() {
  const { t } = useTranslation();

  const { data: reports, isLoading } = useQuery<ReportFull[]>({
    queryKey: ['citizen-reports'],
    queryFn: fetchCitizenReports,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('nav.myReports')}</h1>
        <Button asChild size="sm">
          <Link to="/melden">Neue Meldung</Link>
        </Button>
      </div>

      {isLoading && <p className="text-center py-8 text-muted-foreground">{t('common.loading')}</p>}

      {!isLoading && reports?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Sie haben noch keine Meldungen eingereicht.</p>
          <Button asChild><Link to="/melden">Erste Meldung einreichen</Link></Button>
        </div>
      )}

      <div className="space-y-4">
        {reports?.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-2xl shrink-0">{r.category?.icon}</span>
                  <div className="min-w-0">
                    <p className="font-medium">{r.category?.name}</p>
                    {r.description && (
                      <p className="text-sm text-muted-foreground truncate">{r.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>

              {/* Status Timeline */}
              {r.statusHistory && r.statusHistory.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Verlauf</p>
                  <ol className="space-y-1">
                    {r.statusHistory.map((entry) => (
                      <li key={entry.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{t(`status.${entry.toStatus}`)}</span>
                        {entry.note && <span className="text-muted-foreground">– {entry.note}</span>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
