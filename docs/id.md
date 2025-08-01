# Dokumentasi TahuJS (Bahasa Indonesia)

TahuJS adalah framework JavaScript yang kuat dan fleksibel untuk membangun aplikasi berbasis AI. Framework ini mengintegrasikan berbagai pustaka dan layanan untuk menyediakan fungsionalitas AI yang komprehensif.

## Daftar Isi

1.  [Ikhtisar Teknologi](#1-ikhtisar-teknologi)
2.  [Instalasi](#2-instalasi)
3.  [Konfigurasi](#3-konfigurasi)
4.  [Penggunaan Dasar](#4-penggunaan-dasar)
    *   [Membuat Instansi TahuJS](#membuat-instansi-tahujs)
    *   [Melakukan Chat AI](#melakukan-chat-ai)
    *   [Menggunakan Alat (Tools)](#menggunakan-alat-tools)
    *   [Membuat dan Menjalankan Agen AI](#membuat-dan-menjalankan-agen-ai)
    *   [Integrasi LangChain](#integrasi-langchain)
5.  [Daftar Alat Bawaan](#5-daftar-alat-bawaan)
6.  [Penanganan Kesalahan](#6-penanganan-kesalahan)
7.  [Kontribusi](#7-kontribusi)
8.  [Lisensi](#8-lisensi)

---

# 🥘 TahuJS - Versi yang Ditingkatkan

Selamat datang di versi TahuJS yang ditingkatkan! Pembaruan ini membawa peningkatan signifikan di seluruh fungsionalitas inti, membuat pengembangan aplikasi AI Anda semakin kuat dan andal.

## 🆕 Fitur Baru

### 🌐 Dukungan Multi-Penyedia AI
TahuJS sekarang terintegrasi dengan mulus dengan beberapa penyedia Large Language Model (LLM), memungkinkan Anda memilih yang paling sesuai untuk aplikasi Anda:
-   **OpenRouter**: Akses berbagai model (Claude, GPT, Gemini, dll.) melalui satu API.
-   **OpenAI**: Integrasi langsung dengan model-model canggih OpenAI (GPT-3.5, GPT-4).
-   **Google Gemini**: Manfaatkan model Gemini Google secara langsung.
-   **Ollama**: Sambungkan ke instansi Ollama lokal atau jarak jauh untuk menjalankan model open-source.

### 🔍 Pencarian Web yang Ditingkatkan
-   **3 Metode Fallback**: SerpApi → DuckDuckGo → Google Scraping 🌐✨
-   **Logika Coba Ulang Cerdas**: Secara otomatis mencoba metode berikutnya jika salah satu gagal 🔄
-   **Hasil Lebih Baik**: Hasil pencarian yang lebih akurat dan komprehensif ✅

### 🗺️ Layanan Peta Tingkat Lanjut
-   **Beberapa Penyedia Peta**: OpenStreetMap, Google Maps, Bing Maps, WikiMapia, Apple Maps 📍🌍
-   **Pembuatan Kode QR**: Kode QR instan untuk berbagi lokasi 📱
-   **Data Ketinggian**: Dapatkan informasi ketinggian untuk lokasi mana pun ⛰️
-   **Peta Statis**: Hasilkan gambar peta 🖼️
-   **Petunjuk Arah**: Tautan petunjuk arah multi-penyedia 🛣️

### 🛠️ Alat yang Ditingkatkan
-   **Penanganan Kesalahan yang Ditingkatkan**: Pesan kesalahan dan fallback yang lebih baik 🛡️
-   **Umpan Balik Visual**: Output konsol berwarna dengan emoji 🎨
-   **Performa Dioptimalkan**: Waktu respons lebih cepat 🚀
-   **Lebih Andal**: Beberapa fallback untuk setiap layanan 💪

## 🚀 Mulai Cepat

Mulai dan jalankan dalam waktu singkat!

```javascript
// Lihat example/quick-start.js untuk pengaturan minimal
import { createTahu } from 'tahujs';

async function quickStartExample() {
  const tahu = createTahu({
    provider: 'openrouter', // atau 'openai', 'gemini', 'ollama'
    apiKey: 'kunci-api-anda',
    model: 'google/gemini-2.0-flash-exp:free',
  });

  const chatResult = await tahu.chat('Jelaskan AI secara singkat.');
  console.log(chatResult.response);

  const calcResult = await tahu.useTool('calculate', '10 + 5 * 2');
  console.log(calcResult);
}
quickStartExample();
```
Untuk demonstrasi komprehensif semua fitur, lihat `example/demo.js`.

## 🎯 Kasus Penggunaan

TahuJS serbaguna dan dapat mendukung berbagai aplikasi cerdas:

### 1. Perencanaan Perjalanan ✈️
```javascript
const travelAgent = tahu.createAgent('TravelExpert', {
  systemPrompt: 'Perencana perjalanan ahli untuk Indonesia',
  capabilities: ['search', 'location', 'directions']
});

const plan = await tahu.runAgent('TravelExpert', 
  'Rencanakan itinerary 3 hari di Jakarta dengan lokasi dan petunjuk arah yang tepat'
);
console.log(plan.response);
```

### 2. Asisten Penelitian 🔬
```javascript
const researcher = tahu.createAgent('Researcher', {
  systemPrompt: 'Asisten penelitian yang teliti',
  capabilities: ['search', 'analyze', 'calculate']
});

const report = await tahu.runAgent('Researcher', 
  'Teliti pasar kendaraan listrik di Indonesia dengan statistik'
);
console.log(report.response);
```

### 3. Konsultan Teknis 💻
```javascript
const techExpert = tahu.createAgent('TechExpert', {
  systemPrompt: 'Insinyur perangkat lunak senior dan arsitek',
  capabilities: ['search', 'calculate', 'analyze']
});

const advice = await tahu.runAgent('TechExpert', 
  'Bantu saya menskalakan aplikasi Node.js untuk 10.000 pengguna bersamaan'
);
console.log(advice.response);
```

## 🔧 Opsi Konfigurasi

Sesuaikan TahuJS agar sesuai dengan kebutuhan Anda:

```javascript
const config = {
  // Wajib untuk sebagian besar penyedia
  provider: 'openrouter', // 'openrouter', 'gemini', 'openai', 'ollama'
  apiKey: 'kunci-api-anda', // Tidak diperlukan untuk Ollama jika berjalan secara lokal tanpa otentikasi
  
  // Pengaturan AI opsional
  model: 'anthropic/claude-3-sonnet', // Nama model bervariasi berdasarkan penyedia
  temperature: 0.7,
  maxTokens: 2000,

  // Khusus untuk OpenRouter
  httpReferer: 'situs-web-anda.com', // Jika dikonfigurasi di OpenRouter
  xTitle: 'Nama Aplikasi Anda', // Jika dikonfigurasi di OpenRouter

  // Khusus untuk Ollama
  ollamaBaseUrl: 'http://localhost:11434', // URL API Ollama default
  
  // Kunci layanan opsional untuk fitur yang ditingkatkan
  serpApiKey: 'kunci-serpapi-anda', // Pencarian web yang lebih baik
  googleMapsApiKey: 'kunci-google-maps-anda', // Peta yang ditingkatkan
  mapboxKey: 'kunci-mapbox-anda' // Peta premium
};
```

## 🌟 Mengapa Memilih TahuJS yang Ditingkatkan?

-   **🔄 Sistem Fallback**: Tidak pernah gagal karena satu layanan mati
-   **🎯 Multi-Penyedia**: Yang terbaik dari semua dunia dengan beberapa penyedia layanan
-   **📱 UX Modern**: Kode QR, output berwarna, umpan balik visual
-   **🚀 Performa**: Dioptimalkan untuk kecepatan dan keandalan
-   **🛡️ Tangguh**: Penanganan kesalahan dan validasi yang ekstensif
-   **📊 Komprehensif**: Toolkit lengkap untuk agen AI

## 🎉 Siap Digunakan!

TahuJS yang ditingkatkan sekarang mencakup:
-   ✅ Sistem fallback pencarian web 3-tingkat
-   ✅ Beberapa penyedia layanan peta
-   ✅ Pembuatan kode QR untuk lokasi
-   ✅ Integrasi data ketinggian
-   ✅ Penanganan kesalahan yang ditingkatkan
-   ✅ Umpan balik visual dan logging
-   ✅ Validasi konfigurasi
-   ✅ Contoh alur kerja lengkap
-   ✅ **Memori Agen Persisten**: Simpan percakapan agen ke file JSON atau database SQLite.
-   ✅ **Alur Kerja Multi-Agen**: Mengatur urutan tugas agen dengan dependensi.
-   ✅ **Pemrosesan Paralel**: Menjalankan beberapa tugas agen atau prompt chat secara bersamaan.
-   ✅ **Pemrosesan Batch Sederhana**: Memproses beberapa prompt chat secara paralel.
-   ✅ **Memori Jangka Pendek yang Dapat Dikonfigurasi**: Batasi riwayat percakapan dalam memori untuk agen.
-   ✅ **Penemuan Plugin Otomatis**: Muat semua plugin dari direktori dengan `tahu.loadPlugins()`.
-   ✅ **Dukungan untuk penyedia LLM OpenAI, Gemini, OpenRouter, dan Ollama.**

Sempurna untuk penggunaan produksi! 🚀