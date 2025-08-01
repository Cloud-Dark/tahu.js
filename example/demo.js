// examples/enhanced-demo.js - Test all the new features
import TahuJS, { createTahu } from '../src/tahu.js';

// Import plugins
import tahuCryptoPlugin from '../src/plugins/tahu-crypto.js';
import tahuSocialPlugin from '../src/plugins/tahu-social.js';
import tahuFinancePlugin from '../src/plugins/tahu-finance.js';
import tahuCurrencyPlugin from '../src/plugins/tahu-currency.js';


async function enhancedDemo() {
  console.log('🥘 Enhanced TahuJS Demo Starting...\n');

  // --- IMPORTANT: Replace with your actual API keys or ensure Ollama is running ---
  const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; 
  const OPENAI_API_KEY = 'sk-XXXXXXXXXXXXX'; 
  const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXXXXX'; 
  const OLLAMA_BASE_URL = 'http://localhost:11434'; // Default Ollama URL

  // --- Example 1: Using OpenRouter ---
  console.log('--- Testing with OpenRouter ---');
  const tahuOpenRouter = createTahu({
    provider: 'openrouter',
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // Or 'anthropic/claude-3-sonnet', 'openai/gpt-4'
    // httpReferer: 'your-website.com', // Required for OpenRouter if set
    // xTitle: 'Your App Name', // Required for OpenRouter if set
  });
  tahuOpenRouter.use(tahuCryptoPlugin); // Plugins can be used with any instance
  tahuOpenRouter.loadPlugins('./src/plugins'); // Auto-discover plugins

  try {
    const chatResultOpenRouter = await tahuOpenRouter.chat('Explain the concept of quantum entanglement in simple terms.');
    console.log('OpenRouter Chat:', chatResultOpenRouter.response);
    const cryptoPriceOpenRouter = await tahuOpenRouter.useTool('cryptoPrice', 'ETH');
    console.log('OpenRouter Crypto Price:', cryptoPriceOpenRouter);
  } catch (error) {
    console.error('❌ OpenRouter Demo Error:', error.message);
  }
  console.log('\n' + '='.repeat(50) + '\n');

  // --- Example 2: Using OpenAI ---
  console.log('--- Testing with OpenAI ---');
  const tahuOpenAI = createTahu({
    provider: 'openai',
    apiKey: OPENAI_API_KEY,
    model: 'gpt-3.5-turbo', // Or 'gpt-4'
  });
  try {
    const chatResultOpenAI = await tahuOpenAI.chat('What are the main benefits of using cloud computing?');
    console.log('OpenAI Chat:', chatResultOpenAI.response);
  } catch (error) {
    console.error('❌ OpenAI Demo Error:', error.message);
  }
  console.log('\n' + '='.repeat(50) + '\n');

  // --- Example 3: Using Gemini (Google Generative AI) ---
  console.log('--- Testing with Gemini ---');
  const tahuGemini = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-pro',
  });
  try {
    const chatResultGemini = await tahuGemini.chat('Tell me a short, inspiring story about innovation.');
    console.log('Gemini Chat:', chatResultGemini.response);
  } catch (error) {
    console.error('❌ Gemini Demo Error:', error.message);
  }
  console.log('\n' + '='.repeat(50) + '\n');

  // --- Example 4: Using Ollama (ensure Ollama server is running locally) ---
  console.log('--- Testing with Ollama ---');
  const tahuOllama = createTahu({
    provider: 'ollama',
    model: 'llama2', // Ensure this model is downloaded in your Ollama instance
    ollamaBaseUrl: OLLAMA_BASE_URL,
  });
  try {
    const chatResultOllama = await tahuOllama.chat('What is the capital of France?');
    console.log('Ollama Chat:', chatResultOllama.response);
  } catch (error) {
    console.error('❌ Ollama Demo Error:', error.message);
    console.log('💡 Make sure Ollama server is running and the model (e.g., "llama2") is downloaded.');
  }
  console.log('\n' + '='.repeat(50) + '\n');


  // --- Existing Demo Features (can be run with any configured tahu instance, e.g., tahuOpenRouter) ---
  console.log('--- Testing Existing Features with OpenRouter instance ---');
  const tahu = tahuOpenRouter; // Use one of the initialized instances for the rest of the demo

  try {
    // Test Enhanced Web Search with fallbacks
    console.log('🔍 Testing Enhanced Web Search:');
    const searchResult = await tahu.useTool('webSearch', 'latest JavaScript frameworks 2024');
    console.log(searchResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Enhanced Location Search
    console.log('📍 Testing Enhanced Location Search:');
    const locationResult = await tahu.useTool('findLocation', 'Monas Jakarta');
    console.log(locationResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Directions
    console.log('🗺️  Testing Directions:');
    const directionsResult = await tahu.useTool('getDirections', 'from Jakarta to Bandung');
    console.log(directionsResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Elevation
    console.log('⛰️  Testing Elevation:');
    const elevationResult = await tahu.useTool('getElevation', '-6.2088,106.8456'); // Jakarta coordinates
    console.log('Elevation Result:', elevationResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Calculator
    console.log('🧮 Testing Calculator:');
    const calcResult = await tahu.useTool('calculate', '25 * 4 + sqrt(16)');
    console.log(calcResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Web Scraping
    console.log('🌐 Testing Web Scraping:');
    const scrapeResult = await tahu.useTool('webScrape', 'https://www.wikipedia.org');
    console.log(scrapeResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test AI Chat (already tested above, but keeping for completeness)
    // console.log('💬 Testing AI Chat:');
    // const chatResult = await tahu.chat('Tell me about the weather in Jakarta and search for current weather information');
    // console.log(chatResult.response);
    // console.log('\n' + '='.repeat(50) + '\n');

    // Create specialized agents
    console.log('🤖 Testing Specialized Agents:');
    
    // Travel Agent (using existing createAgent for custom example)
    const travelAgent = tahu.createAgent('TravelExpert', {
      systemPrompt: 'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.',
      capabilities: ['search', 'location', 'directions', 'recommendations'],
      personality: { // Enhanced personality
        traits: ['organized', 'friendly'],
        mood: 'optimistic',
        expertise: ['travel planning', 'destination knowledge']
      },
      memoryType: 'volatile' // Default in-memory
    });

    const travelResult = await tahu.runAgent('TravelExpert', 'Plan a day trip to Jakarta. Find interesting places to visit and provide directions.');
    console.log('Travel Agent:', travelResult.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // Research Agent (using new createPrebuiltAgent) with JSON memory
    console.log('🔬 Testing Pre-built Research Agent with JSON memory:');
    const researchAgent = tahu.createPrebuiltAgent('researcher', { 
        name: 'MySmartResearcherJSON',
        memoryType: 'json', // Save memory to JSON file
        maxMemorySize: 3 // Limit memory to 3 entries
    });
    const researchResult = await tahu.runAgent('MySmartResearcherJSON', 'Research the current state of AI development in Indonesia');
    console.log('Research Agent (JSON):', researchResult.response);
    // Run again to show memory persistence and trimming
    const researchResult2 = await tahu.runAgent('MySmartResearcherJSON', 'What was the last thing I asked you about?');
    console.log('Research Agent (JSON, continued):', researchResult2.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // Coder Agent (using new createPrebuiltAgent) with SQLite memory
    console.log('👨‍💻 Testing Pre-built Coder Agent with SQLite memory:');
    const coderAgent = tahu.createPrebuiltAgent('coder', { 
        name: 'MyCoderAgentSQLite',
        memoryType: 'sqlite', // Save memory to SQLite database
        maxMemorySize: 5 // Limit memory to 5 entries
    }); 
    const coderResult = await tahu.runAgent('MyCoderAgentSQLite', 'Write a simple Python function to calculate factorial.');
    console.log('Coder Agent (SQLite):', coderResult.response);
    // Run again to show memory persistence
    const coderResult2 = await tahu.runAgent('MyCoderAgentSQLite', 'Can you remind me of the Python function you just wrote?');
    console.log('Coder Agent (SQLite, continued):', coderResult2.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- NEW: Test Plugin Tools ---
    console.log('🔌 Testing Plugin Tools:');
    const cryptoPrice = await tahu.useTool('cryptoPrice', 'BTC');
    console.log('Crypto Price:', cryptoPrice);

    const socialTrends = await tahu.useTool('socialTrends', 'Twitter');
    console.log('Social Trends:', socialTrends);

    const stockPrice = await tahu.useTool('stockPrice', 'MSFT');
    console.log('Stock Price:', stockPrice);

    const currencyConversion = await tahu.useTool('convertCurrency', '100 USD to IDR');
    console.log('Currency Conversion:', currencyConversion);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- NEW: Test Multi-agent Workflow ---
    console.log('🔥 Testing Multi-agent Workflow:');
    tahu.createAgent('WorkflowResearcher', { systemPrompt: 'You are a researcher who gathers information.' });
    tahu.createAgent('WorkflowAnalyst', { systemPrompt: 'You are an analyst who processes research data.' });
    tahu.createAgent('WorkflowWriter', { systemPrompt: 'You are a writer who summarizes analysis results.' });

    const workflow = tahu.createWorkflow([
        { agent: 'WorkflowResearcher', task: 'research_ai_trends' },
        { agent: 'WorkflowAnalyst', task: 'analyze_research', depends: ['research_ai_trends'] },
        { agent: 'WorkflowWriter', task: 'summarize_analysis', depends: ['analyze_research'] }
    ]);

    const workflowResults = await workflow.execute('Latest AI trends in healthcare.');
    console.log('Workflow Final Results:', workflowResults);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- NEW: Test Parallel Processing ---
    console.log('⚡ Testing Parallel Processing:');
    const parallelTasks = [
        { prompt: 'Explain quantum computing briefly.' },
        { prompt: 'What is the capital of France?' },
        { agent: 'MySmartResearcherJSON', input: 'Summarize the last research topic.' }
    ];
    const parallelResults = await tahu.parallel(parallelTasks);
    console.log('Parallel Processing Results:', parallelResults.map(r => r.response || r));
    console.log('\n' + '='.repeat(50) + '\n');

    // --- NEW: Test Batch Processing ---
    console.log('📦 Testing Batch Processing:');
    const batchPrompts = [
        { prompt: 'Tell me a short story about a robot.' },
        { prompt: 'List 3 benefits of cloud computing.' },
        { prompt: 'What is the main purpose of a blockchain?' }
    ];
    const batchResults = await tahu.batch(batchPrompts);
    console.log('Batch Processing Results:', batchResults.map(r => r.response));
    console.log('\n' + '='.repeat(50) + '\n');


    console.log('\n🎉 Enhanced Demo completed successfully!');
console.log('📊 Available tools:', tahu.listTools());
   console.log('🤖 Available agents:', tahu.listAgents());

 } catch (error) {
   console.error('❌ Demo Error:', error.message);
 }
}

// Run enhanced demo
enhancedDemo().catch(console.error);