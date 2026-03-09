import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Link } from 'react-router-dom';
import { ReportPublic } from '@maengelmelder/shared-types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';

interface ReportMarkerProps {
  report: ReportPublic;
}

function createCategoryIcon(icon: string) {
  return divIcon({
    className: '',
    html: `<div style="
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      background:#2563eb;border:2px solid #fff;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;transform:rotate(-45deg);box-shadow:0 2px 4px rgba(0,0,0,.3)
    "><span style="transform:rotate(45deg)">${icon}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

export function ReportMarker({ report }: ReportMarkerProps) {
  const icon = createCategoryIcon(report.category?.icon ?? '📍');

  return (
    <Marker position={[report.lat, report.lng]} icon={icon}>
      <Popup maxWidth={260}>
        <div className="text-sm space-y-1 min-w-[200px]">
          <div className="font-semibold flex items-center gap-1">
            <span>{report.category?.icon}</span>
            <span>{report.category?.name}</span>
          </div>
          {report.description && (
            <p className="text-gray-600 line-clamp-2">{report.description}</p>
          )}
          <div className="flex items-center justify-between pt-1">
            <StatusBadge status={report.status} />
            <span className="text-xs text-gray-500">{formatDate(report.createdAt)}</span>
          </div>
          <Link
            to={`/meldungen/${report.id}`}
            className="block text-center mt-2 text-blue-600 hover:underline text-xs font-medium"
          >
            Details anzeigen →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
