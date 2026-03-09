import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { fetchPublicReports } from '@/services/reports.service';
import { fetchCategories } from '@/services/categories.service';
import { ReportStatus } from '@maengelmelder/shared-types';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 20;

export default function ReportsList() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'list', { categoryId, status, page }],
    queryFn: () =>
      fetchPublicReports({
        categoryId: categoryId || undefined,
        status: (status as ReportStatus) || undefined,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Meldungen</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/karte"><Map className="h-4 w-4 mr-1" />Kartenansicht</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          className="text-sm border rounded px-3 py-1.5"
          aria-label={t('map.filterCategory')}
        >
          <option value="">{t('map.allCategories')}</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="text-sm border rounded px-3 py-1.5"
          aria-label={t('map.filterStatus')}
        >
          <option value="">{t('map.allStatuses')}</option>
          {Object.values(ReportStatus).map((s) => (
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          ))}
        </select>

        <span className="text-sm text-muted-foreground self-center ml-auto">
          {data?.total ?? 0} Meldungen
        </span>
      </div>

      {/* List */}
      {isLoading && <p className="text-center py-8 text-muted-foreground">{t('common.loading')}</p>}

      <div className="space-y-3">
        {data?.items.map((r) => (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link to={`/meldungen/${r.id}`} className="block">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-2xl shrink-0">{r.category?.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium">{r.category?.name}</p>
                      {r.description && (
                        <p className="text-sm text-muted-foreground truncate">{r.description}</p>
                      )}
                      {r.address && (
                        <p className="text-xs text-muted-foreground mt-0.5">{r.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && data?.items.length === 0 && (
        <p className="text-center py-8 text-muted-foreground">{t('common.noResults')}</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Seite {page} von {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
