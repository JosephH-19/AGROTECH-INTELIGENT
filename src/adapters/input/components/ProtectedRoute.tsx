import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@shared/store/auth/authStore';
import { useParcelsStore } from '@shared/store/parcels/parcelsStore';
import { useCropsStore } from '@shared/store/crops/cropsStore';
import { useAlertsStore } from '@shared/store/alerts/alertsStore';
import { RoutePaths } from '@shared/constants/routePaths';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const fetchParcels = useParcelsStore((s) => s.fetchParcels);
  const fetchCrops = useCropsStore((s) => s.fetchCrops);
  const fetchAlerts = useAlertsStore((s) => s.fetchAlerts);

  useEffect(() => {
    if (isAuthenticated) {
      fetchParcels();
      fetchCrops();
      fetchAlerts();
    }
  }, [isAuthenticated, fetchParcels, fetchCrops, fetchAlerts]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-agro-bg via-white to-agro-bg/70">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-agro-primary border-t-transparent" />
          <p className="text-sm text-agro-text-secondary">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={RoutePaths.login} replace />;
  }

  return <>{children}</>;
};
