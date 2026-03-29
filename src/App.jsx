import React, { useState } from 'react';
import CaseList from './components/CaseList';
import CasePlayer from './components/CasePlayer';
import './App.css';

export default function App() {
  const [activeCaseId, setActiveCaseId] = useState(null);

  if (activeCaseId) {
    return (
      <CasePlayer
        caseId={activeCaseId}
        onExit={() => setActiveCaseId(null)}
      />
    );
  }

  return <CaseList onSelectCase={setActiveCaseId} />;
}
