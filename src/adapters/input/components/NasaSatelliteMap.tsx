import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrección de un bug conocido de Leaflet con las rutas de los iconos en entornos Vite/React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Interfaz para recibir las coordenadas de las parcelas de tu Zustand Store
interface ParcelLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  crop: string;
}

interface NasaMapProps {
  parcels?: ParcelLocation[];
  center?: [number, number]; // Coordenadas iniciales [lat, lng] (Por defecto Perú o centro de tus parcelas)
}

export const NasaSatelliteMap = ({ 
  parcels = [], 
  center = [-9.1900, -75.0152] // Coordenadas por defecto (Centro del Perú)
}: NasaMapProps) => {
  
  // Obtenemos la fecha de hoy en formato YYYY-MM-DD requerida por la API GIBS de la NASA
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="card w-full h-[500px] rounded-xl overflow-hidden shadow-sm border border-agro-border/40 bg-white p-2">
      <div className="mb-2 flex items-center justify-between px-2">
        <p className="text-xs font-bold text-agro-text flex items-center gap-1">
          🚀 Capas Satelitales en Tiempo Real (NASA GIBS)
        </p>
        <span className="text-[10px] bg-agro-secondary/10 text-agro-secondary px-2 py-0.5 rounded-full font-semibold">
          Fecha: {todayStr}
        </span>
      </div>

      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom={true} 
        className="w-full h-full rounded-lg"
      >
        <LayersControl position="topright">
          {/* Capa base estándar de OpenStreetMap para referencia */}
          <LayersControl.BaseLayer name="Mapa Base (Calles)">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </LayersControl.BaseLayer>

          {/* CAPA RECOMENDADA 1: Fotografía satelital diaria real de la NASA (MODIS Terra) */}
          <LayersControl.BaseLayer checked name="NASA MODIS Satélite (Hoy)">
            <TileLayer
              url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${todayStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
              attribution='&copy; NASA Earth Science Data and Information System (ESDIS)'
              maxZoom={9}
            />
          </LayersControl.BaseLayer>

          {/* CAPA RECOMENDADA 2: Humedad del Suelo / Salud de Vegetación si está disponible */}
          <LayersControl.Overlay name="NASA Capa de Vegetación (NDVI)">
            <TileLayer
              url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png"
              attribution='&copy; NASA GIBS / MODIS'
              opacity={0.6}
              maxZoom={8}
            />
          </LayersControl.Overlay>
        </LayersControl>

        {/* Mapeo dinámico de tus parcelas sobre el mapa satelital */}
        {parcels.map((parcel) => (
          <Marker key={parcel.id} position={[parcel.lat, parcel.lng]}>
            <Popup>
              <div className="text-xs">
                <h4 className="font-bold text-agro-text">{parcel.name}</h4>
                <p className="text-agro-text-secondary">Cultivo: {parcel.crop}</p>
                <p className="text-[10px] text-gray-400">Lat: {parcel.lat}, Lng: {parcel.lng}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};