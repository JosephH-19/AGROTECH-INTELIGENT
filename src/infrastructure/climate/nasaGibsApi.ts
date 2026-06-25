// src/infrastructure/climate/nasaGibsApi.ts

export class NasaGibsApi {
  /**
   * Retorna la URL del mosaico de imágenes satelitales (clima/nubes) de la NASA
   * calculando automáticamente el día de ayer para garantizar disponibilidad.
   */
  public static getWeatherSatelliteTileUrl(): string {
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    // Formato requerido por la NASA: YYYY-MM-DD
    const fechaFormateada = ayer.toISOString().split('T')[0]; 

    return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${fechaFormateada}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
  }
}