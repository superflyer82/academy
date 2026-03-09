import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, FileText, BarChart2, Tag, Users, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { logout } from '@/services/auth.service';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Meldungen', icon: <FileText className="h-4 w-4" /> },
  { to: '/dashboard/statistiken', label: 'Statistiken', icon: <BarChart2 className="h-4 w-4" /> },
  { to: '/dashboard/kategorien', label: 'Kategorien', icon: <Tag className="h-4 w-4" />, adminOnly: true },
  { to: '/dashboard/mitarbeiter', label: 'Mitarbeiter', icon: <Users className="h-4 w-4" />, adminOnly: true },
  { to: '/dashboard/einstellungen', label: 'Einstellungen', icon: <Settings className="h-4 w-4" />, adminOnly: true },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useTranslation();
  const { user, logout: clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout().catch(() => {});
    clearAuth();
    navigate('/dashboard/login');
  };

  const isAdmin = user?.role === 'ADMIN';
  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  const Sidebar = () => (
    <nav className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <span>{t('dashboard.title')}</span>
        </Link>
      </div>
      <ul className="flex-1 p-3 space-y-1">
        {visibleItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                location.pathname === item.to
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-3 border-t">
        <div className="text-xs text-muted-foreground mb-2 px-3">{user?.name}</div>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />{t('nav.logout')}
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-56 bg-background border-r z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 border-b shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-semibold">{t('dashboard.title')}</span>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
