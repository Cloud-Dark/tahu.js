# 🥘 TahuJS: Comprehensive AI Application Development Framework

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Cloud-Dark/tahu.js?style=social)](https://github.com/Cloud-Dark/tahu.js/stargazers)

**The Ultimate Node.js Library for AI Agents & LLM Integration**

Build powerful AI agents in minutes, not hours. TahuJS provides a simple, fast, and flexible way to create intelligent applications using OpenRouter, Gemini, OpenAI, Ollama, and other leading AI providers.

```javascript
import { createTahu } from 'tahu.js';

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
git clone https://github.com/Cloud-Dark/tahu.js.git
cd tahu.js

# Install all necessary dependencies
npm install
```

### Basic Usage

```javascript
import { createTahu, tools, plugins } from 'tahu.js';

// Initialize with your API keys
const tahu = createTahu({
  provider: 'openrouter', // or 'openai', 'gemini', 'ollama'
  apiKey: process.env.OPENROUTER_API_KEY, // Use environment variables for production
  model: 'google/gemini-2.0-flash-exp:free',
  embeddingModel: 'text-embedding-ada-002', // Required for knowledge base features
  // ollamaBaseUrl: 'http://localhost:11434', // Only if using local Ollama
  // serpApiKey: process.env.SERPAPI_KEY, // Optional, for better web search
  // chromaDbUrl: 'http://localhost:8000', // Optional, for ChromaDB
  // supabaseUrl: process.env.SUPABASE_URL, // Optional, for Supabase
  // supabaseAnonKey: process.env.SUPABASE_ANON_KEY, // Optional, for Supabase
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
// You need to set `supabaseUrl` and `supabaseAnonKey` in your TahuJS config.
// Also, ensure your Supabase database has the `pgvector` extension enabled
// and a table like `documents` with `content` (text) and `embedding` (vector) columns.
// Example table creation SQL:
// CREATE EXTENSION IF NOT EXISTS vector;
// CREATE TABLE documents (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   content text,
//   embedding vector(1536) -- Adjust dimension based on your embedding model
// );
// CREATE OR REPLACE FUNCTION match_documents (
//   query_embedding vector(1536),
//   match_threshold float,
//   match_count int
// )
// RETURNS TABLE (
//   id uuid,
//   content text,
//   similarity float
// )
// LANGUAGE plpgsql
// AS $$
// BEGIN
//   RETURN QUERY
//   SELECT
//     documents.id,
//     documents.content,
//     1 - (documents.embedding <=> query_embedding) AS similarity
//   FROM documents
//   WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
//   ORDER BY similarity DESC
//   LIMIT match_count;
// END;
// $$;
await tahu.useTool('trainKnowledge', 'user_data|supabase|Customers love TahuJS speed and ease of use.');
const userData = await tahu.useTool('retrieveKnowledge', 'user_data|supabase|What do customers like about TahuJS?');
console.log('User Data:', userData);
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

## Multi-Agent Workflows

Define and execute complex workflows where different agents collaborate on tasks, with dependencies between them.

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

## Parallel & Batch Processing

Efficiently handle multiple LLM calls or agent tasks simultaneously.

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
  { prompt: 'List 5 benefits of cloud computing.' },
  { prompt: 'What is the main purpose of blockchain?' }
]);
console.log('Batch Results:', batchResults.map(r => r.response));
```

## Monitoring & Analytics

TahuJS provides real-time analytics to monitor your LLM usage and performance.

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

## Plugin System

Extend TahuJS by creating and loading custom plugins. Plugins can add new tools, modify behavior, or integrate with external services.

```javascript
import { createTahu, plugins } from 'tahu.js';

const tahu = createTahu({ /* your config */ });

// Manually load a specific plugin
tahu.use(plugins.tahuCryptoPlugin);
const cryptoPrice = await tahu.useTool('cryptoPrice', 'ETH');
console.log(cryptoPrice);

// Automatically load all plugins from a directory
tahu.loadPlugins('./src/plugins');
```

## Knowledge Base & RAG

TahuJS allows you to "train" (ingest) your own custom knowledge and retrieve it for AI augmentation. This is crucial for providing your AI with up-to-date or domain-specific information beyond its initial training data.

### How it Works:
1.  **Ingestion (`trainKnowledge`)**: You provide text data. TahuJS converts this text into numerical representations called "embeddings" using an embedding model. These embeddings, along with the original text, are stored in a chosen vector store.
2.  **Retrieval (`retrieveKnowledge`)**: When you have a query, TahuJS converts the query into an embedding and searches the vector store for the most semantically similar pieces of stored knowledge.
3.  **Augmentation**: The retrieved knowledge can then be passed to an LLM as context, allowing it to generate more informed and accurate responses.

### Tools:
*   **`trainKnowledge`**:
    *   **Description**: Adds text data to a specified knowledge base for later retrieval.
    *   **Input Format**: `"knowledgeBaseName|storeType|source_type|source_data"`
    *   **Supported Store Types**: `sqlite`, `chroma`, `supabase`
    *   **Supported Source Types**: `text`, `file`, `url`
    *   **Examples**:
        *   `"my_docs|sqlite|text|This is a document about TahuJS features."`
        *   `"my_docs|sqlite|file|/path/to/your/knowledge.txt"`
        *   `"my_docs|sqlite|url|https://example.com/knowledge.txt"`
*   **`retrieveKnowledge`**:
    *   **Description**: Retrieves relevant information from a specified knowledge base.
    *   **Input Format**: `"knowledgeBaseName|storeType|query_text|k"` (k is optional, default 3)
    *   **Supported Store Types**: `sqlite`, `chroma`, `supabase`
    *   **Example**: `"my_docs|sqlite|What are TahuJS features?|2"`

### Storage Options:
*   **SQLite**:
    *   **Type**: `sqlite`
    *   **Description**: A simple, file-based local database. Ideal for small to medium-sized knowledge bases or local development. No external server required.
    *   **Configuration**: Automatically uses a `.sqlite` file in the `memory` directory.
*   **ChromaDB**:
    *   **Type**: `chroma`
    *   **Description**: A dedicated open-source vector database. Suitable for larger knowledge bases and more efficient similarity searches. Requires running a separate ChromaDB server.
    *   **Configuration**: Set `chromaDbUrl` in TahuJS config (default `http://localhost:8000`).
    *   **Setup**: You need to run a ChromaDB instance. Refer to [ChromaDB documentation](https://www.trychroma.com/) for installation.
*   **Supabase (PostgreSQL dengan pgvector)**:
    *   **Type**: `supabase`
    *   **Description**: A powerful, scalable cloud-based PostgreSQL database with `pgvector` extension for vector storage. Ideal for production applications requiring robust data management and scalability.
    *   **Configuration**: Requires `supabaseUrl` and `supabaseAnonKey` in TahuJS config.
    *   **Setup**: You need to set up a Supabase project, enable the `pgvector` extension, and configure your tables. See example SQL in the "Basic Usage" section above.

## Built-in Tools List

TahuJS comes with the following pre-registered tools:

*   **`webSearch`**: Search the web using multiple search engines (SerpApi, DuckDuckGo, Google Scraping).
*   **`calculate`**: Perform mathematical calculations and expressions.
*   **`findLocation`**: Find location using multiple map services with links and QR codes.
*   **`getDirections`**: Get directions between two locations. Input format: "from [origin] to [destination]".
*   **`getElevation`**: Gets the elevation data for a specific geographic coordinate. Input format: "latitude,longitude".
*   **`webScrape`**: Extract content from web pages.
*   **`dateTime`**: Get current date and time information for a specified timezone.
*   **`summarizeText`**: Summarize a given text using the AI model.
*   **`trainKnowledge`**: Add text data to a specified knowledge base. Supports `text`, `file`, and `url` sources.
*   **`retrieveKnowledge`**: Retrieve relevant information from a specified knowledge base.

## Error Handling

TahuJS provides robust error handling for LLM calls and tool executions, giving informative messages to help diagnose issues.

## Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/Cloud-Dark/tahu.js.git
cd tahu.js
npm install
# Run examples
node example/quick-start.js
node example/demo.js
node example/test_rag.js
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🗺️ Roadmap

### Current (v2.0)
-   ✅ Core agent framework
-   ✅ Multi-provider LLM integration (OpenRouter, OpenAI, Gemini, Ollama)
-   ✅ Comprehensive built-in tools (web search, maps, calculations, scraping, summarization)
-   ✅ Persistent memory (JSON, SQLite)
-   ✅ Multi-agent workflows, parallel, and batch processing
-   ✅ Plugin system
-   ✅ Real-time analytics
-   ✅ Knowledge Base (RAG) with SQLite, ChromaDB, and Supabase support
-   ✅ Enhanced agent communication protocols
-   ✅ More advanced memory types (e.g., dedicated vector stores for RAG)
-   ✅ Improved cost optimization strategies
-   ✅ Deeper integration with external data sources
-   ✅ Supabase (PostgreSQL with pgvector) integration for knowledge base
-   ✅ Multi-modal support (image, audio, video processing)
-   ✅ Advanced reasoning capabilities
-   ✅ Visual workflow builder (UI)
-   ✅ CLI tools for agent management and deployment

### Future (v3.0)
-   🔄 *Define your next big features here!*

---

**Built with ❤️ for the AI developer community**

*TahuJS - Making AI development as easy as cooking instant noodles* 🍜