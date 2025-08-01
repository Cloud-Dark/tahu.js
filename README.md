# 🥘 TahuJS: Comprehensive AI Application Development Framework

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Cloud-Dark/tahujs?style=social)](https://github.com/Cloud-Dark/tahujs/stargazers)

**The Ultimate Node.js Library for AI Agents & LLM Integration**

Build powerful AI agents in minutes, not hours. TahuJS provides a simple, fast, and flexible way to create intelligent applications using OpenRouter, Gemini, OpenAI, Ollama, and other leading AI providers.

```javascript
import { createTahu } from 'tahujs';

// Create an AI agent in a few lines
const tahu = createTahu({
  provider: 'openrouter',
  apiKey: 'YOUR_API_KEY',
  model: 'google/gemini-2.0-flash-exp:free'
});

const simpleAgent = tahu.builder()
  .name('SimpleAssistant')
  .systemPrompt('You are a friendly and helpful AI assistant.')
  .addCapabilities('chat', 'calculate')
  .build();

const response = await tahu.runAgent('SimpleAssistant', 'What is 150 divided by 3 minus 10?');
console.log(response.response);
```

## ✨ Why TahuJS?

-   **🚀 Plug & Play**: Zero-config setup for basic usage, works out of the box.
-   **⚡ Optimized Performance**: Designed for speed with efficient LLM calls and tool execution.
-   **💰 Cost Awareness**: Basic analytics for tracking token usage and estimated costs.
-   **🔧 Developer First**: Intuitive API, modular design, and clear logging.
-   **🌍 Multi-Provider**: Seamless integration with OpenRouter, OpenAI, Google Gemini, and Ollama (local).
-   **🤖 Agent Framework**: Build complex multi-agent workflows with persistent memory.
-   **📊 Production Ready**: Robust error handling, configuration validation, and real-time analytics.

## 🚀 Quick Start

### Installation

Ensure you have **Node.js version 18 or higher** installed on your system.

```bash
# Clone the TahuJS repository
git clone https://github.com/Cloud-Dark/tahujs.git
cd tahujs

# Install all necessary dependencies
npm install
```

### Basic Usage

```javascript
import { createTahu, tools, plugins } from 'tahujs';

// Initialize with your API keys
const tahu = createTahu({
  provider: 'openrouter', // or 'openai', 'gemini', 'ollama'
  apiKey: process.env.OPENROUTER_API_KEY, // Use environment variables for production
  model: 'google/gemini-2.0-flash-exp:free',
  embeddingModel: 'text-embedding-ada-002', // Required for knowledge base features
  // ollamaBaseUrl: 'http://localhost:11434', // Only if using local Ollama
  // serpApiKey: process.env.SERPAPI_KEY, // Optional, for better web search
  // chromaDbUrl: 'http://localhost:8000', // Optional, for ChromaDB
});

// Simple LLM chat
const chatResponse = await tahu.chat('What is the future of AI?');
console.log(chatResponse.response);

// Create a specialized agent
const coder = tahu.builder()
  .name('CodeAssistant')
  .systemPrompt('You are an expert JavaScript developer.')
  .addCapabilities(tools.calculateTool.name, tools.webSearchTool.name)
  .addMemory('json', { maxMemorySize: 5, memoryPath: './coder_memory.json' })
  .build();

const codeResult = await tahu.runAgent('CodeAssistant', 'Write a simple Express.js server that returns "Hello World" on /.');
console.log(codeResult.response);

// Use a built-in tool directly
const calcResult = await tahu.useTool('calculate', '15 * 3 + (10 / 2)');
console.log('Calculation Result:', calcResult);

// Load a plugin and use its tool
tahu.use(plugins.tahuCryptoPlugin);
const cryptoPrice = await tahu.useTool('cryptoPrice', 'BTC');
console.log('Bitcoin Price:', cryptoPrice);

// Train custom knowledge
await tahu.useTool('trainKnowledge', 'my_docs|sqlite|TahuJS is a comprehensive AI framework.');
const retrievedKnowledge = await tahu.useTool('retrieveKnowledge', 'my_docs|sqlite|What is TahuJS?');
console.log('Retrieved:', retrievedKnowledge);
```

## 🎯 Core Features

### Multi-Provider Support

TahuJS allows you to easily switch between different LLM providers:
-   **OpenRouter**: Access a wide range of models (Claude, GPT, Gemini, etc.) via a single API.
-   **OpenAI**: Direct integration with OpenAI's powerful models (GPT-3.5, GPT-4).
-   **Google Gemini**: Leverage Google's Gemini models directly.
-   **Ollama**: Connect to local or remote Ollama instances for running open-source models.

```javascript
// Example with different providers
const tahuGemini = createTahu({ provider: 'gemini', apiKey: 'YOUR_GEMINI_KEY', model: 'gemini-pro' });
const tahuOllama = createTahu({ provider: 'ollama', model: 'llama2', ollamaBaseUrl: 'http://localhost:11434' });
```

### Advanced Memory System

Agents in TahuJS can maintain conversation history and context across interactions.
-   **Volatile Memory**: In-memory history for short-term context.
-   **JSON Persistence**: Save agent conversations to local JSON files.
-   **SQLite Persistence**: Store agent memory in a SQLite database for more robust persistence.
-   **Configurable Size**: Limit the memory size to manage context window and costs.

```javascript
const persistentAgent = tahu.builder()
  .name('MyPersistentAgent')
  .systemPrompt('You remember everything I tell you.')
  .addMemory('sqlite', { maxMemorySize: 20 }) // Persist to SQLite
  .build();

await tahu.runAgent('MyPersistentAgent', 'My favorite color is blue.');
// Later...
const response = await tahu.runAgent('MyPersistentAgent', 'What is my favorite color?');
console.log(response.response); // "Your favorite color is blue."
```

### Knowledge Base & RAG (Retrieval Augmented Generation)

TahuJS enables you to "train" (ingest) your own custom knowledge and retrieve it for AI augmentation.
-   **`trainKnowledge`**: Add text data to a specified knowledge base.
-   **`retrieveKnowledge`**: Fetch relevant information from a knowledge base based on a query.
-   **Multiple Storage Options**:
    -   **SQLite**: Simple, file-based local storage.
    -   **ChromaDB**: Dedicated vector database (requires running a ChromaDB server).
    -   **Supabase (SQL/pgvector)**: For robust, scalable cloud-based vector storage (requires Supabase integration).

```javascript
// Train knowledge into a SQLite-backed knowledge base
await tahu.useTool('trainKnowledge', 'my_product_info|sqlite|Our new product features include real-time analytics and AI-powered recommendations.');
await tahu.useTool('trainKnowledge', 'my_product_info|sqlite|The product is available globally starting Q3 2024.');

// Retrieve relevant information from the knowledge base
const productFeatures = await tahu.useTool('retrieveKnowledge', 'my_product_info|sqlite|What are the key features of the new product?');
console.log('Product Features:', productFeatures);

// Example with ChromaDB (ensure ChromaDB server is running)
// await tahu.useTool('trainKnowledge', 'company_handbook|chroma|Our company values innovation and customer satisfaction.');
// const companyValues = await tahu.useTool('retrieveKnowledge', 'company_handbook|chroma|What are our company values?');
// console.log('Company Values:', companyValues);

// For Supabase (requires Supabase integration and pgvector setup)
// await tahu.useTool('trainKnowledge', 'user_data|supabase|User John Doe prefers dark mode and has subscribed to premium features.');
// const userData = await tahu.useTool('retrieveKnowledge', 'user_data|supabase|What are John Doe's preferences?');
// console.log('User Data:', userData);
```

### Tool Integration

TahuJS comes with a rich set of built-in tools and supports custom tool registration.
-   **Web Search (`webSearch`)**: Utilizes SerpApi, DuckDuckGo, and Google scraping with smart fallbacks.
-   **Location Search (`findLocation`)**: Finds locations with coordinate details, elevation, and map links (OpenStreetMap, Google Maps, Bing Maps, etc.), including QR code generation.
-   **Directions (`getDirections`)**: Provides travel routes between two points.
-   **Mathematical Calculations (`calculate`)**: Evaluates complex mathematical expressions.
-   **Web Scraping (`webScrape`)**: Extracts relevant content from web pages.
-   **Date & Time Information (`dateTime`)**: Gets current time in various time zones.
-   **Elevation (`getElevation`)**: Retrieves elevation data for specific geographic coordinates.
-   **Text Summarization (`summarizeText`)**: Summarizes long texts using the AI model.

```javascript
// Using a built-in tool
const searchResult = await tahu.useTool('webSearch', 'latest AI news');
console.log(searchResult);

// Registering a custom tool
tahu.registerTool('myCustomTool', {
  description: 'A custom tool that does something unique.',
  execute: async (input) => {
    return `Custom tool executed with: ${input}`;
  }
});
const customResult = await tahu.useTool('myCustomTool', 'hello world');
console.log(customResult);
```

## 🤖 Agent Templates

TahuJS provides pre-built specialist agents to kickstart your development:

```javascript
// Coding Assistant
const coder = tahu.createPrebuiltAgent('coder', { name: 'MyCoder' });
const code = await tahu.runAgent('MyCoder', 'Write a simple Python script for Fibonacci sequence.');

// Research Assistant
const researcher = tahu.createPrebuiltAgent('researcher', { name: 'MyResearcher' });
const research = await tahu.runAgent('MyResearcher', 'Summarize the impact of AI on education.');

// Writing Assistant
const writer = tahu.createPrebuiltAgent('writer', { name: 'MyWriter' });
const article = await tahu.runAgent('MyWriter', 'Draft a short blog post about sustainable living.');

// Data Analyst
const analyst = tahu.createPrebuiltAgent('analyst', { name: 'MyAnalyst' });
const analysis = await tahu.runAgent('MyAnalyst', 'Analyze the provided sales data and identify key trends.');
```

## 🔄 Multi-Agent Workflows

Orchestrate complex tasks by chaining multiple agents together, where the output of one agent becomes the input for another.

```javascript
tahu.createAgent('DataGatherer', { systemPrompt: 'Gathers raw data.' });
tahu.createAgent('ReportGenerator', { systemPrompt: 'Generates reports from data.' });

const workflow = tahu.createWorkflow([
  { agent: 'DataGatherer', task: 'collect_market_data' },
  { agent: 'ReportGenerator', task: 'create_summary_report', depends: ['collect_market_data'] }
]);

const workflowResults = await workflow.execute('Market trends for renewable energy.');
console.log('Final Workflow Results:', workflowResults);
```

## ⚡ Parallel & Batch Processing

Execute multiple LLM calls or agent tasks concurrently for improved efficiency.

```javascript
// Parallel execution of agent tasks
const parallelResults = await tahu.parallel([
  { agent: 'MyCoder', input: 'Explain recursion.' },
  { agent: 'MyResearcher', input: 'What is quantum computing?' }
]);
console.log('Parallel Results:', parallelResults.map(r => r.response));

// Simple batch processing of chat prompts
const batchResults = await tahu.batch([
  { prompt: 'Tell me a short story about a space cat.' },
  { prompt: 'List 5 benefits of meditation.' }
]);
console.log('Batch Results:', batchResults.map(r => r.response));
```

## 📊 Monitoring & Analytics

TahuJS includes a built-in analytics manager to track LLM usage, estimated costs, response times, and success rates.

```javascript
// Get real-time statistics
const stats = tahu.analytics.getStats();
console.log(`Total Tokens Used: ${stats.totalTokensUsed}`);
console.log(`Estimated Cost: $${stats.estimatedCost.toFixed(6)}`);
console.log(`Average Response Time: ${stats.averageResponseTimeMs.toFixed(2)} ms`);
console.log(`Success Rate: ${stats.successRate.toFixed(2)}%`);

// Reset stats
tahu.analytics.resetStats();
```

## 🔌 Plugin System

Extend TahuJS functionality by easily registering custom plugins. Plugins can add new tools, modify behavior, or integrate with external services.

```javascript
// Load pre-defined plugins
import { plugins } from 'tahujs';
tahu.use(plugins.tahuCryptoPlugin);
tahu.use(plugins.tahuSocialPlugin);

// Automatically load all plugins from a directory
tahu.loadPlugins('./src/plugins');
```

## 🎨 Agent Personalities

Define rich personalities for your agents, including traits, mood, expertise, and custom greetings.

```javascript
const creativeWriter = tahu.builder()
  .name('CreativeWriter')
  .systemPrompt('You are a highly imaginative and eloquent writer.')
  .addPersonality(
    ['imaginative', 'eloquent', 'expressive'],
    'inspired',
    ['storytelling', 'poetry', 'creative writing']
  )
  .build();

const story = await tahu.runAgent('CreativeWriter', 'Write a short story about a magical forest.');
console.log(story.response);
```

## 📋 Requirements

-   Node.js 18+
-   API key from your chosen LLM provider (OpenRouter, OpenAI, Google Gemini)
-   Ollama (optional, for local LLM models)
-   `better-sqlite3` (for SQLite memory persistence and knowledge base)
-   `chromadb` (optional, for ChromaDB vector store)
-   Supabase integration (optional, for Supabase vector store)

## 🔧 Configuration

Configure TahuJS programmatically:

```javascript
const config = {
  provider: 'openrouter', // 'openrouter', 'gemini', 'openai', 'ollama'
  apiKey: 'your-api-key', // Not needed for Ollama if running locally without auth
  model: 'anthropic/claude-3-sonnet', // Model name varies by provider
  embeddingModel: 'text-embedding-ada-002', // Recommended for knowledge base features
  temperature: 0.7,
  maxTokens: 2000,

  // Specific to OpenRouter
  httpReferer: 'your-website.com', // If configured in OpenRouter
  xTitle: 'Your App Name', // If configured in OpenRouter

  // Specific to Ollama
  ollamaBaseUrl: 'http://localhost:11434', // Default Ollama API URL
  
  // Optional service keys for enhanced features
  serpApiKey: 'your-serpapi-key', // Better web search
  googleMapsApiKey: 'your-google-maps-key', // Enhanced maps
  mapboxKey: 'your-mapbox-key', // Premium maps

  // For ChromaDB
  chromaDbUrl: 'http://localhost:8000', // Default ChromaDB server URL
  
  // For Supabase (requires Supabase integration)
  // supabaseUrl: process.env.SUPABASE_URL,
  // supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
};

const tahu = createTahu(config);
```

## 📖 Documentation

For more in-depth guides on installation, configuration, API usage, and code examples, please visit our comprehensive documentation:

*   **[Documentation in English](docs/en.md)**
*   **[Dokumentasi dalam Bahasa Indonesia](docs/id.md)**

## 🌟 Features Summary

### Core Capabilities
-   ✅ Multiple AI provider support (OpenRouter, OpenAI, Gemini, Ollama)
-   ✅ Intelligent model routing and fallback (for web search)
-   ✅ Built-in conversation memory (volatile, JSON, SQLite)
-   ✅ Function calling and extensive tool integration
-   ✅ Cost tracking and basic analytics
-   ✅ Robust error handling and configuration validation
-   ✅ Embedding generation (for RAG)

### Agent Framework
-   ✅ Multi-agent orchestration and workflows
-   ✅ Parallel and batch processing for LLM calls/agent tasks
-   ✅ Pre-built specialist agents
-   ✅ Agent builder for custom agent creation
-   ✅ Personality customization

### Knowledge Base (RAG)
-   ✅ Ingest custom text data for AI reference
-   ✅ Retrieve relevant information from knowledge bases
-   ✅ Multiple storage options: SQLite, ChromaDB, Supabase (via integration)

### Developer Experience
-   ✅ Modular and extensible design
-   ✅ Clear console logging with `chalk`
-   ✅ Automatic plugin discovery
-   ✅ Intuitive API

## 🗺️ Roadmap

### Current (v1.0)
-   ✅ Core agent framework
-   ✅ Multi-provider LLM integration (OpenRouter, OpenAI, Gemini, Ollama)
-   ✅ Comprehensive built-in tools (web search, maps, calculations, scraping, summarization)
-   ✅ Persistent memory (JSON, SQLite)
-   ✅ Multi-agent workflows, parallel, and batch processing
-   ✅ Plugin system
-   ✅ Real-time analytics
-   ✅ Knowledge Base (RAG) with SQLite and ChromaDB support

### Next (v1.1)
-   🔄 Enhanced agent communication protocols
-   🔄 More advanced memory types (e.g., dedicated vector stores for RAG)
-   🔄 Improved cost optimization strategies
-   🔄 Deeper integration with external data sources
-   🔄 Supabase (PostgreSQL with pgvector) integration for knowledge base

### Future (v2.0)
-   🔄 Multi-modal support (image, audio, video processing)
-   🔄 Advanced reasoning capabilities
-   🔄 Visual workflow builder (UI)
-   🔄 CLI tools for agent management and deployment

---

**Built with ❤️ for the AI developer community**

*TahuJS - Making AI development as easy as cooking instant noodles* 🍜