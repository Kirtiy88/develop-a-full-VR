import React, { useState, useRef, useEffect } from 'react';
import { WaveParams, ChatMessage } from '../types';
import { generatePhysicsHelp } from '../services/geminiService';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';

interface AssistantProps {
  params: WaveParams;
}

export const Assistant: React.FC<AssistantProps> = ({ params }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your Physics Lab Assistant. I can help you understand waves, calculate wavelength, or even help with the Unity code. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await generatePhysicsHelp(userMsg.text, params);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col h-[400px]">
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <Bot className="w-5 h-5 text-emerald-400" />
        <h3 className="font-bold text-white">AI Lab Assistant</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              m.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}>
              {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-none' 
                : 'bg-slate-700 text-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
               <Bot size={14} />
             </div>
             <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center">
               <Loader2 size={16} className="animate-spin text-slate-400" />
             </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-700 bg-slate-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about wavelength or physics..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
