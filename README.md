# 🥘 TahuJS: Framework Pengembangan Aplikasi AI Komprehensif

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Cloud-Dark/tahujs?style=social)](https://github.com/Cloud-Dark/tahujs/stargazers)

Selamat datang di **TahuJS**! Sebuah framework JavaScript yang dirancang untuk menyederhanakan dan mempercepat pengembangan aplikasi berbasis Kecerdasan Buatan (AI). Dengan TahuJS, Anda dapat dengan mudah mengintegrasikan Large Language Models (LLM), memanfaatkan berbagai alat bawaan, dan membangun agen AI yang cerdas dan dinamis.

Fokus kami adalah memberikan pengalaman pengembangan backend yang luar biasa, memungkinkan Anda untuk fokus pada logika inti aplikasi Anda, bukan pada kompleksitas integrasi AI.

## ✨ Mengapa Memilih TahuJS?

*   **Dukungan Multi-LLM Provider**: Fleksibilitas untuk memilih penyedia LLM favorit Anda, termasuk **OpenRouter**, **OpenAI**, **Google Gemini**, dan **Ollama** (lokal).
*   **Alat Bawaan yang Kuat**: Dilengkapi dengan alat untuk pencarian web (dengan fallback cerdas), layanan peta canggih (lokasi, arah, elevasi, QR Code), kalkulasi, web scraping, dan informasi tanggal/waktu.
*   **Orkestrasi Agen Tingkat Lanjut**: Bangun agen AI yang cerdas dengan manajemen memori persisten (JSON/SQLite), alur kerja multi-agen, dan kemampuan pemrosesan paralel.
*   **Arsitektur Plugin yang Fleksibel**: Perluas fungsionalitas TahuJS dengan mudah melalui sistem plugin yang dapat ditemukan secara otomatis.
*   **Pengalaman Developer yang Optimal**: Dirancang untuk kemudahan penggunaan, dengan logging yang jelas dan penanganan kesalahan yang robust.

## 🚀 Mulai Cepat

Ikuti langkah-langkah sederhana ini untuk memulai proyek TahuJS Anda:

### 1. Instalasi

Pastikan Anda memiliki **Node.js versi 18 atau lebih tinggi** terinstal di sistem Anda.

```bash
# Kloning repositori TahuJS
git clone https://github.com/Cloud-Dark/tahujs.git
cd tahujs

# Instal semua dependensi yang diperlukan
npm install
```

### 2. Konfigurasi Kunci API

TahuJS membutuhkan kunci API untuk berinteraksi dengan penyedia LLM dan layanan eksternal lainnya. Anda dapat mengaturnya saat membuat instansi TahuJS.

Contoh konfigurasi dasar:

```javascript
const config = {
  provider: 'openrouter', // Pilih 'openrouter', 'openai', 'gemini', atau 'ollama'
  apiKey: 'YOUR_API_KEY_HERE', // Ganti dengan kunci API Anda yang sebenarnya
  model: 'google/gemini-2.0-flash-exp:free', // Model LLM yang ingin Anda gunakan
  // ollamaBaseUrl: 'http://localhost:11434', // Hanya jika menggunakan Ollama lokal
  // serpApiKey: 'YOUR_SERPAPI_KEY', // Opsional, untuk pencarian web yang lebih baik
  // googleMapsApiKey: 'YOUR_GOOGLE_MAPS_KEY' // Opsional, untuk fitur peta yang ditingkatkan
};
```

### 3. Jalankan Contoh `quick-start.js`

File ini akan memberikan Anda gambaran cepat tentang cara menggunakan TahuJS untuk chat AI dan alat bawaan.

```bash
node example/quick-start.js
```

### 4. Jelajahi `demo.js`

Untuk melihat semua fitur TahuJS secara komprehensif, termasuk dukungan multi-penyedia, manajemen agen, alur kerja, dan pemrosesan paralel, jalankan `demo.js`:

```bash
node example/demo.js
```

## 📚 Dokumentasi Lengkap

Untuk panduan yang lebih mendalam tentang instalasi, konfigurasi, penggunaan API, dan contoh kode, silakan kunjungi dokumentasi kami:

*   **[Dokumentasi dalam Bahasa Indonesia](docs/id.md)**
*   **[Documentation in English](docs/en.md)**

---

Terima kasih telah menggunakan TahuJS! Kami berharap framework ini dapat mempercepat perjalanan pengembangan aplikasi AI Anda.