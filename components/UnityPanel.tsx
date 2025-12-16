import React, { useState } from 'react';
import { WaveParams } from '../types';
import { generateUnityScript } from '../services/geminiService';
import { Box, Copy, Check, Loader2, Code } from 'lucide-react';

interface UnityPanelProps {
  params: WaveParams;
}

export const UnityPanel: React.FC<UnityPanelProps> = ({ params }) => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    const script = await generateUnityScript(params);
    setCode(script);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Box className="w-5 h-5 text-blue-400" />
          Unity Integration
        </h2>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex items-center gap-2"
        >
          {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Code size={12} />}
          Generate C# Script
        </button>
      </div>

      <div className="flex-1 relative group">
        <div className="absolute inset-0 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
          {code ? (
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-auto h-full w-full">
              <code>{code}</code>
            </pre>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <Box size={48} className="mb-2 opacity-50" />
              <p>Generate a C# script to replicate this simulation in your Unity project.</p>
            </div>
          )}
          
          {code && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-md backdrop-blur-sm transition-colors border border-slate-600"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
