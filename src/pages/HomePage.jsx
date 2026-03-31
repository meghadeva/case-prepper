import React from 'react';

/**
 * HomePage — landing page with site description and Coming Soon section.
 *
 * Props:
 *   onBrowseCases() — navigate to the cases page
 */
export default function HomePage({ onBrowseCases }) {
  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero__content">
          <div className="home-hero__badge">Beta</div>
          <h1 className="home-hero__title">
            Sharpen Your{' '}
            <span className="home-hero__title-accent">Case Interview</span>{' '}
            Skills
          </h1>
          <p className="home-hero__subtitle">
            Practice structured consulting case interviews with real published cases
            and get instant AI-powered feedback on your framework, analysis, math,
            and communication — step by step, just like the real thing.
          </p>
          <div className="home-hero__actions">
            <button className="btn btn--primary home-hero__cta" onClick={onBrowseCases}>
              Browse Cases →
            </button>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="home-how">
        <div className="home-how__inner">
          <h2 className="home-how__heading">How It Works</h2>
          <div className="home-how__steps">

            <div className="home-how__step">
              <div className="home-how__step-num">1</div>
              <h3 className="home-how__step-title">Pick a Case</h3>
              <p className="home-how__step-desc">
                Choose from a library of published consulting case studies
                spanning multiple industries and difficulty levels.
              </p>
            </div>

            <div className="home-how__step">
              <div className="home-how__step-num">2</div>
              <h3 className="home-how__step-title">Answer Step by Step</h3>
              <p className="home-how__step-desc">
                Work through the case like a real interview — clarifying
                questions, framework, exhibit analysis, quantitative math,
                and a final recommendation.
              </p>
            </div>

            <div className="home-how__step">
              <div className="home-how__step-num">3</div>
              <h3 className="home-how__step-title">Get AI Feedback</h3>
              <p className="home-how__step-desc">
                Receive dimension-by-dimension coaching on your structure,
                insight, math accuracy, and communication after every step,
                plus a full debrief when you finish.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── What's scored ── */}
      <section className="home-dimensions">
        <div className="home-dimensions__inner">
          <h2 className="home-dimensions__heading">What Gets Scored</h2>
          <p className="home-dimensions__sub">
            Each step is evaluated across the dimensions that actually matter in a consulting interview.
          </p>
          <div className="home-dimensions__grid">
            <div className="home-dim-card">
              <span className="home-dim-card__icon">🏗️</span>
              <h3>Structure</h3>
              <p>MECE frameworks, logical organization, and issue tree quality.</p>
            </div>
            <div className="home-dim-card">
              <span className="home-dim-card__icon">💡</span>
              <h3>Insight</h3>
              <p>Business judgment, so-what analysis, and non-obvious observations.</p>
            </div>
            <div className="home-dim-card">
              <span className="home-dim-card__icon">🔢</span>
              <h3>Math</h3>
              <p>Quantitative accuracy, clean setup, and sanity-checking your answer.</p>
            </div>
            <div className="home-dim-card">
              <span className="home-dim-card__icon">🎤</span>
              <h3>Communication</h3>
              <p>Clarity, confidence, conciseness, and leading with your answer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section className="home-coming-soon">
        <div className="home-coming-soon__inner">
          <div className="home-coming-soon__eyebrow">Coming Soon</div>
          <h2 className="home-coming-soon__heading">What's Next</h2>
          <div className="home-coming-soon__grid">

            <div className="home-coming-soon__card">
              <span className="home-coming-soon__icon">🏢</span>
              <h3>More Firm Cases</h3>
              <p>
                Cases from BCG, Bain, Deloitte, and other top consulting firms —
                covering more industries and case archetypes.
              </p>
            </div>

            <div className="home-coming-soon__card">
              <span className="home-coming-soon__icon">🤝</span>
              <h3>Community Cases</h3>
              <p>
                A platform for practitioners to submit and share original cases,
                vetted and organized by the community.
              </p>
            </div>

            <div className="home-coming-soon__card">
              <span className="home-coming-soon__icon">⭐</span>
              <h3>Case Ratings</h3>
              <p>
                Rate and review cases after completing them so others know
                which cases are most helpful for interview prep.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
