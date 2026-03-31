import React, { useState } from 'react';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import ContactPage from './pages/ContactPage';
import CasePlayer from './components/CasePlayer';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeCaseId, setActiveCaseId] = useState(null);

  // When a case is active, show the full-screen CasePlayer (no nav)
  if (activeCaseId) {
    return (
      <CasePlayer
        caseId={activeCaseId}
        onExit={() => setActiveCaseId(null)}
      />
    );
  }

  const handleSelectCase = (caseId) => {
    setActiveCaseId(caseId);
  };

  return (
    <div className="app">
      <Nav currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === 'home' && (
        <HomePage onBrowseCases={() => setCurrentPage('cases')} />
      )}
      {currentPage === 'cases' && (
        <CasesPage onSelectCase={handleSelectCase} />
      )}
      {currentPage === 'contact' && (
        <ContactPage />
      )}
    </div>
  );
}
