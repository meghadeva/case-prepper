import React, { useState, useCallback } from 'react';
import { useCase, saveSession } from '../hooks/useCase';
import { useEvaluation } from '../hooks/useEvaluation';
import StepView from './StepView';
import AnswerInput from './AnswerInput';
import FeedbackPanel from './FeedbackPanel';
import Debrief from './Debrief';

/**
 * CasePlayer — orchestrates the full case interview session.
 *
 * Props:
 *   caseId: string       — which case to load
 *   onExit()             — go back to case list
 */
export default function CasePlayer({ caseId, onExit }) {
  const {
    caseData,
    currentStep,
    currentStepIndex,
    totalSteps,
    isLastStep,
    loading,
    error,
    goToNextStep,
    resetCase,
  } = useCase(caseId);

  const { evaluation, isEvaluating, evaluationError, evaluate, clearEvaluation } =
    useEvaluation();

  const [answer, setAnswer] = useState('');
  const [stepResults, setStepResults] = useState([]);
  const [showDebrief, setShowDebrief] = useState(false);
  const [hasSubmittedStep, setHasSubmittedStep] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!currentStep || !answer.trim()) return;

    const result = await evaluate({
      caseTitle: caseData.title,
      stepTitle: currentStep.title,
      stepType: currentStep.type,
      dimensionsTested: currentStep.dimensions_tested || [],
      interviewerPrompt: currentStep.interviewer_prompt,
      rubric: currentStep.model_answer_outline,
      scoringGuide: currentStep.scoring_guide,
      userAnswer: answer,
    });

    const stepResult = {
      stepId: currentStep.id,
      stepTitle: currentStep.title,
      userAnswer: answer,
      evaluation: result,
    };

    setStepResults((prev) => {
      const updated = [...prev];
      updated[currentStepIndex] = stepResult;
      return updated;
    });

    setHasSubmittedStep(true);
  }, [currentStep, answer, evaluate, caseData, currentStepIndex]);

  const handleNext = useCallback(() => {
    clearEvaluation();
    setAnswer('');
    setHasSubmittedStep(false);

    if (isLastStep) {
      // Save session and show debrief
      const finalResults = [...stepResults];
      if (finalResults[currentStepIndex]) {
        // already set
      }
      saveSession(caseId, {
        stepResults: finalResults,
        caseTitle: caseData.title,
      });
      setShowDebrief(true);
    } else {
      goToNextStep();
    }
  }, [isLastStep, goToNextStep, clearEvaluation, stepResults, currentStepIndex, caseId, caseData]);

  const handleSkip = useCallback(() => {
    clearEvaluation();
    setAnswer('');
    setHasSubmittedStep(false);

    if (isLastStep) {
      saveSession(caseId, {
        stepResults,
        caseTitle: caseData?.title,
      });
      setShowDebrief(true);
    } else {
      goToNextStep();
    }
  }, [isLastStep, goToNextStep, clearEvaluation, stepResults, caseId, caseData]);

  const handleRetry = useCallback(() => {
    resetCase();
    setAnswer('');
    setStepResults([]);
    setShowDebrief(false);
    setHasSubmittedStep(false);
    clearEvaluation();
  }, [resetCase, clearEvaluation]);

  // --- Loading / error states ---
  if (loading) {
    return (
      <div className="case-player case-player--loading">
        <div className="spinner" />
        <p>Loading case...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="case-player case-player--error">
        <p>{error}</p>
        <button className="btn btn--secondary" onClick={onExit}>
          ← Back
        </button>
      </div>
    );
  }

  if (!caseData) return null;

  // --- Debrief view ---
  if (showDebrief) {
    return (
      <Debrief
        caseData={caseData}
        stepResults={stepResults}
        onRestart={onExit}
        onRetry={handleRetry}
      />
    );
  }

  const progressPct = ((currentStepIndex) / totalSteps) * 100;

  return (
    <div className="case-player">
      {/* Top nav */}
      <div className="case-player__nav">
        <button className="btn btn--ghost" onClick={onExit}>
          ← Cases
        </button>
        <div className="case-player__case-title">{caseData.title}</div>
        <button className="btn btn--ghost" onClick={handleSkip}>
          Skip →
        </button>
      </div>

      {/* Progress bar */}
      <div className="case-player__progress-track">
        <div
          className="case-player__progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Case intro (only on step 0 before submitting) */}
      {currentStepIndex === 0 && !hasSubmittedStep && (
        <div className="case-player__intro">
          <h2 className="case-player__intro-label">Case Background</h2>
          <p className="case-player__intro-text">{caseData.prompt}</p>
        </div>
      )}

      {/* Step content */}
      <div className="case-player__content">
        <StepView
          step={currentStep}
          stepNumber={currentStepIndex + 1}
          totalSteps={totalSteps}
        />

        {!hasSubmittedStep ? (
          <AnswerInput
            value={answer}
            onChange={setAnswer}
            onSubmit={handleSubmit}
            disabled={isEvaluating}
          />
        ) : (
          <>
            <div className="case-player__answer-review">
              <h4>Your Answer</h4>
              <p>{answer}</p>
            </div>

            <FeedbackPanel
              evaluation={evaluation}
              isEvaluating={isEvaluating}
              error={evaluationError}
              dimensionsTested={currentStep?.dimensions_tested || []}
            />

            {!isEvaluating && (
              <div className="case-player__step-actions">
                <button className="btn btn--primary" onClick={handleNext}>
                  {isLastStep ? 'View Full Debrief →' : 'Next Step →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
