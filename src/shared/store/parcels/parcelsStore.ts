import { create } from 'zustand';
import { supabase } from '@infrastructure/persistence/supabaseClient';

export interface Parcel {
  id: string;
  name: string;
  area: number;
  soilType: 'clay' | 'loam' | 'sandy' | 'silt';
  province: string;
  district: string;
  lat: number;
  lng: number;
  health: 'good' | 'warning' | 'critical';
  createdAt: string;
}

interface ParcelsState {
  parcels: Parcel[];
  isLoading: boolean;
  fetchParcels: () => Promise<void>;
  addParcel: (parcel: Omit<Parcel, 'id' | 'createdAt'>) => Promise<void>;
  updateParcel: (id: string, data: Partial<Parcel>) => Promise<void>;
  deleteParcel: (id: string) => Promise<void>;
}

const SOIL_TO_DB: Record<string, string> = {
  clay: 'Arcilloso', loam: 'Franco', sandy: 'Arenoso', silt: 'Limoso',
};
const SOIL_FROM_DB: Record<string, string> = {
  Arcilloso: 'clay', Franco: 'loam', Arenoso: 'sandy', Limoso: 'silt',
};
const HEALTH_TO_DB: Record<string, string> = {
  good: 'Bueno', warning: 'Advertencia', critical: 'Crítico',
};
const HEALTH_FROM_DB: Record<string, string> = {
  Bueno: 'good', Advertencia: 'warning', Crítico: 'critical',
};

function mapParcel(row: any): Parcel {
  return {
    id: row.id_parcela,
    name: row.nombre_parcela,
    area: Number(row.tamano_hectareas),
    soilType: (SOIL_FROM_DB[row.tipo_suelo] ?? 'loam') as Parcel['soilType'],
    province: row.provincia ?? '',
    district: row.distrito ?? '',
    lat: Number(row.latitud ?? 0),
    lng: Number(row.longitud ?? 0),
    health: (HEALTH_FROM_DB[row.estado_salud] ?? 'good') as Parcel['health'],
    createdAt: row.created_at ?? '',
  };
}

export const useParcelsStore = create<ParcelsState>((set) => ({
  parcels: [],
  isLoading: false,

  fetchParcels: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('parcelas').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching parcels:', error);
      set({ isLoading: false });
      return;
    }
    set({ parcels: (data ?? []).map(mapParcel), isLoading: false });
  },

  addParcel: async (parcel) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase.from('parcelas').insert({
      id_agricultor: session.user.id,
      nombre_parcela: parcel.name,
      tamano_hectareas: parcel.area,
      tipo_suelo: SOIL_TO_DB[parcel.soilType] ?? 'Franco',
      provincia: parcel.province,
      distrito: parcel.district,
      latitud: parcel.lat,
      longitud: parcel.lng,
      estado_salud: HEALTH_TO_DB[parcel.health] ?? 'Bueno',
    }).select().single();

    if (error) {
      console.error('Error adding parcel:', error);
      return;
    }
    set((state) => ({ parcels: [mapParcel(data), ...state.parcels] }));
  },

  updateParcel: async (id, data) => {
    const updates: Record<string, unknown> = {};
    if (data.name !== undefined) updates.nombre_parcela = data.name;
    if (data.area !== undefined) updates.tamano_hectareas = data.area;
    if (data.soilType !== undefined) updates.tipo_suelo = SOIL_TO_DB[data.soilType];
    if (data.province !== undefined) updates.provincia = data.province;
    if (data.district !== undefined) updates.distrito = data.district;
    if (data.lat !== undefined) updates.latitud = data.lat;
    if (data.lng !== undefined) updates.longitud = data.lng;
    if (data.health !== undefined) updates.estado_salud = HEALTH_TO_DB[data.health];

    const { error } = await supabase.from('parcelas').update(updates).eq('id_parcela', id);
    if (error) {
      console.error('Error updating parcel:', error);
      return;
    }
    set((state) => ({
      parcels: state.parcels.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },

  deleteParcel: async (id) => {
    const { error } = await supabase.from('parcelas').delete().eq('id_parcela', id);
    if (error) {
      console.error('Error deleting parcel:', error);
      return;
    }
    set((state) => ({ parcels: state.parcels.filter((p) => p.id !== id) }));
  },
}));
