import { useState } from 'react';
import { askGeminiChat } from '../../output/api/GeminiAIAdapter'; // Ajusta la ruta de tu adaptador de salida si es necesario

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiChatWindow = ({ contextAlert }: { contextAlert?: string }) => {
  const [messages, setMessages] = useState<Message[]>(
    contextAlert 
      ? [{ role: 'model', text: `Hola, veo que te interesa saber más sobre la alerta: "${contextAlert}". ¿En qué te puedo asesorar?` }]
      : [{ role: 'model', text: '¡Hola! Soy tu asistente AgroTech-J con Gemini. ¿Qué dudas agrícolas tienes hoy?' }]
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, text: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Pasamos el historial previo y la pregunta actual al adaptador que configuramos de Gemini
      const aiResponse = await askGeminiChat(userText, messages);
      setMessages([...updatedMessages, { role: 'model', text: aiResponse }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: 'model', text: 'Lo siento, hubo un problema al conectar con Gemini. Intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card mt-6 flex flex-col h-[400px] border border-agro-border/40 shadow-sm bg-white rounded-xl overflow-hidden">
      {/* Header del Chat */}
      <div className="bg-agro-secondary/10 p-3 border-b border-agro-border/40 flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-xs font-bold text-agro-text">Asistente Virtual AgroTech (Gemini 1.5 Flash)</p>
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-agro-secondary text-white rounded-tr-none' 
                : 'bg-white text-agro-text border border-agro-border/50 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-agro-border/50 rounded-xl rounded-tl-none px-3 py-2 text-xs text-agro-text-secondary flex gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce [animation-delay:0.2s]">●</span>
              <span className="animate-bounce [animation-delay:0.4s]">●</span>
            </div>
          </div>
        )}
      </div>

      {/* Formulario de envío */}
      <form onSubmit={handleSendMessage} className="p-2 border-t border-agro-border/40 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregúntale a la IA sobre manejo de plagas, riego..."
          className="flex-1 rounded-lg border border-agro-border/60 px-3 py-1.5 text-xs focus:border-agro-secondary focus:outline-none"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-agro-secondary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-agro-secondary/90 transition-all disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};