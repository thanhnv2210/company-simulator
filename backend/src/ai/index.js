const provider = process.env.AI_PROVIDER || 'ollama';

const providers = {
  ollama: require('./providers/ollama'),
  anthropic: require('./providers/anthropic'),
};

const promptBuilders = {
  'decision-explainer': {
    ollama: require('./prompts/decision-explainer/ollama'),
    anthropic: require('./prompts/decision-explainer/anthropic'),
  },
};

function getProvider() {
  const p = providers[provider];
  if (!p) throw new Error(`Unknown AI provider: "${provider}". Valid options: ${Object.keys(providers).join(', ')}`);
  return p;
}

function getPromptBuilder(feature) {
  const featureBuilders = promptBuilders[feature];
  if (!featureBuilders) throw new Error(`Unknown AI feature: "${feature}"`);
  const builder = featureBuilders[provider];
  if (!builder) throw new Error(`No prompt builder for feature "${feature}" with provider "${provider}"`);
  return builder;
}

async function run(feature, context) {
  const promptBuilder = getPromptBuilder(feature);
  const aiProvider = getProvider();
  const prompt = promptBuilder.build(context);
  return aiProvider.call(prompt);
}

module.exports = { run };
