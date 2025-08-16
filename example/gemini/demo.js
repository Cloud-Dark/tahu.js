// example/gemini/demo.js - Comprehensive Gemini Demo of TahuJS Features

import TahuJS, { createTahu, quickChat, createQuickAgent } from '../../src/tahu.js';
import fs from 'fs';
import path from 'path';

async function comprehensiveGeminiDemo() {
  console.log('🥘 TahuJS Comprehensive Gemini Demo Starting...\n');

  // --- IMPORTANT: Replace with your actual API key ---
  const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

  // Check API key
  if (GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY')) {
    console.warn('⚠️  Warning: Gemini API key not set. Some demos may fail.');
  }

  // --- Initialize TahuJS with Gemini ---
  const tahuGemini = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.0-flash', // Or 'gemini-1.5-pro'
    embeddingProvider: 'gemini',
    embeddingModel: 'embedding-001',
    debug: true, // Enable debug mode for more verbose logging
    responseFormat: 'json', // Default response format
  });

  // Use this instance for most demos
  const tahu = tahuGemini;

  try {
    // --- 1. Chat Testing with Gemini ---
    console.log('\n--- 1. Chat Testing with Gemini ---');

    console.log('\n💬 Chat with Gemini:');
    const chatResultGemini = await tahu.chat(
      'Tell a short inspiring story about innovation.'
    );
    console.log('Gemini Response:', chatResultGemini.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 2. Built-in Tool Testing (enabled by default or configured) ---
    console.log('--- 2. Built-in Tool Testing ---');

    // Ensure tools are enabled in config if you want to use them
    // For this demo, we assume default tools are enabled or configured.

    console.log('\n🧮 Calculator Testing:');
    const calcResult = await tahu.useTool('calculate', '25 * 4 + sqrt(16)');
    console.log(calcResult);

    console.log('\n🕐 Date & Time Testing:');
    const dateTimeResult = await tahu.useTool('dateTime', 'America/New_York');
    console.log('Date & Time:', dateTimeResult);

    console.log('\n📝 Text Summarization Testing:');
    const longText =
      'This is a very long text that needs to be summarized. It contains a lot of information about various topics, and the purpose is to demonstrate how the summarization tool can work effectively. The longer the text, the more useful this tool becomes for extracting key points and presenting them in a more concise and digestible format. This is particularly helpful in scenarios where you are dealing with large documents, articles, or transcripts and just need a quick overview.';
    const summaryResult = await tahu.useTool('summarize', longText); // Note: tool name is 'summarize'
    console.log(summaryResult);

    

    // --- 3. Agent Management Testing ---
    console.log('--- 3. Agent Management Testing ---');

    // Travel Agent (using AgentBuilder)
    const travelAgent = tahu
      .builder()
      .name('GeminiTravelExpert')
      .systemPrompt(
        'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.'
      )
      .addCapabilities('webSearch', 'findLocation', 'getDirections') // Example capabilities
      .addMemory('volatile')
      .build();

    console.log(`\n🤖 Agent '${travelAgent.name}' created successfully.`);
    const travelResult = await tahu.runAgent(
      'GeminiTravelExpert',
      'Plan a day trip to Paris. Find interesting places to visit and provide directions.'
    );
    console.log('Travel Agent:', travelResult.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 4. Knowledge Training and Retrieval (RAG) Testing ---
    console.log('--- 4. Knowledge Training and Retrieval (RAG) Testing ---');

    const knowledgeBaseName = 'gemini_rag_docs';
    const storeType = 'sqlite'; // Using SQLite for simplicity in this demo

    // Train from Text
    const textData =
      'Gemini is a family of multimodal large language models developed by Google AI. It is designed to handle various types of data, including text, images, audio, and video.';
    const trainTextResult = await tahu.useTool(
      'trainKnowledge',
      `${knowledgeBaseName}|${storeType}|text|${textData}`
    );
    console.log('Train from Text:', trainTextResult);

    // Retrieve knowledge
    console.log('\n🔍 Retrieving knowledge:');
    const retrieveResult = await tahu.useTool(
      'retrieveKnowledge',
      `${knowledgeBaseName}|${storeType}|What is Gemini?`
    );
    console.log('Retrieval Result:\n', retrieveResult);

    // Use agent with retrieved knowledge
    const ragAgent = tahu.createAgent('GeminiRAGAgent', {
      systemPrompt: 'You are an AI assistant that answers questions based on provided knowledge.',
      capabilities: ['retrieveKnowledge'],
      memoryType: 'volatile',
    });
    const ragResponse = await tahu.runAgent(
      'GeminiRAGAgent',
      `Based on the following information: "${retrieveResult}", answer the question: "What is Gemini?"`
    );
    console.log(`RAG Agent Response: ${ragResponse.response}`);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 5. Debug Mode and Response Format Testing ---
    console.log('--- 5. Debug Mode and Response Format Testing ---');

    // Debug Mode
    const tahuDebug = createTahu({
      provider: 'gemini',
      apiKey: GEMINI_API_KEY,
      model: 'gemini-2.0-flash',
      debug: true,
    });
    console.log('\nRunning chat in debug mode (you should see more logs):');
    const debugResponse = await tahuDebug.chat('What is the capital of Germany?');
    console.log('Debug Mode Response:', debugResponse.response);

    // Raw Text Response Format
    const tahuRaw = createTahu({
      provider: 'gemini',
      apiKey: GEMINI_API_KEY,
      model: 'gemini-2.0-flash',
      responseFormat: 'raw',
    });
    console.log('\nRunning chat with raw text response format:');
    const rawResponse = await tahuRaw.chat('Tell me a short poem about nature.');
    console.log('Raw Text Response:', rawResponse.response);

    // Markdown Response Format
    const tahuMd = createTahu({
      provider: 'gemini',
      apiKey: GEMINI_API_KEY,
      model: 'gemini-2.0-flash',
      responseFormat: 'md',
    });
    console.log('\nRunning chat with markdown response format:');
    const mdResponse = await tahuMd.chat('Explain the concept of quantum computing in markdown format.');
    console.log('Markdown Response:', mdResponse.response);
    console.log('\n' + '='.repeat(50) + '\n');

    console.log('\n🎉 Comprehensive Gemini Demo Finished!');
    console.log('📊 Available Tools:', tahu.listTools());
    console.log('🤖 Available Agents:', tahu.listAgents());
  } catch (error) {
    console.error('❌ Comprehensive Gemini Demo Error:', error.message);
  }
}

comprehensiveGeminiDemo().catch(console.error);
