// example/openrouter/quick-start.js - Simple TahuJS Usage Example with OpenRouter

import { createTahu } from '../../src/tahu.js'; // Using library-style imports

async function quickStartOpenRouter() {
  console.log('🚀 TahuJS Quick Start Demo with OpenRouter\n');

  // --- IMPORTANT: Replace with your actual API key ---
  const OPENROUTER_API_KEY = 'YOUR_OPENROUTER_API_KEY';

  if (OPENROUTER_API_KEY.includes('YOUR_OPENROUTER_API_KEY')) {
    console.error(
      '❌ Please replace OPENROUTER_API_KEY with your actual API key in quick-start-openrouter.js!'
    );
    return;
  }

  // --- Initialize TahuJS with OpenRouter and specific tools enabled ---
  const tahuOpenRouter = createTahu({
    provider: 'openrouter',
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // Or other models supported by OpenRouter
    temperature: 0.7,
    maxTokens: 500,
    tools: {
      enabled: ['calculate'], // Only enable the calculate tool for this instance
    },
    // httpReferer: 'your-website.com', // Uncomment and set if required by OpenRouter
    // xTitle: 'Your App Name', // Uncomment and set if required by OpenRouter
  });

  try {
    console.log('\n--- Example: Using OpenRouter with calculate tool enabled ---');
    console.log('Available tools:', tahuOpenRouter.listTools()); // Should show only 'calculate'

    // Chat with OpenRouter
    const openRouterResponse = await tahuOpenRouter.chat('Hello OpenRouter, how are you today?');
    console.log('OpenRouter Response:', openRouterResponse.response);

    // Use the enabled calculate tool
    const calcResult = await tahuOpenRouter.useTool('calculate', '10 * 10 - 5');
    console.log('Calculation Result:', calcResult);

    // Attempt to use a disabled tool (webSearch)
    try {
      await tahuOpenRouter.useTool('webSearch', 'latest news');
    } catch (error) {
      console.log('Expected error for disabled tool (webSearch):', error.message);
    }

  } catch (error) {
    console.error('❌ OpenRouter Example Error:', error.message);
  }
  console.log('\n🎉 Quick Start OpenRouter Demo Finished!');
}

quickStartOpenRouter().catch(console.error);
