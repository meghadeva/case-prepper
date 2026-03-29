import React from 'react';

const DIMENSION_META = {
  Structure: { icon: '🏗️', description: 'Logical organization and MECE frameworks' },
  Insight:   { icon: '💡', description: 'Business judgment and so-what analysis' },
  Math:      { icon: '🔢', description: 'Quantitative accuracy and approach' },
  Communication: { icon: '🎤', description: 'Clarity, confidence, and conciseness' },
};

function ScoreBar({ score }) {
  if (score === null || score === undefined) return null;
  const pct = (score / 10) * 100;
  const color = score >= 8 ? '#22c55e' : score >= 6 ? '#f59e0b' : '#ef4444';
  return (
    <div className="score-bar">
      <div className="score-bar__track">
        <div
          className="score-bar__fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="score-bar__label" style={{ color }}>
        {score}/10
      </span>
    </div>
  );
}

/**
 * FeedbackPanel — shows AI evaluation results for one step.
 *
 * Props:
 *   evaluation: { scores, feedback, overallNote } | null
 *   isEvaluating: boolean
 *   error: string | null
 *   dimensionsTested: string[]
 */
export default function FeedbackPanel({
  evaluation,
  isEvaluating,
  error,
  dimensionsTested = [],
}) {
  if (isEvaluating) {
    return (
      <div className="feedback-panel feedback-panel--loading">
        <div className="feedback-panel__spinner" />
        <p>Analyzing your response...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-panel feedback-panel--error">
        <h3>⚠️ Evaluation Error</h3>
        <p>{error}</p>
        <p className="feedback-panel__error-hint">
          Check that your API key is set in the <code>.env</code> file and reload.
        </p>
      </div>
    );
  }

  if (!evaluation) return null;

  const activeDims = Object.keys(DIMENSION_META).filter((d) =>
    dimensionsTested.includes(d)
  );

  return (
    <div className="feedback-panel">
      <h3 className="feedback-panel__title">AI Feedback</h3>

      {evaluation.overallNote && (
        <div className="feedback-panel__overall">
          <p>{evaluation.overallNote}</p>
        </div>
      )}

      <div className="feedback-panel__dimensions">
        {activeDims.map((dim) => {
          const score = evaluation.scores?.[dim];
          const note = evaluation.feedback?.[dim];
          const meta = DIMENSION_META[dim];

          return (
            <div key={dim} className="feedback-dim">
              <div className="feedback-dim__header">
                <span className="feedback-dim__icon">{meta.icon}</span>
                <span className="feedback-dim__name">{dim}</span>
                <ScoreBar score={score} />
              </div>
              {note && <p className="feedback-dim__note">{note}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
