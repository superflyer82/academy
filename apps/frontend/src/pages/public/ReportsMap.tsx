import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportMarker } from '@/components/map/ReportMarker';
import { fetchPublicReports } from '@/services/reports.service';
import { fetchCategories } from '@/services/categories.service';
import { ReportStatus } from '@maengelmelder/shared-types';

const MUSTERHAUSEN_CENTER: [number, number] = [51.1, 10.0];

export default function ReportsMap() {
  const { t } = useTranslation();
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');

  const { data: reports } = useQuery({
    queryKey: ['reports', 'public', { categoryId, status }],
    queryFn: () => fetchPublicReports({ categoryId: categoryId || undefined, status: (status as ReportStatus) || undefined, limit: 500 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b flex-wrap">
        <h1 className="text-lg font-semibold mr-2">{t('map.title')}</h1>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="text-sm border rounded px-2 py-1"
          aria-label={t('map.filterCategory')}
        >
          <option value="">{t('map.allCategories')}</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-sm border rounded px-2 py-1"
          aria-label={t('map.filterStatus')}
        >
          <option value="">{t('map.allStatuses')}</option>
          {Object.values(ReportStatus).map((s) => (
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          ))}
        </select>

        <span className="text-sm text-muted-foreground ml-auto">
          {reports?.total ?? 0} Meldungen
        </span>

        <Button asChild variant="outline" size="sm">
          <Link to="/meldungen"><List className="h-4 w-4 mr-1" />Liste</Link>
        </Button>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer
          center={MUSTERHAUSEN_CENTER}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {reports?.items.map((r) => (
            <ReportMarker key={r.id} report={r} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
