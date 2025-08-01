// example/demo.js - Comprehensive Demo of All TahuJS Features

import TahuJS, { createTahu, tools, plugins } from 'tahujs'; // Using library-style imports

async function comprehensiveDemo() {
  console.log('🥘 TahuJS Comprehensive Demo Starting...\n');

  // --- IMPORTANT: Replace with your actual API keys or ensure Ollama is running ---
  const OPENROUTER_API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; 
  const OPENAI_API_KEY = 'sk-XXXXXXXXXXXXX'; 
  const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXXXXX'; 
  const OLLAMA_BASE_URL = 'http://localhost:11434'; // Default Ollama URL

  // Check API keys
  if (OPENROUTER_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.warn('⚠️  Warning: OpenRouter API key not set. Some demos may fail.');
  }
  if (OPENAI_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.warn('⚠️  Warning: OpenAI API key not set. Some demos may fail.');
  }
  if (GEMINI_API_KEY.includes('XXXXXXXXXXXXX')) {
    console.warn('⚠️  Warning: Gemini API key not set. Some demos may fail.');
  }

  // --- Initialize TahuJS for various providers ---
  const tahuOpenRouter = createTahu({
    provider: 'openrouter',
    apiKey: OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-exp:free', // Or 'anthropic/claude-3-sonnet', 'openai/gpt-4'
    // httpReferer: 'your-website.com', // Required for OpenRouter if configured
    // xTitle: 'Your App Name', // Required for OpenRouter if configured
    embeddingModel: 'text-embedding-ada-002', // Embedding model for OpenRouter/OpenAI
    chromaDbUrl: 'http://localhost:8000', // ChromaDB server URL if used
  });

  const tahuOpenAI = createTahu({
    provider: 'openai',
    apiKey: OPENAI_API_KEY,
    model: 'gpt-3.5-turbo', // Or 'gpt-4'
    embeddingModel: 'text-embedding-ada-002',
  });

  const tahuGemini = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-pro',
    embeddingModel: 'embedding-001',
  });

  const tahuOllama = createTahu({
    provider: 'ollama',
    model: 'llama2', // Ensure this model is downloaded on your Ollama instance
    ollamaBaseUrl: OLLAMA_BASE_URL,
    embeddingModel: 'nomic-embed-text', // Ensure this embedding model is downloaded on Ollama
  });

  // --- Load plugins into OpenRouter instance (can also be other instances) ---
  tahuOpenRouter.use(plugins.tahuCryptoPlugin);
  tahuOpenRouter.use(plugins.tahuSocialPlugin);
  tahuOpenRouter.use(plugins.tahuFinancePlugin);
  tahuOpenRouter.use(plugins.tahuCurrencyPlugin);
  console.log('🔌 Plugins loaded manually.');

  // --- Automatically discover plugins from directory ---
  console.log('🔌 Attempting to automatically discover plugins from ./src/plugins...');
  tahuOpenRouter.loadPlugins('./src/plugins'); // This will reload the same plugins, for demo purposes only

  // Use OpenRouter instance for most demos, as it has all plugins and tools
  const tahu = tahuOpenRouter; 

  try {
    // --- 1. Chat Testing with Various Providers ---
    console.log('\n--- 1. Chat Testing with Various Providers ---');
    
    console.log('\n💬 Chat with OpenRouter:');
    const chatResultOpenRouter = await tahuOpenRouter.chat('Explain the concept of quantum entanglement in simple terms.');
    console.log('OpenRouter Response:', chatResultOpenRouter.response);

    console.log('\n💬 Chat with OpenAI:');
    const chatResultOpenAI = await tahuOpenAI.chat('What are the main benefits of cloud computing?');
    console.log('OpenAI Response:', chatResultOpenAI.response);

    console.log('\n💬 Chat with Gemini:');
    const chatResultGemini = await tahuGemini.chat('Tell a short inspiring story about innovation.');
    console.log('Gemini Response:', chatResultGemini.response);

    console.log('\n💬 Chat with Ollama:');
    const chatResultOllama = await tahuOllama.chat('What is the capital of France?');
    console.log('Ollama Response:', chatResultOllama.response);
    console.log('💡 Ensure Ollama server is running and model (e.g., "llama2") is downloaded if Ollama errors occur.');
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 2. Built-in Tool Testing ---
    console.log('--- 2. Built-in Tool Testing ---');

    console.log('\n🔍 Enhanced Web Search Testing:');
    const searchResult = await tahu.useTool('webSearch', 'latest JavaScript frameworks 2024');
    console.log(searchResult);

    console.log('\n📍 Enhanced Location Search Testing:');
    const locationResult = await tahu.useTool('findLocation', 'Monas Jakarta');
    console.log(locationResult);

    console.log('\n🗺️  Directions Testing:');
    const directionsResult = await tahu.useTool('getDirections', 'from Jakarta to Bandung');
    console.log(directionsResult);

    console.log('\n⛰️  Elevation Testing:');
    const elevationResult = await tahu.useTool('getElevation', '-6.2088,106.8456'); // Jakarta coordinates
    console.log('Elevation Result:', elevationResult);

    console.log('\n🧮 Calculator Testing:');
    const calcResult = await tahu.useTool('calculate', '25 * 4 + sqrt(16)');
    console.log(calcResult);

    console.log('\n🌐 Web Scraping Testing:');
    const scrapeResult = await tahu.useTool('webScrape', 'https://www.wikipedia.org');
    console.log(scrapeResult);

    console.log('\n🕐 Date & Time Testing:');
    const dateTimeResult = await tahu.useTool('dateTime', 'America/New_York');
    console.log('Date & Time:', dateTimeResult);

    console.log('\n📝 Text Summarization Testing:');
    const longText = "This is a very long text that needs to be summarized. It contains a lot of information about various topics, and the purpose is to demonstrate how the summarization tool can work effectively. The longer the text, the more useful this tool becomes for extracting key points and presenting them in a more concise and digestible format. This is particularly helpful in scenarios where you are dealing with large documents, articles, or transcripts and just need a quick overview.";
    const summaryResult = await tahu.useTool('summarizeText', longText);
    console.log(summaryResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 3. Plugin Tool Testing ---
    console.log('--- 3. Plugin Tool Testing ---');
    const cryptoPrice = await tahu.useTool('cryptoPrice', 'BTC');
    console.log('Crypto Price:', cryptoPrice);

    const socialTrends = await tahu.useTool('socialTrends', 'Twitter');
    console.log('Social Trends:', socialTrends);

    const stockPrice = await tahu.useTool('stockPrice', 'MSFT');
    console.log('Stock Price:', stockPrice);

    const currencyConversion = await tahu.useTool('convertCurrency', '100 USD to IDR');
    console.log('Currency Conversion:', currencyConversion);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 4. Agent Management Testing ---
    console.log('--- 4. Agent Management Testing ---');
    
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

    // Researcher Agent (using new createPrebuiltAgent) with JSON memory
    console.log('\n🔬 Pre-built Researcher Agent Testing with JSON memory:');
    const researchAgent = tahu.createPrebuiltAgent('researcher', { 
        name: 'MySmartResearcherJSON',
        memoryType: 'json', // Save memory to JSON file
        maxMemorySize: 3 // Limit memory to 3 entries
    });
    const researchResult = await tahu.runAgent('MySmartResearcherJSON', 'Research the current state of AI development in Indonesia');
    console.log('Researcher Agent (JSON):', researchResult.response);
    // Run again to demonstrate memory persistence and trimming
    const researchResult2 = await tahu.runAgent('MySmartResearcherJSON', 'What was the last thing I asked you?');
    console.log('Researcher Agent (JSON, continued):', researchResult2.response);

    // Coder Agent (using new createPrebuiltAgent) with SQLite memory
    console.log('\n👨‍💻 Pre-built Coder Agent Testing with SQLite memory:');
    const coderAgent = tahu.createPrebuiltAgent('coder', { 
        name: 'MyCoderAgentSQLite',
        memoryType: 'sqlite', // Save memory to SQLite database
        maxMemorySize: 5 // Limit memory to 5 entries
    }); 
    const coderResult = await tahu.runAgent('MyCoderAgentSQLite', 'Write a simple Python function to calculate factorial.');
    console.log('Coder Agent (SQLite):', coderResult.response);
    // Run again to demonstrate memory persistence
    const coderResult2 = await tahu.runAgent('MyCoderAgentSQLite', 'Can you remind me about the Python function you just wrote?');
    console.log('Coder Agent (SQLite, continued):', coderResult2.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 5. AgentBuilder Testing with All Features ---
    console.log('--- 5. AgentBuilder Testing with All Features ---');
    const allCapabilitiesAgent = tahu.builder()
        .name('OmniAgent')
        .systemPrompt('You are an all-knowing AI assistant capable of performing any task using all available tools and remembering past interactions.')
        .addPersonality(['curious', 'analytical', 'helpful', 'creative'], 'optimistic', ['everything'])
        .addCapabilities(
            tools.webSearchTool.name, tools.calculateTool.name, tools.findLocationTool.name, 
            tools.getDirectionsTool.name, tools.getElevationTool.name, tools.webScrapeTool.name, 
            tools.dateTimeTool.name, tools.summarizeTool.name, // Built-in tools
            plugins.tahuCryptoPlugin.name, plugins.tahuSocialPlugin.name, 
            plugins.tahuFinancePlugin.name, plugins.tahuCurrencyPlugin.name, // Plugin tools
            tools.trainKnowledgeTool.name, tools.retrieveKnowledgeTool.name // New knowledge tools
        )
        .addMemory('json', { maxMemorySize: 10, memoryPath: './omni_agent_memory.json' })
        .build();

    console.log(`\n🤖 Agent 'OmniAgent' created with builder. Memory: ${allCapabilitiesAgent.memoryType}`);
    console.log('Capabilities:', allCapabilitiesAgent.capabilities.join(', '));

    console.log('\nRunning OmniAgent task: "Find the current price of Bitcoin, then find the location of the Eiffel Tower, and provide a brief summary of its history."');
    const omniResult1 = await tahu.runAgent('OmniAgent', 'Find the current price of Bitcoin, then find the location of the Eiffel Tower, and provide a brief summary of its history.');
    console.log('OmniAgent Response 1:', omniResult1.response);

    console.log('\nRunning OmniAgent task: "What is 123 divided by 45, and what are the top social trends on TikTok?"');
    const omniResult2 = await tahu.runAgent('OmniAgent', 'What is 123 divided by 45, and what are the top social trends on TikTok?');
    console.log('OmniAgent Response 2:', omniResult2.response);

    console.log('\n' + '='.repeat(50) + '\n');

    // --- 6. Multi-Agent Workflow Testing ---
    console.log('--- 6. Multi-Agent Workflow Testing ---');
    tahu.createAgent('WorkflowResearcher', { systemPrompt: 'You are a researcher who gathers information.' });
    tahu.createAgent('WorkflowAnalyst', { systemPrompt: 'You are an analyst who processes research data.' });
    tahu.createAgent('WorkflowWriter', { systemPrompt: 'You are a writer who summarizes analysis results.' });

    const workflow = tahu.createWorkflow([
        { agent: 'WorkflowResearcher', task: 'research_ai_trends' },
        { agent: 'WorkflowAnalyst', task: 'analyze_research', depends: ['research_ai_trends'] },
        { agent: 'WorkflowWriter', task: 'summarize_analysis', depends: ['analyze_research'] }
    ]);

    const workflowResults = await workflow.execute('Latest AI trends in healthcare.');
    console.log('Final Workflow Results:', workflowResults);
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 7. Parallel Processing Testing ---
    console.log('--- 7. Parallel Processing Testing ---');
    const parallelTasks = [
        { prompt: 'Explain quantum computing briefly.' },
        { prompt: 'What is the capital of France?' },
        { agent: 'MySmartResearcherJSON', input: 'Summarize the last research topic.' }
    ];
    const parallelResults = await tahu.parallel(parallelTasks);
    console.log('Parallel Processing Results:', parallelResults.map(r => r.response || r));
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 8. Simple Batch Processing Testing ---
    console.log('--- 8. Simple Batch Processing Testing ---');
    const batchPrompts = [
        { prompt: 'Tell a short story about a robot.' },
        { prompt: 'List 3 benefits of cloud computing.' },
        { prompt: 'What is the main purpose of blockchain?' }
    ];
    const batchResults = await tahu.batch(batchPrompts);
    console.log('Batch Processing Results:', batchResults.map(r => r.response));
    console.log('\n' + '='.repeat(50) + '\n');

    // --- 9. Real-time Analytics Testing ---
    console.log('--- 9. Real-time Analytics Testing ---');
    const stats = tahu.analytics.getStats();
    console.log('📊 LLM Usage Statistics:');
    console.log(`   Total Requests: ${stats.totalRequests}`);
    console.log(`   Successful Requests: ${stats.successfulRequests}`);
    console.log(`   Failed Requests: ${stats.failedRequests}`);
    console.log(`   Success Rate: ${stats.successRate}%`);
    console.log(`   Total Tokens Used: ${stats.totalTokensUsed}`);
    console.log(`   Estimated Total Cost: $${stats.estimatedCost}`);
    console.log(`   Total Response Time: ${stats.totalResponseTimeMs.toFixed(2)} ms`);
    console.log(`   Average Response Time: ${stats.averageResponseTimeMs.toFixed(2)} ms`);
    
    // You can also reset the statistics
    // tahu.analytics.resetStats();
    // console.log('\nStats after reset:', tahu.analytics.getStats());

    console.log('\n' + '='.repeat(50) + '\n');
    // --- 10. Knowledge Training and Retrieval (RAG) Testing ---
    console.log('--- 10. Knowledge Training and Retrieval (RAG) Testing ---');

    // Train knowledge to SQLite
    console.log('\n📚 Training knowledge to SQLite...');
    const trainResultSqlite = await tahu.useTool(
        'trainKnowledge', 
        'my_company_docs|sqlite|TahuJS is a comprehensive AI framework for Node.js. It supports various LLMs and built-in tools.'
    );
    console.log(trainResultSqlite);

    const trainResultSqlite2 = await tahu.useTool(
        'trainKnowledge', 
        'my_company_docs|sqlite|TahuJS key features include agent management, multi-agent workflows, and real-time analytics.'
    );
    console.log(trainResultSqlite2);

    // Retrieve knowledge from SQLite
    console.log('\n🔍 Retrieving knowledge from SQLite...');
    const retrieveResultSqlite = await tahu.useTool(
        'retrieveKnowledge', 
        'my_company_docs|sqlite|What are TahuJS features?'
    );
    console.log(retrieveResultSqlite);

    // Train knowledge to ChromaDB (ensure ChromaDB server is running at http://localhost:8000)
    console.log('\n📚 Training knowledge to ChromaDB (ensure ChromaDB server is running at http://localhost:8000)...');
    const trainResultChroma = await tahu.useTool(
        'trainKnowledge', 
        'product_info|chroma|Our flagship product is TahuAI, a platform that simplifies AI development.'
    );
    console.log(trainResultChroma);

    const trainResultChroma2 = await tahu.useTool(
        'trainKnowledge', 
        'product_info|chroma|TahuAI offers easy LLM integration and powerful customization tools.'
    );
    console.log(trainResultChroma2);

    // Retrieve knowledge from ChromaDB
    console.log('\n🔍 Retrieving knowledge from ChromaDB...');
    const retrieveResultChroma = await tahu.useTool(
        'retrieveKnowledge', 
        'product_info|chroma|What is TahuAI?'
    );
    console.log(retrieveResultChroma);

    // Supabase usage example (will fail if not integrated)
    console.log('\n📚 Attempting to train knowledge to Supabase (will prompt for integration if not already set up)...');
    const trainResultSupabase = await tahu.useTool(
        'trainKnowledge', 
        'customer_feedback|supabase|Customers love TahuJS speed and ease of use.'
    );
    console.log(trainResultSupabase);
    console.log('💡 To use Supabase, you need to add Supabase integration to your project.');
    console.log('\n' + '='.repeat(50) + '\n');


    console.log('\n🎉 Comprehensive Demo Finished!');
    console.log('📊 Available Tools:', tahu.listTools());
    console.log('🤖 Available Agents:', tahu.listAgents());

  } catch (error) {
    console.error('❌ Demo Error:', error.message);
  }
}

// Run comprehensive demo
comprehensiveDemo().catch(console.error);