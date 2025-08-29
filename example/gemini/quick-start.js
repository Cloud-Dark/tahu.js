// example/quick-start-gemini.js - Simple TahuJS Usage Example with Gemini

import { createTahu } from '../../src/tahu.js'; // Using library-style imports
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function quickStartGemini() {
  console.log('🚀 TahuJS Quick Start Demo with Gemini\n');

  // --- IMPORTANT: Replace with your actual API key ---
  const GEMINI_API_KEY = 'your_actual_api_key'; // Replace with your actual Gemini API key

  if (GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY')) {
    console.error(
      '❌ Please replace GEMINI_API_KEY with your actual API key in quick-start-gemini.js!'
    );
    return;
  }

  // --- Initialize TahuJS with Gemini and specific tools enabled ---
  const tahuGemini = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    maxTokens: 500,
  });

  try {
    console.log('\n--- Example: Using Gemini with calculate tool enabled ---');
    console.log('Available tools:', tahuGemini.listTools()); 

    // Chat with Gemini
    const geminiResponse = await tahuGemini.chat('Hello Gemini, how are you today?');
    console.log('Gemini Response:', geminiResponse.response);

    // Use the enabled calculate tool
    const calcResult = await tahuGemini.useTool('calculate', '100 / 4 + 25');
    console.log('Calculation Result:', calcResult);

    // Attempt to use a disabled tool (webSearch)
    try {
      await tahuGemini.useTool('webSearch', 'latest news');
    } catch (error) {
      console.log('\nExpected error for disabled tool (webSearch):', error.message);
    }

  } catch (error) {
    console.error('❌ Gemini Example Error:', error.message);
  }

  // --- Example: Debug Mode ---
  console.log('\n--- Example: Debug Mode ---');
  const tahuDebug = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    debug: true, // Enable debug mode
  });

  try {
    console.log('Running chat in debug mode (you should see more logs):');
    const debugResponse = await tahuDebug.chat('What is the capital of France?');
    console.log('Debug Mode Response:', debugResponse.response);
  } catch (error) {
    console.error('❌ Debug Mode Example Error:', error.message);
  }

  // --- Example: Raw Text Response Format ---
  console.log('\n--- Example: Raw Text Response Format ---');
  const tahuRaw = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    responseFormat: 'raw', // Get raw text response
  });

  try {
    console.log('Running chat with raw text response format:');
    const rawResponse = await tahuRaw.chat('Tell me a short story about a brave knight.');
    console.log('Raw Text Response:', rawResponse.response);
  } catch (error) {
    console.error('❌ Raw Text Format Example Error:', error.message);
  }

  // --- Example: Markdown Response Format ---
  console.log('\n--- Example: Markdown Response Format ---');
  const tahuMd = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    responseFormat: 'md', // Get markdown response
  });

  try {
    console.log('Running chat with markdown response format:');
    const mdResponse = await tahuMd.chat('Explain the concept of recursion in markdown format.');
    console.log('Markdown Response:', mdResponse.response);
  } catch (error) {
    console.error('❌ Markdown Format Example Error:', error.message);
  }

  console.log('\n🎉 Quick Start Gemini Demo Finished!');
}


quickStartGemini().catch(console.error);
