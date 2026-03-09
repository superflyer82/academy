import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, MessageSquare, Clock, User } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatusChangeDialog } from '@/components/dashboard/StatusChangeDialog';
import { fetchDashboardReports, addComment } from '@/services/reports.service';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { formatDateTime } from '@/lib/utils';
import { ReportFull } from '@maengelmelder/shared-types';

// Fetch single report for dashboard via reports list (workaround: filter by id from cache)
function useDashboardReport(id: string) {
  return useQuery<ReportFull | undefined>({
    queryKey: ['report', 'dashboard', id],
    queryFn: async () => {
      const { apiClient } = await import('@/services/api.client');
      const res = await apiClient.get<ReportFull>(`/reports/dashboard/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export default function ReportDetailDashboard() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const { data: report, isLoading } = useDashboardReport(id!);

  const commentMutation = useMutation({
    mutationFn: () => addComment(id!, commentText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', 'dashboard', id] });
      setCommentText('');
    },
  });

  if (isLoading) return <DashboardLayout><p className="text-center py-10">{t('common.loading')}</p></DashboardLayout>;
  if (!report) return <DashboardLayout><p className="text-center py-10">Meldung nicht gefunden.</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-4">
        {/* Breadcrumb */}
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" />Alle Meldungen</Link>
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{report.category?.icon}</span>
            <div>
              <h1 className="text-xl font-bold">{report.category?.name}</h1>
              <p className="text-sm text-muted-foreground">{formatDateTime(report.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} />
            <Button size="sm" onClick={() => setStatusDialogOpen(true)}>
              {t('dashboard.changeStatus')}
            </Button>
          </div>
        </div>

        {/* Reporter info */}
        {(report.reporterName || report.reporterEmail) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-1">
                <User className="h-4 w-4" />Melder
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {report.reporterName && <p>Name: {report.reporterName}</p>}
              {report.reporterEmail && <p>E-Mail: <a href={`mailto:${report.reporterEmail}`} className="text-primary hover:underline">{report.reporterEmail}</a></p>}
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {report.description && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Beschreibung</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{report.description}</p></CardContent>
          </Card>
        )}

        {/* Photos */}
        {report.photos && report.photos.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Fotos</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {report.photos.map((p) => (
                  <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                    <img src={p.url} alt="" className="w-full h-24 object-cover rounded" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-1">
              <MapPin className="h-4 w-4" />Standort
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {report.address && <p className="text-sm">{report.address}</p>}
            <p className="text-xs text-muted-foreground">{report.lat.toFixed(6)}, {report.lng.toFixed(6)}</p>
            <div className="h-48 rounded-md overflow-hidden">
              <MapContainer center={[report.lat, report.lng]} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[report.lat, report.lng]} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status History */}
        {report.statusHistory && report.statusHistory.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-1">
                <Clock className="h-4 w-4" />{t('dashboard.statusHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {report.statusHistory.map((entry) => (
                  <li key={entry.id} className="text-sm flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <span className="font-medium">{t(`status.${entry.toStatus}`)}</span>
                      {entry.note && <span className="text-muted-foreground"> – {entry.note}</span>}
                      <div className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Internal Comments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />{t('dashboard.internalComment')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.comments && report.comments.map((c) => (
              <div key={c.id} className="bg-muted/50 rounded p-3 text-sm">
                <div className="font-medium text-xs text-muted-foreground mb-1">{formatDateTime(c.createdAt)}</div>
                <p>{c.text}</p>
              </div>
            ))}
            <div className="space-y-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Interne Notiz hinzufügen..."
                rows={2}
              />
              <Button
                size="sm"
                onClick={() => commentMutation.mutate()}
                disabled={!commentText.trim() || commentMutation.isPending}
              >
                Notiz speichern
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <StatusChangeDialog
        reportId={id!}
        currentStatus={report.status}
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      />
    </DashboardLayout>
  );
}
