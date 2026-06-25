// src/adapters/output/api/NasaGibsAdapter.ts

export class NasaGibsAdapter {
  /**
   * Genera la URL WMTS compatible con Leaflet para la capa MODIS Terra de la NASA
   */
  public static getWeatherSatelliteUrl(): string {
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    const fechaFormateada = ayer.toISOString().split('T')[0]; // YYYY-MM-DD

    return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${fechaFormateada}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
  }
}