interface SenamhiStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  department: string;
  province: string;
}

interface SenamhiReading {
  temp: number;
  humidity: number;
  precipitation: number;
  date: string;
}

const SENAMHI_OPEN_DATA = 'https://www.datosabiertos.gob.pe/api/3/action/datastore_search';

const RESOURCE_ID = 'cce11817-a362-4a45-898b-974a4caa9fb6';

export async function searchStations(department?: string): Promise<SenamhiStation[]> {
  try {
    const url = `${SENAMHI_OPEN_DATA}?resource_id=${RESOURCE_ID}&limit=100`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    const records = data.result?.records || [];
    return records
      .filter((r: Record<string, unknown>) => !department || r.departamento === department)
      .map((r: Record<string, unknown>) => ({
        id: String(r.id_estacion || r._id || ''),
        name: String(r.nombre || ''),
        lat: Number(r.latitud || 0),
        lng: Number(r.longitud || 0),
        department: String(r.departamento || ''),
        province: String(r.provincia || ''),
      }));
  } catch {
    return [];
  }
}

export async function fetchReadings(_stationId: string): Promise<SenamhiReading[]> {
  try {
    const url = `${SENAMHI_OPEN_DATA}?resource_id=${RESOURCE_ID}&limit=10&sort=fecha%20desc`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    const records = data.result?.records || [];
    return records.slice(0, 7).map((r: Record<string, unknown>) => ({
      temp: Number(r.temperatura || 0),
      humidity: Number(r.humedad_relativa || 0),
      precipitation: Number(r.precipitacion || 0),
      date: String(r.fecha || ''),
    }));
  } catch {
    return [];
  }
}

export async function fetchClimateDataFromSenamhi(lat: number, lng: number): Promise<{
  temp: number; humidity: number; precipitation: number;
} | null> {
  try {
    const stations = await searchStations();
    const nearest = stations.reduce((best, s) => {
      const dist = Math.sqrt((s.lat - lat) ** 2 + (s.lng - lng) ** 2);
      return dist < best.dist ? { station: s, dist } : best;
    }, { station: stations[0], dist: Infinity });

    if (!nearest.station) return null;

    const readings = await fetchReadings(nearest.station.id);
    if (readings.length === 0) return null;

    const latest = readings[0];
    return {
      temp: latest.temp,
      humidity: latest.humidity,
      precipitation: latest.precipitation,
    };
  } catch {
    return null;
  }
}
