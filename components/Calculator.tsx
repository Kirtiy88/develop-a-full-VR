import React, { useState } from 'react';
import { WaveParams, MeasurementPoint } from '../types';
import { Calculator as CalcIcon, CheckCircle, XCircle, Ruler } from 'lucide-react';

interface CalculatorProps {
  params: WaveParams;
  markers: MeasurementPoint[];
  onClearMarkers: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ params, markers, onClearMarkers }) => {
  const [userLambda, setUserLambda] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const actualLambda = params.speed / params.frequency;
  const measuredDistance = markers.length === 2 
    ? Math.abs(markers[1].x - markers[0].x)
    : 0;

  const checkAnswer = () => {
    const val = parseFloat(userLambda);
    if (isNaN(val)) return;

    // Allow 5% margin of error
    const margin = actualLambda * 0.05;
    if (Math.abs(val - actualLambda) < margin) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <CalcIcon className="w-5 h-5 text-emerald-400" />
        Lab Notebook
      </h2>

      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Ruler size={16} /> Measurement Tool
            </h3>
            {markers.length > 0 && (
                <button 
                    onClick={onClearMarkers}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                >
                    Clear Markers
                </button>
            )}
        </div>
        
        {markers.length === 0 && <p className="text-xs text-slate-500">Click two points on the wave (peaks) to measure distance.</p>}
        {markers.length === 1 && <p className="text-xs text-yellow-500">Click second point...</p>}
        {markers.length === 2 && (
             <div className="space-y-1">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Measured Dist:</span>
                    <span className="font-mono text-white">{measuredDistance.toFixed(3)} m</span>
                 </div>
                 <div className="text-xs text-slate-500 italic">
                    Is this one full wavelength? Or multiple?
                 </div>
             </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-slate-300">
          Calculate Wavelength (λ):
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter value in meters"
            value={userLambda}
            onChange={(e) => {
                setUserLambda(e.target.value);
                setFeedback('idle');
            }}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={checkAnswer}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Check
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400 text-sm animate-pulse">
            <CheckCircle size={16} />
            Correct! λ ≈ {actualLambda.toFixed(2)} m
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <XCircle size={16} />
            Not quite. Remember λ = v / f
          </div>
        )}
      </div>
    </div>
  );
};
