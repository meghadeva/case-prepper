import React from 'react';
import { loadSessions } from '../hooks/useCase';

// Import all case JSONs statically so we have metadata without lazy-loading
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

const TYPE_ICON = {
  'Market Entry / Product Launch': '🚀',
  'Operations / Digital Strategy': '⚙️',
  'Operations / Social Enterprise': '🌍',
  'M&A / Growth Strategy': '📈',
  'Operations / Public Policy': '🏛️',
  'Operations / Cost Reduction': '✂️',
  'Growth Strategy / Market Entry': '🗺️',
  'Operations / Non-Profit Strategy': '🌿',
};

/**
 * CaseList — home screen showing all available cases.
 *
 * Props:
 *   onSelectCase(caseId: string) — called when user clicks a case
 */
export default function CaseList({ onSelectCase }) {
  return (
    <div className="case-list">
      <header className="case-list__header">
        <div className="case-list__header-content">
          <h1 className="case-list__title">MBA Case Prepper</h1>
          <p className="case-list__subtitle">
            Practice McKinsey-style case interviews with AI-powered feedback
          </p>
        </div>
      </header>

      <main className="case-list__main">
        <div className="case-list__section-header">
          <h2>Available Cases</h2>
          <span className="case-list__count">{ALL_CASES.length} cases</span>
        </div>

        <div className="case-list__grid">
          {ALL_CASES.map((c) => {
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
                    {TYPE_ICON[c.type] || '📋'}
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
                  <span className="case-card__duration">
                    ⏱ {c.duration_minutes} min
                  </span>
                  {!isStub && (
                    <span className="case-card__steps">
                      {c.steps.length} steps
                    </span>
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
      </main>
    </div>
  );
}
