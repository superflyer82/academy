import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { MapPin, LocateFixed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Fix default marker icons for Webpack/Vite
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ReportMapProps {
  lat?: number;
  lng?: number;
  onChange?: (lat: number, lng: number) => void;
  readonly?: boolean;
  defaultLat?: number;
  defaultLng?: number;
  defaultZoom?: number;
}

export function ReportMap({
  lat, lng, onChange, readonly = false,
  defaultLat = 48.1374, defaultLng = 11.5755, defaultZoom = 13,
}: ReportMapProps) {
  const { t } = useTranslation();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([defaultLat, defaultLng], defaultZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    if (!readonly) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLng]);
        } else {
          markerRef.current = L.marker([clickLat, clickLng]).addTo(map);
        }
        onChange?.(clickLat, clickLng);
      });
    }

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external lat/lng to marker
  useEffect(() => {
    if (!mapRef.current || lat === undefined || lng === undefined) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }
    mapRef.current.setView([lat, lng], Math.max(mapRef.current.getZoom(), 15));
  }, [lat, lng]);

  const handleGps = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onChange?.(latitude, longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border">
      <div ref={containerRef} className="w-full h-full" />
      {!readonly && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute bottom-3 right-3 z-[1000] shadow"
          onClick={handleGps}
          disabled={locating}
          aria-label={t('report.gpsButton')}
        >
          <LocateFixed className="mr-1 h-4 w-4" />
          {locating ? t('common.loading') : t('report.gpsButton')}
        </Button>
      )}
      {!readonly && !lat && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 rounded-lg px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t('report.locationHint')}
          </div>
        </div>
      )}
    </div>
  );
}
