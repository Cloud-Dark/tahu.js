// example/quick-start.js - Contoh Penggunaan TahuJS Sederhana dengan AgentBuilder

import { createTahu, tools } from 'tahujs'; // Menggunakan impor gaya library

async function quickStart() {
  console.log('🚀 TahuJS Quick Start Demo with AgentBuilder\n');

  // --- PENTING: Ganti dengan kunci API OpenRouter Anda yang sebenarnya ---
  const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; 

  if (OPENROUTER_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.error('❌ Harap ganti OPENROUTER_API_KEY dengan kunci API Anda yang sebenarnya di quick-start.js!');
    return;
  }

  // 1. Inisialisasi TahuJS
  const tahu = createTahu({
    provider: 'openrouter', // Anda bisa mengganti ini dengan 'openai', 'gemini', atau 'ollama'
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // Model yang ingin Anda gunakan
  });

  try {
    // 2. Buat agen sederhana menggunakan AgentBuilder
    console.log('🤖 Membuat agen sederhana menggunakan AgentBuilder...');
    const simpleAgent = tahu.builder()
      .name('SimpleAssistant')
      .systemPrompt('Anda adalah asisten AI yang ramah dan membantu.')
      .addCapabilities(tools.calculateTool.name) // Beri agen kemampuan untuk kalkulasi
      .build();

    console.log(`✅ Agen '${simpleAgent.name}' berhasil dibuat.`);

    // 3. Jalankan tugas dengan agen yang baru dibuat
    console.log('\n💬 Menjalankan tugas dengan SimpleAssistant:');
    const agentChatResult = await tahu.runAgent('SimpleAssistant', 'Berapa hasil dari 150 dibagi 3 dikurangi 10?');
    console.log('SimpleAssistant Response:', agentChatResult.response);

    console.log('\n' + '='.repeat(50) + '\n');

    // 4. Contoh penggunaan alat langsung (opsional, untuk menunjukkan fleksibilitas)
    console.log('🧮 Menggunakan alat kalkulator secara langsung (di luar agen)...');
    const calcResult = await tahu.useTool('calculate', '75 * 2 + (200 / 4)');
    console.log('Calculation Result:', calcResult);

  } catch (error) {
    console.error('❌ Quick Start Demo Error:', error.message);
  }

  console.log('\n🎉 Quick Start Demo Selesai!');
}

quickStart().catch(console.error);