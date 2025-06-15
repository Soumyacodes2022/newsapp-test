import { useState, useEffect, useCallback, useRef } from 'react';

export const useTextToSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const utteranceRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Set default voice (prefer English voices)
        const englishVoice = availableVoices.find(voice => 
          voice.lang.startsWith('en') && (
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') ||
            voice.name.includes('Natural')
          )
        ) || availableVoices.find(voice => voice.lang.startsWith('en'));
        
        if (englishVoice) {
          setSelectedVoice(englishVoice);
        }
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const cleanTextForSpeech = useCallback((text) => {
    // Remove markdown formatting and clean text for better speech
    return text
      .replace(/[#*_`]/g, '') // Remove markdown symbols
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/\n+/g, '. ') // Convert line breaks to pauses
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure pauses between sentences
      .trim();
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) return;

    // Stop any current speech first
    stop();

    const cleanedText = cleanTextForSpeech(text);
    setCurrentText(cleanedText);

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utteranceRef.current = utterance;
    
    // Configure utterance for news reading
    utterance.voice = selectedVoice;
    utterance.rate = options.rate || 0.85; // Slightly slower for news
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.9;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentText('');
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentText('');
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, cleanTextForSpeech]);

  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentText('');
    utteranceRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    currentText,
    setSelectedVoice,
    speak,
    pause,
    resume,
    stop
  };
};
