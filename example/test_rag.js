// example/test_rag.js - RAG (Retrieval Augmented Generation) Test Script

import { createTahu, tools } from 'tahu.js';
import fs from 'fs';
import path from 'path';

// --- Konfigurasi ---
const KNOWLEDGE_BASE_NAME = 'my_rag_data';
const STORE_TYPE = 'sqlite'; // Pilihan: 'sqlite', 'chroma', 'supabase'
const EMBEDDING_MODEL = 'text-embedding-ada-002'; // Model embedding yang digunakan

// Ganti dengan kunci API Anda yang sebenarnya
const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; 
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Ganti dengan URL Supabase Anda
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Ganti dengan Kunci Anonim Supabase Anda
const CHROMA_DB_URL = 'http://localhost:8000'; // URL server ChromaDB jika digunakan

// --- Inisialisasi TahuJS ---
const tahu = createTahu({
  provider: 'openrouter',
  apiKey: OPENROUTER_API_KEY,
  model: 'google/gemini-2.0-flash-exp:free', // Model LLM untuk generasi respons
  embeddingModel: EMBEDDING_MODEL, // Model embedding untuk RAG
  // Konfigurasi untuk penyimpanan vektor
  chromaDbUrl: CHROMA_DB_URL,
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
});

// --- Fungsi Bantuan ---
async function trainKnowledge(sourceType, sourceData) {
  console.log(`\n--- Melatih Basis Pengetahuan (${STORE_TYPE}) ---`);
  console.log(`Tipe Sumber: ${sourceType}, Data Sumber: ${sourceData}`);
  try {
    const trainCommand = `${KNOWLEDGE_BASE_NAME}|${STORE_TYPE}|${sourceType}|${sourceData}`;
    const result = await tahu.useTool('trainKnowledge', trainCommand);
    console.log('Hasil Pelatihan:', result);
    return result;
  } catch (error) {
    console.error('Gagal melatih basis pengetahuan:', error.message);
    return `Error saat pelatihan: ${error.message}`;
  }
}

async function testRAG(query) {
  console.log(`\n--- Menguji RAG dengan Kueri ---`);
  console.log(`Kueri: "${query}"`);
  try {
    const retrieveCommand = `${KNOWLEDGE_BASE_NAME}|${STORE_TYPE}|${query}`;
    const result = await tahu.useTool('retrieveKnowledge', retrieveCommand);
    console.log('Hasil Pengambilan:', result);

    // Jika ada hasil, gunakan LLM untuk menghasilkan respons berdasarkan konteks
    if (result && result.includes('✅ Retrieved knowledge')) {
      const context = result.replace('✅ Retrieved knowledge from \'' + KNOWLEDGE_BASE_NAME + '\':\n', '');
      const prompt = `Berdasarkan informasi berikut:\n\n${context}\n\nJawab pertanyaan ini: ${query}`;
      
      console.log('\n--- Menghasilkan Respons dengan LLM ---');
      const llmResponse = await tahu.chat(prompt);
      console.log('Respons LLM:', llmResponse.response);
      return { retrieveResult: result, llmResponse: llmResponse.response };
    } else {
      console.log('Tidak ada pengetahuan yang relevan ditemukan untuk kueri ini.');
      return { retrieveResult: result, llmResponse: 'Tidak ada konteks yang ditemukan.' };
    }
  } catch (error) {
    console.error('Gagal menguji RAG:', error.message);
    return { retrieveResult: `Error saat pengambilan: ${error.message}`, llmResponse: 'Gagal menghasilkan respons.' };
  }
}

async function validateRAG(query, expectedKeywords) {
  console.log(`\n--- Memvalidasi RAG untuk Kueri ---`);
  console.log(`Kueri: "${query}"`);
  console.log(`Kata Kunci yang Diharapkan: ${expectedKeywords.join(', ')}`);
  
  const { retrieveResult, llmResponse } = await testRAG(query);

  let validationStatus = 'GAGAL';
  let similarityScore = 'N/A';

  // Analisis respons LLM untuk kata kunci yang diharapkan
  const lowerLLMResponse = llmResponse.toLowerCase();
  const allKeywordsFound = expectedKeywords.every(keyword => lowerLLMResponse.includes(keyword.toLowerCase()));

  if (allKeywordsFound) {
    validationStatus = 'BERHASIL';
  }

  // Mencoba mengekstrak skor kemiripan dari hasil pengambilan (jika tersedia dan formatnya sesuai)
  // Format yang diharapkan: "1. Content: \"...\" (Similarity: 0.85)"
  const similarityMatch = retrieveResult.match(/Similarity: (\d\.\d+)/);
  if (similarityMatch && similarityMatch[1]) {
    similarityScore = parseFloat(similarityMatch[1]).toFixed(2);
  }

  console.log(`\n--- Hasil Validasi ---`);
  console.log(`Status Validasi: ${validationStatus}`);
  console.log(`Skor Kemiripan Rata-rata (jika ada): ${similarityScore}`);
  console.log(`Respons LLM: ${llmResponse}`);

  return { validationStatus, similarityScore, llmResponse };
}

// --- Fungsi Utama untuk Menjalankan Skenario ---
async function runRagTest() {
  // Pastikan file knowledge.txt ada di root project
  const knowledgeFilePath = path.resolve('knowledge.txt');
  if (!fs.existsSync(knowledgeFilePath)) {
    console.warn(`Peringatan: File 'knowledge.txt' tidak ditemukan di ${knowledgeFilePath}. Membuat file dummy.`);
    fs.writeFileSync(knowledgeFilePath, 'TahuJS adalah framework AI yang kuat untuk Node.js.\nIni menyederhanakan pengembangan aplikasi AI.\nFitur utamanya meliputi agen, alat, dan alur kerja.\nBasis pengetahuan RAG adalah fitur baru yang penting.');
  }

  // --- Skenario Pelatihan ---
  await trainKnowledge('text', 'TahuJS adalah framework AI yang komprehensif untuk Node.js.');
  await trainKnowledge('file', knowledgeFilePath); // Melatih dari file knowledge.txt
  await trainKnowledge('url', 'https://github.com/Cloud-Dark/tahu.js'); // Melatih dari URL GitHub

  // --- Skenario Pengujian ---
  await testRAG('Apa itu TahuJS?');
  await testRAG('Jelaskan fitur utama TahuJS.');
  await testRAG('Bagaimana cara kerja RAG di TahuJS?');

  // --- Skenario Validasi ---
  await validateRAG('Apa itu TahuJS?', ['framework', 'Node.js', 'AI']);
  await validateRAG('Fitur utama TahuJS?', ['agen', 'alat', 'alur kerja']);
  await validateRAG('Bagaimana cara kerja RAG?', ['pengetahuan', 'embeddings', 'vektor']);
}

// Jalankan skrip pengujian RAG
runRagTest().catch(console.error);