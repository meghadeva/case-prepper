import React from 'react';
import { aggregateResults } from '../api/evaluate';

const DIMENSION_META = {
  Structure:     { icon: '🏗️', label: 'Structure' },
  Insight:       { icon: '💡', label: 'Insight' },
  Math:          { icon: '🔢', label: 'Math' },
  Communication: { icon: '🎤', label: 'Communication' },
};

function scoreColor(score) {
  if (score === null || score === undefined) return '#9A9A95';
  if (score >= 8) return '#1A7040';
  if (score >= 6) return '#9A6B00';
  return '#B83232';
}

function scoreLabel(score) {
  if (score === null || score === undefined) return 'N/A';
  if (score >= 9) return 'Exceptional';
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Developing';
  return 'Needs Work';
}

/**
 * Debrief — full post-case summary with aggregate scores per dimension and per step.
 *
 * Props:
 *   caseData: object                                   — full case JSON
 *   stepResults: Array<{stepId, stepTitle, evaluation}> — collected from CasePlayer
 *   onRestart()                                        — go back to case list
 *   onRetry()                                          — restart the same case
 */
export default function Debrief({ caseData, stepResults, onRestart, onRetry }) {
  const { averageByDimension, overallAverage, stepSummaries } =
    aggregateResults(stepResults);

  const completedSteps = stepResults.filter((r) => r.evaluation).length;

  return (
    <div className="debrief">
      <header className="debrief__header">
        <h1 className="debrief__case-title">{caseData.title}</h1>
        <p className="debrief__subtitle">Case Complete — Full Debrief</p>
        <p className="debrief__meta">
          {completedSteps} of {caseData.steps.length} steps evaluated
        </p>
      </header>

      {/* Overall score */}
      <div className="debrief__overall">
        <div
          className="debrief__overall-score"
          style={{ color: scoreColor(overallAverage) }}
        >
          {overallAverage ?? '—'}
          <span className="debrief__overall-denom">/10</span>
        </div>
        <div className="debrief__overall-label">
          Overall Score
          <br />
          <span style={{ color: scoreColor(overallAverage), fontSize: '0.9rem' }}>
            {scoreLabel(overallAverage)}
          </span>
        </div>
      </div>

      {/* Dimension breakdown */}
      <section className="debrief__dimensions">
        <h2>Score by Dimension</h2>
        <div className="debrief__dim-grid">
          {Object.entries(DIMENSION_META).map(([dim, meta]) => {
            const avg = averageByDimension[dim];
            return (
              <div key={dim} className="debrief__dim-card">
                <span className="debrief__dim-icon">{meta.icon}</span>
                <span className="debrief__dim-name">{meta.label}</span>
                <span
                  className="debrief__dim-score"
                  style={{ color: scoreColor(avg) }}
                >
                  {avg ?? 'N/A'}
                </span>
                <span
                  className="debrief__dim-label"
                  style={{ color: scoreColor(avg) }}
                >
                  {scoreLabel(avg)}
                </span>
                <div className="debrief__dim-bar">
                  <div
                    className="debrief__dim-bar-fill"
                    style={{
                      width: avg ? `${(avg / 10) * 100}%` : '0%',
                      backgroundColor: scoreColor(avg),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step-by-step breakdown */}
      <section className="debrief__steps">
        <h2>Step-by-Step Breakdown</h2>
        <div className="debrief__step-list">
          {stepSummaries.map((s, idx) => {
            const step = caseData.steps[idx];
            const hasEval = stepResults[idx]?.evaluation;
            return (
              <div key={s.stepId} className="debrief__step-row">
                <div className="debrief__step-row-header">
                  <span className="debrief__step-num">Step {idx + 1}</span>
                  <span className="debrief__step-title">{s.stepTitle}</span>
                  {!hasEval && (
                    <span className="debrief__step-skipped">Skipped</span>
                  )}
                </div>

                {hasEval && (
                  <>
                    <div className="debrief__step-dims">
                      {step?.dimensions_tested?.map((dim) => {
                        const score = s.scores[dim];
                        return (
                          <span
                            key={dim}
                            className="debrief__step-dim-chip"
                            style={{ borderColor: scoreColor(score) }}
                          >
                            {dim}: {' '}
                            <strong style={{ color: scoreColor(score) }}>
                              {score ?? '—'}
                            </strong>
                          </span>
                        );
                      })}
                    </div>

                    {s.overallNote && (
                      <p className="debrief__step-note">{s.overallNote}</p>
                    )}

                    {/* Per-dimension feedback notes */}
                    {stepResults[idx]?.evaluation?.feedback && (
                      <div className="debrief__step-feedback">
                        {step?.dimensions_tested?.map((dim) => {
                          const note = stepResults[idx].evaluation.feedback[dim];
                          if (!note) return null;
                          return (
                            <div key={dim} className="debrief__step-feedback-item">
                              <strong>{DIMENSION_META[dim]?.icon} {dim}:</strong> {note}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Actions */}
      <div className="debrief__actions">
        <button className="btn btn--secondary" onClick={onRestart}>
          ← Back to Cases
        </button>
        <button className="btn btn--primary" onClick={onRetry}>
          Retry This Case
        </button>
      </div>
    </div>
  );
}
