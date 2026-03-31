import React from 'react';

/**
 * HomePage — editorial landing page.
 * Light theme, no gradients, typographic hierarchy over decorative elements.
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
          <span className="home-hero__overline">Case Interview Prep</span>
          <h1 className="home-hero__title">
            Practice like it's<br />
            <em>a real interview.</em>
          </h1>
          <p className="home-hero__subtitle">
            Work through published consulting cases step by step and get
            AI-powered feedback on your structure, analysis, and
            communication — exactly like a live interview, without the scheduling.
          </p>
          <button className="btn btn--primary home-hero__cta" onClick={onBrowseCases}>
            Browse Cases →
          </button>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="home-how">
        <div className="home-how__inner">
          <span className="home-section-label">How It Works</span>
          <div className="home-how__list">

            <div className="home-how__item">
              <span className="home-how__item-num">01</span>
              <div>
                <h3 className="home-how__item-title">Pick a Case</h3>
                <p className="home-how__item-desc">
                  Choose from a library of published consulting case studies
                  spanning multiple industries and difficulty levels.
                </p>
              </div>
            </div>

            <div className="home-how__item">
              <span className="home-how__item-num">02</span>
              <div>
                <h3 className="home-how__item-title">Answer Step by Step</h3>
                <p className="home-how__item-desc">
                  Work through the case like a real interview — clarifying
                  questions, framework, exhibit analysis, quantitative math,
                  and a final recommendation.
                </p>
              </div>
            </div>

            <div className="home-how__item">
              <span className="home-how__item-num">03</span>
              <div>
                <h3 className="home-how__item-title">Get AI Feedback</h3>
                <p className="home-how__item-desc">
                  Receive dimension-by-dimension coaching on your structure,
                  insight, math accuracy, and communication after every step,
                  plus a full debrief when you finish.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What Gets Scored ── */}
      <section className="home-scored">
        <div className="home-scored__inner">
          <span className="home-section-label">What Gets Scored</span>
          <div className="home-scored__list">

            <div className="home-scored__item">
              <span className="home-scored__item-name">Structure</span>
              <span className="home-scored__item-desc">
                MECE frameworks, logical organization, and issue tree quality.
              </span>
            </div>

            <div className="home-scored__item">
              <span className="home-scored__item-name">Insight</span>
              <span className="home-scored__item-desc">
                Business judgment, so-what analysis, and non-obvious observations.
              </span>
            </div>

            <div className="home-scored__item">
              <span className="home-scored__item-name">Math</span>
              <span className="home-scored__item-desc">
                Quantitative accuracy, clean setup, and sanity-checking your answer.
              </span>
            </div>

            <div className="home-scored__item">
              <span className="home-scored__item-name">Communication</span>
              <span className="home-scored__item-desc">
                Clarity, confidence, conciseness, and leading with your answer.
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section className="home-coming">
        <div className="home-coming__inner">
          <span className="home-section-label">Coming Soon</span>
          <div className="home-coming__list">

            <div className="home-coming__item">
              <h3 className="home-coming__item-title">More Firm Cases</h3>
              <p className="home-coming__item-desc">
                Cases from BCG, Bain, Deloitte, and other top consulting firms —
                covering more industries and case archetypes.
              </p>
            </div>

            <div className="home-coming__item">
              <h3 className="home-coming__item-title">Community Cases</h3>
              <p className="home-coming__item-desc">
                A platform for practitioners to submit and share original cases,
                vetted and organized by the community.
              </p>
            </div>

            <div className="home-coming__item">
              <h3 className="home-coming__item-title">Case Ratings</h3>
              <p className="home-coming__item-desc">
                Rate and review cases after completing them so others know
                which are most helpful for interview prep.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
