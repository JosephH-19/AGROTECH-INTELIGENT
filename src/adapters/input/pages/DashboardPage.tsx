import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePaths } from '@shared/constants/routePaths';
import { useParcelsStore } from '@shared/store/parcels/parcelsStore';
import { useCropsStore } from '@shared/store/crops/cropsStore';
import { useAlertsStore } from '@shared/store/alerts/alertsStore';
import { useClimateStore } from '@shared/store/climate/climateStore';
import { PageShell } from '../components/PageShell';
import { NasaSatelliteMap } from '../components/NasaSatelliteMap'; // Integración de la NASA
import { AiChatWindow } from '../components/AiChatWindow'; // Integración de la IA

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

  // MAPEADO GLOBAL: Dibujamos todas las parcelas en el mapa general del Dashboard para control territorial
  const mappedParcelsForMap = parcels.map((p) => ({
    id: p.id,
    name: p.name,
    lat: p.lat || -12.0833,
    lng: p.lng || -75.2167,
    crop: crops.find((c) => c.parcelId === p.id) 
      ? t(`crops.types.${crops.find((c) => c.parcelId === p.id)?.type}`) 
      : 'Sin cultivo asignado',
  }));

  const mapCenter: [number, number] = parcels.length > 0 && parcels[0].lat && parcels[0].lng
    ? [parcels[0].lat, parcels[0].lng]
    : [-12.0833, -75.2167];

  // Generamos el informe contextual consolidado para que la IA brinde soporte en base a la situación general actual
  const dashboardContext = `Informe operativo actual de AgroTech-J: Contamos con ${parcels.length} parcelas bajo control, ${activeCrops.length} cultivos activos en desarrollo y ${unreadAlerts.length} alertas agroclimáticas críticas sin resolver. El clima promedio de hoy reporta ${climate?.temp ?? 'N/A'}°C. Actúa como director técnico agrícola y bríndame un diagnóstico ejecutivo compacto junto con las 3 prioridades del día.`;

  return (
    <PageShell title={t('home.title')} subtitle={t('home.description')}>
      {/* 1. SECCIÓN DE MÉTRICAS */}
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

      {/* 2. MAQUETADO DISTRIBUIDO: INFORMACIÓN COMPACTA VS MAPA NASA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        
        {/* Columna Izquierda: Listados de Monitoreo */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            
            {/* Cultivos Activos */}
            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase text-agro-text tracking-wider">Cultivos Activos</h2>
                <Link to={RoutePaths.crops} className="text-[11px] font-semibold text-agro-secondary hover:underline">Ver todos</Link>
              </div>
              {activeCrops.length === 0 ? (
                <p className="py-8 text-center text-xs text-agro-text-secondary">No hay cultivos activos</p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {activeCrops.slice(0, 4).map((crop) => (
                    <div key={crop.id} className="flex items-center justify-between rounded-xl bg-agro-muted/50 px-3 py-2.5">
                      <div>
                        <p className="text-xs font-bold text-agro-text">{t(`crops.types.${crop.type}`)}</p>
                        <p className="text-[10px] text-agro-text-secondary">{crop.parcelName}</p>
                      </div>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        crop.status === 'sowing' ? 'badge-blue' :
                        crop.status === 'growth' ? 'badge-green' :
                        crop.status === 'maturation' ? 'badge-amber' : 'bg-gray-100 text-gray-600'
                      }`}>{t(`crops.statuses.${crop.status}`)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alertas Recientes */}
            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase text-agro-text tracking-wider">Alertas Recientes</h2>
                <Link to={RoutePaths.alerts} className="text-[11px] font-semibold text-agro-secondary hover:underline">Ver todas</Link>
              </div>
              {unreadAlerts.length === 0 ? (
                <p className="py-8 text-center text-xs text-agro-text-secondary">No hay alertas pendientes</p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {unreadAlerts.slice(0, 4).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 rounded-xl bg-agro-muted/50 px-3 py-2.5">
                      <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}>
                        {alert.severity === 'critical' ? '!!' : alert.severity === 'warning' ? '!' : 'i'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-agro-text truncate">{alert.title}</p>
                        <p className="truncate text-[10px] text-agro-text-secondary">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ASISTENTE EJECUTIVO CON IA (Abajo de las listas de control) */}
          <div className="mt-4">
            <h2 className="text-sm font-bold text-agro-text mb-2">Diagnóstico General del Sistema (IA)</h2>
            <AiChatWindow key={dashboardContext} contextAlert={dashboardContext} />
          </div>
        </div>

        {/* Columna Derecha: Vista de Control Satelital de la NASA */}
        <div className="lg:col-span-5">
          <div className="sticky top-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase text-agro-text tracking-wider">Monitoreo Satelital de Parcelas</h2>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">NASA GIBS</span>
            </div>
            <NasaSatelliteMap parcels={mappedParcelsForMap} center={mapCenter} />
          </div>
        </div>

      </div>

      {/* 3. ACCIONES RÁPIDAS */}
      <div className="card p-5 mt-6">
        <h2 className="text-xs font-bold uppercase text-agro-text tracking-wider mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link to={RoutePaths.parcels} className="btn-primary text-xs">Nueva Parcela</Link>
          <Link to={RoutePaths.climate} className="btn-secondary text-xs">Ver Clima</Link>
          <Link to={RoutePaths.alerts} className="btn-primary text-xs bg-amber-500 hover:bg-amber-600 border-none">Ver Alertas</Link>
        </div>
      </div>
    </PageShell>
  );
};