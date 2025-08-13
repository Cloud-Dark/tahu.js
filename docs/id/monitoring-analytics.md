# Pemantauan & Analitik

TahuJS menyertakan manajer analitik bawaan untuk melacak penggunaan LLM Anda dan kinerja.

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({
  /* konfigurasi Anda */
});

// Setelah beberapa panggilan LLM atau agen berjalan
const stats = tahu.analytics.getStats();
console.log('📊 Statistik Penggunaan LLM:');
console.log(`   Total Permintaan: ${stats.totalRequests}`);
console.log(`   Permintaan Berhasil: ${stats.successfulRequests}`);
console.log(`   Permintaan Gagal: ${stats.failedRequests}`);
console.log(`   Tingkat Keberhasilan: ${stats.successRate.toFixed(2)}%`);
console.log(`   Total Token Digunakan: ${stats.totalTokensUsed}`);
console.log(`   Perkiraan Total Biaya: $${stats.estimatedCost.toFixed(6)}`);
console.log(
  `   Total Waktu Respons: ${stats.totalResponseTimeMs.toFixed(2)} ms`
);
console.log(
  `   Rata-rata Waktu Respons: ${stats.averageResponseTimeMs.toFixed(2)} ms`
);

// Anda juga dapat mereset statistik
// tahu.analytics.resetStats();
```