import { create } from 'zustand';
import { supabase } from '@infrastructure/persistence/supabaseClient';

export type CropType = 'potato' | 'corn' | 'quinoa' | 'barley' | 'bean' | 'coffee' | 'maca' | 'oat';
export type CropStatus = 'sowing' | 'growth' | 'maturation' | 'harvested';

export interface Crop {
  id: string;
  parcelId: string;
  parcelName: string;
  type: CropType;
  sowingDate: string;
  status: CropStatus;
  notes?: string;
}

interface CropsState {
  crops: Crop[];
  isLoading: boolean;
  fetchCrops: () => Promise<void>;
  addCrop: (crop: Omit<Crop, 'id'>) => Promise<void>;
  updateCrop: (id: string, data: Partial<Crop>) => Promise<void>;
  deleteCrop: (id: string) => Promise<void>;
}

const STATUS_TO_DB: Record<string, string> = {
  sowing: 'Siembra', growth: 'Crecimiento', maturation: 'Maduración', harvested: 'Cosechado',
};
const STATUS_FROM_DB: Record<string, string> = {
  Siembra: 'sowing', Crecimiento: 'growth', Maduración: 'maturation', Cosechado: 'harvested',
};
const CROP_TO_DB: Record<string, string> = {
  potato: 'Papa', corn: 'Maíz', quinoa: 'Quinua', barley: 'Cebada',
  bean: 'Frijol', coffee: 'Café', maca: 'Maca', oat: 'Avena',
};
const CROP_FROM_DB: Record<string, string> = {
  Papa: 'potato', Maíz: 'corn', Quinua: 'quinoa', Cebada: 'barley',
  Frijol: 'bean', Café: 'coffee', Maca: 'maca', Avena: 'oat',
};

function mapCrop(row: any): Crop {
  return {
    id: row.id_cultivo,
    parcelId: row.id_parcela,
    parcelName: row.parcelas?.nombre_parcela ?? '',
    type: (CROP_FROM_DB[row.tipo_cultivo] ?? 'potato') as CropType,
    sowingDate: row.fecha_siembra ?? '',
    status: (STATUS_FROM_DB[row.estado_actual] ?? 'sowing') as CropStatus,
    notes: row.notas ?? '',
  };
}

export const useCropsStore = create<CropsState>((set) => ({
  crops: [],
  isLoading: false,

  fetchCrops: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('cultivos')
      .select('*, parcelas!inner(nombre_parcela)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching crops:', error);
      set({ isLoading: false });
      return;
    }
    set({ crops: (data ?? []).map(mapCrop), isLoading: false });
  },

  addCrop: async (crop) => {
    const { data, error } = await supabase.from('cultivos').insert({
      id_parcela: crop.parcelId,
      tipo_cultivo: CROP_TO_DB[crop.type] ?? 'Papa',
      fecha_siembra: crop.sowingDate,
      estado_actual: STATUS_TO_DB[crop.status] ?? 'Siembra',
      notas: crop.notes ?? null,
    }).select('*, parcelas(nombre_parcela)').single();

    if (error) {
      console.error('Error adding crop:', error);
      return;
    }
    set((state) => ({ crops: [mapCrop(data), ...state.crops] }));
  },

  updateCrop: async (id, data) => {
    const updates: Record<string, unknown> = {};
    if (data.parcelId !== undefined) updates.id_parcela = data.parcelId;
    if (data.type !== undefined) updates.tipo_cultivo = CROP_TO_DB[data.type];
    if (data.sowingDate !== undefined) updates.fecha_siembra = data.sowingDate;
    if (data.status !== undefined) updates.estado_actual = STATUS_TO_DB[data.status];
    if (data.notes !== undefined) updates.notas = data.notes;

    const { error } = await supabase.from('cultivos').update(updates).eq('id_cultivo', id);
    if (error) {
      console.error('Error updating crop:', error);
      return;
    }
    set((state) => ({
      crops: state.crops.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },

  deleteCrop: async (id) => {
    const { error } = await supabase.from('cultivos').delete().eq('id_cultivo', id);
    if (error) {
      console.error('Error deleting crop:', error);
      return;
    }
    set((state) => ({ crops: state.crops.filter((c) => c.id !== id) }));
  },
}));
