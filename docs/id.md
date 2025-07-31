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

## 1. Ikhtisar Teknologi

TahuJS dibangun di atas tumpukan teknologi berikut:

*   **Bahasa & Runtime:** JavaScript (ESM) di Node.js.
*   **Orkestrasi AI:** [LangChain.js](https://js.langchain.com/) untuk membangun agen AI, merantai panggilan LLM, dan mengintegrasikan alat.
*   **Penyedia LLM:** Integrasi dengan OpenRouter (mendukung berbagai model seperti Claude, GPT, Gemini) dan Google Gemini.
*   **Permintaan HTTP:** [Axios](https://axios-http.com/) untuk semua panggilan API eksternal.
*   **Web Scraping:** [Cheerio](https://cheerio.js.org/) untuk parsing dan ekstraksi data dari konten HTML.
*   **Operasi Matematika:** [Math.js](https://mathjs.org/) untuk perhitungan matematis.
*   **Utilitas Terminal:** `chalk` untuk output konsol berwarna dan `qrcode-terminal` untuk menghasilkan kode QR.
*   **Layanan Pencarian:** Kelas `SearchService` kustom yang memanfaatkan SerpApi (utama), DuckDuckGo, dan scraping Google langsung (fallback).
*   **Layanan Pemetaan & Lokasi:** Kelas `MapService` kustom yang menggunakan OpenStreetMap (Nominatim untuk geocoding, StaticMap untuk gambar statis), Open-Elevation API, dan berpotensi Mapbox.
*   **Manajemen Konfigurasi:** Kelas `ConfigValidator` kustom untuk memvalidasi pengaturan aplikasi.

## 2. Instalasi

Pastikan Anda memiliki Node.js (versi 18 atau lebih tinggi) terinstal.

1.  **Kloning repositori:**
    ```bash
    git clone https://github.com/yourusername/tahujs.git
    cd tahujs
    ```
2.  **Instal dependensi:**
    ```bash
    npm install
    ```

## 3. Konfigurasi

TahuJS dikonfigurasi melalui objek `config` saat membuat instansi `TahuJS`.

**Contoh Konfigurasi:**

```javascript
const config = {
    provider: 'openrouter', // atau 'gemini'
    apiKey: 'YOUR_API_KEY_HERE', // Kunci API dari OpenRouter atau Google Gemini
    model: 'google/gemini-2.0-flash-exp:free', // Model LLM yang akan digunakan
    temperature: 0.7, // Kreativitas model (0.0 - 2.0)
    maxTokens: 2000, // Batas token output
    serpApiKey: 'YOUR_SERPAPI_KEY', // Opsional, untuk pencarian web yang lebih baik
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Opsional, untuk fitur peta tertentu
    mapboxKey: 'YOUR_MAPBOX_KEY', // Opsional, jika menggunakan Mapbox
    httpReferer: 'YOUR_HTTP_REFERER', // Opsional, untuk OpenRouter
    xTitle: 'YOUR_X_TITLE' // Opsional, untuk OpenRouter
};
```

**Catatan Penting untuk OpenRouter:** Jika Anda menggunakan OpenRouter, pastikan `httpReferer` dan `xTitle` di konfigurasi TahuJS Anda cocok dengan pengaturan yang Anda buat di akun OpenRouter Anda untuk API Key tersebut. Jika tidak cocok, Anda mungkin mendapatkan kesalahan 403 (Forbidden).

## 4. Penggunaan Dasar

### Membuat Instansi TahuJS

```javascript
import { createTahu } from './src/tahu.js';

const tahu = createTahu({
    provider: 'openrouter',
    apiKey: 'YOUR_API_KEY_HERE',
    model: 'google/gemini-2.0-flash-exp:free',
    serpApiKey: 'YOUR_SERPAPI_KEY' // Jika ada
});
```

### Melakukan Chat AI

```javascript
async function runChat() {
    const chatResult = await tahu.chat('Jelaskan konsep AI dengan singkat.');
    console.log(chatResult.response);
}
runChat();
```

### Menggunakan Alat (Tools)

TahuJS menyediakan berbagai alat bawaan yang dapat Anda gunakan secara langsung.

```javascript
async function useTools() {
    // Pencarian Web
    const searchResult = await tahu.useTool('webSearch', 'berita teknologi terbaru');
    console.log('Hasil Pencarian Web:', searchResult);

    // Perhitungan Matematika
    const calcResult = await tahu.useTool('calculate', '15 * 3 + (10 / 2)');
    console.log('Hasil Perhitungan:', calcResult);

    // Pencarian Lokasi
    const locationResult = await tahu.useTool('findLocation', 'Menara Eiffel Paris');
    console.log('Informasi Lokasi:', locationResult);

    // Petunjuk Arah
    const directionsResult = await tahu.useTool('getDirections', 'from Monas to Ragunan Zoo');
    console.log('Petunjuk Arah:', directionsResult);

    // Ketinggian (Elevation)
    const elevationResult = await tahu.useTool('getElevation', '-6.2088,106.8456'); // Koordinat Jakarta
    console.log('Ketinggian:', elevationResult);

    // Web Scraping
    const scrapeResult = await tahu.useTool('webScrape', 'https://www.wikipedia.org');
    console.log('Hasil Web Scraping:', scrapeResult);

    // Tanggal & Waktu
    const dateTimeResult = await tahu.useTool('dateTime', 'Asia/Jakarta');
    console.log('Tanggal & Waktu:', dateTimeResult);
}
useTools();
```

### Membuat dan Menjalankan Agen AI

Anda dapat membuat agen AI khusus dengan peran dan kemampuan tertentu.

```javascript
async function runAgentDemo() {
    const travelAgent = tahu.createAgent('TravelExpert', {
        systemPrompt: 'Anda adalah agen perjalanan profesional. Anda membantu merencanakan perjalanan, menemukan lokasi, dan memberikan saran perjalanan.',
        capabilities: ['chat', 'search', 'location', 'directions']
    });

    const travelResult = await tahu.runAgent('TravelExpert', 'Rencanakan perjalanan sehari ke Bali. Temukan tempat menarik untuk dikunjungi dan berikan petunjuk arah.');
    console.log('Hasil Agen Perjalanan:', travelResult.response);
}
runAgentDemo();
```

### Integrasi LangChain

TahuJS memungkinkan Anda membuat agen LangChain yang dapat memanfaatkan semua alat TahuJS secara otomatis.

```javascript
import { createTahu } from './src/tahu.js';

async function langchainIntegrationDemo() {
    const tahu = createTahu({
        provider: 'openrouter',
        apiKey: 'YOUR_API_KEY_HERE',
        model: 'google/gemini-2.0-flash-exp:free',
        serpApiKey: 'YOUR_SERPAPI_KEY'
    });

    const researchAgent = await tahu.createLangChainAgent(
        'Anda adalah asisten peneliti yang kuat. Anda dapat mencari web, menemukan lokasi, dan melakukan perhitungan.'
    );

    const task = "Cari berita terbaru tentang pengembangan AI di Indonesia, lalu cari lokasi kantor pusat Google Indonesia dan berikan link Google Maps-nya.";
    const result = await researchAgent.invoke({ input: task });
    console.log('Hasil Agen LangChain:', result.output);
}
langchainIntegrationDemo();
```

## 5. Daftar Alat Bawaan

*   `webSearch`: Mencari web menggunakan berbagai mesin pencari (SerpApi, DuckDuckGo, Google Scraping).
*   `calculate`: Melakukan perhitungan matematis dan ekspresi.
*   `findLocation`: Menemukan lokasi menggunakan berbagai layanan peta dengan tautan dan kode QR.
*   `getDirections`: Mendapatkan petunjuk arah antara dua lokasi. Input harus dalam format "from [origin] to [destination]".
*   `getElevation`: Mendapatkan data ketinggian untuk koordinat geografis tertentu. Input harus dalam format "latitude,longitude".
*   `webScrape`: Mengekstrak konten dari halaman web.
*   `dateTime`: Mendapatkan informasi tanggal dan waktu saat ini.

## 6. Penanganan Kesalahan

TahuJS menyediakan penanganan kesalahan dasar untuk masalah API umum seperti:

*   `401 Unauthorized`: Kunci API tidak valid.
*   `429 Too Many Requests`: Batas laju terlampaui.
*   `402 Payment Required`: Kredit tidak mencukupi.
*   `403 Forbidden`: Terutama untuk OpenRouter, periksa `httpReferer` dan `xTitle` Anda.
*   Kesalahan umum lainnya akan dilaporkan dengan pesan yang relevan.

## 7. Kontribusi

Kami menyambut kontribusi! Jika Anda ingin berkontribusi pada TahuJS, silakan fork repositori, buat cabang fitur, dan kirimkan pull request.

## 8. Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.