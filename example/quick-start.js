// example/quick-start.js - Simple TahuJS Usage Example with AgentBuilder

import { createTahu, tools } from 'tahujs'; // Using library-style imports

async function quickStart() {
  console.log('🚀 TahuJS Quick Start Demo with AgentBuilder\n');

  // --- IMPORTANT: Replace with your actual OpenRouter API key ---
  const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; 

  if (OPENROUTER_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.error('❌ Please replace OPENROUTER_API_KEY with your actual API key in quick-start.js!');
    return;
  }

  // 1. Initialize TahuJS
  const tahu = createTahu({
    provider: 'openrouter', // You can change this to 'openai', 'gemini', or 'ollama'
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // The model you want to use
  });

  try {
    // 2. Create a simple agent using AgentBuilder
    console.log('🤖 Creating a simple agent using AgentBuilder...');
    const simpleAgent = tahu.builder()
      .name('SimpleAssistant')
      .systemPrompt('You are a friendly and helpful AI assistant.')
      .addCapabilities(tools.calculateTool.name) // Give the agent calculation capability
      .build();

    console.log(`✅ Agent '${simpleAgent.name}' created successfully.`);

    // 3. Run a task with the newly created agent
    console.log('\n💬 Running task with SimpleAssistant:');
    const agentChatResult = await tahu.runAgent('SimpleAssistant', 'What is 150 divided by 3 minus 10?');
    console.log('SimpleAssistant Response:', agentChatResult.response);

    console.log('\n' + '='.repeat(50) + '\n');

    // 4. Example of direct tool usage (optional, to show flexibility)
    console.log('🧮 Using calculator tool directly (outside of agent)...');
    const calcResult = await tahu.useTool('calculate', '75 * 2 + (200 / 4)');
    console.log('Calculation Result:', calcResult);

  } catch (error) {
    console.error('❌ Quick Start Demo Error:', error.message);
  }

  console.log('\n🎉 Quick Start Demo Finished!');
}

quickStart().catch(console.error);