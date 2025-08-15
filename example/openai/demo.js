// example/openai/demo.js - Comprehensive OpenAI Demo of TahuJS Features

import TahuJS, { createTahu, quickChat, createQuickAgent } from '../../src/tahu.js';
import fs from 'fs';
import path from 'path';

async function comprehensiveOpenAIDemo() {
  console.log('🥘 TahuJS Comprehensive OpenAI Demo Starting...\n');

  // --- IMPORTANT: Replace with your actual API key ---
  const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

  // Check API key
  if (OPENAI_API_KEY.includes('YOUR_OPENAI_API_KEY')) {
    console.warn('⚠️  Warning: OpenAI API key not set. Some demos may fail.');
  }

  // --- Initialize TahuJS with OpenAI ---
  const tahuOpenAI = createTahu({
    provider: 'openai',
    apiKey: OPENAI_API_KEY,
    model: 'gpt-3.5-turbo', // Or 'gpt-4'
    embeddingProvider: 'openai',
    embeddingModel: 'text-embedding-ada-002',
    debug: true, // Enable debug mode for more verbose logging
    responseFormat: 'json', // Default response format
  });

  // Use this instance for most demos
  const tahu = tahuOpenAI;

  try {
    // --- 1. Chat Testing with OpenAI ---
    console.log('\n--- 1. Chat Testing with OpenAI ---
');

    console.log('\n💬 Chat with OpenAI:
');
    const chatResultOpenAI = await tahu.chat(
      'What are the main benefits of cloud computing?'
    );
    console.log('OpenAI Response:', chatResultOpenAI.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 2. Built-in Tool Testing (enabled by default or configured) ---
    console.log('--- 2. Built-in Tool Testing ---
');

    console.log('\n🧮 Calculator Testing:
');
    const calcResult = await tahu.useTool('calculate', '25 * 4 + sqrt(16)');
    console.log(calcResult);

    console.log('\n🕐 Date & Time Testing:
');
    const dateTimeResult = await tahu.useTool('dateTime', 'America/New_York');
    console.log('Date & Time:', dateTimeResult);

    console.log('\n📝 Text Summarization Testing:
');
    const longText =
      'This is a very long text that needs to be summarized. It contains a lot of information about various topics, and the purpose is to demonstrate how the summarization tool can work effectively. The longer the text, the more useful this tool becomes for extracting key points and presenting them in a more concise and digestible format. This is particularly helpful in scenarios where you are dealing with large documents, articles, or transcripts and just need a quick overview.';
    const summaryResult = await tahu.useTool('summarize', longText);
    console.log(summaryResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 3. Agent Management Testing ---
    console.log('--- 3. Agent Management Testing ---
');

    const travelAgent = tahu
      .builder()
      .name('OpenAITravelExpert')
      .systemPrompt(
        'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.'
      )
      .addCapabilities('webSearch', 'findLocation', 'getDirections')
      .addMemory('volatile')
      .build();

    console.log(`\n🤖 Agent '${travelAgent.name}' created successfully.
`);
    const travelResult = await tahu.runAgent(
      'OpenAITravelExpert',
      'Plan a day trip to London. Find interesting places to visit and provide directions.'
    );
    console.log('Travel Agent:', travelResult.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 4. Knowledge Training and Retrieval (RAG) Testing ---
    console.log('--- 4. Knowledge Training and Retrieval (RAG) Testing ---
');

    const knowledgeBaseName = 'openai_rag_docs';
    const storeType = 'sqlite';

    const textData =
      'OpenAI is an AI research and deployment company. Its mission is to ensure that artificial general intelligence benefits all of humanity.';
    const trainTextResult = await tahu.useTool(
      'trainKnowledge',
      `${knowledgeBaseName}|${storeType}|text|${textData}`
    );
    console.log('Train from Text:', trainTextResult);

    console.log('\n🔍 Retrieving knowledge:
');
    const retrieveResult = await tahu.useTool(
      'retrieveKnowledge',
      `${knowledgeBaseName}|${storeType}|What is OpenAI?`
    );
    console.log('Retrieval Result:\n', retrieveResult);

    const ragAgent = tahu.createAgent('OpenAIRAGAgent', {
      systemPrompt: 'You are an AI assistant that answers questions based on provided knowledge.',
      capabilities: ['retrieveKnowledge'],
      memoryType: 'volatile',
    });
    const ragResponse = await tahu.runAgent(
      'OpenAIRAGAgent',
      `Based on the following information: "${retrieveResult}", answer the question: "What is OpenAI?"`
    );
    console.log(`RAG Agent Response: ${ragResponse.response}`);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 5. Debug Mode and Response Format Testing ---
    console.log('--- 5. Debug Mode and Response Format Testing ---
');

    const tahuDebug = createTahu({
      provider: 'openai',
      apiKey: OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      debug: true,
    });
    console.log('\nRunning chat in debug mode (you should see more logs):
');
    const debugResponse = await tahuDebug.chat('What is the capital of Canada?');
    console.log('Debug Mode Response:', debugResponse.response);

    const tahuRaw = createTahu({
      provider: 'openai',
      apiKey: OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      responseFormat: 'raw',
    });
    console.log('\nRunning chat with raw text response format:
');
    const rawResponse = await tahuRaw.chat('Tell me a short poem about technology.');
    console.log('Raw Text Response:', rawResponse.response);

    const tahuMd = createTahu({
      provider: 'openai',
      apiKey: OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      responseFormat: 'md',
    });
    console.log('\nRunning chat with markdown response format:
');
    const mdResponse = await tahuMd.chat('Explain the concept of machine learning in markdown format.');
    console.log('Markdown Response:', mdResponse.response);
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('\n🎉 Comprehensive OpenAI Demo Finished!
');
    console.log('📊 Available Tools:', tahu.listTools());
    console.log('🤖 Available Agents:', tahu.listAgents());
  } catch (error) {
    console.error('❌ Comprehensive OpenAI Demo Error:', error.message);
  }
}

comprehensiveOpenAIDemo().catch(console.error);
