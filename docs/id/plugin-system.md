# Sistem Plugin

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