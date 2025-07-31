// langchain-demo.js - Demo for TahuJS + LangChain Integration
import TahuJS, { createTahu } from '../index.js';

async function langchainDemo() {
    console.log('🍲 TahuJS & LangChain Demo Starting...\n');

    const API_KEY = 'sk-or-v1-XXX'; // Replace with your real API key

    if (!API_KEY || API_KEY.includes('YOUR_API_KEY')) {
        console.error('❌ Please set your real OpenRouter API key!');
        return;
    }

    // Inisialisasi TahuJS
    const tahu = createTahu({
        provider: 'openrouter',
        apiKey: API_KEY,
        model: 'google/gemini-2.0-flash-exp:free',
    });

    try {
        // 1. Buat Agen LangChain
        // Agen ini secara otomatis akan memiliki akses ke semua alat TahuJS
        const researchAgent = await tahu.createLangChainAgent(
            'You are a powerful research assistant. You can search the web, find locations, and perform calculations.'
        );

        // 2. Jalankan Agen dengan tugas yang kompleks
        console.log('\n==================================================');
        console.log('🚀 Running Task 1: Find news and location...');

        const task1 = "Cari berita terbaru tentang pengembangan AI di Indonesia, lalu cari lokasi kantor pusat Google Indonesia dan berikan link Google Maps-nya.";

        const result1 = await researchAgent.invoke({ input: task1 });

        console.log('\n✅ Final Answer (Task 1):');
        console.log(result1.output);

        // 3. Jalankan Agen dengan tugas yang membutuhkan alat berbeda
        console.log('\n==================================================');
        console.log('🚀 Running Task 2: Get directions...');

        const task2 = "Berikan saya rute perjalanan dari Monas ke Kebun Binatang Ragunan";

        const result2 = await researchAgent.invoke({ input: task2 });

        console.log('\n✅ Final Answer (Task 2):');
        console.log(result2.output);

        console.log('\n🎉 LangChain Demo completed successfully!');

    } catch (error) {
        console.error('❌ LangChain Demo Error:', error.message);
    }
}

langchainDemo().catch(console.error);