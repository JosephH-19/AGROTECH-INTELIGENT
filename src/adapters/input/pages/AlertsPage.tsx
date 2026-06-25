import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlertsStore, AlertSeverity } from '@shared/store/alerts/alertsStore';
import { PageShell } from '../components/PageShell';
import { AiChatWindow } from '../components/AiChatWindow';

const severityStyle: Record<AlertSeverity, { badge: string; icon: string; border: string }> = {
  info: { badge: 'badge-blue', icon: 'i', border: 'border-l-blue-400' },
  warning: { badge: 'badge-amber', icon: '!', border: 'border-l-amber-400' },
  critical: { badge: 'badge-red', icon: '!!', border: 'border-l-red-400' },
};

export const AlertsPage = () => {
  const { t } = useTranslation();
  const { alerts, markAsRead, deleteAlert } = useAlertsStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const [selectedAlertContext, setSelectedAlertContext] = useState<string | undefined>(undefined);
  // Estado para controlar la apertura del asistente virtual de forma global en la página
  const [isChatOpen, setIsChatOpen] = useState(false);

  const filtered = filter === 'unread' ? alerts.filter((a) => !a.read) : alerts;

  const handleConsultIA = (alertTitle: string, alertMessage: string) => {
    setSelectedAlertContext(`${alertTitle}: ${alertMessage}`);
    setIsChatOpen(true); // Abre automáticamente el panel al hacer la consulta
  };

  return (
    <PageShell title={t('alerts.title')} subtitle={t('alerts.description')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-agro-text-secondary">{alerts.filter((a) => !a.read).length} sin leer</p>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${filter === 'all' ? 'bg-agro-secondary text-white shadow-sm' : 'border border-agro-border/60 text-agro-text-secondary hover:border-agro-text-secondary/30'}`}
          >Todas</button>
          <button
            onClick={() => setFilter('unread')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${filter === 'unread' ? 'bg-agro-secondary text-white shadow-sm' : 'border border-agro-border/60 text-agro-text-secondary hover:border-agro-text-secondary/30'}`}
          >No leídas</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-agro-muted text-2xl text-agro-text-secondary">-</div>
          <p className="mt-4 text-sm text-agro-text-secondary">{t('alerts.empty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const s = severityStyle[alert.severity];
            return (
              <div key={alert.id} className={`card overflow-hidden transition-all hover:shadow-md ${!alert.read ? `border-l-4 ${s.border}` : ''}`}>
                <div className="flex items-start gap-4 p-5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white ${
                    alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className={`text-sm font-bold ${!alert.read ? 'text-agro-text' : 'text-agro-text-secondary'}`}>{alert.title}</h3>
                        <span className={`mt-1 inline-block text-[11px] font-semibold ${s.badge}`}>
                          {t(`alerts.severities.${alert.severity}`)}
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-[11px] text-agro-text-secondary">
                        {new Date(alert.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-agro-text-secondary">{alert.message}</p>
                    {alert.parcelName && <p className="mt-1 text-[11px] text-agro-text-secondary">{alert.parcelName}</p>}
                    <div className="mt-3 flex gap-3">
                      {!alert.read && (
                        <button onClick={() => markAsRead(alert.id)} className="text-[11px] font-semibold text-agro-secondary hover:underline">Marcar como leída</button>
                      )}
                      
                      <button 
                        onClick={() => handleConsultIA(alert.title, alert.message)} 
                        className="text-[11px] font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        🤖 Consultar acción con IA
                      </button>

                      <button onClick={() => deleteAlert(alert.id)} className="text-[11px] font-medium text-agro-danger hover:underline">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INTERFAZ FLOTANTE DEL CHAT CON IA (Disponible abajo a la derecha de manera limpia) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="w-80 md:w-96 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-center bg-agro-text text-white px-4 py-2 rounded-t-xl text-xs font-bold shadow-md">
              <span>Asistente AgroTech</span>
              <button onClick={() => setIsChatOpen(false)} className="hover:text-agro-danger font-bold text-sm">✕</button>
            </div>
            <AiChatWindow key={selectedAlertContext} contextAlert={selectedAlertContext} />
          </div>
        )}
        
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-agro-secondary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Consultar Asistente IA"
        >
          {isChatOpen ? '💬' : '🤖'}
        </button>
      </div>
    </PageShell>
  );
};