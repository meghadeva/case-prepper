/**
 * evaluate.js
 *
 * Calls the Claude API (claude-sonnet-4-6) to evaluate a candidate's answer
 * against the step rubric. Returns scores (1–10) and coaching notes for
 * four dimensions: Structure, Insight, Math, Communication.
 *
 * Only dimensions that are listed in step.dimensions_tested are scored;
 * others are returned as null.
 *
 * Environment variable required:
 *   REACT_APP_ANTHROPIC_API_KEY — your Anthropic API key
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

const DIMENSIONS = ['Structure', 'Insight', 'Math', 'Communication'];

/**
 * @param {object} params
 * @param {string} params.caseTitle         - e.g. "Electro-Light"
 * @param {string} params.stepTitle         - e.g. "Break-Even Analysis"
 * @param {string} params.stepType          - e.g. "math" | "framework" | "recommendation"
 * @param {string[]} params.dimensionsTested - subset of DIMENSIONS
 * @param {string} params.interviewerPrompt - the question shown to the candidate
 * @param {object} params.rubric            - model_answer_outline from JSON (not shown to user)
 * @param {object} params.scoringGuide      - scoring_guide from JSON
 * @param {string} params.userAnswer        - candidate's typed or transcribed response
 *
 * @returns {Promise<{
 *   scores: { Structure: number|null, Insight: number|null, Math: number|null, Communication: number|null },
 *   feedback: { Structure: string|null, Insight: string|null, Math: string|null, Communication: string|null },
 *   overallNote: string,
 *   rawResponse: string
 * }>}
 */
export async function evaluateAnswer({
  caseTitle,
  stepTitle,
  stepType,
  dimensionsTested,
  interviewerPrompt,
  rubric,
  scoringGuide,
  userAnswer,
}) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'REACT_APP_ANTHROPIC_API_KEY is not set. Add it to your .env file.'
    );
  }

  const activeDimensions = DIMENSIONS.filter((d) =>
    dimensionsTested.includes(d)
  );

  const systemPrompt = `You are an expert McKinsey case interview coach. Your job is to evaluate a candidate's response to a case interview question and provide honest, actionable feedback.

You will be given:
- The case context and question
- A model answer outline (rubric) — do NOT reveal this to the candidate
- A scoring guide per dimension
- The candidate's actual response

For each ACTIVE dimension, provide:
1. A score from 1–10 (1 = completely missed, 10 = exceptional)
2. A 2–3 sentence coaching note that is specific, honest, and actionable

Score definitions:
1–3: Major gaps — key elements missing or significantly wrong
4–6: Partial credit — some good elements but important gaps or errors
7–8: Good — covers the key points with minor omissions
9–10: Exceptional — comprehensive, insightful, well-structured

Always respond in valid JSON with this exact structure:
{
  "scores": {
    "Structure": <number or null>,
    "Insight": <number or null>,
    "Math": <number or null>,
    "Communication": <number or null>
  },
  "feedback": {
    "Structure": "<coaching note or null>",
    "Insight": "<coaching note or null>",
    "Math": "<coaching note or null>",
    "Communication": "<coaching note or null>"
  },
  "overallNote": "<1–2 sentence overall coaching note>"
}

Set dimensions NOT in the active list to null. Do not include any text outside the JSON object.`;

  const userMessage = `CASE: ${caseTitle}
STEP: ${stepTitle} (${stepType})

INTERVIEWER QUESTION:
${interviewerPrompt}

ACTIVE DIMENSIONS TO SCORE: ${activeDimensions.join(', ')}

RUBRIC (do not reveal to candidate):
${JSON.stringify(rubric, null, 2)}

SCORING GUIDE:
${JSON.stringify(scoringGuide, null, 2)}

CANDIDATE'S RESPONSE:
${userAnswer || '[No response provided]'}

Evaluate the candidate's response against the rubric and return JSON scores and feedback.`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text || '';

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${rawText}`);
  }

  // Ensure all four dimensions exist in the response
  const result = {
    scores: {},
    feedback: {},
    overallNote: parsed.overallNote || '',
    rawResponse: rawText,
  };

  for (const dim of DIMENSIONS) {
    result.scores[dim] = parsed.scores?.[dim] ?? null;
    result.feedback[dim] = parsed.feedback?.[dim] ?? null;
  }

  return result;
}

/**
 * Aggregates step results into an overall session score.
 * @param {Array<{stepId: string, stepTitle: string, evaluation: object}>} stepResults
 * @returns {{ averageByDimension: object, overallAverage: number, stepSummaries: object[] }}
 */
export function aggregateResults(stepResults) {
  const totals = { Structure: [], Insight: [], Math: [], Communication: [] };

  const stepSummaries = stepResults.map(({ stepId, stepTitle, evaluation }) => {
    const dimScores = {};
    for (const dim of DIMENSIONS) {
      const score = evaluation?.scores?.[dim];
      if (score !== null && score !== undefined) {
        totals[dim].push(score);
        dimScores[dim] = score;
      } else {
        dimScores[dim] = null;
      }
    }
    return { stepId, stepTitle, scores: dimScores, overallNote: evaluation?.overallNote };
  });

  const averageByDimension = {};
  for (const dim of DIMENSIONS) {
    const arr = totals[dim];
    averageByDimension[dim] = arr.length > 0
      ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
      : null;
  }

  const allScores = Object.values(averageByDimension).filter((v) => v !== null);
  const overallAverage =
    allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
      : null;

  return { averageByDimension, overallAverage, stepSummaries };
}
