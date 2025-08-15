# Dokumentasi TahuJS

Dokumen ini menyediakan informasi komprehensif tentang TahuJS, kerangka kerja Node.js yang kuat untuk membangun aplikasi AI.

## Pendahuluan

TahuJS adalah kerangka kerja JavaScript yang dirancang untuk menyederhanakan dan mempercepat pengembangan aplikasi bertenaga kecerdasan buatan. Ini menyediakan cara yang sederhana, cepat, dan fleksibel untuk membuat aplikasi cerdas menggunakan berbagai penyedia AI terkemuka.

Apakah Anda bertujuan untuk membangun agen cerdas yang dapat berinteraksi secara dinamis, mengotomatiskan pengambilan informasi dari web, menganalisis data lokasi, atau melakukan perhitungan kompleks, TahuJS menyediakan fondasi yang kokoh dan mudah digunakan.

## Instalasi dan Mulai Cepat

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

### Penggunaan Dasar (Halo Dunia)

Berikut adalah contoh minimal untuk menjalankan TahuJS:

```javascript
import { createTahu } from 'tahu.js';

async function runHelloWorld() {
  const tahu = createTahu({
    provider: 'openrouter', // atau 'openai', 'gemini', 'ollama'
    apiKey: 'KUNCI_API_ANDA_DI_SINI', // Ganti dengan kunci API Anda yang sebenarnya
    model: 'google/gemini-2.0-flash-exp:free', // Atau model pilihan Anda
  });

  const chatResult = await tahu.chat('Halo TahuJS, apa kabar?');
  console.log(chatResult.response);
}
runHelloWorld();
```

## Sistem Plugin

Perluas TahuJS dengan membuat dan memuat plugin kustom. Plugin dapat mendaftarkan alat baru, menambahkan logika kustom, atau berintegrasi dengan layanan eksternal.

```javascript
import { createTahu, plugins } from 'tahu.js';

const tahu = createTahu({
  /* konfigurasi Anda */
});

// Muat plugin tertentu secara manual
tahu.use(plugins.tahuCryptoPlugin);
const cryptoPrice = await tahu.useTool('cryptoPrice', 'ETH');
console.log(cryptoPrice);

// Muat semua plugin secara otomatis dari direktori
tahu.loadPlugins('./src/plugins');
```

## Roadmap

### Saat Ini (v2.0)

- ✅ Kerangka kerja agen inti
- ✅ Integrasi LLM multi-penyedia (OpenRouter, OpenAI, Gemini, Ollama)
- ✅ Alat bawaan komprehensif (pencarian web, peta, perhitungan, scraping, peringkasan, OCR)
- ✅ Memori persisten (JSON, SQLite)
- ✅ Alur kerja multi-agen, pemrosesan paralel, dan batch
- ✅ Sistem plugin
- ✅ Analitik waktu nyata
- ✅ Basis Pengetahuan (RAG) dengan dukungan SQLite, ChromaDB, dan Supabase
- ✅ Protokol komunikasi agen yang ditingkatkan
- ✅ Jenis memori yang lebih canggih (misalnya, penyimpanan vektor khusus untuk RAG)
- ✅ Strategi optimasi biaya yang ditingkatkan
- ✅ Integrasi yang lebih dalam dengan sumber data eksternal
- ✅ Supabase (PostgreSQL dengan pgvector) integrasi untuk basis pengetahuan
- ✅ Dukungan multi-modal (pemrosesan gambar, audio, video)
- ✅ Kemampuan penalaran tingkat lanjut
- ✅ Pembuat alur kerja visual (UI)
- ✅ Alat CLI untuk manajemen dan penyebaran agen

### Masa Depan (v3.0)

- 🔄 _Definisikan fitur besar Anda berikutnya di sini!_

## Contoh

Bagian ini menyediakan gambaran umum yang komprehensif tentang contoh TahuJS, dikategorikan berdasarkan penyedia LLM.

### Contoh Gemini

Bagian ini menyediakan contoh penggunaan TahuJS dengan Gemini.

#### Mulai Cepat

Contoh sederhana untuk memulai dengan Gemini.

[Lihat Contoh Mulai Cepat](<../example/gemini/quick-start.js>)

#### Demo Komprehensif

Demonstrasi yang lebih komprehensif tentang fitur TahuJS dengan Gemini.

[Lihat Demo Komprehensif](<../example/gemini/demo.js>)

### Contoh Ollama

Bagian ini menyediakan contoh penggunaan TahuJS dengan Ollama.

#### Mulai Cepat

Contoh sederhana untuk memulai dengan Ollama.

[Lihat Contoh Mulai Cepat](<../example/ollama/quick-start.js>)

#### Demo Komprehensif

Demonstrasi yang lebih komprehensif tentang fitur TahuJS dengan Ollama.

[Lihat Demo Komprehensif](<../example/ollama/demo.js>)

### Contoh OpenAI

Bagian ini menyediakan contoh penggunaan TahuJS dengan OpenAI.

#### Mulai Cepat

Contoh sederhana untuk memulai dengan OpenAI.

[Lihat Contoh Mulai Cepat](<../example/openai/quick-start.js>)

#### Demo Komprehensif

Demonstrasi yang lebih komprehensif tentang fitur TahuJS dengan OpenAI.

[Lihat Demo Komprehensif](<../example/openai/demo.js>)

### Contoh OpenRouter

Bagian ini menyediakan contoh penggunaan TahuJS dengan OpenRouter.

#### Mulai Cepat

Contoh sederhana untuk memulai dengan OpenRouter.

[Lihat Contoh Mulai Cepat](<../example/openrouter/quick-start.js>)

#### Demo Komprehensif

Demonstrasi yang lebih komprehensif tentang fitur TahuJS dengan OpenRouter.

[Lihat Demo Komprehensif](<../example/openrouter/demo.js>)

## Alat Bawaan

TahuJS dilengkapi dengan seperangkat alat bawaan yang kuat yang dapat digunakan oleh agen atau secara langsung.

