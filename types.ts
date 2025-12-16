export interface WaveParams {
  frequency: number; // Hz
  amplitude: number; // Meters
  speed: number; // m/s
  isRunning: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface MeasurementPoint {
  x: number;
  y: number;
  z: number;
}
