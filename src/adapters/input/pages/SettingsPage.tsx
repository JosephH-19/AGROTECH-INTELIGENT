import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@shared/store/auth/authStore';
import { useParcelsStore } from '@shared/store/parcels/parcelsStore';
import { useCropsStore } from '@shared/store/crops/cropsStore';
import { useAlertsStore } from '@shared/store/alerts/alertsStore';
import { PageShell } from '../components/PageShell';

const NOTIF_KEY = 'agrotech_notifications';

interface NotifPrefs {
  critical: boolean;
  recommendations: boolean;
  weeklyReports: boolean;
  autoSync: boolean;
}

function loadNotifs(): NotifPrefs {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : { critical: true, recommendations: true, weeklyReports: true, autoSync: true };
  } catch {
    return { critical: true, recommendations: true, weeklyReports: true, autoSync: true };
  }
}

function getCacheSize(): string {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && !k.startsWith('sb-') && k !== NOTIF_KEY) {
      total += localStorage.getItem(k)?.length ?? 0;
    }
  }
  return total > 1024 ? `${(total / 1024).toFixed(1)} KB` : `${total} B`;
}

function countOfflineData(): number {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('offline_') || k === NOTIF_KEY) count++;
  }
  return count;
}

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser, logout } = useAuthStore();
  const { parcels } = useParcelsStore();
  const { crops } = useCropsStore();
  const { alerts } = useAlertsStore();
  const [notifs, setNotifs] = useState<NotifPrefs>(loadNotifs);
  const [msg, setMsg] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  }, [notifs]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    updateUser({ language: lang as 'es' | 'qu' | 'en' });
  };

  const handleSync = async () => {
    setSyncing(true);
    setMsg('');
    try {
      await Promise.all([
        useParcelsStore.getState().fetchParcels(),
        useCropsStore.getState().fetchCrops(),
        useAlertsStore.getState().fetchAlerts(),
      ]);
      setMsg('Datos sincronizados correctamente');
    } catch {
      setMsg('Error al sincronizar');
    }
    setSyncing(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleClearCache = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && !k.startsWith('sb-') && k !== NOTIF_KEY) {
        keys.push(k);
      }
    }
    keys.forEach(k => localStorage.removeItem(k));
    setMsg('Cache local limpiado');
    setTimeout(() => setMsg(''), 3000);
  };

  const notifItems = [
    { key: 'critical' as const, label: 'Alertas críticas (heladas, plagas)' },
    { key: 'recommendations' as const, label: 'Recomendaciones agrícolas' },
    { key: 'weeklyReports' as const, label: 'Reportes semanales' },
    { key: 'autoSync' as const, label: 'Sincronización automática' },
  ];

  return (
    <PageShell title={t('settings.title')} subtitle={t('settings.description')}>
      <div className="space-y-5">
        <div className="card p-6">
          <h3 className="section-title mb-4">Perfil</h3>
          {user && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Nombre', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Teléfono', value: user.phone || '--' },
                { label: 'Rol', value: t(`auth.${user.role}`) },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-agro-muted/50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-agro-text-secondary">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-agro-text">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="section-title mb-4">Idioma</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'es', label: 'Español' },
              { key: 'qu', label: 'Quechua' },
              { key: 'en', label: 'English' },
            ].map((lang) => (
              <button
                key={lang.key}
                onClick={() => changeLanguage(lang.key)}
                className={`rounded-lg px-5 py-2.5 text-xs font-semibold transition-all ${
                  i18n.language === lang.key
                    ? 'bg-agro-primary text-white shadow-sm'
                    : 'border border-agro-border/60 text-agro-text-secondary hover:border-agro-text-secondary/30'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="section-title mb-4">Notificaciones</h3>
          <div className="space-y-2">
            {notifItems.map((item) => (
              <label key={item.key} className="flex items-center gap-3 rounded-xl bg-agro-muted/50 px-4 py-3 transition-colors hover:bg-agro-muted">
                <input
                  type="checkbox"
                  checked={notifs[item.key]}
                  onChange={(e) => setNotifs(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-agro-border/60 text-agro-primary focus:ring-agro-primary/20"
                />
                <span className="text-xs text-agro-text">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="section-title mb-4">Sincronización</h3>
          <div className="space-y-3 text-xs text-agro-text-secondary">
            <p>Parcelas: {parcels.length} | Cultivos: {crops.length} | Alertas: {alerts.length}</p>
            <p>Datos en cache local: {countOfflineData()} elementos ({getCacheSize()})</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleSync} disabled={syncing} className="btn-primary text-xs">
              {syncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
            </button>
            <button onClick={handleClearCache} className="btn-outline text-xs">
              Limpiar Cache
            </button>
          </div>
          {msg && <p className="mt-3 text-xs font-medium text-green-700">{msg}</p>}
        </div>

        <div className="card p-6">
          <h3 className="section-title mb-4">Cerrar Sesion</h3>
          <button onClick={logout} className="btn-danger text-xs">
            Cerrar Sesion
          </button>
        </div>

        <div className="card p-6">
          <h3 className="section-title mb-4">Acerca de</h3>
          <div className="text-xs text-agro-text-secondary space-y-1">
            <p><strong className="text-agro-text">AgroTech Inteligente</strong> - Plataforma Agricola Inteligente</p>
            <p>Version 1.0.0</p>
            <p>Universidad Continental - Diseno de Software 2025</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
