'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems: { href: string; label: string }[] = [
  { href: '/', label: 'Begrüßung' },
  { href: '/anwendungsbeispiel', label: 'Anwendungsbeispiel' },
  { href: '/staerken-offene-fragen', label: 'Stärken und offene Fragen des Vibecodings' },
  { href: '/use-cases', label: 'Use-Cases' },
  { href: '/architektur', label: 'Architektur' },
  { href: '/abschluss', label: 'Abschluss' },
];

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={onOpenChange}
      className="flex flex-col border-r border-pd-blue/20 bg-white"
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-pd-blue/30 bg-pd-blue px-3">
        <Collapsible.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? 'Navigation einklappen' : 'Navigation ausklappen'}
            aria-expanded={open}
            className="shrink-0 text-white hover:bg-pd-blue-light hover:text-white"
          >
            {open ? <ChevronLeft className="h-5 w-5" aria-hidden /> : <ChevronRight className="h-5 w-5" aria-hidden />}
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content asChild forceMount>
          <span className="flex items-center gap-2 overflow-hidden text-white">
            <Menu className="h-5 w-5 shrink-0 text-white/90" aria-hidden />
            <span className="truncate text-sm font-semibold text-white">PDAcademy</span>
          </span>
        </Collapsible.Content>
      </div>
      <Collapsible.Content forceMount className="flex flex-1 flex-col overflow-hidden data-[state=closed]:hidden">
        <nav
          className="flex-1 overflow-y-auto p-3"
          aria-label="Hauptnavigation"
        >
          <ul className="space-y-1">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pd-blue focus-visible:ring-inset',
                      isActive
                        ? 'bg-pd-blue/15 text-pd-blue font-medium ring-1 ring-pd-blue/20'
                        : 'text-pd-gray hover:bg-pd-blue/5 hover:text-pd-blue'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="line-clamp-2 break-words leading-snug">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
