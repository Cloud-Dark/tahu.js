// example/ollama/quick-start.js - Simple TahuJS Usage Example with Ollama

import { createTahu } from '../../src/tahu.js'; // Using library-style imports

async function quickStartOllama() {
  console.log('🚀 TahuJS Quick Start Demo with Ollama\n');

  // --- IMPORTANT: Ensure Ollama server is running and model is downloaded ---
  const OLLAMA_BASE_URL = 'http://localhost:11434'; // Default Ollama URL
  const OLLAMA_MODEL = 'llama2'; // Ensure this model is downloaded on your Ollama instance

  // --- Initialize TahuJS with Ollama ---
  const tahuOllama = createTahu({
    provider: 'ollama',
    ollamaBaseUrl: OLLAMA_BASE_URL,
    model: OLLAMA_MODEL,
    temperature: 0.7,
    maxTokens: 500,
    tools: {
      enabled: ['calculate'], // Only enable the calculate tool for this instance
    },
  });

  try {
    console.log('\n--- Example: Using Ollama with calculate tool enabled ---');
    console.log('Available tools:', tahuOllama.listTools()); // Should show only 'calculate'

    // Chat with Ollama
    const ollamaResponse = await tahuOllama.chat('Hello Ollama, how are you today?');
    console.log('Ollama Response:', ollamaResponse.response);

    // Use the enabled calculate tool
    const calcResult = await tahuOllama.useTool('calculate', '50 * 2 + 10');
    console.log('Calculation Result:', calcResult);

    // Attempt to use a disabled tool (webSearch)
    try {
      await tahuOllama.useTool('webSearch', 'latest news');
    } catch (error) {
      console.log('Expected error for disabled tool (webSearch):', error.message);
    }

  } catch (error) {
    console.error('❌ Ollama Example Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Ensure Ollama server is running at', OLLAMA_BASE_URL);
    }
    if (error.message.includes('model')) {
      console.error('💡 Ensure model', OLLAMA_MODEL, 'is downloaded on your Ollama instance.');
    }
  }
  console.log('\n🎉 Quick Start Ollama Demo Finished!');
}

quickStartOllama().catch(console.error);
