# Contoh

Bagian ini menyediakan gambaran umum yang komprehensif tentang contoh TahuJS, dikategorikan berdasarkan penyedia LLM.

## Contoh Gemini

Bagian ini menyediakan contoh penggunaan TahuJS dengan Gemini.

### Mulai Cepat

Contoh sederhana untuk memulai dengan Gemini.

[Lihat Contoh Mulai Cepat](<../example/gemini/quick-start.js>)

### Demo Komprehensif

Demonstrasi yang lebih komprehensif tentang fitur TahuJS dengan Gemini.

[Lihat Demo Komprehensif](<../example/gemini/demo.js>)

## Contoh Ollama

Bagian ini menyediakan contoh penggunaan TahuJS dengan Ollama.

### Mulai Cepat

Contoh sederhana untuk memulai dengan Ollama.

[Lihat Contoh Mulai Cepat](<../example/ollama/quick-start.js>)

### Demo Komprehensif

Demonstrasi yang lebih komprehensif tentang fitur TahuJS dengan Ollama.

[Lihat Demo Komprehensif](<../example/ollama/demo.js>)

## Contoh OpenAI

Bagian ini menyediakan contoh penggunaan TahuJS dengan OpenAI.

### Mulai Cepat

Contoh sederhana untuk memulai dengan OpenAI.

[Lihat Contoh Mulai Cepat](<../example/openai/quick-start.js>)

### Demo Komprehensif

Demonstrasi yang lebih komprehensif tentang fitur TahuJS dengan OpenAI.

[Lihat Demo Komprehensif](<../example/openai/demo.js>)

## Contoh OpenRouter

Bagian ini menyediakan contoh penggunaan TahuJS dengan OpenRouter.

### Mulai Cepat

Contoh sederhana untuk memulai dengan OpenRouter.

[Lihat Contoh Mulai Cepat](<../example/openrouter/quick-start.js>)

### Demo Komprehensif

Demonstrasi yang lebih komprehensif tentang fitur TahuJS dengan OpenRouter.

[Lihat Demo Komprehensif](<../example/openrouter/demo.js>)

## Alat Bawaan

TahuJS dilengkapi dengan seperangkat alat bawaan yang kuat yang dapat digunakan oleh agen atau secara langsung.

### Alat OCR

Alat OCR memungkinkan Anda mengekstrak teks dari file gambar dan PDF.

```javascript
import { createTahu } from '../../src/tahu.js';
import path from 'path';
import process from 'process'; // Import process for process.cwd()

async function runOcrExample() {
  const tahu = createTahu({
    provider: 'gemini', // Atau penyedia lain
    apiKey: 'KUNCI_API_ANDA',
    model: 'gemini-1.5-flash',
    tools: {
      enabled: ['ocr'], // Hanya aktifkan alat OCR
    },
  });

  try {
    console.log('\n--- Contoh Alat OCR ---');
    const imagePath = path.join(process.cwd(), 'example', 'gemini', 'sample.png'); // Path ke gambar/PDF Anda
    // Untuk pengujian nyata, ganti 'sample.png' dengan gambar/PDF yang berisi teks.
    // Anda mungkin perlu menginstal data bahasa 'tesseract.js' untuk bahasa tertentu.
    const extractedText = await tahu.useTool('ocr', imagePath);
    console.log('Teks yang Diekstrak:', extractedText);
  } catch (error) {
    console.error('❌ Kesalahan Contoh OCR:', error.message);
  }
}
runOcrExample();
```
