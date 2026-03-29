import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useSpeech — wraps the Web Speech API (SpeechRecognition).
 *
 * Returns:
 *   isSupported   — boolean, whether the browser supports SpeechRecognition
 *   isListening   — boolean, whether currently recording
 *   transcript    — string, cumulative transcript of current session
 *   interimText   — string, live in-progress text (not yet confirmed)
 *   error         — string|null
 *   startListening(onTranscriptChange) — begin recording
 *   stopListening()                    — stop recording
 *   resetTranscript()                  — clear transcript
 */
export function useSpeech() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = Boolean(SpeechRecognition);

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState(null);

  // Accumulated confirmed transcript across multiple recognition segments
  const confirmedRef = useRef('');

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText('');
  }, []);

  const startListening = useCallback(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (onTranscriptChange) => {
      if (!isSupported) {
        setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
        return;
      }

      setError(null);
      confirmedRef.current = transcript; // preserve existing text

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalSegment = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalSegment += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        if (finalSegment) {
          confirmedRef.current = (confirmedRef.current + ' ' + finalSegment).trim();
          setTranscript(confirmedRef.current);
          onTranscriptChange?.(confirmedRef.current);
        }
        setInterimText(interim);
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          setError('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognition.start();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSupported, transcript]
  );

  const resetTranscript = useCallback(() => {
    confirmedRef.current = '';
    setTranscript('');
    setInterimText('');
    setError(null);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimText,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
