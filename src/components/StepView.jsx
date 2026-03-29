import React from 'react';

const STEP_TYPE_LABEL = {
  clarification: 'Clarifying Questions',
  framework: 'Framework',
  exhibit: 'Exhibit Analysis',
  math: 'Math / Quantitative',
  recommendation: 'Recommendation',
};

const STEP_TYPE_ICON = {
  clarification: '❓',
  framework: '🗂️',
  exhibit: '📊',
  math: '🔢',
  recommendation: '✅',
};

/**
 * StepView — displays the current step's interviewer question and any exhibit.
 *
 * Props:
 *   step: object        — the current step object from the case JSON
 *   stepNumber: number  — 1-based step number
 *   totalSteps: number
 */
export default function StepView({ step, stepNumber, totalSteps }) {
  if (!step) return null;

  return (
    <div className="step-view">
      <div className="step-view__meta">
        <span className="step-view__type-icon">{STEP_TYPE_ICON[step.type] || '📋'}</span>
        <span className="step-view__type-label">
          {STEP_TYPE_LABEL[step.type] || step.type}
        </span>
        <span className="step-view__progress">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      <h2 className="step-view__title">{step.title}</h2>

      <div className="step-view__dimensions">
        {step.dimensions_tested?.map((d) => (
          <span key={d} className="step-view__dim-badge">
            {d}
          </span>
        ))}
      </div>

      <div className="step-view__question">
        <p className="step-view__interviewer-label">Interviewer:</p>
        <blockquote className="step-view__question-text">
          {step.interviewer_prompt}
        </blockquote>
      </div>

      {/* Exhibit block (only for exhibit-type steps) */}
      {step.type === 'exhibit' && step.exhibit && (
        <ExhibitBlock exhibit={step.exhibit} />
      )}

      {/* Additional data for math steps */}
      {step.type === 'math' && step.given_data && (
        <GivenDataBlock data={step.given_data} />
      )}
    </div>
  );
}

function ExhibitBlock({ exhibit }) {
  return (
    <div className="exhibit-block">
      <h4 className="exhibit-block__title">Exhibit: {exhibit.description}</h4>

      {/* Try to show the image; fall back to text summary */}
      {exhibit.image_url ? (
        <div className="exhibit-block__image-wrap">
          <img
            src={exhibit.image_url}
            alt={exhibit.description}
            className="exhibit-block__image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'block';
            }}
          />
          <div className="exhibit-block__fallback" style={{ display: 'none' }}>
            <ExhibitDataTable exhibit={exhibit} />
          </div>
        </div>
      ) : (
        <ExhibitDataTable exhibit={exhibit} />
      )}

      {exhibit.text_summary && (
        <p className="exhibit-block__summary">{exhibit.text_summary}</p>
      )}
    </div>
  );
}

function ExhibitDataTable({ exhibit }) {
  if (!exhibit.data) return null;
  const { outer_pie, inner_pie, total_market_gallons } = exhibit.data;
  const totalBillions = total_market_gallons
    ? (total_market_gallons / 1e9).toFixed(0)
    : null;

  return (
    <div className="exhibit-table">
      {outer_pie && (
        <div className="exhibit-table__section">
          <h5>{outer_pie.label}</h5>
          {totalBillions && (
            <p className="exhibit-table__total">
              Total market: <strong>{totalBillions} billion gallons</strong>
            </p>
          )}
          <table>
            <thead>
              <tr>
                <th>Segment</th>
                <th>Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {outer_pie.segments.map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.share_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {inner_pie && (
        <div className="exhibit-table__section">
          <h5>{inner_pie.label}</h5>
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {inner_pie.segments.map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.share_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function GivenDataBlock({ data }) {
  return (
    <div className="given-data-block">
      <h4 className="given-data-block__title">Given Information</h4>
      <ul className="given-data-block__list">
        {data.format && (
          <li>
            <strong>Format:</strong> {data.format}
          </li>
        )}
        {data.price_to_retailer_per_bottle !== undefined && (
          <li>
            <strong>Price to retailer:</strong> ${data.price_to_retailer_per_bottle.toFixed(2)} per bottle
          </li>
        )}
        {data.variable_cost_per_bottle !== undefined && (
          <li>
            <strong>Variable cost per bottle:</strong> ${data.variable_cost_per_bottle.toFixed(2)}
          </li>
        )}
        {data.fixed_costs_total !== undefined && (
          <li>
            <strong>Total fixed costs:</strong> $
            {(data.fixed_costs_total / 1e6).toFixed(0)}M
          </li>
        )}
      </ul>
    </div>
  );
}
