import { create } from 'zustand';
import { fetchClimateData as fetchNasaCurrent, fetchForecast as fetchNasaForecast, NasaPowerDay } from '@infrastructure/climate/nasaPowerApi';
import { fetchClimateDataFromSenamhi, fetchReadings, searchStations } from '@infrastructure/climate/senamhiApi';

export interface ClimateReading {
  date: string;
  temp: number;
  humidity: number;
  precipitation: number;
  wind: number;
  feelsLike: number;
  uvIndex: number;
}

export interface ClimateState {
  current: ClimateReading | null;
  forecast: ClimateReading[];
  source: 'senamhi' | 'nasa';
  isLoading: boolean;
  error: string;
  setSource: (source: 'senamhi' | 'nasa') => void;
  fetchClimate: (lat: number, lng: number) => Promise<void>;
  _lastLat: number;
  _lastLng: number;
}

function fmtDate(yyyymmdd: string): string {
  if (yyyymmdd.includes('-')) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

function mapNasaReading(d: NasaPowerDay): ClimateReading {
  return {
    date: fmtDate(d.date),
    temp: Math.round(d.temp * 10) / 10,
    humidity: Math.round(d.humidity),
    precipitation: Math.round(d.precipitation * 10) / 10,
    wind: Math.round(d.wind * 10) / 10,
    feelsLike: Math.round((d.temp - 2) * 10) / 10,
    uvIndex: Math.min(11, Math.max(0, Math.round(d.solarRadiation / 100))),
  };
}

export const useClimateStore = create<ClimateState>((set, get) => ({
  current: null,
  forecast: [],
  source: 'nasa',
  isLoading: false,
  error: '',
  _lastLat: 0,
  _lastLng: 0,

  setSource: (source) => {
    set({ source, error: '' });
    const { _lastLat, _lastLng } = get();
    if (_lastLat && _lastLng) {
      get().fetchClimate(_lastLat, _lastLng);
    }
  },

  fetchClimate: async (lat: number, lng: number) => {
    set({ isLoading: true, _lastLat: lat, _lastLng: lng, error: '' });
    const source = get().source;

    if (source === 'nasa') {
      const [currentData, forecastData] = await Promise.all([
        fetchNasaCurrent(lat, lng),
        fetchNasaForecast(lat, lng),
      ]);
      set({
        current: currentData ? mapNasaReading(currentData) : get().current,
        forecast: forecastData.map(mapNasaReading),
        isLoading: false,
        error: currentData ? '' : 'No se pudieron obtener datos de NASA POWER.',
      });
    } else {
      try {
        const senamhi = await fetchClimateDataFromSenamhi(lat, lng);
        if (senamhi) {
          const stations = await searchStations();
          const nearest = stations.reduce((best, s) => {
            const dist = Math.sqrt((s.lat - lat) ** 2 + (s.lng - lng) ** 2);
            return dist < best.dist ? { station: s, dist } : best;
          }, { station: stations[0], dist: Infinity });

          let forecast: ClimateReading[] = [];
          if (nearest.station) {
            const readings = await fetchReadings(nearest.station.id);
            forecast = readings.map((r) => ({
              date: fmtDate(r.date),
              temp: Math.round(r.temp * 10) / 10,
              humidity: Math.round(r.humidity),
              precipitation: Math.round(r.precipitation * 10) / 10,
              wind: 0,
              feelsLike: Math.round((r.temp - 2) * 10) / 10,
              uvIndex: 0,
            }));
          }

          const today = new Date().toISOString().slice(0, 10);
          set({
            current: {
              date: today,
              temp: Math.round(senamhi.temp * 10) / 10,
              humidity: Math.round(senamhi.humidity),
              precipitation: Math.round(senamhi.precipitation * 10) / 10,
              wind: 0,
              feelsLike: Math.round((senamhi.temp - 2) * 10) / 10,
              uvIndex: 0,
            },
            forecast,
            isLoading: false,
            error: '',
          });
        } else {
          set({
            isLoading: false,
            error: 'SENAMHI no disponible desde el navegador (CORS). Cambia a NASA POWER.',
          });
        }
      } catch {
        set({
          isLoading: false,
          error: 'SENAMHI no disponible desde el navegador (CORS). Cambia a NASA POWER.',
        });
      }
    }
  },
}));
