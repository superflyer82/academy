import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { logout } from '@/services/auth.service';

export function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isStaff = user?.role && ['ADMIN', 'STAFF', 'VIEWER'].includes(user.role as string);
  const isCitizen = !isStaff;

  const handleLogout = async () => {
    await logout().catch(() => {});
    clearAuth();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Mängelmelder</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link to="/karte">{t('nav.map')}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/melden">{t('nav.newReport')}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/verfolgen">Verfolgen</Link>
          </Button>

          {isAuthenticated && isCitizen && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/meine-meldungen">{t('nav.myReports')}</Link>
            </Button>
          )}

          {isAuthenticated && isStaff && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">{t('nav.dashboard')}</Link>
            </Button>
          )}

          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>{t('nav.logout')}</Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/anmelden">{t('nav.login')}</Link>
            </Button>
          )}
        </nav>

        {/* Mobile menu button */}
        <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-4 space-y-1">
          {[
            { to: '/karte', label: t('nav.map') },
            { to: '/melden', label: t('nav.newReport') },
            { to: '/verfolgen', label: 'Verfolgen' },
          ].map(({ to, label }) => (
            <Button key={to} asChild variant="ghost" className="w-full justify-start" onClick={() => setMenuOpen(false)}>
              <Link to={to}>{label}</Link>
            </Button>
          ))}

          {isAuthenticated && isCitizen && (
            <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setMenuOpen(false)}>
              <Link to="/meine-meldungen">{t('nav.myReports')}</Link>
            </Button>
          )}
          {isAuthenticated && isStaff && (
            <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setMenuOpen(false)}>
              <Link to="/dashboard">{t('nav.dashboard')}</Link>
            </Button>
          )}
          {isAuthenticated ? (
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>{t('nav.logout')}</Button>
          ) : (
            <Button asChild className="w-full" onClick={() => setMenuOpen(false)}>
              <Link to="/anmelden">{t('nav.login')}</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
