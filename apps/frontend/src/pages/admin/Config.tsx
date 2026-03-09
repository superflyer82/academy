import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getConfig, updateConfig } from '@/services/admin.service';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

const CONFIG_FIELDS = [
  { key: 'city_name', label: 'Stadtname', placeholder: 'Musterhausen' },
  { key: 'city_lat', label: 'Karten-Latitude', placeholder: '51.1' },
  { key: 'city_lng', label: 'Karten-Longitude', placeholder: '10.0' },
  { key: 'primary_color', label: 'Primärfarbe (Hex)', placeholder: '#2563eb' },
  { key: 'contact_email', label: 'Kontakt-E-Mail', placeholder: 'info@musterhausen.de' },
  { key: 'footer_text', label: 'Footer-Text', placeholder: 'Stadt Musterhausen' },
];

export default function Config() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
  });

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: () => updateConfig(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-xl">
        <h1 className="text-2xl font-bold">Einstellungen</h1>

        {isLoading && <p className="text-muted-foreground">{t('common.loading')}</p>}

        {!isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Allgemeine Konfiguration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CONFIG_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <Label htmlFor={`cfg-${key}`}>{label}</Label>
                  <Input
                    id={`cfg-${key}`}
                    value={form[key] ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="mt-1"
                  />
                </div>
              ))}

              {saveMutation.isSuccess && (
                <p className="text-sm text-green-600">Einstellungen gespeichert.</p>
              )}

              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full">
                {saveMutation.isPending ? 'Wird gespeichert...' : t('common.save')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
