// Stub — wire up when switching from Ollama to Anthropic
// Install: npm install @anthropic-ai/sdk
// Env: ANTHROPIC_API_KEY

async function call(prompt) {
  throw new Error('Anthropic provider not yet configured. Set AI_PROVIDER=ollama in .env');
}

module.exports = { call };
