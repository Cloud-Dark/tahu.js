// src/plugins/tahu-finance.js
// Plugin untuk data keuangan (menggunakan data tiruan)

export default function tahuFinancePlugin(tahuInstance) {
    tahuInstance.registerTool('stockPrice', {
        name: 'stockPrice',
        description: 'Get mock stock prices for common companies. Input: stock symbol (e.g., "AAPL", "GOOGL", "MSFT").',
        execute: async (symbol) => {
            const prices = {
                'AAPL': 175.50,
                'GOOGL': 150.20,
                'MSFT': 420.10,
                'AMZN': 185.00,
                'TSLA': 178.90
            };
            const upperSymbol = symbol.toUpperCase();
            const price = prices[upperSymbol];

            if (price) {
                return `📊 The current stock price of ${upperSymbol} is $${price.toFixed(2)}. (Mock data)`;
            } else {
                return `❌ Stock price for ${upperSymbol} not found in mock data.`;
            }
        }
    });
    console.log('🔌 Tahu-Finance plugin loaded: stockPrice tool registered.');
}