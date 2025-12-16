import React from 'react';
import { WaveParams } from '../types';
import { Play, Pause, RefreshCw, Activity, Zap, Wind } from 'lucide-react';

interface ControlsProps {
  params: WaveParams;
  setParams: React.Dispatch<React.SetStateAction<WaveParams>>;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ params, setParams, onReset }) => {
  const handleChange = (key: keyof WaveParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Wave Generator
        </h2>
        <div className="flex gap-2">
           <button
            onClick={() => setParams(p => ({ ...p, isRunning: !p.isRunning }))}
            className={`p-2 rounded-lg transition-colors ${
              params.isRunning 
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
          >
            {params.isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={onReset}
            className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
            title="Reset Simulation"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Frequency Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-slate-300 flex items-center gap-2">
              <Zap size={14} /> Frequency (Hz)
            </label>
            <span className="font-mono text-indigo-300">{params.frequency.toFixed(1)} Hz</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5.0"
            step="0.1"
            value={params.frequency}
            onChange={(e) => handleChange('frequency', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Amplitude Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-slate-300 flex items-center gap-2">
              <Activity size={14} /> Amplitude (m)
            </label>
            <span className="font-mono text-pink-300">{params.amplitude.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={params.amplitude}
            onChange={(e) => handleChange('amplitude', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-slate-300 flex items-center gap-2">
              <Wind size={14} /> Wave Speed (m/s)
            </label>
            <span className="font-mono text-cyan-300">{params.speed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={params.speed}
            onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};
