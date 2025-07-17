declare class Recorder {
  constructor(audioContext: AudioContext, config?: any);
  init(stream: MediaStream): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<{ blob: Blob, buffer: Float32Array[] }>;
  // Add any other methods you use if needed
}

export default Recorder; 