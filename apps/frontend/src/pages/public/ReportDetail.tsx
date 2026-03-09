import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { fetchReportById } from '@/services/reports.service';
import { formatDateTime } from '@/lib/utils';

export default function ReportDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['report', id],
    queryFn: () => fetchReportById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-8 text-center">{t('common.loading')}</div>;
  if (isError || !report) return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <p className="text-muted-foreground">Meldung nicht gefunden.</p>
      <Button asChild variant="link" className="mt-2"><Link to="/meldungen">← Zurück zur Liste</Link></Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/meldungen"><ArrowLeft className="h-4 w-4 mr-1" />Alle Meldungen</Link>
      </Button>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{report.category?.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{report.category?.name}</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDateTime(report.createdAt)}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {report.description && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Beschreibung</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{report.description}</p></CardContent>
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
          {report.address && <p className="text-sm text-muted-foreground">{report.address}</p>}
          <div className="h-48 rounded-md overflow-hidden">
            <MapContainer center={[report.lat, report.lng]} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[report.lat, report.lng]} />
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      {report.photos && report.photos.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Fotos</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {report.photos.map((photo) => (
                <a key={photo.id} href={photo.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={photo.url}
                    alt="Meldungsfoto"
                    className="w-full h-24 object-cover rounded"
                  />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center pt-2">
        <Button asChild variant="outline">
          <Link to="/melden">Neue Meldung einreichen</Link>
        </Button>
      </div>
    </div>
  );
}
