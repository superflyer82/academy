import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getStaff, createStaff } from '@/services/admin.service';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StaffRole } from '@maengelmelder/shared-types';

export default function Staff() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: getStaff,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<{ email: string; name: string; role: StaffRole; department: string }>({ email: '', name: '', role: StaffRole.STAFF, department: '' });

  const createMutation = useMutation({
    mutationFn: () => createStaff(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setDialogOpen(false);
      setForm({ email: '', name: '', role: StaffRole.STAFF, department: '' });
    },
  });

  const ROLE_LABELS: Record<StaffRole, string> = {
    [StaffRole.ADMIN]: 'Administrator',
    [StaffRole.STAFF]: 'Mitarbeiter',
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mitarbeiter</h1>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />Mitarbeiter hinzufügen
          </Button>
        </div>

        {isLoading && <p className="text-muted-foreground">{t('common.loading')}</p>}

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead className="hidden md:table-cell">Abteilung</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s: { id: string; name: string; email: string; role: StaffRole; department?: string; isActive: boolean }) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{ROLE_LABELS[s.role]}</TableCell>
                  <TableCell className="hidden md:table-cell">{s.department ?? '—'}</TableCell>
                  <TableCell>
                    <span className={s.isActive ? 'text-green-600' : 'text-muted-foreground'}>
                      {s.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && staff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Noch keine Mitarbeiter angelegt.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Mitarbeiter hinzufügen</DialogTitle>

        <div className="space-y-3">
          <div>
            <Label htmlFor="staff-name">Name</Label>
            <Input id="staff-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="staff-email">E-Mail</Label>
            <Input id="staff-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="staff-role">Rolle</Label>
            <Select id="staff-role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as StaffRole }))} className="mt-1">
              {Object.values(StaffRole).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="staff-dept">Abteilung (optional)</Label>
            <Input id="staff-dept" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className="mt-1" />
          </div>
          <p className="text-sm text-muted-foreground">Das initiale Passwort wird per E-Mail zugesandt.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.email || !form.name}>
            {createMutation.isPending ? 'Wird erstellt...' : 'Erstellen'}
          </Button>
        </DialogFooter>
      </Dialog>
    </DashboardLayout>
  );
}
