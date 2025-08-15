// example/test_rag.js - RAG Demonstration with Train, Test, and Validation

import { createTahu, tools } from '../src/tahu.js';
import fs from 'fs';
import path from 'path';

async function ragDemo() {
  console.log('🚀 RAG Demonstration Starting...\n');

  // --- Configuration ---
  const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; // Ganti dengan API key Anda
  const CHROMA_DB_URL = 'http://localhost:8000'; // Pastikan ChromaDB berjalan di URL ini

  if (OPENROUTER_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.error(
      '❌ Please set your OPENROUTER_API_KEY in example/test_rag.js!'
    );
    return;
  }

  // --- Initialize TahuJS ---
  const tahu = createTahu({
    provider: 'openrouter', // Bisa juga 'openai', 'gemini', 'ollama'
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free',
    embeddingProvider: 'openai', // Explicitly set embedding provider
    embeddingModel: 'text-embedding-ada-002', // Model embedding yang diperlukan untuk RAG
    chromaDbUrl: CHROMA_DB_URL, // Menggunakan ChromaDB untuk contoh ini
  });

  const knowledgeBaseName = 'my_rag_docs';
  const storeType = 'chroma'; // Bisa juga 'sqlite' atau 'supabase'

  try {
    // --- 1. Training Phase ---
    console.log(
      `\n--- 📚 Training Knowledge Base: ${knowledgeBaseName} (${storeType}) ---`
    );

    // Train from Text
    const textData =
      'TahuJS adalah framework Node.js yang memudahkan pengembangan aplikasi AI. Fitur utamanya meliputi integrasi LLM, agen cerdas, dan basis pengetahuan RAG.';
    const trainTextResult = await tahu.useTool(
      tools.trainKnowledgeTool.name,
      `${knowledgeBaseName}|${storeType}|text|${textData}`
    );
    console.log('Train from Text:', trainTextResult);

    // Train from File (Pastikan file 'knowledge.txt' ada di root project)
    const filePath = path.join(process.cwd(), 'knowledge.txt');
    if (fs.existsSync(filePath)) {
      const trainFileResult = await tahu.useTool(
        tools.trainKnowledgeTool.name,
        `${knowledgeBaseName}|${storeType}|file|${filePath}`
      );
      console.log('Train from File:', trainFileResult);
    } else {
      console.warn(`⚠️  File ${filePath} not found. Skipping file training.`);
    }

    // Train from URL
    const urlData = 'https://github.com/Cloud-Dark/tahu.js'; // Contoh URL repo TahuJS
    const trainUrlResult = await tahu.useTool(
      tools.trainKnowledgeTool.name,
      `${knowledgeBaseName}|${storeType}|url|${urlData}`
    );
    console.log('Train from URL:', trainUrlResult);

    // --- 2. Testing Phase ---
    console.log(`\n--- 🧪 Testing Knowledge Base: ${knowledgeBaseName} ---`);

    const queries = [
      'Apa itu TahuJS?',
      'Jelaskan fitur utama TahuJS.',
      'Bagaimana cara kerja RAG di TahuJS?',
      'Apa saja yang ada di repo GitHub TahuJS?',
    ];

    for (const query of queries) {
      console.log(`\nQuery: "${query}"`);
      // Retrieve documents with similarity score (k=3)
      const retrieveResult = await tahu.useTool(
        tools.retrieveKnowledgeTool.name,
        `${knowledgeBaseName}|${storeType}|${query}|3`
      );
      console.log('Retrieval Result:\n', retrieveResult);

      // --- 3. Validation Phase (using the retrieved context) ---
      console.log('--- Validating with LLM ---');
      // Assuming 'SimpleAssistant' agent is available or create one if needed
      // const simpleAgent = tahu.createAgent('SimpleAssistant', { systemPrompt: 'You are a helpful assistant.' });
      const agentResponse = await tahu.runAgent(
        'SimpleAssistant',
        `Berdasarkan informasi berikut: "${retrieveResult}", jawab pertanyaan: "${query}"`
      );
      console.log(`LLM Response for "${query}":\n${agentResponse.response}`);
    }

    // --- Optional: Clear Knowledge Base ---
    // console.log(`\n--- 🗑️ Clearing Knowledge Base: ${knowledgeBaseName} ---`);
    // await tahu.vectorStore.clearKnowledgeBase(knowledgeBaseName, storeType);
    // console.log(`Knowledge base '${knowledgeBaseName}' cleared.`);

    console.log('\n🚀 RAG Demonstration Finished!');
  } catch (error) {
    console.error('❌ RAG Demonstration Error:', error.message);
    if (error.message.includes('ChromaDB')) {
      console.error('💡 Ensure ChromaDB server is running at', CHROMA_DB_URL);
    }
    if (error.message.includes('Supabase')) {
      console.error(
        '💡 Ensure Supabase integration is configured correctly in TahuJS.'
      );
    }
  }
}

// Run the RAG demo
ragDemo().catch(console.error);
