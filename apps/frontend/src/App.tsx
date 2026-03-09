import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { useAuthStore } from '@/store/auth.store';

// Public pages (lazy-loaded)
const Home = lazy(() => import('@/pages/public/Home'));
const ReportForm = lazy(() => import('@/pages/public/ReportForm'));
const ReportSuccess = lazy(() => import('@/pages/public/ReportSuccess'));
const ReportsMap = lazy(() => import('@/pages/public/ReportsMap'));
const ReportsList = lazy(() => import('@/pages/public/ReportsList'));
const ReportDetail = lazy(() => import('@/pages/public/ReportDetail'));
const TrackReport = lazy(() => import('@/pages/public/TrackReport'));

// Citizen pages
const CitizenLogin = lazy(() => import('@/pages/citizen/Login'));
const Register = lazy(() => import('@/pages/citizen/Register'));
const MyReports = lazy(() => import('@/pages/citizen/MyReports'));

// Staff/Admin pages
const StaffLogin = lazy(() => import('@/pages/admin/StaffLogin'));
const ReportsTable = lazy(() => import('@/pages/admin/ReportsTable'));
const ReportDetailDashboard = lazy(() => import('@/pages/admin/ReportDetailDashboard'));
const Stats = lazy(() => import('@/pages/admin/Stats'));
const Categories = lazy(() => import('@/pages/admin/Categories'));
const Staff = lazy(() => import('@/pages/admin/Staff'));
const Config = lazy(() => import('@/pages/admin/Config'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
      Wird geladen...
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/anmelden" replace />;
  return <>{children}</>;
}

function RequireStaff({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/dashboard/login" replace />;
  const isStaff = ['ADMIN', 'STAFF', 'VIEWER'].includes(user.role as string);
  if (!isStaff) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// Pages without Navbar (full-screen layouts)
const FULL_SCREEN_ROUTES = ['/dashboard'];

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes with Navbar */}
        <Route element={<AppLayout><Suspense fallback={<Loading />}><Routes></Routes></Suspense></AppLayout>}>
        </Route>

        {/* Public pages */}
        <Route path="/" element={<AppLayout><Suspense fallback={<Loading />}><Home /></Suspense></AppLayout>} />
        <Route path="/melden" element={<AppLayout><Suspense fallback={<Loading />}><ReportForm /></Suspense></AppLayout>} />
        <Route path="/melden/erfolg/:publicToken" element={<AppLayout><Suspense fallback={<Loading />}><ReportSuccess /></Suspense></AppLayout>} />
        <Route path="/karte" element={<ReportsMap />} />
        <Route path="/meldungen" element={<AppLayout><Suspense fallback={<Loading />}><ReportsList /></Suspense></AppLayout>} />
        <Route path="/meldungen/:id" element={<AppLayout><Suspense fallback={<Loading />}><ReportDetail /></Suspense></AppLayout>} />
        <Route path="/verfolgen" element={<AppLayout><Suspense fallback={<Loading />}><TrackReport /></Suspense></AppLayout>} />
        <Route path="/verfolgen/:publicToken" element={<AppLayout><Suspense fallback={<Loading />}><TrackReport /></Suspense></AppLayout>} />

        {/* Citizen auth */}
        <Route path="/anmelden" element={<CitizenLogin />} />
        <Route path="/registrieren" element={<Register />} />
        <Route path="/meine-meldungen" element={<RequireAuth><AppLayout><Suspense fallback={<Loading />}><MyReports /></Suspense></AppLayout></RequireAuth>} />

        {/* Staff / Dashboard */}
        <Route path="/dashboard/login" element={<StaffLogin />} />
        <Route path="/dashboard" element={<RequireStaff><Suspense fallback={<Loading />}><ReportsTable /></Suspense></RequireStaff>} />
        <Route path="/dashboard/meldungen/:id" element={<RequireStaff><Suspense fallback={<Loading />}><ReportDetailDashboard /></Suspense></RequireStaff>} />
        <Route path="/dashboard/statistiken" element={<RequireStaff><Suspense fallback={<Loading />}><Stats /></Suspense></RequireStaff>} />
        <Route path="/dashboard/kategorien" element={<RequireStaff><Suspense fallback={<Loading />}><Categories /></Suspense></RequireStaff>} />
        <Route path="/dashboard/mitarbeiter" element={<RequireStaff><Suspense fallback={<Loading />}><Staff /></Suspense></RequireStaff>} />
        <Route path="/dashboard/einstellungen" element={<RequireStaff><Suspense fallback={<Loading />}><Config /></Suspense></RequireStaff>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
