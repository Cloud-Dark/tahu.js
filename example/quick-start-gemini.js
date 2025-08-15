// example/quick-start-gemini.js - Simple TahuJS Usage Example with Gemini 1.0 Pro

import { createTahu } from '../src/tahu.js'; // Using library-style imports

async function quickStartGemini() {
  console.log('🚀 TahuJS Quick Start Demo with Gemini 1.0 Pro\n');

  // --- IMPORTANT: Replace with your actual API key ---
  const GEMINI_API_KEY = 'AIzaSyAUm394Y_jpQ41cfC0Cq6gljVSn4yBL-lQ'; // Replace with your actual Gemini API key

  if (GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY')) {
    console.error(
      '❌ Please replace GEMINI_API_KEY with your actual API key in quick-start-gemini.js!'
    );
    return;
  }

  // --- Initialize TahuJS with Gemini 1.0 Pro ---
  const tahuGemini = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    maxTokens: 500,
  });

  try {
    console.log('\n--- Example: Using Gemini 1.0 Pro ---');
    const geminiResponse = await tahuGemini.chat('Hello Gemini 1.0 Pro, how are you today?');
    console.log('Gemini 1.0 Pro Response:', geminiResponse.response);
  } catch (error) {
    console.error('❌ Gemini 1.0 Pro Example Error:', error.message);
  }
  console.log('\n🎉 Quick Start Gemini Demo Finished!');
}

quickStartGemini().catch(console.error);

