# Konfigurasi

Sesuaikan TahuJS agar sesuai dengan kebutuhan Anda. Disarankan untuk menggunakan variabel lingkungan untuk kunci API dalam produksi.

```javascript
const config = {
  // Wajib untuk sebagian besar penyedia
  provider: 'openrouter', // 'openrouter', 'gemini', 'openai', 'ollama'
  apiKey: process.env.OPENROUTER_API_KEY, // Gunakan variabel lingkungan untuk produksi

  // Pengaturan AI opsional
  model: 'anthropic/claude-3-sonnet', // Nama model bervariasi berdasarkan penyedia
  embeddingModel: 'text-embedding-ada-002', // Direkomendasikan untuk fitur basis pengetahuan (dapat diubah berdasarkan penyedia)
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