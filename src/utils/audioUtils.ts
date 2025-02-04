// Create an audio context
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Define frequencies and patterns for each instrument
const instrumentSounds = {
  drum: {
    frequency: 100,
    type: 'sine',
    duration: 0.1,
  },
  bass: {
    frequency: 60,
    type: 'triangle',
    duration: 0.3,
  },
  piano: {
    frequency: 440,
    type: 'sine',
    duration: 0.2,
  },
  cymbals: {
    frequency: 2000,
    type: 'square',
    duration: 0.05,
  },
  guitar: {
    frequency: 220,
    type: 'sawtooth',
    duration: 0.3,
  },
  beatbox: {
    frequency: 150,
    type: 'square',
    duration: 0.15,
  },
} as const;

export const playSound = (instrument: keyof typeof instrumentSounds) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  const sound = instrumentSounds[instrument];
  
  oscillator.type = sound.type as OscillatorType;
  oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(0.7, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + sound.duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start();
  oscillator.stop(ctx.currentTime + sound.duration);
};

export const startLoop = (instrument: keyof typeof instrumentSounds, bpm = 120) => {
  const intervalTime = (60 / bpm) * 1000; // Convert BPM to milliseconds
  return setInterval(() => playSound(instrument), intervalTime);
};

export const stopLoop = (intervalId: number) => {
  clearInterval(intervalId);
};