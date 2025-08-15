# Penggunaan Dasar

### Membuat Instansi TahuJS

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({
  provider: 'openrouter',
  apiKey: 'KUNCI_API_ANDA_DI_SINI',
  model: 'google/gemini-2.0-flash-exp:free',
  embeddingModel: 'text-embedding-ada-002', // Contoh: Menggunakan model embedding OpenAI
  // embeddingModel: 'embedding-001', // Contoh: Menggunakan model embedding Gemini
  // embeddingModel: 'nomic-embed-text', // Contoh: Menggunakan model embedding Ollama
  serpApiKey: 'KUNCI_SERPAPI_ANDA', // Jika tersedia
});
```

### Melakukan Chat AI

```javascript
import { createTahu } from 'tahu.js';

async function runChat() {
  const tahu = createTahu({
    /* konfigurasi Anda */
  });
  const chatResult = await tahu.chat('Jelaskan konsep AI secara singkat.');
  console.log(chatResult.response);
}
runChat();
```

### Menggunakan Alat (Tools)

```javascript
import { createTahu, tools } from 'tahu.js';

async function useTools() {
  const tahu = createTahu({
    /* konfigurasi Anda */
  });
  // Pencarian Web
  const searchResult = await tahu.useTool(
    tools.webSearchTool.name,
    'berita teknologi terbaru 2024'
  );
  console.log('Hasil Pencarian Web:', searchResult);

  // Perhitungan Matematika
  const calcResult = await tahu.useTool(
    tools.calculateTool.name,
    '15 * 3 + (10 / 2)'
  );
  console.log('Hasil Perhitungan:', calcResult);

  // Pencarian Lokasi
  const locationResult = await tahu.useTool(
    tools.findLocationTool.name,
    'Menara Eiffel Paris'
  );
  console.log('Info Lokasi:', locationResult);

  // Petunjuk Arah
  const directionsResult = await tahu.useTool(
    tools.getDirectionsTool.name,
    'dari Monas ke Kebun Binatang Ragunan'
  );
  console.log('Petunjuk Arah:', directionsResult);

  // Ketinggian
  const elevationResult = await tahu.useTool(
    tools.getElevationTool.name,
    '-6.2088,106.8456'
  ); // Koordinat Jakarta
  console.log('Ketinggian:', elevationResult);

  // Web Scraping
  const scrapeResult = await tahu.useTool(
    tools.webScrapeTool.name,
    'https://www.wikipedia.org'
  );
  console.log('Hasil Web Scraping:', scrapeResult);

  // Tanggal & Waktu
  const dateTimeResult = await tahu.useTool(
    tools.dateTimeTool.name,
    'America/New_York'
  );
  console.log('Tanggal & Waktu:', dateTimeResult);

  // Rangkum Teks
  const longText =
    'Ini adalah teks yang sangat panjang yang perlu diringkas. Teks ini berisi banyak informasi tentang berbagai topik, dan tujuannya adalah untuk menunjukkan bagaimana alat ringkasan dapat bekerja secara efektif. Semakin panjang teksnya, semakin berguna alat ini untuk mengekstrak poin-poin utama dan menyajikannya dalam format yang lebih ringkas dan mudah dicerna. Ini sangat membantu dalam skenario di mana Anda berurusan dengan dokumen, artikel, atau transkrip yang besar dan hanya membutuhkan gambaran umum yang cepat.';
  const summaryResult = await tahu.useTool(tools.summarizeTool.name, longText);
  console.log('Hasil Rangkuman:', summaryResult);
}
useTools();
```

### Membuat dan Menjalankan Agen AI

```javascript
import { createTahu } from 'tahu.js';

async function runAgentDemo() {
  const tahu = createTahu({
    /* konfigurasi Anda */
  });
  const travelAgent = tahu.createAgent('TravelExpert', {
    systemPrompt:
      'Anda adalah agen perjalanan profesional. Anda membantu merencanakan perjalanan, menemukan lokasi, dan memberikan saran perjalanan.',
    capabilities: ['chat', 'search', 'location', 'directions'],
    memoryType: 'json', // Pertahankan memori ke file JSON
    maxMemorySize: 5, // Simpan 5 interaksi terakhir
  });

  const travelResult = await tahu.runAgent(
    'TravelExpert',
    'Rencanakan perjalanan sehari ke Bali. Temukan tempat menarik untuk dikunjungi dan berikan petunjuk arah.'
  );
  console.log('Hasil Agen Perjalanan:', travelResult.response);

  // Gunakan agen pra-bangun
  const coderAgent = tahu.createPrebuiltAgent('coder', {
    name: 'AgenCoderSaya',
  });
  const codeResult = await tahu.runAgent(
    'AgenCoderSaya',
    'Tulis fungsi JavaScript sederhana untuk membalikkan string.'
  );
  console.log('Hasil Agen Coder:', codeResult.response);
}
runAgentDemo();
```

### Integrasi LangChain

TahuJS memanfaatkan LangChain.js di balik layar, dan Anda dapat langsung membuat dan menggunakan agen LangChain untuk skenario yang lebih canggih.

```javascript
import { createTahu } from 'tahu.js';

async function langchainIntegrationDemo() {
  const tahu = createTahu({
    provider: 'openrouter',
    apiKey: 'KUNCI_API_ANDA_DI_SINI',
    model: 'google/gemini-2.0-flash-exp:free',
    serpApiKey: 'KUNCI_SERPAPI_ANDA',
  });

  const researchAgent = await tahu.createLangChainAgent(
    'Anda adalah asisten penelitian yang kuat. Anda dapat mencari di web, menemukan lokasi, dan melakukan perhitungan.'
  );

  const task =
    'Temukan berita terbaru tentang pengembangan AI di Indonesia, lalu temukan lokasi kantor pusat Google Indonesia dan berikan tautan Google Maps-nya.';
  const result = await researchAgent.invoke({ input: task });
  console.log('Hasil Agen LangChain:', result.output);
}
langchainIntegrationDemo();
```

## Contoh Spesifik Penyedia

TahuJS mendukung berbagai penyedia LLM. Berikut adalah contoh yang menunjukkan cara menggunakan TahuJS dengan setiap penyedia tertentu:

*   [Contoh Gemini](gemini-examples.md)
*   [Contoh Ollama](ollama-examples.md)
*   [Contoh OpenAI](openai-examples.md)
*   [Contoh OpenRouter](openrouter-examples.md)
