interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const isSpeechRecognitionSupported = (): boolean => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const startSpeechRecognition = (
  onResult: (text: string) => void,
  onError: (error: string) => void
): (() => void) | null => {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition not supported');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(event.error);
  };

  recognition.start();

  return () => recognition.stop();
};

export const speakText = (text: string, options: SpeechSynthesisUtteranceOptions = {}): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.volume) utterance.volume = options.volume;
    if (options.voice) utterance.voice = options.voice;

    window.speechSynthesis.speak(utterance);
  }
};

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  return window.speechSynthesis?.getVoices() || [];
};

interface SpeechSynthesisUtteranceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}