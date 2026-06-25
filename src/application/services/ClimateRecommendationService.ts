// src/application/services/ClimateRecommendationService.ts
import { askGeminiChat } from '../../adapters/output/api/GeminiAIAdapter';

export const generateClimateAlerts = async (nasaData: any, senamhiData: any, cropName: string) => {
  const prompt = `
    Como asesor agrícola inteligente, analiza las siguientes condiciones meteorológicas actuales obtenidas para un cultivo de ${cropName}:
    - Datos Locales (SENAMHI): Temperatura actual de ${senamhiData.temperatura}°C, Humedad: ${senamhiData.humedad}%.
    - Datos Satelitales (NASA): Precipitación estimada: ${nasaData.precipitation}mm, Radiación Solar: ${nasaData.solar_radiation} kW/m²/day.
    
    En base a esto, genera una alerta corta de riesgos potenciales (ej: riesgo de helada, exceso de humedad, proliferación de hongos) y 3 recomendaciones rápidas de riego o cuidado.
  `;
  
  // Llama al adaptador de Gemini para obtener la respuesta
  return await askGeminiChat(prompt);
};