// example/demo.js - Demonstrasi Komprehensif Semua Fitur TahuJS

import TahuJS, { createTahu } from '../src/tahu.js';

// Import plugins (pastikan jalur ini benar jika Anda memindahkan file plugin)
import tahuCryptoPlugin from '../src/plugins/tahu-crypto.js';
import tahuSocialPlugin from '../src/plugins/tahu-social.js';
import tahuFinancePlugin from '../src/plugins/tahu-finance.js';
import tahuCurrencyPlugin from '../src/plugins/tahu-currency.js';


async function comprehensiveDemo() {
  console.log('🥘 TahuJS Comprehensive Demo Starting...\n');

  // --- PENTING: Ganti dengan kunci API Anda yang sebenarnya atau pastikan Ollama berjalan ---
  const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; 
  const OPENAI_API_KEY = 'sk-XXXXXXXXXXXXX'; 
  const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXXXXX'; 
  const OLLAMA_BASE_URL = 'http://localhost:11434'; // URL Ollama default

  // Periksa kunci API
  if (OPENROUTER_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.warn('⚠️  Peringatan: Kunci API OpenRouter belum diatur. Beberapa demo mungkin gagal.');
  }
  if (OPENAI_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.warn('⚠️  Peringatan: Kunci API OpenAI belum diatur. Beberapa demo mungkin gagal.');
  }
  if (GEMINI_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.warn('⚠️  Peringatan: Kunci API Gemini belum diatur. Beberapa demo mungkin gagal.');
  }

  // --- Inisialisasi TahuJS untuk berbagai penyedia ---
  const tahuOpenRouter = createTahu({
    provider: 'openrouter',
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // Atau 'anthropic/claude-3-sonnet', 'openai/gpt-4'
    // httpReferer: 'your-website.com', // Diperlukan untuk OpenRouter jika diatur
    // xTitle: 'Your App Name', // Diperlukan untuk OpenRouter jika diatur
  });

  const tahuOpenAI = createTahu({
    provider: 'openai',
    apiKey: OPENAI_API_KEY,
    model: 'gpt-3.5-turbo', // Atau 'gpt-4'
  });

  const tahuGemini = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-pro',
  });

  const tahuOllama = createTahu({
    provider: 'ollama',
    model: 'llama2', // Pastikan model ini diunduh di instansi Ollama Anda
    ollamaBaseUrl: OLLAMA_BASE_URL,
  });

  // --- Muat plugin ke instansi OpenRouter (bisa juga ke instansi lain) ---
  tahuOpenRouter.use(tahuCryptoPlugin);
  tahuOpenRouter.use(tahuSocialPlugin);
  tahuOpenRouter.use(tahuFinancePlugin);
  tahuOpenRouter.use(tahuCurrencyPlugin);
  console.log('🔌 Plugin dimuat secara manual.');

  // --- Otomatis temukan plugin dari direktori ---
  console.log('🔌 Mencoba menemukan plugin secara otomatis dari ./src/plugins...');
  tahuOpenRouter.loadPlugins('./src/plugins'); // Ini akan memuat ulang plugin yang sama, hanya untuk demo

  // Gunakan instansi OpenRouter untuk sebagian besar demo, karena memiliki semua plugin dan alat
  const tahu = tahuOpenRouter; 

  try {
    // --- 1. Pengujian Chat dengan Berbagai Penyedia ---
    console.log('\n--- 1. Pengujian Chat dengan Berbagai Penyedia ---');
    
    console.log('\n💬 Chat dengan OpenRouter:');
    const chatResultOpenRouter = await tahuOpenRouter.chat('Jelaskan konsep quantum entanglement dalam istilah sederhana.');
    console.log('OpenRouter Response:', chatResultOpenRouter.response);

    console.log('\n💬 Chat dengan OpenAI:');
    const chatResultOpenAI = await tahuOpenAI.chat('Apa manfaat utama menggunakan cloud computing?');
    console.log('OpenAI Response:', chatResultOpenAI.response);

    console.log('\n💬 Chat dengan Gemini:');
    const chatResultGemini = await tahuGemini.chat('Ceritakan kisah singkat yang menginspirasi tentang inovasi.');
    console.log('Gemini Response:', chatResultGemini.response);

    console.log('\n💬 Chat dengan Ollama:');
    const chatResultOllama = await tahuOllama.chat('Apa ibu kota Prancis?');
    console.log('Ollama Response:', chatResultOllama.response);
    console.log('💡 Pastikan server Ollama berjalan dan model (misalnya, "llama2") diunduh jika ada kesalahan Ollama.');
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 2. Pengujian Alat Bawaan ---
    console.log('--- 2. Pengujian Alat Bawaan ---');

    console.log('\n🔍 Pengujian Pencarian Web yang Ditingkatkan:');
    const searchResult = await tahu.useTool('webSearch', 'framework JavaScript terbaru 2024');
    console.log(searchResult);

    console.log('\n📍 Pengujian Pencarian Lokasi yang Ditingkatkan:');
    const locationResult = await tahu.useTool('findLocation', 'Monas Jakarta');
    console.log(locationResult);

    console.log('\n🗺️  Pengujian Petunjuk Arah:');
    const directionsResult = await tahu.useTool('getDirections', 'from Jakarta to Bandung');
    console.log(directionsResult);

    console.log('\n⛰️  Pengujian Ketinggian:');
    const elevationResult = await tahu.useTool('getElevation', '-6.2088,106.8456'); // Koordinat Jakarta
    console.log('Hasil Ketinggian:', elevationResult);

    console.log('\n🧮 Pengujian Kalkulator:');
    const calcResult = await tahu.useTool('calculate', '25 * 4 + sqrt(16)');
    console.log(calcResult);

    console.log('\n🌐 Pengujian Web Scraping:');
    const scrapeResult = await tahu.useTool('webScrape', 'https://www.wikipedia.org');
    console.log(scrapeResult);

    console.log('\n🕐 Pengujian Tanggal & Waktu:');
    const dateTimeResult = await tahu.useTool('dateTime', 'America/New_York');
    console.log('Tanggal & Waktu:', dateTimeResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 3. Pengujian Alat Plugin ---
    console.log('--- 3. Pengujian Alat Plugin ---');
    const cryptoPrice = await tahu.useTool('cryptoPrice', 'BTC');
    console.log('Harga Kripto:', cryptoPrice);

    const socialTrends = await tahu.useTool('socialTrends', 'Twitter');
    console.log('Tren Sosial:', socialTrends);

    const stockPrice = await tahu.useTool('stockPrice', 'MSFT');
    console.log('Harga Saham:', stockPrice);

    const currencyConversion = await tahu.useTool('convertCurrency', '100 USD to IDR');
    console.log('Konversi Mata Uang:', currencyConversion);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 4. Pengujian Manajemen Agen ---
    console.log('--- 4. Pengujian Manajemen Agen ---');
    
    // Agen Perjalanan (menggunakan createAgent yang ada untuk contoh kustom)
    const travelAgent = tahu.createAgent('TravelExpert', {
      systemPrompt: 'Anda adalah agen perjalanan profesional. Anda membantu merencanakan perjalanan, menemukan lokasi, dan memberikan saran perjalanan.',
      capabilities: ['search', 'location', 'directions', 'recommendations'],
      personality: { // Kepribadian yang ditingkatkan
        traits: ['terorganisir', 'ramah'],
        mood: 'optimis',
        expertise: ['perencanaan perjalanan', 'pengetahuan destinasi']
      },
      memoryType: 'volatile' // Default in-memory
    });
    const travelResult = await tahu.runAgent('TravelExpert', 'Rencanakan perjalanan sehari ke Jakarta. Temukan tempat menarik untuk dikunjungi dan berikan petunjuk arah.');
    console.log('Agen Perjalanan:', travelResult.response);

    // Agen Peneliti (menggunakan createPrebuiltAgent baru) dengan memori JSON
    console.log('\n🔬 Pengujian Agen Peneliti Pra-bangun dengan memori JSON:');
    const researchAgent = tahu.createPrebuiltAgent('researcher', { 
        name: 'MySmartResearcherJSON',
        memoryType: 'json', // Simpan memori ke file JSON
        maxMemorySize: 3 // Batasi memori hingga 3 entri
    });
    const researchResult = await tahu.runAgent('MySmartResearcherJSON', 'Teliti keadaan pengembangan AI saat ini di Indonesia');
    console.log('Agen Peneliti (JSON):', researchResult.response);
    // Jalankan lagi untuk menunjukkan persistensi dan pemangkasan memori
    const researchResult2 = await tahu.runAgent('MySmartResearcherJSON', 'Apa hal terakhir yang saya tanyakan kepada Anda?');
    console.log('Agen Peneliti (JSON, lanjutan):', researchResult2.response);

    // Agen Coder (menggunakan createPrebuiltAgent baru) dengan memori SQLite
    console.log('\n👨‍💻 Pengujian Agen Coder Pra-bangun dengan memori SQLite:');
    const coderAgent = tahu.createPrebuiltAgent('coder', { 
        name: 'MyCoderAgentSQLite',
        memoryType: 'sqlite', // Simpan memori ke database SQLite
        maxMemorySize: 5 // Batasi memori hingga 5 entri
    }); 
    const coderResult = await tahu.runAgent('MyCoderAgentSQLite', 'Tulis fungsi Python sederhana untuk menghitung faktorial.');
    console.log('Agen Coder (SQLite):', coderResult.response);
    // Jalankan lagi untuk menunjukkan persistensi memori
    const coderResult2 = await tahu.runAgent('MyCoderAgentSQLite', 'Bisakah Anda mengingatkan saya tentang fungsi Python yang baru saja Anda tulis?');
    console.log('Agen Coder (SQLite, lanjutan):', coderResult2.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 5. Pengujian Alur Kerja Multi-Agen ---
    console.log('--- 5. Pengujian Alur Kerja Multi-Agen ---');
    tahu.createAgent('WorkflowResearcher', { systemPrompt: 'Anda adalah peneliti yang mengumpulkan informasi.' });
    tahu.createAgent('WorkflowAnalyst', { systemPrompt: 'Anda adalah analis yang memproses data penelitian.' });
    tahu.createAgent('WorkflowWriter', { systemPrompt: 'Anda adalah penulis yang meringkas hasil analisis.' });

    const workflow = tahu.createWorkflow([
        { agent: 'WorkflowResearcher', task: 'research_ai_trends' },
        { agent: 'WorkflowAnalyst', task: 'analyze_research', depends: ['research_ai_trends'] },
        { agent: 'WorkflowWriter', task: 'summarize_analysis', depends: ['analyze_research'] }
    ]);

    const workflowResults = await workflow.execute('Tren AI terbaru dalam perawatan kesehatan.');
    console.log('Hasil Akhir Alur Kerja:', workflowResults);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 6. Pengujian Pemrosesan Paralel ---
    console.log('--- 6. Pengujian Pemrosesan Paralel ---');
    const parallelTasks = [
        { prompt: 'Jelaskan komputasi kuantum secara singkat.' },
        { prompt: 'Apa ibu kota Prancis?' },
        { agent: 'MySmartResearcherJSON', input: 'Ringkas topik penelitian terakhir.' }
    ];
    const parallelResults = await tahu.parallel(parallelTasks);
    console.log('Hasil Pemrosesan Paralel:', parallelResults.map(r => r.response || r));
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 7. Pengujian Pemrosesan Batch Sederhana ---
    console.log('--- 7. Pengujian Pemrosesan Batch Sederhana ---');
    const batchPrompts = [
        { prompt: 'Ceritakan kisah singkat tentang robot.' },
        { prompt: 'Sebutkan 3 manfaat cloud computing.' },
        { prompt: 'Apa tujuan utama blockchain?' }
    ];
    const batchResults = await tahu.batch(batchPrompts);
    console.log('Hasil Pemrosesan Batch:', batchResults.map(r => r.response));
    console.log('\n' + '='.repeat(50) + '\n');


    console.log('\n🎉 Demo Komprehensif Selesai!');
    console.log('📊 Alat yang Tersedia:', tahu.listTools());
    console.log('🤖 Agen yang Tersedia:', tahu.listAgents());

  } catch (error) {
    console.error('❌ Demo Error:', error.message);
  }
}

// Jalankan demo komprehensif
comprehensiveDemo().catch(console.error);