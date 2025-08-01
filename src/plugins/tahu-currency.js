// Plugin for currency conversion (using mock data)

export default function tahuCurrencyPlugin(tahuInstance) {
    tahuInstance.registerTool('convertCurrency', {
        name: 'convertCurrency',
        description: 'Convert an amount from one currency to another. Input: "amount fromCurrency toCurrency" (e.g., "100 USD to EUR").',
        execute: async (input) => {
            const match = input.match(/(\d+(\.\d+)?)\s*([A-Za-z]{3})\s*to\s*([A-Za-z]{3})/);
            if (!match) {
                return "❌ Invalid format. Please use 'amount fromCurrency toCurrency' (e.g., '100 USD to EUR').";
            }

            const amount = parseFloat(match[1]);
            const fromCurrency = match[3].toUpperCase();
            const toCurrency = match[4].toUpperCase();

            // Mock exchange rates (simplified)
            const rates = {
                'USD': { 'EUR': 0.92, 'IDR': 16200, 'JPY': 156.00 },
                'EUR': { 'USD': 1.08, 'IDR': 17600, 'JPY': 170.00 },
                'IDR': { 'USD': 0.000062, 'EUR': 0.000057, 'JPY': 0.0096 },
                'JPY': { 'USD': 0.0064, 'EUR': 0.0059, 'IDR': 104.00 }
            };

            if (!rates[fromCurrency] || !rates[fromCurrency][toCurrency]) {
                return `❌ Conversion rate from ${fromCurrency} to ${toCurrency} not available in mock data.`;
            }

            const convertedAmount = amount * rates[fromCurrency][toCurrency];
            return `💱 ${amount} ${fromCurrency} is approximately ${convertedAmount.toFixed(2)} ${toCurrency}. (Mock data)`;
        }
    });
    console.log('🔌 Tahu-Currency plugin loaded: convertCurrency tool registered.');
}