import { AppShell } from '@/components/app-shell';

export default function ShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-pd-blue focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Zum Hauptinhalt springen
      </a>
      <AppShell>{children}</AppShell>
    </>
  );
}
