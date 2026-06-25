import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapNasaApiToLayerConfig } from '../helpers/dataMapper'; // Ajusta según tu alias, ej: '@shared/helpers/dataMapper'

export const MapaNasa: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Evitar doble renderizado si el contenedor no existe o el mapa ya fue inicializado
    if (!mapContainerRef.current || mapRef.current) return;

    // 1. Obtener la configuración del mapa limpia desde el Mapper
    const config = mapNasaApiToLayerConfig();

    // 2. Inicializar el mapa de Leaflet centrado en la región (coordenadas de Perú por defecto)
    const mapa = L.map(mapContainerRef.current, {
      zoomControl: true,
      fadeAnimation: true
    }).setView([-9.19, -75.01], 6);
    
    mapRef.current = mapa;

    // 3. Inyectar la capa satelital meteorológica de la NASA
    L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
    }).addTo(mapa);

    // 4. Limpieza del mapa al desmontar el componente (evita memory leaks)
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Badge informativo flotante con Tailwind */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/95 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-700/60 backdrop-blur-md shadow-lg select-none pointer-events-none">
        <span className="inline-block animate-pulse mr-1.5 text-emerald-400">●</span> 
        NASA GIBS Satellite (Ayer)
      </div>
      
      {/* El lienzo del mapa */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[550px] bg-slate-950" />
    </div>
  );
};