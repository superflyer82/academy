'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen w-full">
      <aside
        className="shrink-0 transition-[width] duration-200 ease-out"
        style={{ width: sidebarOpen ? 280 : 72 }}
        aria-label="Seitennavigation"
      >
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      </aside>
      <main
        id="main-content"
        className="flex-1 overflow-auto bg-background border-l-4 border-pd-blue/20"
        role="main"
      >
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
        <footer className="mt-auto border-t border-pd-blue/20 bg-pd-blue py-6 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm">
              © PDAcademy · In Anlehnung an die Corporate Identity der{' '}
              <a href="https://www.pd-g.de" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white/90">
                PD – Berater der öffentlichen Hand
              </a>
              {' '}· <a href="#" className="underline underline-offset-2 hover:text-white/90">Impressum</a> · <a href="#" className="underline underline-offset-2 hover:text-white/90">Datenschutz</a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
