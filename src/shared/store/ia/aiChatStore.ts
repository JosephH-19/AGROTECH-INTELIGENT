import { create } from 'zustand';
// Importamos la función correcta desde tu adaptador
import { askGeminiChat } from '../../../adapters/output/api/GeminiAIAdapter'; 

// Importamos tus stores que ya tienen los datos sincronizados de Supabase
import { useParcelsStore } from '../parcels/parcelsStore'; 
import { useCropsStore } from '../crops/cropsStore';

interface Message { role: 'user' | 'model'; text: string; }
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (txt: string) => Promise<void>;
}

export const useAiChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  sendMessage: async (text) => {
    // Control de seguridad: evita peticiones duplicadas si el usuario da muchos clics rápidos
    if (get().isLoading) return;

    const currentMessages = get().messages;
    const newMsg: Message = { role: 'user', text };
    
    // Mostramos el mensaje del usuario de inmediato en la pantalla y activamos carga
    set({ 
      messages: [...currentMessages, newMsg],
      isLoading: true 
    });

    try {
      // 1. Extraemos los datos agrícolas vivos del cliente (vienen de Supabase)
      const activeParcels = useParcelsStore.getState().parcels || [];
      const activeCrops = useCropsStore.getState().crops || [];

      // 2. Formateamos los datos en un texto limpio para que Gemini los entienda
      const databaseContext = `
        - Total de parcelas registradas: ${activeParcels.length}
        - Detalle de parcelas: ${JSON.stringify(activeParcels.map(p => ({ nombre: p.name, estado: p.status })))}
        - Total de cultivos activos: ${activeCrops.length}
        - Detalle de cultivos: ${JSON.stringify(activeCrops.map(c => ({ tipo: c.type || c.name, etapa: c.stage })))}
      `;

      // 3. Enviamos la consulta con el historial y el contexto de la Base de Datos
      const response = await askGeminiChat(text, currentMessages, databaseContext); 
      
      // 4. Guardamos la respuesta de la IA en el chat
      set({ 
        messages: [...get().messages, { role: 'model', text: response }],
        isLoading: false 
      });

    } catch (error) {
      console.error("Error en flujo de chat:", error);
      
      // Manejo de errores elegante para el usuario en lugar de colapsar la pantalla
      set({ 
        messages: [...get().messages, { 
          role: 'model', 
          text: "Lo siento, hubo un problema al procesar tu consulta agrícola. Por favor, intenta de nuevo." 
        }],
        isLoading: false 
      });
    }
  }
}));