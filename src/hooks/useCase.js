import { useState, useEffect, useCallback } from 'react';

const SESSION_STORAGE_KEY = 'mba_case_sessions';

/**
 * useCase — manages case data loading and session state.
 *
 * @param {string|null} caseId - the case id to load (e.g. "electro-light"), or null
 * @returns {object}
 */
export function useCase(caseId) {
  const [caseData, setCaseData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load case JSON dynamically
  useEffect(() => {
    if (!caseId) {
      setCaseData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStepIndex(0);

    import(`../cases/${caseId}.json`)
      .then((module) => {
        setCaseData(module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load case "${caseId}": ${err.message}`);
        setLoading(false);
      });
  }, [caseId]);

  const currentStep = caseData?.steps?.[currentStepIndex] ?? null;
  const totalSteps = caseData?.steps?.length ?? 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isComplete = totalSteps > 0 && currentStepIndex >= totalSteps;

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((i) => i + 1);
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const goToStep = useCallback((index) => {
    setCurrentStepIndex(index);
  }, []);

  const resetCase = useCallback(() => {
    setCurrentStepIndex(0);
  }, []);

  return {
    caseData,
    currentStep,
    currentStepIndex,
    totalSteps,
    isLastStep,
    isComplete,
    loading,
    error,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetCase,
  };
}

// ---------------------------------------------------------------------------
// Session persistence helpers (localStorage)
// ---------------------------------------------------------------------------

function loadAllSessions() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllSessions(sessions) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage quota exceeded or unavailable — silently ignore
  }
}

/**
 * Save a completed session result for a case.
 * @param {string} caseId
 * @param {object} sessionData - { completedAt, stepResults, aggregated }
 */
export function saveSession(caseId, sessionData) {
  const all = loadAllSessions();
  if (!all[caseId]) all[caseId] = [];
  all[caseId].unshift({ ...sessionData, completedAt: new Date().toISOString() });
  // Keep at most 10 sessions per case
  all[caseId] = all[caseId].slice(0, 10);
  saveAllSessions(all);
}

/**
 * Load all sessions for a given case.
 * @param {string} caseId
 * @returns {Array}
 */
export function loadSessions(caseId) {
  const all = loadAllSessions();
  return all[caseId] || [];
}

/**
 * Clear all sessions for a given case.
 * @param {string} caseId
 */
export function clearSessions(caseId) {
  const all = loadAllSessions();
  delete all[caseId];
  saveAllSessions(all);
}
