import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import CaseList from './components/CaseList';
import CasePlayer from './components/CasePlayer';
import './App.css';

export default function App() {
  const [activeCaseId, setActiveCaseId] = useState(null);

  if (activeCaseId) {
    return (
      <>
        <CasePlayer
          caseId={activeCaseId}
          onExit={() => setActiveCaseId(null)}
        />
        <Analytics />
      </>
    );
  }

  return (
    <>
      <CaseList onSelectCase={setActiveCaseId} />
      <Analytics />
    </>
  );
}
