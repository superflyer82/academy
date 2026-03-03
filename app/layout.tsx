import type { Metadata } from 'next';
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
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
