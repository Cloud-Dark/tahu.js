// example/openai/quick-start.js - Simple TahuJS Usage Example with OpenAI

import { createTahu } from '../../src/tahu.js'; // Using library-style imports

async function quickStartOpenAI() {
  console.log('🚀 TahuJS Quick Start Demo with OpenAI\n');

  // --- IMPORTANT: Replace with your actual API key ---
  const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

  if (OPENAI_API_KEY.includes('YOUR_OPENAI_API_KEY')) {
    console.error(
      '❌ Please replace OPENAI_API_KEY with your actual API key in quick-start-openai.js!'
    );
    return;
  }

  // --- Initialize TahuJS with OpenAI and specific tools enabled ---
  const tahuOpenAI = createTahu({
    provider: 'openai',
    apiKey: OPENAI_API_KEY,
    model: 'gpt-3.5-turbo', // Or 'gpt-4'
    temperature: 0.7,
    maxTokens: 500,
    debug: true, // Enable debug mode to see detailed logging
    tools: {
      enabled: ['calculate'], // Only enable the calculate tool for this instance
    },
  });

  try {
    console.log('\n--- Example: Using OpenAI with calculate tool enabled ---');
    console.log('Available tools:', tahuOpenAI.listTools()); // Should show only 'calculate'

    // Chat with OpenAI
    const openaiResponse = await tahuOpenAI.chat(
      'Hello OpenAI, how are you today?'
    );
    console.log('OpenAI Response:', openaiResponse.response);

    // Use the enabled calculate tool
    const calcResult = await tahuOpenAI.useTool(
      'calculate',
      '75 * 2 + (200 / 4)'
    );
    console.log('Calculation Result:', calcResult);

    // Attempt to use a disabled tool (webSearch)
    try {
      await tahuOpenAI.useTool('webSearch', 'latest news');
    } catch (error) {
      console.log(
        'Expected error for disabled tool (webSearch):',
        error.message
      );
    }
  } catch (error) {
    console.error('❌ OpenAI Example Error:', error.message);
  }
  console.log('\n🎉 Quick Start OpenAI Demo Finished!');
}

quickStartOpenAI().catch(console.error);
