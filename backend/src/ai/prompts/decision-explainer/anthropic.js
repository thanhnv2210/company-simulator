// Stub — Claude prompt style differs from Ollama (longer context, more nuanced framing)
// Wire this up when switching AI_PROVIDER=anthropic

function build({ company, decisionTitle, optionLabel, roleImpacts, beforeMetrics, afterMetrics }) {
  throw new Error('Anthropic prompt builder not yet implemented');
}

module.exports = { build };
