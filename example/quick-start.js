// example/quick-start.js - Simple TahuJS Usage Example with AgentBuilder

import { createTahu, tools, plugins } from '../src/tahu.js'; // Using library-style imports
import fs from 'fs'; // Import fs for file operations

async function quickStart() {
  console.log('🚀 TahuJS Quick Start Demo with AgentBuilder\n');

  // --- IMPORTANT: Replace with your actual API keys ---
  const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX';
  const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase Anon Key

  if (OPENROUTER_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.error(
      '❌ Please replace OPENROUTER_API_KEY with your actual API key in quick-start.js!'
    );
    return;
  }
  if (
    !SUPABASE_URL.includes('YOUR_SUPABASE_URL') ||
    !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
  ) {
    console.warn(
      '⚠️  Supabase URL or Anon Key not set. Supabase RAG demo might fail.'
    );
  }

  // --- Initialize TahuJS ---
  const tahu = createTahu({
    provider: 'openrouter', // You can change this to 'openai', 'gemini', or 'ollama'
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // The model you want to use
    embeddingProvider: 'openai', // Explicitly set embedding provider
    embeddingModel: 'text-embedding-ada-002', // Required for RAG features
    // Supabase configuration for RAG
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
  });

  // --- Example: Initializing TahuJS with specific tools enabled ---
  console.log('\n--- Example: Initializing TahuJS with specific tools enabled ---');
  const tahuLimitedTools = createTahu({
    provider: 'openrouter',
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free',
    tools: {
      enabled: [
        tools.calculateTool.name,
        tools.dateTimeTool.name,
      ],
    },
  });

  try {
    console.log('Available tools for tahuLimitedTools:', tahuLimitedTools.listTools());
    const limitedCalcResult = await tahuLimitedTools.useTool('calculate', '10 + 5');
    console.log('Limited Tools Calc Result:', limitedCalcResult);

    // This should fail if webSearchTool is not enabled
    try {
      await tahuLimitedTools.useTool('webSearch', 'latest news');
    } catch (error) {
      console.log('Expected error for disabled tool (webSearch):', error.message);
    }
  } catch (error) {
    console.error('❌ Limited Tools Example Error:', error.message);
  }
  console.log('--- End Limited Tools Example ---\n');

  try {
    // --- 1. Create a simple agent using AgentBuilder ---
    console.log('🤖 Creating a simple agent using AgentBuilder...');
    const simpleAgent = tahu
      .builder()
      .name('SimpleAssistant')
      .systemPrompt('You are a friendly and helpful AI assistant.')
      .addCapabilities(
        tools.calculateTool.name,
        tools.trainKnowledgeTool.name,
        tools.retrieveKnowledgeTool.name
      ) // Add RAG capabilities
      .addMemory('volatile') // Use volatile memory for this simple agent
      .build();

    console.log(`✅ Agent '${simpleAgent.name}' created successfully.`);

    // --- 2. Train Knowledge ---
    console.log('\n📚 Training knowledge...');

    // Train from text directly
    const trainTextResult = await tahu.runAgent(
      'SimpleAssistant',
      'train knowledge_base_rag|sqlite|text|TahuJS adalah framework AI yang kuat untuk Node.js.'
    );
    console.log('Train from text:', trainTextResult.response);

    // Train from a local file (ensure knowledge.txt exists in the root directory)
    const trainFileResult = await tahu.runAgent(
      'SimpleAssistant',
      'train knowledge_base_rag|sqlite|file|knowledge.txt'
    );
    console.log('Train from file:', trainFileResult.response);

    // Train from a URL (example: TahuJS documentation page)
    const trainUrlResult = await tahu.runAgent(
      'SimpleAssistant',
      'train knowledge_base_rag|sqlite|url|https://github.com/Cloud-Dark/tahujs'
    );
    console.log('Train from URL:', trainUrlResult.response);

    // Train knowledge to Supabase (requires Supabase setup)
    const trainSupabaseResult = await tahu.runAgent(
      'SimpleAssistant',
      'train customer_feedback|supabase|text|Pelanggan menyukai TahuJS karena mudah digunakan.'
    );
    console.log('Train to Supabase:', trainSupabaseResult.response);

    // --- 3. Ask Questions using RAG ---
    console.log('\n💬 Asking questions using RAG...');

    // Question based on file training
    const founderQuestion = await tahu.runAgent(
      'SimpleAssistant',
      'siapa pendiri apipedia?'
    );
    console.log('Question: siapa pendiri apipedia?');
    console.log('Response:', founderQuestion.response);

    // Question based on direct text training
    const tahuFeaturesQuestion = await tahu.runAgent(
      'SimpleAssistant',
      'Apa saja fitur TahuJS?'
    );
    console.log('\nQuestion: Apa saja fitur TahuJS?');
    console.log('Response:', tahuFeaturesQuestion.response);

    // Question based on URL training
    const githubInfoQuestion = await tahu.runAgent(
      'SimpleAssistant',
      'Apa itu TahuJS menurut GitHub repo nya?'
    );
    console.log('\nQuestion: Apa itu TahuJS menurut GitHub repo nya?');
    console.log('Response:', githubInfoQuestion.response);

    // Question based on Supabase training
    const customerFeedbackQuestion = await tahu.runAgent(
      'SimpleAssistant',
      'Apa yang disukai pelanggan tentang TahuJS?'
    );
    console.log('\nQuestion: Apa yang disukai pelanggan tentang TahuJS?');
    console.log('Response:', customerFeedbackQuestion.response);

    // --- 4. Example of direct tool usage (optional) ---
    console.log('\n🧮 Using calculator tool directly (outside of agent)...');
    const calcResult = await tahu.useTool('calculate', '75 * 2 + (200 / 4)');
    console.log('Calculation Result:', calcResult);
  } catch (error) {
    console.error('❌ Quick Start Demo Error:', error.message);
  }

  console.log('\n🎉 Quick Start Demo Finished!');
}

quickStart().catch(console.error);
