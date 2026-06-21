interface NasaPowerResponse {
  properties: {
    parameter: Record<string, Record<string, number | null>>;
  };
}

export interface NasaPowerData {
  temp: number;
  humidity: number;
  precipitation: number;
  wind: number;
  solarRadiation: number;
}

export interface NasaPowerDay extends NasaPowerData {
  date: string;
}

const BASE_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point';
const PARAMETERS = 'T2M,RH2M,PRECTOTCORR,WS2M,ALLSKY_SFC_SW_DWN';

function isValid(v: number | null | undefined): boolean {
  return v != null && v !== -999;
}

function getMapValues(params: Record<string, Record<string, number | null>>, param: string): Record<string, number> {
  const result: Record<string, number> = {};
  const raw = params[param];
  if (!raw) return result;
  for (const [date, val] of Object.entries(raw)) {
    if (isValid(val)) {
      result[date] = val;
    }
  }
  return result;
}

export async function fetchClimateData(lat: number, lng: number): Promise<NasaPowerDay | null> {
  try {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');

    const url = `${BASE_URL}?parameters=${PARAMETERS}&community=ag&longitude=${lng}&latitude=${lat}&start=${fmt(start)}&end=${fmt(end)}&format=JSON`;

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;

    const data: NasaPowerResponse = await res.json();
    const params = data.properties?.parameter;
    if (!params) return null;

    const validDates = Object.keys(getMapValues(params, 'T2M')).sort();
    if (validDates.length === 0) return null;

    const latest = validDates[validDates.length - 1];

    return {
      date: latest,
      temp: params['T2M']?.[latest] ?? 0,
      humidity: params['RH2M']?.[latest] ?? 0,
      precipitation: params['PRECTOTCORR']?.[latest] ?? 0,
      wind: (params['WS2M']?.[latest] ?? 0) * 3.6,
      solarRadiation: params['ALLSKY_SFC_SW_DWN']?.[latest] ?? 0,
    };
  } catch {
    return null;
  }
}

export async function fetchForecast(lat: number, lng: number): Promise<NasaPowerDay[]> {
  try {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');

    const url = `${BASE_URL}?parameters=${PARAMETERS}&community=ag&longitude=${lng}&latitude=${lat}&start=${fmt(start)}&end=${fmt(end)}&format=JSON`;

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];

    const data: NasaPowerResponse = await res.json();
    const params = data.properties?.parameter;
    if (!params) return [];

    const validDates = Object.keys(getMapValues(params, 'T2M')).sort();
    const lastDays = validDates.slice(-7);

    return lastDays.map((date) => ({
      date,
      temp: params['T2M']?.[date] ?? 0,
      humidity: params['RH2M']?.[date] ?? 0,
      precipitation: params['PRECTOTCORR']?.[date] ?? 0,
      wind: (params['WS2M']?.[date] ?? 0) * 3.6,
      solarRadiation: params['ALLSKY_SFC_SW_DWN']?.[date] ?? 0,
    }));
  } catch {
    return [];
  }
}
