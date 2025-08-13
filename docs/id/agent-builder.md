# Agent Builder

`AgentBuilder` menyediakan API yang lancar untuk membangun dan mengkonfigurasi agen dengan berbagai kemampuan, kepribadian, dan pengaturan memori.

```javascript
import { createTahu, tools } from 'tahu.js';

const tahu = createTahu({
  /* konfigurasi Anda */
});

const omniAgent = tahu
  .builder()
  .name('OmniAgent')
  .systemPrompt(
    'Anda adalah asisten AI yang serba tahu yang mampu melakukan tugas apa pun menggunakan semua alat yang tersedia dan mengingat interaksi sebelumnya.'
  )
  .addPersonality(['penasaran', 'analitis', 'membantu', 'kreatif'], 'optimis', [
    'segalanya',
  ])
  .addCapabilities(
    tools.webSearchTool.name,
    tools.calculateTool.name,
    tools.findLocationTool.name,
    tools.getDirectionsTool.name,
    tools.getElevationTool.name,
    tools.webScrapeTool.name,
    tools.dateTimeTool.name,
    tools.summarizeTool.name,
    tools.trainKnowledgeTool.name,
    tools.retrieveKnowledgeTool.name // Alat pengetahuan baru
  )
  .addMemory('sqlite', { maxMemorySize: 10 }) // Pertahankan memori ke SQLite
  .build();

console.log(
  `Agen '${omniAgent.name}' dibuat. Tipe Memori: ${omniAgent.memoryType}`
);
console.log('Kemampuan:', omniAgent.capabilities.join(', '));

const omniResult = await tahu.runAgent(
  'OmniAgent',
  'Berapa harga Bitcoin saat ini, dan apa tren sosial teratas di Twitter?'
);
console.log('Respons OmniAgent:', omniResult.response);
```