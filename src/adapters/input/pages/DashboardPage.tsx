import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePaths } from '@shared/constants/routePaths';
import { useParcelsStore } from '@shared/store/parcels/parcelsStore';
import { useCropsStore } from '@shared/store/crops/cropsStore';
import { useAlertsStore } from '@shared/store/alerts/alertsStore';
import { useClimateStore } from '@shared/store/climate/climateStore';
import { PageShell } from '../components/PageShell';

const icons = {
  parcels: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/></svg>
  ),
  crops: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/></svg>
  ),
  alerts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
  ),
  temp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
  ),
};

export const DashboardPage = () => {
  const { t } = useTranslation();
  const parcels = useParcelsStore((s) => s.parcels);
  const crops = useCropsStore((s) => s.crops);
  const alerts = useAlertsStore((s) => s.alerts);
  const climate = useClimateStore((s) => s.current);

  const stats = [
    { label: t('home.totalParcels'), value: parcels.length, color: 'bg-green-500', icon: icons.parcels, path: RoutePaths.parcels, desc: `${parcels.length} registradas` },
    { label: t('home.totalCrops'), value: crops.length, color: 'bg-blue-500', icon: icons.crops, path: RoutePaths.crops, desc: `${crops.filter(c => c.status !== 'harvested').length} activos` },
    { label: t('home.activeAlerts'), value: alerts.filter((a) => !a.read).length, color: 'bg-red-500', icon: icons.alerts, path: RoutePaths.alerts, desc: alerts.filter(a => !a.read).length === 0 ? 'sin pendientes' : 'sin atender' },
    { label: 'Temperatura', value: climate ? `${climate.temp}°C` : '--', color: 'bg-amber-500', icon: icons.temp, path: RoutePaths.climate, desc: `humedad ${climate?.humidity ?? '--'}%` },
  ];

  const activeCrops = crops.filter((c) => c.status !== 'harvested');
  const unreadAlerts = alerts.filter((a) => !a.read);

  return (
    <PageShell title={t('home.title')} subtitle={t('home.description')}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.path} className="card-hover p-5">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${stat.color}`}>
                {stat.icon}
              </span>
              <span className="text-2xl font-bold text-agro-text">{stat.value}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-agro-text">{stat.label}</p>
            <p className="mt-0.5 text-xs text-agro-text-secondary">{stat.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">Cultivos Activos</h2>
            <Link to={RoutePaths.crops} className="text-xs font-medium text-agro-secondary hover:underline">Ver todos</Link>
          </div>
          {activeCrops.length === 0 ? (
            <p className="py-8 text-center text-sm text-agro-text-secondary">No hay cultivos activos</p>
          ) : (
            <div className="space-y-2">
              {activeCrops.slice(0, 5).map((crop) => (
                <div key={crop.id} className="flex items-center justify-between rounded-xl bg-agro-muted/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-agro-text">{t(`crops.types.${crop.type}`)}</p>
                    <p className="text-xs text-agro-text-secondary">{crop.parcelName}</p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                    crop.status === 'sowing' ? 'badge-blue' :
                    crop.status === 'growth' ? 'badge-green' :
                    crop.status === 'maturation' ? 'badge-amber' : 'bg-gray-100 text-gray-600'
                  }`}>{t(`crops.statuses.${crop.status}`)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">Alertas Recientes</h2>
            <Link to={RoutePaths.alerts} className="text-xs font-medium text-agro-secondary hover:underline">Ver todas</Link>
          </div>
          {unreadAlerts.length === 0 ? (
            <p className="py-8 text-center text-sm text-agro-text-secondary">No hay alertas pendientes</p>
          ) : (
            <div className="space-y-2">
              {unreadAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 rounded-xl bg-agro-muted/50 px-4 py-3">
                  <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>
                    {alert.severity === 'critical' ? '!!' : alert.severity === 'warning' ? '!' : 'i'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-agro-text">{alert.title}</p>
                    <p className="truncate text-xs text-agro-text-secondary">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="section-title mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link to={RoutePaths.parcels} className="btn-primary text-xs">Nueva Parcela</Link>
          <Link to={RoutePaths.climate} className="btn-secondary text-xs">Ver Clima</Link>
          <Link to={RoutePaths.alerts} className="btn-primary text-xs bg-amber-500 hover:bg-amber-600">Ver Alertas</Link>
        </div>
      </div>
    </PageShell>
  );
};
