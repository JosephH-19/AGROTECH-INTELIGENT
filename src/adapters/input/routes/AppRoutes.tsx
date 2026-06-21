import { Route, Routes, Outlet } from 'react-router-dom';
import { RoutePaths } from '@shared/constants/routePaths';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ParcelsPage } from '../pages/ParcelsPage';
import { CropsPage } from '../pages/CropsPage';
import { ClimatePage } from '../pages/ClimatePage';
import { AlertsPage } from '../pages/AlertsPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { OfflineSyncPage } from '../pages/OfflineSyncPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';

const ProtectedLayout = () => (
  <ProtectedRoute>
    <AppLayout>
      <Outlet />
    </AppLayout>
  </ProtectedRoute>
);

export const AppRoutes = () => (
  <Routes>
    <Route path={RoutePaths.login} element={<LoginPage />} />
    <Route path={RoutePaths.register} element={<RegisterPage />} />
    <Route element={<ProtectedLayout />}>
      <Route path={RoutePaths.home} element={<DashboardPage />} />
      <Route path={RoutePaths.parcels} element={<ParcelsPage />} />
      <Route path={RoutePaths.crops} element={<CropsPage />} />
      <Route path={RoutePaths.climate} element={<ClimatePage />} />
      <Route path={RoutePaths.alerts} element={<AlertsPage />} />
      <Route path={RoutePaths.recommendations} element={<RecommendationsPage />} />
      <Route path={RoutePaths.reports} element={<ReportsPage />} />
      <Route path={RoutePaths.settings} element={<SettingsPage />} />
      <Route path={RoutePaths.offlineSync} element={<OfflineSyncPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
