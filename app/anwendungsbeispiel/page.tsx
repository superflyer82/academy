import { SchulbescheinigungForm } from '@/components/schulbescheinigung-form';

export default function AnwendungsbeispielPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-pd-blue md:text-4xl">
        Anwendungsbeispiel
      </h1>
      <p className="mt-2 text-muted-foreground">
        Formular nach XSchule-Schema „Schulbescheinigung“ – demonstriert clientseitige Validierung
        (Zod) und barrierefreie Eingaben (WCAG 2.1 AA).
      </p>
      <div className="mt-8">
        <SchulbescheinigungForm />
      </div>
    </>
  );
}
