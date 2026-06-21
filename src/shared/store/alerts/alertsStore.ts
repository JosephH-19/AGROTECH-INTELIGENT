import { create } from 'zustand';
import { supabase } from '@infrastructure/persistence/supabaseClient';

export type AlertType = 'frost' | 'plague' | 'drought' | 'heavyRain' | 'disease';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  parcelName?: string;
  createdAt: string;
  read: boolean;
}

interface AlertsState {
  alerts: Alert[];
  unreadCount: number;
  isLoading: boolean;
  fetchAlerts: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
}

const ALERT_TYPE_FROM_DB: Record<string, string> = {
  Helada: 'frost', Plaga: 'plague', Sequía: 'drought',
  'Lluvia Intensa': 'heavyRain', Enfermedad: 'disease',
};

const SEVERITY_FROM_DB: Record<string, string> = {
  Informativo: 'info', Advertencia: 'warning', Crítico: 'critical',
};

function mapAlert(row: any): Alert {
  return {
    id: row.id_alerta_envio,
    type: (ALERT_TYPE_FROM_DB[row.tipo_alerta] ?? 'disease') as AlertType,
    severity: (SEVERITY_FROM_DB[row.severidad] ?? 'info') as AlertSeverity,
    title: row.titulo,
    message: row.mensaje,
    createdAt: row.fecha_envio ?? '',
    read: row.leida ?? false,
  };
}

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [],
  unreadCount: 0,
  isLoading: false,

  fetchAlerts: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('historial_alertas_enviadas')
      .select('*')
      .order('fecha_envio', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      set({ isLoading: false });
      return;
    }
    const alerts = (data ?? []).map(mapAlert);
    set({ alerts, unreadCount: alerts.filter((a) => !a.read).length, isLoading: false });
  },

  markAsRead: async (id) => {
    const { error } = await supabase.from('historial_alertas_enviadas').update({ leida: true }).eq('id_alerta_envio', id);
    if (error) {
      console.error('Error marking alert as read:', error);
      return;
    }
    set((state) => {
      const alerts = state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
      return { alerts, unreadCount: alerts.filter((a) => !a.read).length };
    });
  },

  deleteAlert: async (id) => {
    const { error } = await supabase.from('historial_alertas_enviadas').delete().eq('id_alerta_envio', id);
    if (error) {
      console.error('Error deleting alert:', error);
      return;
    }
    set((state) => {
      const alerts = state.alerts.filter((a) => a.id !== id);
      return { alerts, unreadCount: alerts.filter((a) => !a.read).length };
    });
  },
}));
