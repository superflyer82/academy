import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'PDAcademy – academy.newlink.de',
  description: 'Moderne, barrierefreie Web-App für die PDAcademy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="font-sans">
      <body className="min-h-screen font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-pd-blue focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Zum Hauptinhalt springen
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
