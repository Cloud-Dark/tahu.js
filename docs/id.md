# Dokumentasi TahuJS (Bahasa Indonesia)

TahuJS adalah framework JavaScript yang kuat dan fleksibel untuk membangun aplikasi berbasis AI. Framework ini mengintegrasikan berbagai pustaka dan layanan untuk menyediakan fungsionalitas AI yang komprehensif.

## Daftar Isi

1.  [Pendahuluan](#pendahuluan)
2.  [Fitur Utama](#fitur-utama)
3.  [Ikhtisar Teknologi](#ikhtisar-teknologi)
4.  [Instalasi](#instalas)
5.  [Konfigurasi](#konfigurasi)
6.  [Penggunaan Dasar](#penggunaan-dasar)
    *   [Membuat Instansi TahuJS](#membuat-instansi-tahujs)
    *   [Melakukan Chat AI](#melakukan-chat-ai)
    *   [Menggunakan Alat (Tools)](#menggunakan-alat-tools)
    *   [Membuat dan Menjalankan Agen AI](#membuat-dan-menjalankan-agen-ai)
    *   [Integrasi LangChain](#integrasi-langchain)
7.  [Agent Builder](#agent-builder)
8.  [Alur Kerja Multi-Agen](#alur-kerja-multi-agen)
9.  [Pemrosesan Paralel & Batch](#pemrosesan-paralel--batch)
10. [Pemantauan & Analitik](#pemantauan--analitik)
11. [Sistem Plugin](#sistem-plugin)
12. [Basis Pengetahuan & RAG](#basis-pengetahuan--rag)
13. [Daftar Alat Bawaan](#daftar-alat-bawaan)
14. [Penanganan Kesalahan](#penanganan-kesalahan)
15. [Kontribusi](#kontribusi)
16. [Lisensi](#lisensi)
17. [Peta Jalan (Roadmap)](#peta-jalan-roadmap)

---

# 🥘 TahuJS - Versi yang Ditingkatkan

Selamat datang di versi TahuJS yang ditingkatkan! Pembaruan ini membawa peningkatan signifikan di seluruh fungsionalitas inti, membuat pengembangan aplikasi AI Anda semakin kuat dan andal.

## Pendahuluan

TahuJS adalah framework JavaScript yang dirancang untuk menyederhanakan dan mempercepat pengembangan aplikasi berbasis kecerdasan buatan. Dengan mengintegrasikan berbagai pustaka AI terkemuka dan menyediakan seperangkat alat bawaan yang kuat, TahuJS memungkinkan pengembang untuk fokus pada logika inti aplikasi mereka, daripada kompleksitas integrasi AI.

Baik Anda bertujuan untuk membangun agen cerdas yang dapat berinteraksi secara dinamis, mengotomatiskan pengambilan informasi dari web, menganalisis data lokasi, atau melakukan perhitungan kompleks, TahuJS menyediakan fondasi yang kokoh dan mudah digunakan.

## Fitur Utama

-   **🌐 Dukungan Multi-Penyedia AI**: Terintegrasi dengan mulus dengan OpenRouter, OpenAI, Google Gemini, dan Ollama.
-   **🔍 Pencarian Web yang Ditingkatkan**: Sistem fallback 3-tingkat (SerpApi → DuckDuckGo → Google Scraping) untuk pencarian yang tangguh.
-   **🗺️ Layanan Peta Tingkat Lanjut**: Beberapa penyedia peta, pembuatan kode QR, data ketinggian, peta statis, dan petunjuk arah multi-penyedia.
-   **🛠️ Alat Bawaan Komprehensif**: Kumpulan alat yang kaya untuk perhitungan, web scraping, tanggal/waktu, dan ringkasan teks.
-   **🧠 Sistem Memori Tingkat Lanjut**: Mendukung persistensi memori agen volatile, file JSON, dan database SQLite.
-   **🤖 Kerangka Agen yang Kuat**: Buat dan kelola agen AI dengan kepribadian dan kemampuan yang dapat disesuaikan.
-   **🔄 Alur Kerja Multi-Agen**: Mengatur urutan tugas agen dengan dependensi.
-   **⚡ Pemrosesan Paralel & Batch**: Menjalankan beberapa panggilan LLM atau tugas agen secara bersamaan.
-   **📊 Pemantauan & Analitik Real-time**: Melacak penggunaan token, perkiraan biaya, waktu respons, dan tingkat keberhasilan.
-   **🔌 Arsitektur Plugin Fleksibel**: Mudah memperluas fungsionalitas TahuJS melalui sistem plugin yang dapat ditemukan secara otomatis.
-   **✅ Validasi Konfigurasi**: Memastikan pengaturan API penting diatur dengan benar.
-   **📚 Basis Pengetahuan (RAG)**: Masukkan data kustom dan ambil untuk augmentasi AI menggunakan SQLite, ChromaDB, atau Supabase. **Baru**: Mendukung pelatihan dari teks, file lokal, dan URL.

## Ikhtisar Teknologi

TahuJS dibangun di atas fondasi teknologi modern dan terbukti:

*   **Bahasa Inti & Runtime:** JavaScript (ESM) berjalan di Node.js.
*   **Orkestrasi AI:** LangChain.js (`@langchain/openai`, `@langchain/google-genai`, `langchain`, `@langchain/community`).
*   **LLM Providers:** OpenRouter, OpenAI, Google Gemini, Ollama.
*   **Permintaan HTTP:** Axios untuk semua panggilan API eksternal.
*   **Web Scraping:** Cheerio untuk parsing HTML.
*   **Operasi Matematika:** Math.js untuk perhitungan.
*   **Utilitas Terminal:** `chalk` untuk output konsol berwarna dan `qrcode-terminal` untuk menghasilkan kode QR.
*   **Layanan Pencarian:** `SearchService` kustom (SerpApi, DuckDuckGo, Google scraping).
*   **Layanan Pemetaan & Lokasi:** `MapService` kustom (OpenStreetMap Nominatim, StaticMap, Open-Elevation API, Mapbox).
*   **Manajemen Konfigurasi:** `ConfigValidator` kustom.
*   **Database:** `better-sqlite3` untuk persistensi memori SQLite dan basis pengetahuan.
*   **Basis Data Vektor:** `chromadb` untuk integrasi ChromaDB, `@supabase/supabase-js` dan `@langchain/supabase` untuk integrasi Supabase.

## Instalasi

Untuk memulai dengan TahuJS, ikuti langkah-langkah sederhana ini:

1.  **Pastikan Node.js Terinstal:** TahuJS memerlukan Node.js versi 18 atau lebih tinggi.
2.  **Kloning Repositori:**
    ```bash
    git clone https://github.com/Cloud-Dark/tahu.js.git
    cd tahu.js
    ```
3.  **Instal Dependensi:**
    ```bash
    npm install
    ```
4.  **Konfigurasi Kunci API:** Atur kunci API Anda di variabel lingkungan atau langsung dalam konfigurasi Anda saat membuat instansi TahuJS.
5.  **Jalankan Contoh:** Jelajahi folder `example/` untuk melihat bagaimana TahuJS dapat digunakan dalam skenario dunia nyata.

## Konfigurasi

Sesuaikan TahuJS agar sesuai dengan kebutuhan Anda. Disarankan untuk menggunakan variabel lingkungan untuk kunci API dalam produksi.

```javascript
const config = {
  // Wajib untuk sebagian besar penyedia
  provider: 'openrouter', // 'openrouter', 'gemini', 'openai', 'ollama'
  apiKey: process.env.OPENROUTER_API_KEY, // Gunakan variabel lingkungan untuk produksi
  
  // Pengaturan AI opsional
  model: 'anthropic/claude-3-sonnet', // Nama model bervariasi berdasarkan penyedia
  embeddingModel: 'text-embedding-ada-002', // Direkomendasikan untuk fitur basis pengetahuan
  temperature: 0.7, // Mengontrol keacakan (0.0 - 2.0)
  maxTokens: 2000, // Token maksimum dalam respons

  // Khusus untuk OpenRouter
  httpReferer: 'situs-web-anda.com', // Jika dikonfigurasi di OpenRouter
  xTitle: 'Nama Aplikasi Anda', // Jika dikonfigurasi di OpenRouter

  // Khusus untuk Ollama
  ollamaBaseUrl: 'http://localhost:11434', // URL API Ollama default
  
  // Kunci layanan opsional untuk fitur yang ditingkatkan
  serpApiKey: process.env.SERPAPI_KEY, // Untuk pencarian web yang lebih baik melalui SerpApi
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Untuk fitur peta yang ditingkatkan
  mapboxKey: process.env.MAPBOX_KEY, // Untuk fitur Mapbox premium

  // Untuk ChromaDB
  chromaDbUrl: 'http://localhost:8000', // URL server ChromaDB default
  
  // Untuk Supabase (membutuhkan integrasi Supabase)
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,

};

import { createTahu } from 'tahu.js';
const tahu = createTahu(config);
```

## Penggunaan Dasar

### Membuat Instansi TahuJS

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({
    provider: 'openrouter',
    apiKey: 'KUNCI_API_ANDA_DI_SINI',
    model: 'google/gemini-2.0-flash-exp:free',
    serpApiKey: 'KUNCI_SERPAPI_ANDA', // Jika tersedia
    embeddingModel: 'text-embedding-ada-002', // Diperlukan untuk basis pengetahuan
});
```

### Melakukan Chat AI

```javascript
import { createTahu } from 'tahu.js';

async function runChat() {
    const tahu = createTahu({ /* konfigurasi Anda */ });
    const chatResult = await tahu.chat('Jelaskan konsep AI secara singkat.');
    console.log(chatResult.response);
}
runChat();
```

### Menggunakan Alat (Tools)

```javascript
import { createTahu, tools } from 'tahu.js';

async function useTools() {
    const tahu = createTahu({ /* konfigurasi Anda */ });
    // Pencarian Web
    const searchResult = await tahu.useTool(tools.webSearchTool.name, 'berita teknologi terbaru 2024');
    console.log('Hasil Pencarian Web:', searchResult);

    // Perhitungan Matematika
    const calcResult = await tahu.useTool(tools.calculateTool.name, '15 * 3 + (10 / 2)');
    console.log('Hasil Perhitungan:', calcResult);

    // Pencarian Lokasi
    const locationResult = await tahu.useTool(tools.findLocationTool.name, 'Menara Eiffel Paris');
    console.log('Info Lokasi:', locationResult);

    // Petunjuk Arah
    const directionsResult = await tahu.useTool(tools.getDirectionsTool.name, 'dari Monas ke Kebun Binatang Ragunan');
    console.log('Petunjuk Arah:', directionsResult);

    // Ketinggian
    const elevationResult = await tahu.useTool(tools.getElevationTool.name, '-6.2088,106.8456'); // Koordinat Jakarta
    console.log('Ketinggian:', elevationResult);

    // Web Scraping
    const scrapeResult = await tahu.useTool(tools.webScrapeTool.name, 'https://www.wikipedia.org');
    console.log('Hasil Web Scraping:', scrapeResult);

    // Tanggal & Waktu
    const dateTimeResult = await tahu.useTool(tools.dateTimeTool.name, 'America/New_York');
    console.log('Tanggal & Waktu:', dateTimeResult);

    // Rangkum Teks
    const longText = "Ini adalah teks yang sangat panjang yang perlu diringkas. Teks ini berisi banyak informasi tentang berbagai topik, dan tujuannya adalah untuk menunjukkan bagaimana alat ringkasan dapat bekerja secara efektif. Semakin panjang teksnya, semakin berguna alat ini untuk mengekstrak poin-poin utama dan menyajikannya dalam format yang lebih ringkas dan mudah dicerna. Ini sangat membantu dalam skenario di mana Anda berurusan dengan dokumen, artikel, atau transkrip yang besar dan hanya membutuhkan gambaran umum yang cepat.";
    const summaryResult = await tahu.useTool(tools.summarizeTool.name, longText);
    console.log('Hasil Rangkuman:', summaryResult);
}
useTools();
```

### Membuat dan Menjalankan Agen AI

```javascript
import { createTahu } from 'tahu.js';

async function runAgentDemo() {
    const tahu = createTahu({ /* konfigurasi Anda */ });
    const travelAgent = tahu.createAgent('TravelExpert', {
        systemPrompt: 'Anda adalah agen perjalanan profesional. Anda membantu merencanakan perjalanan, menemukan lokasi, dan memberikan saran perjalanan.',
        capabilities: ['chat', 'search', 'location', 'directions'],
        memoryType: 'json', // Pertahankan memori ke file JSON
        maxMemorySize: 5 // Simpan 5 interaksi terakhir
    });

    const travelResult = await tahu.runAgent('TravelExpert', 'Rencanakan perjalanan sehari ke Bali. Temukan tempat menarik untuk dikunjungi dan berikan petunjuk arah.');
    console.log('Hasil Agen Perjalanan:', travelResult.response);

    // Gunakan agen pra-bangun
    const coderAgent = tahu.createPrebuiltAgent('coder', { name: 'AgenCoderSaya' });
    const codeResult = await tahu.runAgent('AgenCoderSaya', 'Tulis fungsi JavaScript sederhana untuk membalikkan string.');
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
        serpApiKey: 'KUNCI_SERPAPI_ANDA'
    });

    const researchAgent = await tahu.createLangChainAgent(
        'Anda adalah asisten penelitian yang kuat. Anda dapat mencari di web, menemukan lokasi, dan melakukan perhitungan.'
    );

    const task = "Temukan berita terbaru tentang pengembangan AI di Indonesia, lalu temukan lokasi kantor pusat Google Indonesia dan berikan tautan Google Maps-nya.";
    const result = await researchAgent.invoke({ input: task });
    console.log('Hasil Agen LangChain:', result.output);
}
langchainIntegrationDemo();
```

## Agent Builder

`AgentBuilder` menyediakan API yang lancar untuk membangun dan mengkonfigurasi agen dengan berbagai kemampuan, kepribadian, dan pengaturan memori.

```javascript
import { createTahu, tools } from 'tahu.js';

const tahu = createTahu({ /* konfigurasi Anda */ });

const omniAgent = tahu.builder()
    .name('OmniAgent')
    .systemPrompt('Anda adalah asisten AI yang serba tahu yang mampu melakukan tugas apa pun menggunakan semua alat yang tersedia dan mengingat interaksi sebelumnya.')
    .addPersonality(['penasaran', 'analitis', 'membantu', 'kreatif'], 'optimis', ['segalanya'])
    .addCapabilities(
        tools.webSearchTool.name, tools.calculateTool.name, tools.findLocationTool.name, 
        tools.getDirectionsTool.name, tools.getElevationTool.name, tools.webScrapeTool.name, 
        tools.dateTimeTool.name, tools.summarizeTool.name,
        tools.trainKnowledgeTool.name, tools.retrieveKnowledgeTool.name // Alat pengetahuan baru
    )
    .addMemory('sqlite', { maxMemorySize: 10 }) // Pertahankan memori ke SQLite
    .build();

console.log(`Agen '${omniAgent.name}' dibuat. Tipe Memori: ${omniAgent.memoryType}`);
console.log('Kemampuan:', omniAgent.capabilities.join(', '));

const omniResult = await tahu.runAgent('OmniAgent', 'Berapa harga Bitcoin saat ini, dan apa tren sosial teratas di Twitter?');
console.log('Respons OmniAgent:', omniResult.response);
```

## Alur Kerja Multi-Agen

Definisikan dan jalankan alur kerja kompleks di mana agen yang berbeda berkolaborasi dalam tugas, dengan dependensi di antara mereka.

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({ /* konfigurasi Anda */ });

tahu.createAgent('PengumpulData', { systemPrompt: 'Mengumpulkan data mentah.' });
tahu.createAgent('PembuatLaporan', { systemPrompt: 'Menghasilkan laporan dari data.' });

const workflow = tahu.createWorkflow([
    { agent: 'PengumpulData', task: 'kumpulkan_data_pasar' },
    { agent: 'PembuatLaporan', task: 'buat_laporan_ringkasan', depends: ['kumpulkan_data_pasar'] }
]);

const workflowResults = await workflow.execute('Tren pasar untuk energi terbarukan.');
console.log('Hasil Akhir Alur Kerja:', workflowResults);
```

## Pemrosesan Paralel & Batch

Menangani beberapa permintaan LLM atau tugas agen secara bersamaan untuk efisiensi yang lebih baik.

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({ /* konfigurasi Anda */ });

// Eksekusi paralel tugas agen atau prompt chat
const parallelTasks = [
    { prompt: 'Jelaskan komputasi kuantum secara singkat.' },
    { prompt: 'Apa ibu kota Prancis?' },
    { agent: 'MySmartResearcherJSON', input: 'Ringkas topik penelitian terakhir.' } // Asumsi agen MySmartResearcherJSON ada
];
const parallelResults = await tahu.parallel(parallelTasks);
console.log('Hasil Paralel:', parallelResults.map(r => r.response || r));

// Pemrosesan batch sederhana dari prompt chat
const batchPrompts = [
    { prompt: 'Ceritakan kisah singkat tentang robot.' },
    { prompt: 'Sebutkan 3 manfaat cloud computing.' },
    { prompt: 'Apa tujuan utama blockchain?' }
];
const batchResults = await tahu.batch(batchPrompts);
console.log('Hasil Batch:', batchResults.map(r => r.response));
```

## Pemantauan & Analitik

TahuJS menyertakan manajer analitik bawaan untuk melacak penggunaan LLM Anda dan kinerja.

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({ /* konfigurasi Anda */ });

// Setelah beberapa panggilan LLM atau agen berjalan
const stats = tahu.analytics.getStats();
console.log('📊 Statistik Penggunaan LLM:');
console.log(`   Total Permintaan: ${stats.totalRequests}`);
console.log(`   Permintaan Berhasil: ${stats.successfulRequests}`);
console.log(`   Permintaan Gagal: ${stats.failedRequests}`);
console.log(`   Tingkat Keberhasilan: ${stats.successRate.toFixed(2)}%`);
console.log(`   Total Token Digunakan: ${stats.totalTokensUsed}`);
console.log(`   Perkiraan Total Biaya: $${stats.estimatedCost.toFixed(6)}`);
console.log(`   Total Waktu Respons: ${stats.totalResponseTimeMs.toFixed(2)} ms`);
console.log(`   Rata-rata Waktu Respons: ${stats.averageResponseTimeMs.toFixed(2)} ms`);

// Anda juga dapat mereset statistik
// tahu.analytics.resetStats();
```

## Sistem Plugin

Perluas TahuJS dengan membuat dan memuat plugin kustom. Plugin dapat mendaftarkan alat baru, menambahkan logika kustom, atau berintegrasi dengan layanan eksternal.

```javascript
import { createTahu, plugins } from 'tahu.js';

const tahu = createTahu({ /* konfigurasi Anda */ });

// Muat plugin tertentu secara manual
tahu.use(plugins.tahuCryptoPlugin);
const cryptoPrice = await tahu.useTool('cryptoPrice', 'ETH');
console.log(cryptoPrice);

// Muat semua plugin secara otomatis dari direktori
tahu.loadPlugins('./src/plugins');
```

## Basis Pengetahuan & RAG

TahuJS memungkinkan Anda untuk "melatih" (memasukkan) pengetahuan kustom Anda sendiri dan mengambilnya untuk augmentasi AI. Ini sangat penting untuk menyediakan AI Anda dengan informasi terbaru atau spesifik domain di luar data pelatihan awalnya.

### Cara Kerjanya:
1.  **Pemasukan (`trainKnowledge`)**: Anda menyediakan data teks. TahuJS mengubah teks ini menjadi representasi numerik yang disebut "embeddings" menggunakan model embedding. Embeddings ini, bersama dengan teks aslinya, disimpan dalam penyimpanan vektor yang dipilih.
2.  **Pengambilan (`retrieveKnowledge`)**: Ketika Anda memiliki kueri, TahuJS mengubah kueri menjadi embedding dan mencari penyimpanan vektor untuk potongan pengetahuan yang paling relevan secara semantik.
3.  **Augmentasi**: Pengetahuan yang diambil kemudian dapat diteruskan ke LLM sebagai konteks, memungkinkannya menghasilkan respons yang lebih terinformasi dan akurat.

### Alat:
*   **`trainKnowledge`**:
    *   **Deskripsi**: Menambahkan data teks ke basis pengetahuan yang ditentukan untuk pengambilan nanti.
    *   **Format Input**: `"knowledgeBaseName|storeType|source_type|source_data"`
    *   **Tipe Penyimpanan yang Didukung**: `sqlite`, `chroma`, `supabase`
    *   **Tipe Sumber yang Didukung**: `text`, `file`, `url`
    *   **Contoh**:
        *   `"my_docs|sqlite|text|This is a document about TahuJS features."`
        *   `"my_docs|sqlite|file|/path/to/your/knowledge.txt"`
        *   `"my_docs|sqlite|url|https://example.com/knowledge.txt"`
*   **`retrieveKnowledge`**:
    *   **Deskripsi**: Mengambil informasi yang relevan dari basis pengetahuan yang ditentukan.
    *   **Format Input**: `"knowledgeBaseName|storeType|query_text|k"` (k opsional, default 3)
    *   **Tipe Penyimpanan yang Didukung**: `sqlite`, `chroma`, `supabase`
    *   **Contoh**: `"my_docs|sqlite|What are TahuJS features?|2"`

### Opsi Penyimpanan:
*   **SQLite**:
    *   **Tipe**: `sqlite`
    *   **Deskripsi**: Basis data lokal berbasis file yang sederhana. Ideal untuk basis pengetahuan berukuran kecil hingga menengah atau pengembangan lokal. Tidak memerlukan server eksternal.
    *   **Konfigurasi**: Secara otomatis menggunakan file `.sqlite` di direktori `memory`.
*   **ChromaDB**:
    *   **Tipe**: `chroma`
    *   **Deskripsi**: Basis data vektor open-source khusus. Cocok untuk basis pengetahuan yang lebih besar dan pencarian kemiripan yang lebih efisien. Membutuhkan server ChromaDB terpisah untuk berjalan.
    *   **Konfigurasi**: Atur `chromaDbUrl` di konfigurasi TahuJS (default `http://localhost:8000`).
    *   **Pengaturan**: Anda perlu menjalankan instansi ChromaDB. Lihat [dokumentasi ChromaDB](https://www.trychroma.com/) untuk instalasi.
*   **Supabase (PostgreSQL dengan pgvector)**:
    *   **Tipe**: `supabase`
    *   **Deskripsi**: Basis data PostgreSQL berbasis cloud yang kuat dan skalabel dengan ekstensi `pgvector` untuk penyimpanan vektor. Ideal untuk aplikasi produksi yang membutuhkan manajemen data yang kuat dan skalabilitas.
    *   **Konfigurasi**: Membutuhkan `supabaseUrl` dan `supabaseAnonKey` di konfigurasi TahuJS.
    *   **Pengaturan**: Anda perlu menyiapkan proyek Supabase, mengaktifkan ekstensi `pgvector`, dan mengkonfigurasi tabel Anda. Lihat contoh SQL di bagian "Penggunaan Dasar" di atas.

## Built-in Tools List

TahuJS comes with the following pre-registered tools:

*   **`webSearch`**: Search the web using multiple search engines (SerpApi, DuckDuckGo, Google Scraping).
*   **`calculate`**: Perform mathematical calculations and expressions.
*   **`findLocation`**: Find location using multiple map services with links and QR codes.
*   **`getDirections`**: Get directions between two locations. Input format: "from [origin] to [destination]".
*   **`getElevation`**: Gets the elevation data for a specific geographic coordinate. Input format: "latitude,longitude".
*   **`webScrape`**: Extract content from web pages.
*   **`dateTime`**: Get current date and time information for a specified timezone.
*   **`summarizeText`**: Summarize a given text using the AI model.
*   **`trainKnowledge`**: Add text data to a specified knowledge base. Supports `text`, `file`, and `url` sources.
*   **`retrieveKnowledge`**: Retrieve relevant information from a specified knowledge base.

## Error Handling

TahuJS provides robust error handling for LLM calls and tool executions, giving informative messages to help diagnose issues.

## Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/Cloud-Dark/tahu.js.git
cd tahu.js
npm install
# Run examples
node example/quick-start.js
node example/demo.js
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🗺️ Roadmap

### Current (v2.0)
-   ✅ Core agent framework
-   ✅ Multi-provider LLM integration (OpenRouter, OpenAI, Gemini, Ollama)
-   ✅ Comprehensive built-in tools (web search, maps, calculations, scraping, summarization)
-   ✅ Persistent memory (JSON, SQLite)
-   ✅ Multi-agent workflows, parallel, and batch processing
-   ✅ Plugin system
-   ✅ Real-time analytics
-   ✅ Knowledge Base (RAG) with SQLite, ChromaDB, and Supabase support
-   ✅ Enhanced agent communication protocols
-   ✅ More advanced memory types (e.g., dedicated vector stores for RAG)
-   ✅ Improved cost optimization strategies
-   ✅ Deeper integration with external data sources
-   ✅ Supabase (PostgreSQL with pgvector) integration for knowledge base
-   ✅ Multi-modal support (image, audio, video processing)
-   ✅ Advanced reasoning capabilities
-   ✅ Visual workflow builder (UI)
-   ✅ CLI tools for agent management and deployment

### Future (v3.0)
-   🔄 *Define your next big features here!*

---

**Built with ❤️ for the AI developer community**

*TahuJS - Making AI development as easy as cooking instant noodles* 🍜