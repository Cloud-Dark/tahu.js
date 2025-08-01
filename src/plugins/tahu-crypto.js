// src/plugins/tahu-crypto.js
// Plugin untuk analisis kripto (menggunakan data tiruan)

export default function tahuCryptoPlugin(tahuInstance) {
    tahuInstance.registerTool('cryptoPrice', {
        name: 'cryptoPrice',
        description: 'Get mock cryptocurrency prices for symbols like BTC, ETH, XRP. Input: cryptocurrency symbol (e.g., "BTC").',
        execute: async (symbol) => {
            const prices = {
                'BTC': 68500.75,
                'ETH': 3800.20,
                'XRP': 0.62,
                'ADA': 0.45,
                'SOL': 170.10
            };
            const upperSymbol = symbol.toUpperCase();
            const price = prices[upperSymbol];

            if (price) {
                return `📈 The current price of ${upperSymbol} is $${price.toFixed(2)}. (Mock data)`;
            } else {
                return `❌ Crypto price for ${upperSymbol} not found in mock data.`;
            }
        }
    });
    console.log('🔌 Tahu-Crypto plugin loaded: cryptoPrice tool registered.');
}