import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BulkActions } from '@/components/dashboard/BulkActions';
import { fetchDashboardReports } from '@/services/reports.service';
import { fetchCategories } from '@/services/categories.service';
import { exportUrl } from '@/services/admin.service';
import { ReportStatus, ReportPriority } from '@maengelmelder/shared-types';
import { formatDate } from '@/lib/utils';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

const PAGE_SIZE = 25;

const PRIORITY_LABELS: Record<ReportPriority, string> = {
  [ReportPriority.LOW]: '⬇ Niedrig',
  [ReportPriority.MEDIUM]: '➡ Mittel',
  [ReportPriority.HIGH]: '⬆ Hoch',
  [ReportPriority.URGENT]: '🔴 Dringend',
};

export default function ReportsTable() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'dashboard', { categoryId, status, search, page }],
    queryFn: () =>
      fetchDashboardReports({
        categoryId: categoryId || undefined,
        status: (status as ReportStatus) || undefined,
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (!data) return;
    const allIds = data.data.map((r) => r.id);
    setSelectedIds(selectedIds.length === allIds.length ? [] : allIds);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold">{t('dashboard.reports')}</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={exportUrl('csv')} download>
                <Download className="h-4 w-4 mr-1" />CSV
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={exportUrl('xlsx')} download>
                <Download className="h-4 w-4 mr-1" />Excel
              </a>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-48"
          />
          <Select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }} className="w-44">
            <option value="">{t('map.allCategories')}</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-44">
            <option value="">{t('map.allStatuses')}</option>
            {Object.values(ReportStatus).map((s) => (
              <option key={s} value={s}>{t(`status.${s}`)}</option>
            ))}
          </Select>
          <Button variant="ghost" size="sm" onClick={() => { setCategoryId(''); setStatus(''); setSearch(''); setPage(1); }}>
            <Filter className="h-4 w-4 mr-1" />Zurücksetzen
          </Button>
          <span className="text-sm text-muted-foreground self-center ml-auto">{data?.total ?? 0} Meldungen</span>
        </div>

        {/* Bulk actions */}
        <BulkActions selectedIds={selectedIds} onClear={() => setSelectedIds([])} />

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={!!data && selectedIds.length === data.data.length && data.data.length > 0}
                    onChange={toggleSelectAll}
                    aria-label={t('dashboard.selectAll')}
                  />
                </TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead className="hidden sm:table-cell">Beschreibung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Priorität</TableHead>
                <TableHead className="hidden lg:table-cell">Standort</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {t('common.noResults')}
                  </TableCell>
                </TableRow>
              )}
              {data?.data.map((r) => (
                <TableRow key={r.id} data-state={selectedIds.includes(r.id) ? 'selected' : undefined}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      aria-label={`Meldung ${r.id} auswählen`}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{r.category?.icon} {r.category?.name}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell max-w-xs">
                    <p className="truncate text-sm text-muted-foreground">{r.description ?? '—'}</p>
                  </TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {PRIORITY_LABELS[r.priority]}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {r.address ?? `${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}`}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(r.createdAt)}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/dashboard/meldungen/${r.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Seite {page} von {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
