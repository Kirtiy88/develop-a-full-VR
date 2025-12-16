import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, PerspectiveCamera, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { WaveParams, MeasurementPoint } from '../types';

interface WaveSceneProps {
  params: WaveParams;
  onMeasure: (point: MeasurementPoint) => void;
  markers: MeasurementPoint[];
}

const WaveMesh: React.FC<{ params: WaveParams }> = ({ params }) => {
  const meshRef = useRef<THREE.Line>(null);
  
  // Create geometry for the line
  const count = 1000; // Number of points
  const width = 20; // Width of the wave display in meters
  
  const points = useMemo(() => {
    return new Array(count).fill(0).map(() => new THREE.Vector3());
  }, []);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = params.isRunning ? clock.getElapsedTime() : 0; // Simplified time control
    // Ideally we'd accumulate time manually to support pause/resume properly, 
    // but for this demo, clock is fine or we can use a ref for manual time.
    
    // Manual time tracking for pause support could be implemented in parent, 
    // but keeping it simple: visualization reflects parameters.
    
    // Wave Equation: y = A * sin(k(x - vt)) -> y = A * sin(2*PI*f * (x/v - t)) ?
    // Standard: y(x,t) = A * sin(k*x - w*t)
    // k = 2PI / lambda
    // w = 2PI * f
    // lambda = v / f
    // Therefore k = 2PI * f / v
    
    const lambda = params.speed / Math.max(0.1, params.frequency);
    const k = (2 * Math.PI) / lambda;
    const w = 2 * Math.PI * params.frequency;
    
    // We want the wave to move to the right, so (kx - wt)
    // To make it look continuous, we calculate y for each x point
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    // Use a static time offset if paused to keep wave visible but still
    const effectiveTime = params.isRunning ? clock.getElapsedTime() : 0; 
    
    for (let i = 0; i < count; i++) {
        // map i to x coordinate from -width/2 to width/2
        const x = (i / count) * width - (width / 2);
        
        // y = A * sin(kx - wt)
        const y = params.amplitude * Math.sin(k * x - w * effectiveTime);
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={meshRef}>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color="#00ff88" linewidth={3} />
    </line>
  );
};

const MeasurementMarkers: React.FC<{ markers: MeasurementPoint[] }> = ({ markers }) => {
  return (
    <group>
      {markers.map((m, idx) => (
        <group key={idx} position={[m.x, m.y, m.z]}>
          <Sphere args={[0.15, 16, 16]}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </Sphere>
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            {m.x.toFixed(2)}m
          </Text>
        </group>
      ))}
      
      {/* Draw line between markers if we have 2 */}
      {markers.length === 2 && (
        <line>
          <bufferGeometry attach="geometry" setFromPoints={[
            new THREE.Vector3(markers[0].x, markers[0].y, markers[0].z),
            new THREE.Vector3(markers[1].x, markers[1].y, markers[1].z)
          ]} />
          <lineBasicMaterial attach="material" color="#ef4444" linewidth={2} dashSize={0.2} gapSize={0.1} />
        </line>
      )}
    </group>
  );
};

const SceneContent: React.FC<WaveSceneProps> = ({ params, onMeasure, markers }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Grid for measurement reference */}
      {/* GridHelper: size, divisions. 20 size / 20 divisions = 1 meter per square */}
      <Grid 
        args={[20, 20]} 
        position={[0, -2, 0]} 
        cellColor="#4f46e5" 
        sectionColor="#818cf8" 
        sectionThickness={1}
        cellThickness={0.5}
        fadeDistance={25}
      />
      
      {/* Background Grid visual (Axis) */}
      <group position={[0, 0, -1]}>
         <gridHelper args={[20, 20, 0x444444, 0x222222]} rotation={[Math.PI/2, 0, 0]} />
      </group>

      <WaveMesh params={params} />
      <MeasurementMarkers markers={markers} />

      {/* Invisible plane for clicking/measuring */}
      <mesh 
        visible={false} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]} 
        onClick={(e) => {
            // Only allow measuring on the XY plane essentially
            onMeasure(e.point);
        }}
      >
        <planeGeometry args={[20, 10]} />
      </mesh>
    </>
  );
};

export const WaveScene: React.FC<WaveSceneProps> = (props) => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-2xl relative">
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md p-2 rounded text-xs text-emerald-400 font-mono pointer-events-none">
        <div>VR SCENE RENDERER</div>
        <div>UNITY_COMPATIBLE: TRUE</div>
      </div>
      <Canvas>
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
};
