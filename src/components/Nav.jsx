import React from 'react';

/**
 * Nav — shared top navigation bar across all pages.
 *
 * Props:
 *   currentPage: 'home' | 'cases' | 'contact'
 *   onNavigate(page): called when a nav link is clicked
 */
export default function Nav({ currentPage, onNavigate }) {
  return (
    <nav className="main-nav">
      <button
        className="main-nav__brand"
        onClick={() => onNavigate('home')}
      >
        MBA Case Prepper
      </button>

      <div className="main-nav__links">
        <button
          className={`main-nav__link ${currentPage === 'home' ? 'main-nav__link--active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className={`main-nav__link ${currentPage === 'cases' ? 'main-nav__link--active' : ''}`}
          onClick={() => onNavigate('cases')}
        >
          Cases
        </button>
        <button
          className={`main-nav__link ${currentPage === 'contact' ? 'main-nav__link--active' : ''}`}
          onClick={() => onNavigate('contact')}
        >
          About
        </button>
      </div>
    </nav>
  );
}
