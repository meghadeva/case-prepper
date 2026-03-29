import { useState, useCallback } from 'react';
import { evaluateAnswer } from '../api/evaluate';

/**
 * useEvaluation — manages the lifecycle of evaluating a single step answer.
 *
 * Returns:
 *   evaluation    — the latest evaluation result (or null)
 *   isEvaluating  — boolean
 *   evaluationError — string|null
 *   evaluate(params) — triggers API call
 *   clearEvaluation() — resets state
 */
export function useEvaluation() {
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState(null);

  const evaluate = useCallback(async (params) => {
    setIsEvaluating(true);
    setEvaluationError(null);
    setEvaluation(null);

    try {
      const result = await evaluateAnswer(params);
      setEvaluation(result);
      return result;
    } catch (err) {
      setEvaluationError(err.message);
      return null;
    } finally {
      setIsEvaluating(false);
    }
  }, []);

  const clearEvaluation = useCallback(() => {
    setEvaluation(null);
    setEvaluationError(null);
  }, []);

  return {
    evaluation,
    isEvaluating,
    evaluationError,
    evaluate,
    clearEvaluation,
  };
}
