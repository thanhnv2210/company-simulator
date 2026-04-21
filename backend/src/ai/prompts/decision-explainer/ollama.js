// Prompt tuned for qwen2.5-coder:7b
// - Structured input works better than open narrative for this model
// - Explicit output format reduces hallucination on small 7b models
// - Short, directive instructions outperform long descriptive prompts

function build({ company, decisionTitle, optionLabel, roleImpacts, beforeMetrics, afterMetrics }) {
  const metricLines = buildMetricDiff(roleImpacts, beforeMetrics, afterMetrics);

  return `You are a startup business analyst. Explain a company decision in plain English.

Company: ${company.name} | Stage: ${company.stage} | Team: ${company.size} people

Decision: "${decisionTitle}"
Choice made: "${optionLabel}"

Metric changes:
${metricLines}

Write exactly 3 short paragraphs:
1. Why this decision caused these specific metric changes (business logic)
2. The main risk this creates going forward
3. One concrete thing the team should watch in the next quarter

Be direct. No bullet points. No headers. Under 120 words total.`;
}

function buildMetricDiff(roleImpacts, beforeMetrics, afterMetrics) {
  const lines = [];

  Object.entries(roleImpacts).forEach(([role, impacts]) => {
    Object.entries(impacts).forEach(([key, delta]) => {
      if (key === 'agreement') return;
      const before = beforeMetrics?.[role]?.[key];
      const after = afterMetrics?.[role]?.[key];
      if (before === undefined || after === undefined) return;
      const sign = delta > 0 ? '+' : '';
      lines.push(`  ${role}.${key.replace(/_/g, ' ')}: ${before} → ${after} (${sign}${delta})`);
    });
  });

  return lines.length > 0 ? lines.join('\n') : '  (no tracked metric changes)';
}

module.exports = { build };
