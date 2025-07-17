declare module 'recorder-js' {
  export default class Recorder {
    constructor(audioContext: AudioContext, config?: any);
    init(stream: MediaStream): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<{ blob: Blob, buffer: Float32Array[] }>;
  }
} 