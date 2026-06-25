import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClimateStore } from '@shared/store/climate/climateStore';
import { useParcelsStore } from '@shared/store/parcels/parcelsStore';
import { PageShell } from '../components/PageShell';
import { NasaSatelliteMap } from '../components/NasaSatelliteMap'; // Importamos el mapa de la NASA
import { AiChatWindow } from '../components/AiChatWindow'; // Importamos el chat con IA

const DEFAULT_COORDS = { lat: -12.0833, lng: -75.2167 };

export const ClimatePage = () => {
  const { t } = useTranslation();
  const { current, forecast, source, setSource, fetchClimate, isLoading, error } = useClimateStore();
  const parcels = useParcelsStore((s) => s.parcels);
  const fetched = useRef(false);

  // Estado para pasarle las métricas climáticas a la IA como contexto inicial
  const [climateContext, setClimateContext] = useState<string | undefined>(undefined);

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

  // Generamos el contexto para la IA una vez que los datos del clima estén listos
  useEffect(() => {
    if (current) {
      setClimateContext(
        `Condiciones de telemetría actuales mediante la fuente ${source.toUpperCase()}: Temperatura de ${current.temp}°C (Sensación de ${current.feelsLike}°C), Humedad del ${current.humidity}%, Precipitación acumulada de ${current.precipitation}mm, Viento a ${current.wind}km/h e Índice UV de ${current.uvIndex}. ¿Qué acciones agronómicas preventivas me recomiendas para mis cultivos con este reporte?`
      );
    }
  }, [current, source]);

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

  // MAPEADO: Adaptamos la parcela consultada para que aparezca fijada con un marcador sobre las capas de la NASA
  const mappedParcelForMap = parcels.length > 0 
    ? [{ id: parcels[0].id, name: parcels[0].name, lat: parcels[0].lat || DEFAULT_COORDS.lat, lng: parcels[0].lng || DEFAULT_COORDS.lng, crop: `Zona de Monitoreo (${source.toUpperCase()})` }]
    : [{ id: 'default', name: 'Ubicación Base', lat: DEFAULT_COORDS.lat, lng: DEFAULT_COORDS.lng, crop: 'Coordenadas de Referencia' }];

  const mapCenter: [number, number] = [mappedParcelForMap[0].lat, mappedParcelForMap[0].lng];

  return (
    <PageShell title={t('climate.title')} subtitle={t('climate.description')}>
      
      {/* DISEÑO EN DOS COLUMNAS: IZQUIERDA TELEMETRÍA CLIMÁTICA, DERECHA MAPA SATELLITAL NASA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Panel Izquierdo (Métricas, Fuentes y Pronósticos) */}
        <div className="lg:col-span-8 space-y-6">
          
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

          {/* Tarjeta de Condiciones Actuales */}
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white/90">Condiciones Actuales en Zona de Cultivo</h2>
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

          {/* Panel de Pronóstico de 7 Días */}
          <div className="card p-6">
            <h2 className="section-title mb-5">Pronóstico 7 Días</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
              {forecast.map((day, i) => (
                <div key={i} className="rounded-xl bg-agro-muted/50 px-3 py-3 text-center">
                  <p className="text-[11px] font-bold text-agro-text-secondary uppercase">
                    {dayNames[new Date(day.date).getDay()]}
                  </p>
                  <p className="mt-2 text-xl font-bold text-agro-text">{Math.round(day.temp)}°C</p>
                  <div className="mt-3 space-y-1 text-[10px] text-agro-text-secondary">
                    <p>Hum: {day.humidity}%</p>
                    <p>Lluvia: {day.precipitation}mm</p>
                    <p>Vto: {day.wind}km/h</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMENDACIÓN INTELIGENTE: El chat con IA integrado abajo con el contexto climático inyectado */}
          <div className="mt-4">
            <h2 className="text-sm font-bold text-agro-text mb-2">Consultoría Agroclimática Automatizada con IA</h2>
            <AiChatWindow key={climateContext} contextAlert={climateContext} />
          </div>

        </div>

        {/* Panel Derecho Fijo (Visor Satelital NASA GIBS en Tiempo Real) */}
        <div className="lg:col-span-4">
          <div className="sticky top-4">
            <NasaSatelliteMap parcels={mappedParcelForMap} center={mapCenter} />
          </div>
        </div>

      </div>
    </PageShell>
  );
};