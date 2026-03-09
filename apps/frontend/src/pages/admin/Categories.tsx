import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categories.service';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Category } from '@maengelmelder/shared-types';

interface CategoryForm {
  name: string;
  icon: string;
  color: string;
  responsibleDepartment: string;
  targetResolutionDays: number;
  isActive: boolean;
}

const DEFAULT_FORM: CategoryForm = {
  name: '',
  icon: '📍',
  color: '#2563eb',
  responsibleDepartment: '',
  targetResolutionDays: 14,
  isActive: true,
};

export default function Categories() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: fetchAllCategories,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(DEFAULT_FORM);

  const openCreate = () => {
    setEditId(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      responsibleDepartment: cat.responsibleDepartment,
      targetResolutionDays: cat.targetResolutionDays,
      isActive: cat.isActive,
    });
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: () =>
      editId ? updateCategory(editId, form) : createCategory(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kategorien</h1>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" />Neue Kategorie
          </Button>
        </div>

        {isLoading && <p className="text-muted-foreground">{t('common.loading')}</p>}

        <div className="grid gap-3">
          {categories.map((cat) => (
            <Card key={cat.id} className={!cat.isActive ? 'opacity-60' : undefined}>
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">{cat.responsibleDepartment} · {cat.targetResolutionDays} Tage Ziel</p>
                </div>
                <div
                  className="h-4 w-4 rounded-full border shrink-0"
                  style={{ backgroundColor: cat.color }}
                  title={cat.color}
                />
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat)} aria-label={`${cat.name} bearbeiten`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(cat.id)}
                    disabled={deleteMutation.isPending}
                    aria-label={`${cat.name} löschen`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editId ? 'Kategorie bearbeiten' : 'Neue Kategorie'}</DialogTitle>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="cat-icon">Icon (Emoji)</Label>
              <Input id="cat-icon" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="cat-dept">Zuständige Abteilung</Label>
            <Input id="cat-dept" value={form.responsibleDepartment} onChange={(e) => setForm((f) => ({ ...f, responsibleDepartment: e.target.value }))} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cat-days">Bearbeitungsziel (Tage)</Label>
              <Input
                id="cat-days"
                type="number"
                min={1}
                value={form.targetResolutionDays}
                onChange={(e) => setForm((f) => ({ ...f, targetResolutionDays: Number(e.target.value) }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cat-color">Farbe</Label>
              <Input id="cat-color" type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="mt-1 h-10" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
            Aktiv
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name}>
            {saveMutation.isPending ? 'Wird gespeichert...' : t('common.save')}
          </Button>
        </DialogFooter>
      </Dialog>
    </DashboardLayout>
  );
}
