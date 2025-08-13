# Plugin System

Extend TahuJS by creating and loading custom plugins. Plugins can add new tools, modify behavior, or integrate with external services.

```javascript
import { createTahu, plugins } from 'tahu.js';

const tahu = createTahu({
  /* your config */
});

// Manually load a specific plugin
tahu.use(plugins.tahuCryptoPlugin);
const cryptoPrice = await tahu.useTool('cryptoPrice', 'ETH');
console.log(cryptoPrice);

// Automatically load all plugins from a directory
tahu.loadPlugins('./src/plugins');
```