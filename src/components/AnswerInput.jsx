import React, { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';

/**
 * AnswerInput — text + speech input for candidate answers.
 *
 * Props:
 *   value: string               — controlled value
 *   onChange(text: string)      — called on any change
 *   onSubmit()                  — called when user submits answer
 *   disabled: boolean           — disable input while evaluating
 *   placeholder: string
 */
export default function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type your answer here, or use the microphone...',
}) {
  const {
    isSupported,
    isListening,
    transcript,
    interimText,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeech();

  const [mode, setMode] = useState('text'); // 'text' | 'speech'

  // Sync speech transcript → parent value
  useEffect(() => {
    if (mode === 'speech' && transcript) {
      onChange(transcript);
    }
  }, [transcript, mode, onChange]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setMode('speech');
      resetTranscript();
      startListening();
    }
  };

  const handleTextChange = (e) => {
    setMode('text');
    onChange(e.target.value);
  };

  const handleSubmit = () => {
    if (isListening) stopListening();
    onSubmit();
  };

  const canSubmit = !disabled && value.trim().length > 0;

  return (
    <div className="answer-input">
      <div className="answer-input__toolbar">
        <span className="answer-input__label">Your Answer</span>
        <div className="answer-input__modes">
          {isSupported && (
            <button
              className={`answer-input__mic-btn ${isListening ? 'answer-input__mic-btn--active' : ''}`}
              onClick={handleMicClick}
              disabled={disabled}
              title={isListening ? 'Stop recording' : 'Start voice input'}
              type="button"
            >
              {isListening ? '⏹ Stop' : '🎤 Speak'}
            </button>
          )}
          {!isSupported && (
            <span className="answer-input__no-speech">
              Speech not supported in this browser
            </span>
          )}
        </div>
      </div>

      <div className="answer-input__editor">
        <textarea
          className="answer-input__textarea"
          value={value + (isListening && interimText ? ' ' + interimText : '')}
          onChange={handleTextChange}
          disabled={disabled || isListening}
          placeholder={isListening ? 'Listening... speak your answer' : placeholder}
          rows={6}
        />
        {isListening && (
          <div className="answer-input__listening-badge">
            <span className="answer-input__pulse" />
            Recording...
          </div>
        )}
      </div>

      {speechError && (
        <p className="answer-input__speech-error">{speechError}</p>
      )}

      <div className="answer-input__footer">
        <span className="answer-input__char-count">
          {value.trim().split(/\s+/).filter(Boolean).length} words
        </span>
        <button
          className="answer-input__submit-btn"
          onClick={handleSubmit}
          disabled={!canSubmit}
          type="button"
        >
          Submit Answer →
        </button>
      </div>
    </div>
  );
}
