// example/ollama/demo.js - Comprehensive Ollama Demo of TahuJS Features

import TahuJS, { createTahu, quickChat, createQuickAgent } from '../../src/tahu.js';
import fs from 'fs';
import path from 'path';

async function comprehensiveOllamaDemo() {
  console.log('🥘 TahuJS Comprehensive Ollama Demo Starting...\n');

  // --- IMPORTANT: Ensure Ollama server is running and models are downloaded ---
  const OLLAMA_BASE_URL = 'http://localhost:11434'; // Default Ollama URL
  const OLLAMA_MODEL = 'llama2'; // Ensure this model is downloaded on your Ollama instance
  const OLLAMA_EMBEDDING_MODEL = 'nomic-embed-text'; // Ensure this model is downloaded

  // --- Initialize TahuJS with Ollama ---
  const tahuOllama = createTahu({
    provider: 'ollama',
    ollamaBaseUrl: OLLAMA_BASE_URL,
    model: OLLAMA_MODEL,
    embeddingProvider: 'ollama',
    embeddingModel: OLLAMA_EMBEDDING_MODEL,
    debug: true, // Enable debug mode for more verbose logging
    responseFormat: 'json', // Default response format
  });

  // Use this instance for most demos
  const tahu = tahuOllama;

  try {
    // --- 1. Chat Testing with Ollama ---
    console.log('\n--- 1. Chat Testing with Ollama ---
');

    console.log('\n💬 Chat with Ollama:
');
    const chatResultOllama = await tahu.chat(
      'What is the capital of France?'
    );
    console.log('Ollama Response:', chatResultOllama.response);
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

    console.log('\n👁️ OCR Tool Testing:');
    const imagePath = path.join(process.cwd(), 'example', 'ollama', 'sample.png');
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
      .name('OllamaTravelExpert')
      .systemPrompt(
        'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.'
      )
      .addCapabilities('webSearch', 'findLocation', 'getDirections')
      .addMemory('volatile')
      .build();

    console.log(`\n🤖 Agent '${travelAgent.name}' created successfully.
`);
    const travelResult = await tahu.runAgent(
      'OllamaTravelExpert',
      'Plan a day trip to Berlin. Find interesting places to visit and provide directions.'
    );
    console.log('Travel Agent:', travelResult.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 4. Knowledge Training and Retrieval (RAG) Testing ---
    console.log('--- 4. Knowledge Training and Retrieval (RAG) Testing ---
');

    const knowledgeBaseName = 'ollama_rag_docs';
    const storeType = 'sqlite';

    const textData =
      'Ollama is a tool for running large language models locally. It supports various models like Llama 2, Mistral, and more.';
    const trainTextResult = await tahu.useTool(
      'trainKnowledge',
      `${knowledgeBaseName}|${storeType}|text|${textData}`
    );
    console.log('Train from Text:', trainTextResult);

    console.log('\n🔍 Retrieving knowledge:
');
    const retrieveResult = await tahu.useTool(
      'retrieveKnowledge',
      `${knowledgeBaseName}|${storeType}|What is Ollama?`
    );
    console.log('Retrieval Result:\n', retrieveResult);

    const ragAgent = tahu.createAgent('OllamaRAGAgent', {
      systemPrompt: 'You are an AI assistant that answers questions based on provided knowledge.',
      capabilities: ['retrieveKnowledge'],
      memoryType: 'volatile',
    });
    const ragResponse = await tahu.runAgent(
      'OllamaRAGAgent',
      `Based on the following information: "${retrieveResult}", answer the question: "What is Ollama?"
    `);
    console.log(`RAG Agent Response: ${ragResponse.response}`);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 5. Debug Mode and Response Format Testing ---
    console.log('--- 5. Debug Mode and Response Format Testing ---
');

    const tahuDebug = createTahu({
      provider: 'ollama',
      ollamaBaseUrl: OLLAMA_BASE_URL,
      model: OLLAMA_MODEL,
      debug: true,
    });
    console.log('\nRunning chat in debug mode (you should see more logs):
');
    const debugResponse = await tahuDebug.chat('What is the capital of Spain?');
    console.log('Debug Mode Response:', debugResponse.response);

    const tahuRaw = createTahu({
      provider: 'ollama',
      ollamaBaseUrl: OLLAMA_BASE_URL,
      model: OLLAMA_MODEL,
      responseFormat: 'raw',
    });
    console.log('\nRunning chat with raw text response format:
');
    const rawResponse = await tahuRaw.chat('Tell me a short story about a robot.');
    console.log('Raw Text Response:', rawResponse.response);

    const tahuMd = createTahu({
      provider: 'ollama',
      ollamaBaseUrl: OLLAMA_BASE_URL,
      model: OLLAMA_MODEL,
      responseFormat: 'md',
    });
    console.log('\nRunning chat with markdown response format:
');
    const mdResponse = await tahuMd.chat('Explain the concept of blockchain in markdown format.');
    console.log('Markdown Response:', mdResponse.response);
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('\n🎉 Comprehensive Ollama Demo Finished!
');
    console.log('📊 Available Tools:', tahu.listTools());
    console.log('🤖 Available Agents:', tahu.listAgents());
  } catch (error) {
    console.error('❌ Comprehensive Ollama Demo Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Ensure Ollama server is running at', OLLAMA_BASE_URL);
    }
    if (error.message.includes('model')) {
      console.error('💡 Ensure model', OLLAMA_MODEL, 'is downloaded on your Ollama instance.');
    }
  }
}

comprehensiveOllamaDemo().catch(console.error);
