# Pemrosesan Paralel & Batch

Menangani beberapa permintaan LLM atau tugas agen secara bersamaan untuk efisiensi yang lebih baik.

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({
  /* konfigurasi Anda */
});

// Eksekusi paralel tugas agen atau prompt chat
const parallelTasks = [
  { prompt: 'Jelaskan komputasi kuantum secara singkat.' },
  { prompt: 'Apa ibu kota Prancis?' },
  {
    agent: 'MySmartResearcherJSON',
    input: 'Ringkas topik penelitian terakhir.',
  }, // Asumsi agen MySmartResearcherJSON ada
];
const parallelResults = await tahu.parallel(parallelTasks);
console.log(
  'Hasil Paralel:',
  parallelResults.map((r) => r.response || r)
);

// Pemrosesan batch sederhana dari prompt chat
const batchPrompts = [
  { prompt: 'Ceritakan kisah singkat tentang robot.' },
  { prompt: 'Sebutkan 3 manfaat cloud computing.' },
  { prompt: 'Apa tujuan utama blockchain?' },
];
const batchResults = await tahu.batch(batchPrompts);
console.log(
  'Hasil Batch:',
  batchResults.map((r) => r.response)
);
```