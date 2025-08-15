// example/openrouter/demo.js - Comprehensive OpenRouter Demo of TahuJS Features

import TahuJS, { createTahu, quickChat, createQuickAgent } from '../../src/tahu.js';
import fs from 'fs';
import path from 'path';

async function comprehensiveOpenRouterDemo() {
  console.log('🥘 TahuJS Comprehensive OpenRouter Demo Starting...\n');

  // --- IMPORTANT: Replace with your actual API key ---
  const OPENROUTER_API_KEY = 'YOUR_OPENROUTER_API_KEY';

  // Check API key
  if (OPENROUTER_API_KEY.includes('YOUR_OPENROUTER_API_KEY')) {
    console.warn('⚠️  Warning: OpenRouter API key not set. Some demos may fail.');
  }

  // --- Initialize TahuJS with OpenRouter ---
  const tahuOpenRouter = createTahu({
    provider: 'openrouter',
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // Or 'anthropic/claude-3-sonnet', 'openai/gpt-4'
    embeddingProvider: 'openai', // OpenRouter often uses OpenAI compatible embeddings
    embeddingModel: 'text-embedding-ada-002',
    debug: true, // Enable debug mode for more verbose logging
    responseFormat: 'json', // Default response format
    // httpReferer: 'your-website.com', // Required for OpenRouter if configured
    // xTitle: 'Your App Name', // Required for OpenRouter if configured
  });

  // Use this instance for most demos
  const tahu = tahuOpenRouter;

  try {
    // --- 1. Chat Testing with OpenRouter ---
    console.log('\n--- 1. Chat Testing with OpenRouter ---
');

    console.log('\n💬 Chat with OpenRouter:');
    const chatResultOpenRouter = await tahu.chat(
      'Explain the concept of quantum entanglement in simple terms.'
    );
    console.log('OpenRouter Response:', chatResultOpenRouter.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 2. Built-in Tool Testing (enabled by default or configured) ---
    console.log('--- 2. Built-in Tool Testing ---
');

    console.log('\n🧮 Calculator Testing:');
    const calcResult = await tahu.useTool('calculate', '25 * 4 + sqrt(16)');
    console.log(calcResult);

    console.log('\n🕐 Date & Time Testing:');
    const dateTimeResult = await tahu.useTool('dateTime', 'America/New_York');
    console.log('Date & Time:', dateTimeResult);

    console.log('\n📝 Text Summarization Testing:');
    const longText =
      'This is a very long text that needs to be summarized. It contains a lot of information about various topics, and the purpose is to demonstrate how the summarization tool can work effectively. The longer the text, the more useful this tool becomes for extracting key points and presenting them in a more concise and digestible format. This is particularly helpful in scenarios where you are dealing with large documents, articles, or transcripts and just need a quick overview.';
    const summaryResult = await tahu.useTool('summarize', longText);
    console.log(summaryResult);

    console.log('\n👁️ OCR Tool Testing:');
    const imagePath = path.join(process.cwd(), 'example', 'openrouter', 'sample.png');
    // For a real test, you would replace 'sample.png' with an image containing text.
    // For this example, it will likely return empty or garbled text as sample.png is just a blank image.
    const ocrResult = await tahu.useTool('ocr', imagePath);
    console.log('OCR Result:', ocrResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 3. Agent Management Testing ---
    console.log('--- 3. Agent Management Testing ---
');

    const travelAgent = tahu
      .builder()
      .name('OpenRouterTravelExpert')
      .systemPrompt(
        'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.'
      )
      .addCapabilities('webSearch', 'findLocation', 'getDirections')
      .addMemory('volatile')
      .build();

    console.log(`\n🤖 Agent '${travelAgent.name}' created successfully.`);
    const travelResult = await tahu.runAgent(
      'OpenRouterTravelExpert',
      'Plan a day trip to Rome. Find interesting places to visit and provide directions.'
    );
    console.log('Travel Agent:', travelResult.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 4. Knowledge Training and Retrieval (RAG) Testing ---
    console.log('--- 4. Knowledge Training and Retrieval (RAG) Testing ---
');

    const knowledgeBaseName = 'openrouter_rag_docs';
    const storeType = 'sqlite';

    const textData =
      'OpenRouter provides a unified API for various large language models, simplifying access and integration.';
    const trainTextResult = await tahu.useTool(
      'trainKnowledge',
      `${knowledgeBaseName}|${storeType}|text|${textData}`
    );
    console.log('Train from Text:', trainTextResult);

    console.log('\n🔍 Retrieving knowledge:');
    const retrieveResult = await tahu.useTool(
      'retrieveKnowledge',
      `${knowledgeBaseName}|${storeType}|What is OpenRouter?`
    );
    console.log('Retrieval Result:\n', retrieveResult);

    const ragAgent = tahu.createAgent('OpenRouterRAGAgent', {
      systemPrompt: 'You are an AI assistant that answers questions based on provided knowledge.',
      capabilities: ['retrieveKnowledge'],
      memoryType: 'volatile',
    });
    const ragResponse = await tahu.runAgent(
      'OpenRouterRAGAgent',
      `Based on the following information: "${retrieveResult}", answer the question: "What is OpenRouter?"`
    );
    console.log(`RAG Agent Response: ${ragResponse.response}`);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 5. Debug Mode and Response Format Testing ---
    console.log('--- 5. Debug Mode and Response Format Testing ---
');

    const tahuDebug = createTahu({
      provider: 'openrouter',
      apiKey: OPENROUTER_API_KEY,
      model: 'google/gemini-2.0-flash-exp:free',
      debug: true,
    });
    console.log('\nRunning chat in debug mode (you should see more logs):');
    const debugResponse = await tahuDebug.chat('What is the capital of Italy?');
    console.log('Debug Mode Response:', debugResponse.response);

    const tahuRaw = createTahu({
      provider: 'openrouter',
      apiKey: OPENROUTER_API_KEY,
      model: 'google/gemini-2.0-flash-exp:free',
      responseFormat: 'raw',
    });
    console.log('\nRunning chat with raw text response format:');
    const rawResponse = await tahuRaw.chat('Tell me a short story about a magical forest.');
    console.log('Raw Text Response:', rawResponse.response);

    const tahuMd = createTahu({
      provider: 'openrouter',
      apiKey: OPENROUTER_API_KEY,
      model: 'google/gemini-2.0-flash-exp:free',
      responseFormat: 'md',
    });
    console.log('\nRunning chat with markdown response format:');
    const mdResponse = await tahuMd.chat('Explain the concept of artificial intelligence in markdown format.');
    console.log('Markdown Response:', mdResponse.response);
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('\n🎉 Comprehensive OpenRouter Demo Finished!');
    console.log('📊 Available Tools:', tahu.listTools());
    console.log('🤖 Available Agents:', tahu.listAgents());
  } catch (error) {
    console.error('❌ Comprehensive OpenRouter Demo Error:', error.message);
  }
}

comprehensiveOpenRouterDemo().catch(console.error);
