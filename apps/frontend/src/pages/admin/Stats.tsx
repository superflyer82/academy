import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStats } from '@/services/admin.service';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ReportStatus } from '@maengelmelder/shared-types';

export default function Stats() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats(),
  });

  if (isLoading) return <DashboardLayout><p className="text-center py-10">{t('common.loading')}</p></DashboardLayout>;

  const byStatus = data?.byStatus ?? {};
  const byCategory = data?.byCategory ?? [];

  const kpis = [
    {
      label: 'Neue Meldungen (offen)',
      value: byStatus[ReportStatus.OPEN] ?? 0,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },
    {
      label: 'In Bearbeitung',
      value: byStatus[ReportStatus.IN_PROGRESS] ?? 0,
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    },
    {
      label: 'Gelöst',
      value: byStatus[ReportStatus.RESOLVED] ?? 0,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      label: 'Ø Bearbeitungszeit',
      value: data?.avgResolutionDays != null ? `${data.avgResolutionDays.toFixed(1)} Tage` : '—',
      icon: <Clock className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('dashboard.stats')}</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                {kpi.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overdue */}
        {data && data.openOverdue > 0 && (
          <Card className="border-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Überfällige Meldungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{data.openOverdue}</p>
              <p className="text-sm text-muted-foreground">Meldungen, die das Bearbeitungsziel überschritten haben</p>
            </CardContent>
          </Card>
        )}

        {/* By Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meldungen nach Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.values(ReportStatus).map((s) => {
                const count = byStatus[s] ?? 0;
                const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span className="text-sm w-36 shrink-0">{t(`status.${s}`)}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* By Category */}
        {byCategory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Meldungen nach Kategorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {byCategory.map((cat) => (
                  <div key={cat.categoryId} className="flex items-center justify-between text-sm">
                    <span>{cat.categoryName}</span>
                    <span className="font-medium">{cat.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
