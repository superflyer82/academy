'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  schulbescheinigungSchema,
  type SchulbescheinigungFormData,
} from '@/lib/schulbescheinigung-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SchulbescheinigungForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SchulbescheinigungFormData>({
    resolver: zodResolver(schulbescheinigungSchema),
    defaultValues: {
      ausstellungsort: '',
      familienname: '',
      vorname: '',
      geburtsort: '',
      staatsangehoerigkeit: 'Deutschland',
      strasse: '',
      hausnummer: '',
      plz: '',
      wohnort: '',
      staat: 'Deutschland',
      jahrgangsstufe: '',
      schulname: '',
      schuleStrasse: '',
      schuleHausnummer: '',
      schulePlz: '',
      schuleOrt: '',
      schuleTelefon: '',
      schuleFax: '',
      artDerTraegerschaft: '',
      schulform: '',
    },
  });

  const onSubmit = (data: SchulbescheinigungFormData) => {
    console.log('Schulbescheinigung (validiert):', data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-10"
      aria-labelledby="form-title"
    >
      <h2 id="form-title" className="sr-only">
        Schulbescheinigung ausfüllen
      </h2>

      {/* Ausstellung */}
      <fieldset className="rounded-2xl border-2 border-pd-blue/25 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <legend className="text-lg font-medium text-pd-blue">
          Ausstellung
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ausstellungsdatum">Ausstellungsdatum</Label>
            <Input
              id="ausstellungsdatum"
              type="date"
              {...register('ausstellungsdatum')}
              aria-invalid={!!errors.ausstellungsdatum}
              aria-describedby={errors.ausstellungsdatum ? 'ausstellungsdatum-error' : undefined}
              className="mt-1"
            />
            {errors.ausstellungsdatum && (
              <p id="ausstellungsdatum-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.ausstellungsdatum.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="ausstellungsort">Ort der Ausstellung</Label>
            <Input
              id="ausstellungsort"
              {...register('ausstellungsort')}
              aria-invalid={!!errors.ausstellungsort}
              aria-describedby={errors.ausstellungsort ? 'ausstellungsort-error' : undefined}
              className="mt-1"
            />
            {errors.ausstellungsort && (
              <p id="ausstellungsort-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.ausstellungsort.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="gueltigkeitsdatum">Gültigkeitsdatum</Label>
          <Input
            id="gueltigkeitsdatum"
            type="date"
            {...register('gueltigkeitsdatum')}
            aria-invalid={!!errors.gueltigkeitsdatum}
            aria-describedby={errors.gueltigkeitsdatum ? 'gueltigkeitsdatum-error' : undefined}
            className="mt-1 max-w-xs"
          />
          {errors.gueltigkeitsdatum && (
            <p id="gueltigkeitsdatum-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.gueltigkeitsdatum.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* Schüler:in */}
      <fieldset className="rounded-2xl border-2 border-pd-blue/25 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <legend className="text-lg font-medium text-pd-blue">
          Angaben zur Schülerin / zum Schüler
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="familienname">Familienname</Label>
            <Input
              id="familienname"
              {...register('familienname')}
              aria-invalid={!!errors.familienname}
              aria-describedby={errors.familienname ? 'familienname-error' : undefined}
              className="mt-1"
            />
            {errors.familienname && (
              <p id="familienname-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.familienname.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="vorname">Vorname</Label>
            <Input
              id="vorname"
              {...register('vorname')}
              aria-invalid={!!errors.vorname}
              aria-describedby={errors.vorname ? 'vorname-error' : undefined}
              className="mt-1"
            />
            {errors.vorname && (
              <p id="vorname-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.vorname.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="geburtsdatum">Geburtsdatum</Label>
            <Input
              id="geburtsdatum"
              type="date"
              {...register('geburtsdatum')}
              aria-invalid={!!errors.geburtsdatum}
              aria-describedby={errors.geburtsdatum ? 'geburtsdatum-error' : undefined}
              className="mt-1"
            />
            {errors.geburtsdatum && (
              <p id="geburtsdatum-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.geburtsdatum.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="geburtsort">Geburtsort</Label>
            <Input
              id="geburtsort"
              {...register('geburtsort')}
              aria-invalid={!!errors.geburtsort}
              aria-describedby={errors.geburtsort ? 'geburtsort-error' : undefined}
              className="mt-1"
            />
            {errors.geburtsort && (
              <p id="geburtsort-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.geburtsort.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="staatsangehoerigkeit">Staatsangehörigkeit</Label>
          <Input
            id="staatsangehoerigkeit"
            {...register('staatsangehoerigkeit')}
            aria-invalid={!!errors.staatsangehoerigkeit}
            aria-describedby={errors.staatsangehoerigkeit ? 'staatsangehoerigkeit-error' : undefined}
            className="mt-1 max-w-xs"
          />
          {errors.staatsangehoerigkeit && (
            <p id="staatsangehoerigkeit-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.staatsangehoerigkeit.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* Anschrift Schüler:in */}
      <fieldset className="rounded-2xl border-2 border-pd-blue/25 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <legend className="text-lg font-medium text-pd-blue">
          Anschrift
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="strasse">Straße</Label>
            <Input
              id="strasse"
              {...register('strasse')}
              aria-invalid={!!errors.strasse}
              aria-describedby={errors.strasse ? 'strasse-error' : undefined}
              className="mt-1"
            />
            {errors.strasse && (
              <p id="strasse-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.strasse.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="hausnummer">Hausnummer</Label>
            <Input
              id="hausnummer"
              {...register('hausnummer')}
              aria-invalid={!!errors.hausnummer}
              aria-describedby={errors.hausnummer ? 'hausnummer-error' : undefined}
              className="mt-1 max-w-[120px]"
            />
            {errors.hausnummer && (
              <p id="hausnummer-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.hausnummer.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="plz">Postleitzahl</Label>
            <Input
              id="plz"
              inputMode="numeric"
              maxLength={5}
              {...register('plz')}
              aria-invalid={!!errors.plz}
              aria-describedby={errors.plz ? 'plz-error' : undefined}
              className="mt-1 max-w-[120px]"
            />
            {errors.plz && (
              <p id="plz-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.plz.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="wohnort">Ort</Label>
            <Input
              id="wohnort"
              {...register('wohnort')}
              aria-invalid={!!errors.wohnort}
              aria-describedby={errors.wohnort ? 'wohnort-error' : undefined}
              className="mt-1"
            />
            {errors.wohnort && (
              <p id="wohnort-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.wohnort.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="staat">Staat</Label>
          <Input
            id="staat"
            {...register('staat')}
            aria-invalid={!!errors.staat}
            aria-describedby={errors.staat ? 'staat-error' : undefined}
            className="mt-1 max-w-xs"
          />
          {errors.staat && (
            <p id="staat-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.staat.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* Schulbesuch */}
      <fieldset className="rounded-2xl border-2 border-pd-blue/25 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <legend className="text-lg font-medium text-pd-blue">
          Schulbesuch
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="jahrgangsstufe">Jahrgangsstufe</Label>
            <Input
              id="jahrgangsstufe"
              {...register('jahrgangsstufe')}
              placeholder="z. B. Qualifikationsphase 2"
              aria-invalid={!!errors.jahrgangsstufe}
              aria-describedby={errors.jahrgangsstufe ? 'jahrgangsstufe-error' : undefined}
              className="mt-1"
            />
            {errors.jahrgangsstufe && (
              <p id="jahrgangsstufe-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.jahrgangsstufe.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="schulbesuchEnde">Schulbesuch voraussichtlich bis</Label>
            <Input
              id="schulbesuchEnde"
              type="date"
              {...register('schulbesuchEnde')}
              aria-invalid={!!errors.schulbesuchEnde}
              aria-describedby={errors.schulbesuchEnde ? 'schulbesuchEnde-error' : undefined}
              className="mt-1"
            />
            {errors.schulbesuchEnde && (
              <p id="schulbesuchEnde-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.schulbesuchEnde.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Schule */}
      <fieldset className="rounded-2xl border-2 border-pd-blue/25 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <legend className="text-lg font-medium text-pd-blue">
          Schule
        </legend>
        <div className="mt-4">
          <Label htmlFor="schulname">Name der Schule</Label>
          <Input
            id="schulname"
            {...register('schulname')}
            aria-invalid={!!errors.schulname}
            aria-describedby={errors.schulname ? 'schulname-error' : undefined}
            className="mt-1"
          />
          {errors.schulname && (
            <p id="schulname-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.schulname.message}
            </p>
          )}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="schuleStrasse">Straße</Label>
            <Input
              id="schuleStrasse"
              {...register('schuleStrasse')}
              aria-invalid={!!errors.schuleStrasse}
              aria-describedby={errors.schuleStrasse ? 'schuleStrasse-error' : undefined}
              className="mt-1"
            />
            {errors.schuleStrasse && (
              <p id="schuleStrasse-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.schuleStrasse.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="schuleHausnummer">Hausnummer</Label>
            <Input
              id="schuleHausnummer"
              {...register('schuleHausnummer')}
              aria-invalid={!!errors.schuleHausnummer}
              aria-describedby={errors.schuleHausnummer ? 'schuleHausnummer-error' : undefined}
              className="mt-1 max-w-[120px]"
            />
            {errors.schuleHausnummer && (
              <p id="schuleHausnummer-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.schuleHausnummer.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="schulePlz">Postleitzahl</Label>
            <Input
              id="schulePlz"
              inputMode="numeric"
              maxLength={5}
              {...register('schulePlz')}
              aria-invalid={!!errors.schulePlz}
              aria-describedby={errors.schulePlz ? 'schulePlz-error' : undefined}
              className="mt-1 max-w-[120px]"
            />
            {errors.schulePlz && (
              <p id="schulePlz-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.schulePlz.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="schuleOrt">Ort</Label>
            <Input
              id="schuleOrt"
              {...register('schuleOrt')}
              aria-invalid={!!errors.schuleOrt}
              aria-describedby={errors.schuleOrt ? 'schuleOrt-error' : undefined}
              className="mt-1"
            />
            {errors.schuleOrt && (
              <p id="schuleOrt-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.schuleOrt.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="schuleTelefon">Telefon</Label>
            <Input
              id="schuleTelefon"
              type="tel"
              {...register('schuleTelefon')}
              aria-invalid={!!errors.schuleTelefon}
              aria-describedby={errors.schuleTelefon ? 'schuleTelefon-error' : undefined}
              className="mt-1"
            />
            {errors.schuleTelefon && (
              <p id="schuleTelefon-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.schuleTelefon.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="schuleFax">Fax (optional)</Label>
            <Input
              id="schuleFax"
              type="tel"
              {...register('schuleFax')}
              className="mt-1"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="artDerTraegerschaft">Art der Trägerschaft</Label>
            <Input
              id="artDerTraegerschaft"
              {...register('artDerTraegerschaft')}
              placeholder="z. B. Kommune"
              aria-invalid={!!errors.artDerTraegerschaft}
              aria-describedby={errors.artDerTraegerschaft ? 'artDerTraegerschaft-error' : undefined}
              className="mt-1"
            />
            {errors.artDerTraegerschaft && (
              <p id="artDerTraegerschaft-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.artDerTraegerschaft.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="schulform">Schulform</Label>
            <Input
              id="schulform"
              {...register('schulform')}
              placeholder="z. B. Gymnasium"
              aria-invalid={!!errors.schulform}
              aria-describedby={errors.schulform ? 'schulform-error' : undefined}
              className="mt-1"
            />
            {errors.schulform && (
              <p id="schulform-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.schulform.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg">
          Prüfen und absenden
        </Button>
        {isSubmitSuccessful && (
          <p className="text-sm text-green-700" role="status">
            Alle Angaben sind gültig. (Demo: keine Übermittlung.)
          </p>
        )}
      </div>
    </form>
  );
}
