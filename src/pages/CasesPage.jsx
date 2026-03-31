import React, { useState } from 'react';
import { loadSessions } from '../hooks/useCase';

// Import all case JSONs statically for metadata
import electroLight from '../cases/electro-light.json';
import beautify from '../cases/beautify.json';
import diconsa from '../cases/diconsa.json';
import globapharm from '../cases/globapharm.json';
import nationalEducation from '../cases/national-education.json';
import talbotTrucks from '../cases/talbot-trucks.json';
import shopsCorporation from '../cases/shops-corporation.json';
import conservationForever from '../cases/conservation-forever.json';

const ALL_CASES = [
  electroLight,
  beautify,
  diconsa,
  globapharm,
  nationalEducation,
  talbotTrucks,
  shopsCorporation,
  conservationForever,
];

const DIFFICULTY_COLOR = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

// Case-specific emojis that match the actual content of each case
const CASE_EMOJI = {
  'electro-light':       '🥤', // sports drink product launch
  'beautify':            '💄', // beauty retailer digital strategy
  'diconsa':             '🏪', // rural stores / financial access
  'globapharm':          '💊', // pharma M&A
  'national-education':  '📚', // public school improvement
  'talbot-trucks':       '🚛', // commercial truck manufacturer
  'shops-corporation':   '🏬', // retail chain market expansion
  'conservation-forever':'🌲', // environmental non-profit
};

const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];
const STATUSES = [
  ['all', 'All'],
  ['available', 'Available'],
  ['coming-soon', 'Coming Soon'],
];

/**
 * CasesPage — filterable library of all cases.
 *
 * Props:
 *   onSelectCase(caseId: string) — called when user clicks an active case card
 */
export default function CasesPage({ onSelectCase }) {
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = ALL_CASES.filter((c) => {
    const isStub = !c.steps || c.steps.length === 0;
    if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
    if (status === 'available' && isStub) return false;
    if (status === 'coming-soon' && !isStub) return false;
    return true;
  });

  return (
    <div className="cases-page">

      <div className="cases-page__header">
        <h1 className="cases-page__title">Case Library</h1>
        <p className="cases-page__subtitle">
          Published consulting cases for structured interview practice
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="cases-page__filters">

        <div className="filter-group">
          <span className="filter-group__label">Difficulty</span>
          <div className="filter-group__chips">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={`filter-chip ${difficulty === d ? 'filter-chip--active' : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group__label">Status</span>
          <div className="filter-group__chips">
            {STATUSES.map(([val, label]) => (
              <button
                key={val}
                className={`filter-chip ${status === val ? 'filter-chip--active' : ''}`}
                onClick={() => setStatus(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="cases-page__count-row">
        <span className="cases-page__count">
          {filtered.length} of {ALL_CASES.length} cases
        </span>
      </div>

      {/* ── Case Grid ── */}
      <div className="cases-page__grid">
        {filtered.map((c) => {
          const sessions = loadSessions(c.id);
          const lastSession = sessions[0];
          const isStub = !c.steps || c.steps.length === 0;

          return (
            <div
              key={c.id}
              className={`case-card ${isStub ? 'case-card--stub' : ''}`}
              onClick={() => !isStub && onSelectCase(c.id)}
              role={isStub ? 'presentation' : 'button'}
              tabIndex={isStub ? -1 : 0}
              onKeyDown={(e) => {
                if (!isStub && (e.key === 'Enter' || e.key === ' ')) {
                  onSelectCase(c.id);
                }
              }}
            >
              <div className="case-card__top">
                <span className="case-card__icon">
                  {CASE_EMOJI[c.id] || '📋'}
                </span>
                <span
                  className="case-card__difficulty"
                  style={{ color: DIFFICULTY_COLOR[c.difficulty] }}
                >
                  {c.difficulty}
                </span>
              </div>

              <h3 className="case-card__title">{c.title}</h3>
              <p className="case-card__client">Client: {c.client}</p>
              <p className="case-card__industry">{c.industry}</p>
              <p className="case-card__type">{c.type}</p>

              <div className="case-card__meta">
                <span className="case-card__duration">⏱ {c.duration_minutes} min</span>
                {!isStub && (
                  <span className="case-card__steps">{c.steps.length} steps</span>
                )}
              </div>

              {isStub ? (
                <div className="case-card__badge case-card__badge--coming-soon">
                  Coming Soon
                </div>
              ) : lastSession ? (
                <div className="case-card__badge case-card__badge--played">
                  Last score: {lastSession.aggregated?.overallAverage ?? '—'}/10
                </div>
              ) : (
                <div className="case-card__badge case-card__badge--new">
                  New
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="cases-page__empty">
          No cases match the selected filters.
        </div>
      )}

    </div>
  );
}
