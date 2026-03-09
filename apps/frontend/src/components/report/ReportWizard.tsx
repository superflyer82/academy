import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CategoryPicker } from './CategoryPicker';
import { ReportMap } from '@/components/map/ReportMap';
import { PhotoUpload } from './PhotoUpload';
import { DuplicateWarning } from './DuplicateWarning';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchCategories } from '@/services/categories.service';
import { submitReport, fetchNearby } from '@/services/reports.service';
import { ReportPublic } from '@maengelmelder/shared-types';
import { cn } from '@/lib/utils';

type WizardStep = 1 | 2 | 3 | 4;

interface FormState {
  categoryId: string;
  lat?: number;
  lng?: number;
  address?: string;
  description?: string;
  photos: File[];
  reporterName?: string;
  reporterEmail?: string;
  notifyOnUpdate: boolean;
}

const STEPS = [1, 2, 3, 4] as const;

export function ReportWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<FormState>({ categoryId: '', photos: [], notifyOnUpdate: false });
  const [duplicates, setDuplicates] = useState<ReportPublic[]>([]);

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const submitMutation = useMutation({
    mutationFn: () => submitReport(
      { categoryId: form.categoryId, lat: form.lat!, lng: form.lng!, description: form.description, address: form.address, reporterName: form.reporterName, reporterEmail: form.reporterEmail, notifyOnUpdate: form.notifyOnUpdate },
      form.photos
    ),
    onSuccess: (data) => navigate(`/meldung-bestaetigung/${data.publicToken}`),
  });

  const checkDuplicates = async () => {
    if (form.lat && form.lng && form.categoryId) {
      const nearby = await fetchNearby(form.lat, form.lng, form.categoryId);
      setDuplicates(nearby);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!form.categoryId;
    if (step === 2) return form.lat !== undefined && form.lng !== undefined;
    return true;
  };

  const nextStep = async () => {
    if (step === 3) await checkDuplicates();
    setStep((prev) => (Math.min(prev + 1, 4) as WizardStep));
  };

  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress indicator */}
      <div className="flex items-center mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4} aria-label="Schritt-Anzeige">
        {STEPS.map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
              step > s ? 'bg-green-500 text-white' : step === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            )}>
              {step > s ? '✓' : s}
            </div>
            <div className="text-xs ml-2 hidden sm:block text-muted-foreground">{t(`report.steps.${s}`)}</div>
            {s < 4 && <div className={cn('flex-1 h-0.5 mx-2', step > s ? 'bg-green-500' : 'bg-muted')} />}
          </div>
        ))}
      </div>

      {/* Step 1: Category */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-6">{t('report.category')}</h2>
          <CategoryPicker categories={categories} selected={form.categoryId} onSelect={(id) => setForm({ ...form, categoryId: id })} />
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('report.location')}</h2>
          <ReportMap lat={form.lat} lng={form.lng} onChange={(lat, lng) => setForm({ ...form, lat, lng })} />
          <div className="mt-4">
            <Label htmlFor="address">{t('report.location')} (Adresse)</Label>
            <Input id="address" placeholder="Straße, Hausnummer, Stadt" value={form.address ?? ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" />
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Details</h2>
          <div>
            <Label htmlFor="description">{t('report.description')}</Label>
            <textarea
              id="description"
              rows={4}
              placeholder={t('report.descriptionPlaceholder')}
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength={2000}
              className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <PhotoUpload files={form.photos} onChange={(photos) => setForm({ ...form, photos })} />
          <div className="space-y-3">
            <p className="text-sm font-medium">{t('report.contact')} <span className="text-muted-foreground font-normal">({t('common.optional')})</span></p>
            <p className="text-xs text-muted-foreground">{t('report.contactHint')}</p>
            <Input placeholder={t('report.name')} value={form.reporterName ?? ''} onChange={(e) => setForm({ ...form, reporterName: e.target.value })} />
            <Input type="email" placeholder={t('report.email')} value={form.reporterEmail ?? ''} onChange={(e) => setForm({ ...form, reporterEmail: e.target.value })} />
            {form.reporterEmail && (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.notifyOnUpdate} onChange={(e) => setForm({ ...form, notifyOnUpdate: e.target.checked })} className="rounded" />
                {t('report.notify')}
              </label>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('report.summary')}</h2>
          <DuplicateWarning reports={duplicates} />
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCategory?.icon}</span>
              <span className="font-medium">{selectedCategory?.name}</span>
            </div>
            {form.address && <p className="text-sm">📍 {form.address}</p>}
            {form.lat && form.lng && <p className="text-sm text-muted-foreground">{form.lat.toFixed(5)}, {form.lng.toFixed(5)}</p>}
            {form.description && <p className="text-sm">{form.description}</p>}
            {form.photos.length > 0 && <p className="text-sm">{form.photos.length} Foto(s)</p>}
            {form.reporterEmail ? (
              <p className="text-sm">✉️ {form.reporterEmail}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Anonym</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep((prev) => (prev - 1) as WizardStep)}>{t('common.back')}</Button>
        ) : <div />}
        {step < 4 ? (
          <Button onClick={nextStep} disabled={!canProceed()}>{t('common.next')}</Button>
        ) : (
          <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? t('common.loading') : t('report.confirmSubmit')}
          </Button>
        )}
      </div>
      {submitMutation.isError && (
        <p className="text-sm text-destructive mt-2" role="alert">Fehler beim Absenden. Bitte erneut versuchen.</p>
      )}
    </div>
  );
}
