// src/adapters/output/api/GeminiAIAdapter.ts

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Usamos el endpoint oficial de generación de contenidos compatible con Flash
const BASE_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
/**
 * Función auxiliar para convertir un archivo (File) a Base64 estructurado para Gemini
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1];
      resolve({
        inlineData: { data: base64Data, mimeType: file.type }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 1. CHAT INTERACTIVO & RECOMENDACIONES AGRÍCOLAS CON CONTEXTO
 * Mantiene compatibilidad total con producción si se llama sin el tercer parámetro.
 */
export const askGeminiChat = async (
  userPrompt: string, 
  history: Array<{ role: 'user' | 'model', text: string }> = [], 
  databaseContext: string = ""
) => {
  // Mapeamos el historial existente asegurando la estructura nativa requerida por Gemini
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  // Construcción del Prompt del Sistema + Datos de Supabase de manera limpia
  let promptCompuesto = `Actúa como el director técnico agrícola y agrónomo experto de AgroTech-J.\n`;
  
  if (databaseContext) {
    promptCompuesto += `CONTEXTO EN TIEMPO REAL DEL SISTEMA (SUPABASE):\n${databaseContext}\n\n`;
  }
  
  promptCompuesto += `Pregunta del usuario: ${userPrompt}\n`;
  promptCompuesto += `Responde de forma clara, práctica, compacta y ejecutiva.`;

  // Agregamos el nuevo mensaje al final del arreglo de turnos
  contents.push({
    role: "user",
    parts: [{ text: promptCompuesto }]
  });

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });
    
    const data = await response.json();
    
    // Validación por si la API retorna una estructura vacía o error de cuotas
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(data.error?.message || "Respuesta vacía o error en el modelo.");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error en el Chat de Gemini:", error);
    throw new Error("No se pudo conectar con el asistente agrícola.");
  }
};

/**
 * 2. DETECCIÓN DE PLAGAS POR FOTO + RECOMENDACIÓN AUTOMÁTICA
 */
export const analyzeCropHealth = async (imageFile: File, cropType: string) => {
  const imagePart = await fileToGenerativePart(imageFile);
  const textPrompt = `Analiza detalladamente esta imagen de un cultivo de ${cropType}. 
  Identifica si tiene alguna plaga, enfermedad o deficiencia nutricional. 
  Devuelve tu respuesta estructurada obligatoriamente en formato JSON plano con los siguientes campos:
  {
    "status": "Saludable" o "Alerta",
    "issue_detected": "Nombre de la plaga o enfermedad (o 'Ninguna')",
    "confidence": "Porcentaje estimado de certeza (0-100%)",
    "recommendations": ["Recomendación 1", "Recomendación 2", "Tratamiento ecológico"]
  }`;

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: textPrompt },
            imagePart
          ]
        }],
        // Forzamos al modelo a responder en JSON estructurado para guardarlo en la Base de Datos fácilmente
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText); 
  } catch (error) {
    console.error("Error analizando la salud del cultivo:", error);
    return {
      status: "Error",
      issue_detected: "No se pudo procesar la imagen",
      confidence: "0%",
      recommendations: ["Por favor, intente de nuevo más tarde."]
    };
  }
};