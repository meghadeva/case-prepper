import React from 'react';

// TODO: Replace with your actual GitHub repo URL before deploying
const GITHUB_URL = 'https://github.com/meghadeva/case-prepper';

/**
 * ContactPage — about the builder, links, and project motivation.
 */
export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="contact-page__inner">

        {/* ── Header ── */}
        <div className="contact-header">
          <h1 className="contact-header__title">About This Project</h1>
          <p className="contact-header__sub">Built by Megha Devaraj</p>
        </div>

        <div className="contact-body">

          {/* ── Bio ── */}
          <div className="contact-bio">
            <h2 className="contact-bio__heading">Hi, I'm Megha</h2>
            <p>
              I'm an MBA candidate who spent too many hours searching for a simple,
              no-fluff way to practice consulting case interviews. Most tools I found
              were paywalled, clunky, or gave feedback that didn't match what
              interviewers actually care about. So I built one.
            </p>
            <p>
              MBA Case Prepper walks you through real published cases step by step —
              just like a live interview — and gives you AI-powered feedback on
              exactly the dimensions that matter: your structure, your insight,
              your math, and how clearly you communicate.
            </p>

            <div className="contact-why">
              <h3 className="contact-why__heading">Why I built this</h3>
              <p>
                Case prep shouldn't require a subscription or a prep partner available
                at the same time as you. I wanted something free, async, and actually
                reflective of what interviewers are evaluating. This is that.
              </p>
            </div>
          </div>

          {/* ── Links ── */}
          <div className="contact-links">
            <h2 className="contact-links__heading">Get in Touch</h2>

            <div className="contact-link-list">

              <a
                href="https://linkedin.com/in/megha-devaraj"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-card"
              >
                <span className="contact-link-card__icon">💼</span>
                <div className="contact-link-card__text">
                  <div className="contact-link-card__label">LinkedIn</div>
                  <div className="contact-link-card__value">megha-devaraj</div>
                </div>
                <span className="contact-link-card__arrow">→</span>
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-card"
              >
                <span className="contact-link-card__icon">💻</span>
                <div className="contact-link-card__text">
                  <div className="contact-link-card__label">GitHub</div>
                  <div className="contact-link-card__value">View source code</div>
                </div>
                <span className="contact-link-card__arrow">→</span>
              </a>

              <a
                href="mailto:megha.s.devaraj@gmail.com"
                className="contact-link-card"
              >
                <span className="contact-link-card__icon">✉️</span>
                <div className="contact-link-card__text">
                  <div className="contact-link-card__label">Email</div>
                  <div className="contact-link-card__value">megha.s.devaraj@gmail.com</div>
                </div>
                <span className="contact-link-card__arrow">→</span>
              </a>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
