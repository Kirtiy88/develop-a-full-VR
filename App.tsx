import React, { useState } from 'react';
import { WaveScene } from './components/WaveScene';
import { Controls } from './components/Controls';
import { Calculator } from './components/Calculator';
import { UnityPanel } from './components/UnityPanel';
import { Assistant } from './components/Assistant';
import { WaveParams, MeasurementPoint } from './types';
import { Beaker } from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<WaveParams>({
    frequency: 1.0,
    amplitude: 1.0,
    speed: 2.0,
    isRunning: true,
  });

  const [markers, setMarkers] = useState<MeasurementPoint[]>([]);

  const handleReset = () => {
    setParams({
      frequency: 1.0,
      amplitude: 1.0,
      speed: 2.0,
      isRunning: true,
    });
    setMarkers([]);
  };

  const handleMeasure = (point: MeasurementPoint) => {
    if (markers.length >= 2) {
      setMarkers([point]); // Start new pair
    } else {
      setMarkers(prev => [...prev, point]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 shadow-md z-20">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">WaveLab VR</h1>
              <p className="text-xs text-slate-400 font-mono">PHYSICS SIMULATION & UNITY STUDIO</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
             <span>v1.0.0</span>
             <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
             <span>WebGL Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col md:flex-row gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* Left Column: 3D Scene */}
        <div className="flex-1 flex flex-col min-h-[500px] md:min-h-0 relative">
          <WaveScene params={params} onMeasure={handleMeasure} markers={markers} />
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controls params={params} setParams={setParams} onReset={handleReset} />
            <Calculator params={params} markers={markers} onClearMarkers={() => setMarkers([])} />
          </div>
        </div>

        {/* Right Column: Tools & AI */}
        <div className="w-full md:w-[400px] flex flex-col gap-4 overflow-y-auto">
          <Assistant params={params} />
          <div className="flex-1 min-h-[300px]">
            <UnityPanel params={params} />
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;
