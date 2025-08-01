// example/quick-start.js - Contoh Penggunaan TahuJS Sederhana

import { createTahu } from '../src/tahu.js';

async function quickStart() {
  console.log('🚀 TahuJS Quick Start Demo\n');

  // --- PENTING: Ganti dengan kunci API OpenRouter Anda yang sebenarnya ---
  const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; 

  if (OPENROUTER_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.error('❌ Harap ganti OPENROUTER_API_KEY dengan kunci API Anda yang sebenarnya di quick-start.js!');
    return;
  }

  // 1. Inisialisasi TahuJS dengan penyedia dan kunci API Anda
  const tahu = createTahu({
    provider: 'openrouter', // Anda bisa mengganti ini dengan 'openai', 'gemini', atau 'ollama'
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // Model yang ingin Anda gunakan
  });

  try {
    // 2. Lakukan percakapan AI sederhana
    console.log('💬 Melakukan percakapan AI...');
    const chatResult = await tahu.chat('Jelaskan konsep kecerdasan buatan dalam satu kalimat.');
    console.log('AI Response:', chatResult.response);

    console.log('\n' + '='.repeat(50) + '\n');

    // 3. Gunakan alat bawaan (misalnya, kalkulator)
    console.log('🧮 Menggunakan alat kalkulator...');
    const calcResult = await tahu.useTool('calculate', '123 * 45 + (100 / 5)');
    console.log('Calculation Result:', calcResult);

  } catch (error) {
    console.error('❌ Quick Start Demo Error:', error.message);
  }

  console.log('\n🎉 Quick Start Demo Selesai!');
}

quickStart().catch(console.error);