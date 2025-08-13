# Alur Kerja Multi-Agen

Definisikan dan jalankan alur kerja kompleks di mana agen yang berbeda berkolaborasi dalam tugas, dengan dependensi di antara mereka.

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({
  /* konfigurasi Anda */
});

tahu.createAgent('PengumpulData', {
  systemPrompt: 'Mengumpulkan data mentah.',
});
tahu.createAgent('PembuatLaporan', {
  systemPrompt: 'Menghasilkan laporan dari data.',
});

const workflow = tahu.createWorkflow([
  { agent: 'PengumpulData', task: 'kumpulkan_data_pasar' },
  {
    agent: 'PembuatLaporan',
    task: 'buat_laporan_ringkasan',
    depends: ['kumpulkan_data_pasar'],
  },
]);

const workflowResults = await workflow.execute(
  'Tren pasar untuk energi terbarukan.'
);
console.log('Hasil Akhir Alur Kerja:', workflowResults);
```