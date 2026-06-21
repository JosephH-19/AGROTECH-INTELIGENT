import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useClimateStore } from '@shared/store/climate/climateStore';
import { useParcelsStore } from '@shared/store/parcels/parcelsStore';
import { PageShell } from '../components/PageShell';

const DEFAULT_COORDS = { lat: -12.0833, lng: -75.2167 };

export const ClimatePage = () => {
  const { t } = useTranslation();
  const { current, forecast, source, setSource, fetchClimate, isLoading, error } = useClimateStore();
  const parcels = useParcelsStore((s) => s.parcels);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    if (parcels.length > 0) {
      const p = parcels[0];
      if (p.lat && p.lng) {
        fetchClimate(p.lat, p.lng);
        fetched.current = true;
      }
    } else if (!isLoading && parcels.length === 0) {
      fetchClimate(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng);
      fetched.current = true;
    }
  }, [parcels, isLoading, fetchClimate]);

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (isLoading) {
    return (
      <PageShell title={t('climate.title')} subtitle={t('climate.description')}>
        <div className="card flex flex-col items-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-agro-primary border-t-transparent" />
          <p className="mt-4 text-sm text-agro-text-secondary">{t('climate.loading')}</p>
        </div>
      </PageShell>
    );
  }

  if (!current) {
    return (
      <PageShell title={t('climate.title')} subtitle={t('climate.description')}>
        <div className="card flex flex-col items-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-agro-muted text-2xl text-agro-text-secondary">!</div>
          <p className="mt-4 text-sm text-agro-text-secondary">No se pudieron obtener datos climáticos para esta fuente.</p>
          <button onClick={() => { const s = useClimateStore.getState(); if (s._lastLat && s._lastLng) s.fetchClimate(s._lastLat, s._lastLng); }} className="btn-outline mt-4 text-xs">
            Reintentar
          </button>
        </div>
      </PageShell>
    );
  }

  const metrics = [
    { label: 'Temperatura', value: `${current.temp}°C`, sub: `sensación ${current.feelsLike}°C` },
    { label: 'Humedad', value: `${current.humidity}%`, sub: '' },
    { label: 'Precipitación', value: `${current.precipitation} mm`, sub: '' },
    { label: 'Viento', value: `${current.wind} km/h`, sub: '' },
    { label: 'Índice UV', value: `${current.uvIndex}`, sub: '' },
  ];

  return (
    <PageShell title={t('climate.title')} subtitle={t('climate.description')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setSource('senamhi')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${source === 'senamhi' ? 'bg-agro-secondary text-white shadow-sm' : 'border border-agro-border/60 text-agro-text-secondary hover:border-agro-text-secondary/30'}`}
          >
            SENAMHI
          </button>
          <button
            onClick={() => setSource('nasa')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${source === 'nasa' ? 'bg-agro-secondary text-white shadow-sm' : 'border border-agro-border/60 text-agro-text-secondary hover:border-agro-text-secondary/30'}`}
          >
            NASA POWER
          </button>
        </div>
        <span className="text-[11px] text-agro-text-secondary">{t('climate.source')}: {source === 'senamhi' ? 'SENAMHI' : 'NASA POWER'}</span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
          {source === 'senamhi' && (
            <button onClick={() => setSource('nasa')} className="ml-2 font-semibold underline">Usar NASA POWER</button>
          )}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white/90">Condiciones Actuales</h2>
            <span className="text-2xl text-white/80">{current.temp}°C</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-agro-border/30 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white px-5 py-4 text-center">
              <p className="text-lg font-bold text-agro-text">{m.value}</p>
              <p className="mt-0.5 text-[11px] font-medium text-agro-text-secondary">{m.label}</p>
              {m.sub && <p className="text-[10px] text-agro-text-secondary/60">{m.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="section-title mb-5">Pronóstico 7 Días</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          {forecast.map((day, i) => (
            <div key={i} className="rounded-xl bg-agro-muted/50 px-4 py-3 text-center">
              <p className="text-[11px] font-bold text-agro-text-secondary uppercase">
                {dayNames[new Date(day.date).getDay()]}
              </p>
              <p className="mt-2 text-xl font-bold text-agro-text">{Math.round(day.temp)}°C</p>
              <div className="mt-3 space-y-1 text-[11px] text-agro-text-secondary">
                <p>Humedad: {day.humidity}%</p>
                <p>Lluvia: {day.precipitation}mm</p>
                <p>Viento: {day.wind}km/h</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};
