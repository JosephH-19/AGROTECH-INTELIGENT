import { create } from 'zustand';
import { askGemini } from '@adapters/output/api/GeminiAIAdapter';

interface Message { role: 'user' | 'model'; text: string; }
interface ChatState {
  messages: Message[];
  sendMessage: (txt: string) => Promise<void>;
}

export const useAiChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sendMessage: async (text) => {
    const newMsg: Message = { role: 'user', text };
    set({ messages: [...get().messages, newMsg] });
    // Aquí puedes mapear el historial completo y enviarlo al adaptador
    const response = await askGemini(text); 
    set({ messages: [...get().messages, { role: 'model', text: response }] });
  }
}));