# TahuJS Documentation (English)

TahuJS is a powerful and flexible JavaScript framework for building AI-powered applications. It integrates various libraries and services to provide comprehensive AI functionalities.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Key Features](#key-features)
3.  [Tech Stack Overview](#tech-stack-overview)
4.  [Installation](#installation)
5.  [Configuration](#configuration)
6.  [Basic Usage](#basic-usage)
    *   [Creating a TahuJS Instance](#creating-a-tahujs-instance)
    *   [Performing AI Chat](#performing-ai-chat)
    *   [Using Tools](#using-tools)
    *   [Creating and Running AI Agents](#creating-and-running-ai-agents)
    *   [LangChain Integration](#langchain-integration)
7.  [Agent Builder](#agent-builder)
8.  [Multi-Agent Workflows](#multi-agent-workflows)
9.  [Parallel & Batch Processing](#parallel--batch-processing)
10. [Monitoring & Analytics](#monitoring--analytics)
11. [Plugin System](#plugin-system)
12. [Knowledge Base & RAG](#knowledge-base--rag)
13. [Built-in Tools List](#built-in-tools-list)
14. [Error Handling](#error-handling)
15. [Contributing](#contributing)
16. [License](#license)
17. [Roadmap](#roadmap)

---

# 🥘 TahuJS - Enhanced Version

Welcome to the enhanced version of TahuJS! This update brings significant improvements across core functionalities, making your AI application development even more powerful and reliable.

## Introduction

TahuJS is a JavaScript framework designed to streamline and accelerate the development of artificial intelligence-powered applications. By integrating various leading AI libraries and providing a robust set of built-in tools, TahuJS allows developers to focus on their application's core logic, rather than the complexities of AI integration.

Whether you aim to build intelligent agents that can interact dynamically, automate information retrieval from the web, analyze location data, or perform complex calculations, TahuJS provides a solid and easy-to-use foundation.

## Key Features

-   **🌐 Multi-AI Provider Support**: Seamlessly integrates with OpenRouter, OpenAI, Google Gemini, and Ollama.
-   **🔍 Enhanced Web Search**: 3-tier fallback system (SerpApi → DuckDuckGo → Google Scraping) for robust search.
-   **🗺️ Advanced Map Services**: Multiple map providers, QR code generation, elevation data, static maps, and multi-provider directions.
-   **🛠️ Comprehensive Built-in Tools**: A rich suite of tools for calculations, web scraping, date/time, and text summarization.
-   **🧠 Advanced Memory System**: Supports volatile, JSON file, and SQLite database persistence for agent memory.
-   **🤖 Powerful Agent Framework**: Create and manage AI agents with customizable personalities and capabilities.
-   **🔄 Multi-Agent Workflows**: Orchestrate sequences of agent tasks with dependencies.
-   **⚡ Parallel & Batch Processing**: Execute multiple LLM calls or agent tasks concurrently.
-   **📊 Real-time Monitoring & Analytics**: Track token usage, estimated costs, response times, and success rates.
-   **🔌 Flexible Plugin Architecture**: Easily extend TahuJS functionality through an auto-discoverable plugin system.
-   **✅ Configuration Validation**: Ensures essential API settings are correctly set up.
-   **📚 Knowledge Base (RAG)**: Ingest custom data and retrieve it for AI augmentation using SQLite, ChromaDB, or Supabase. **New**: Supports training from text, local files, and URLs.

## Tech Stack Overview

TahuJS is built on a foundation of modern and proven technologies:

*   **Core Language & Runtime:** JavaScript (ESM) running on Node.js.
*   **AI Orchestration:** LangChain.js (`@langchain/openai`, `@langchain/google-genai`, `langchain`, `@langchain/community`).
*   **LLM Providers:** OpenRouter, OpenAI, Google Gemini, Ollama.
*   **HTTP Requests:** Axios for all external API calls.
*   **Web Scraping:** Cheerio for HTML parsing.
*   **Mathematical Operations:** Math.js for calculations.
*   **Terminal Utilities:** `chalk` for colored console output and `qrcode-terminal` for generating QR codes.
*   **Search Services:** Custom `SearchService` (SerpApi, DuckDuckGo, Google scraping).
*   **Mapping & Location Services:** Custom `MapService` (OpenStreetMap Nominatim, StaticMap, Open-Elevation API, Mapbox).
*   **Configuration Management:** Custom `ConfigValidator`.
*   **Database:** `better-sqlite3` for SQLite memory persistence and knowledge base.
*   **Vector Database:** `chromadb` for ChromaDB integration, `@supabase/supabase-js` and `@langchain/supabase` for Supabase integration.

## Installation

To get started with TahuJS, follow these simple steps:

1.  **Ensure Node.js is Installed:** TahuJS requires Node.js version 18 or higher.
2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Cloud-Dark/tahujs.git
    cd tahujs
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Configure API Keys:** Set your API keys in environment variables or directly in your configuration when creating a TahuJS instance.
5.  **Run Examples:** Explore the `example/` folder to see how TahuJS can be used in real-world scenarios.

## Configuration

Customize TahuJS to fit your needs. It's recommended to use environment variables for API keys in production.

```javascript
const config = {
  // Required for most providers
  provider: 'openrouter', // 'openrouter', 'gemini', 'openai', 'ollama'
  apiKey: process.env.OPENROUTER_API_KEY, // Use environment variables for production
  
  // Optional AI settings
  model: 'anthropic/claude-3-sonnet', // Model name varies by provider
  embeddingModel: 'text-embedding-ada-002', // Recommended for knowledge base features
  temperature: 0.7, // Controls randomness (0.0 - 2.0)
  maxTokens: 2000, // Maximum tokens in the response

  // Specific to OpenRouter
  httpReferer: 'your-website.com', // If configured in OpenRouter
  xTitle: 'Your App Name', // If configured in OpenRouter

  // Specific to Ollama
  ollamaBaseUrl: 'http://localhost:11434', // Default Ollama API URL
  
  // Optional service keys for enhanced features
  serpApiKey: process.env.SERPAPI_KEY, // For better web search via SerpApi
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // For enhanced map features
  mapboxKey: process.env.MAPBOX_KEY, // For premium Mapbox features

  // For ChromaDB
  chromaDbUrl: 'http://localhost:8000', // Default ChromaDB server URL
  
  // For Supabase (requires Supabase integration)
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
};

import { createTahu } from 'tahujs';
const tahu = createTahu(config);
```

## Basic Usage

### Creating a TahuJS Instance

```javascript
import { createTahu } from 'tahujs';

const tahu = createTahu({
    provider: 'openrouter',
    apiKey: 'YOUR_API_KEY_HERE',
    model: 'google/gemini-2.0-flash-exp:free',
    serpApiKey: 'YOUR_SERPAPI_KEY', // If available
    embeddingModel: 'text-embedding-ada-002', // Required for knowledge base
});
```

### Performing AI Chat

```javascript
import { createTahu } from 'tahujs';

async function runChat() {
    const tahu = createTahu({ /* your config */ });
    const chatResult = await tahu.chat('Explain the concept of AI briefly.');
    console.log(chatResult.response);
}
runChat();
```

### Using Tools

```javascript
import { createTahu, tools } from 'tahujs';

async function useTools() {
    const tahu = createTahu({ /* your config */ });
    // Web Search
    const searchResult = await tahu.useTool(tools.webSearchTool.name, 'latest technology news');
    console.log('Web Search Result:', searchResult);

    // Mathematical Calculation
    const calcResult = await tahu.useTool(tools.calculateTool.name, '15 * 3 + (10 / 2)');
    console.log('Calculation Result:', calcResult);

    // Location Search
    const locationResult = await tahu.useTool(tools.findLocationTool.name, 'Eiffel Tower Paris');
    console.log('Location Info:', locationResult);

    // Directions
    const directionsResult = await tahu.useTool(tools.getDirectionsTool.name, 'from Monas to Ragunan Zoo');
    console.log('Directions:', directionsResult);

    // Elevation
    const elevationResult = await tahu.useTool(tools.getElevationTool.name, '-6.2088,106.8456'); // Jakarta coordinates
    console.log('Elevation:', elevationResult);

    // Web Scraping
    const scrapeResult = await tahu.useTool(tools.webScrapeTool.name, 'https://www.wikipedia.org');
    console.log('Web Scrape Result:', scrapeResult);

    // Date & Time
    const dateTimeResult = await tahu.useTool(tools.dateTimeTool.name, 'America/New_York');
    console.log('Date & Time:', dateTimeResult);

    // Summarize Text
    const longText = "This is a very long text that needs to be summarized. It contains a lot of information about various topics, and the purpose is to demonstrate how the summarization tool can work effectively. The longer the text, the more useful this tool becomes for extracting key points and presenting them in a more concise and digestible format. This is particularly helpful in scenarios where you are dealing with large documents, articles, or transcripts and just need a quick overview.";
    const summaryResult = await tahu.useTool(tools.summarizeTool.name, longText);
    console.log('Summary Result:', summaryResult);
}
useTools();
```

### Creating and Running AI Agents

```javascript
import { createTahu } from 'tahujs';

async function runAgentDemo() {
    const tahu = createTahu({ /* your config */ });
    const travelAgent = tahu.createAgent('TravelExpert', {
        systemPrompt: 'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.',
        capabilities: ['chat', 'search', 'location', 'directions'],
        memoryType: 'json', // Persist memory to a JSON file
        maxMemorySize: 5 // Keep last 5 interactions
    });

    const travelResult = await tahu.runAgent('TravelExpert', 'Plan a day trip to Bali. Find interesting places to visit and provide directions.');
    console.log('Travel Agent Result:', travelResult.response);

    // Use a pre-built agent
    const coderAgent = tahu.createPrebuiltAgent('coder', { name: 'MyCoderAgent' });
    const codeResult = await tahu.runAgent('MyCoderAgent', 'Write a simple JavaScript function to reverse a string.');
    console.log('Coder Agent Result:', codeResult.response);
}
runAgentDemo();
```

### LangChain Integration

TahuJS leverages LangChain.js under the hood, and you can directly create and use LangChain agents for more advanced scenarios.

```javascript
import { createTahu } from 'tahujs';

async function langchainIntegrationDemo() {
    const tahu = createTahu({
        provider: 'openrouter',
        apiKey: 'YOUR_API_KEY_HERE',
        model: 'google/gemini-2.0-flash-exp:free',
        serpApiKey: 'YOUR_SERPAPI_KEY'
    });

    const researchAgent = await tahu.createLangChainAgent(
        'You are a powerful research assistant. You can search the web, find locations, and perform calculations.'
    );

    const task = "Find the latest news about AI development in Indonesia, then find the location of Google Indonesia's headquarters and provide its Google Maps link.";
    const result = await researchAgent.invoke({ input: task });
    console.log('LangChain Agent Result:', result.output);
}
langchainIntegrationDemo();
```

## Agent Builder

The `AgentBuilder` provides a fluent API to construct and configure agents with various capabilities, personalities, and memory settings.

```javascript
import { createTahu, tools } from 'tahujs';

const tahu = createTahu({ /* your config */ });

const omniAgent = tahu.builder()
    .name('OmniAgent')
    .systemPrompt('You are an all-knowing AI assistant capable of performing any task using all available tools and remembering past interactions.')
    .addPersonality(['curious', 'analytical', 'helpful', 'creative'], 'optimistic', ['everything'])
    .addCapabilities(
        tools.webSearchTool.name, tools.calculateTool.name, tools.findLocationTool.name, 
        tools.getDirectionsTool.name, tools.getElevationTool.name, tools.webScrapeTool.name, 
        tools.dateTimeTool.name, tools.summarizeTool.name,
        tools.trainKnowledgeTool.name, tools.retrieveKnowledgeTool.name // New knowledge tools
    )
    .addMemory('sqlite', { maxMemorySize: 10 }) // Persist memory to SQLite
    .build();

console.log(`Agent '${omniAgent.name}' created. Memory Type: ${omniAgent.memoryType}`);
console.log('Capabilities:', omniAgent.capabilities.join(', '));

const omniResult = await tahu.runAgent('OmniAgent', 'What is the current price of Bitcoin, and what are the top social trends on Twitter?');
console.log('OmniAgent Response:', omniResult.response);
```

## Multi-Agent Workflows

Define and execute complex workflows where different agents collaborate on tasks, with dependencies between them.

```javascript
import { createTahu } from 'tahujs';

const tahu = createTahu({ /* your config */ });

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
```

## Parallel & Batch Processing

Efficiently handle multiple LLM calls or agent tasks simultaneously.

```javascript
import { createTahu } from 'tahujs';

const tahu = createTahu({ /* your config */ });

// Parallel execution of agent tasks or chat prompts
const parallelTasks = [
    { prompt: 'Explain quantum computing briefly.' },
    { prompt: 'What is the capital of France?' },
    { agent: 'MySmartResearcherJSON', input: 'Summarize the last research topic.' } // Assuming MySmartResearcherJSON agent exists
];
const parallelResults = await tahu.parallel(parallelTasks);
console.log('Parallel Results:', parallelResults.map(r => r.response || r));

// Simple batch processing of chat prompts
const batchPrompts = [
    { prompt: 'Tell a short story about a robot.' },
    { prompt: 'List 3 benefits of cloud computing.' },
    { prompt: 'What is the main purpose of blockchain?' }
];
const batchResults = await tahu.batch(batchPrompts);
console.log('Batch Results:', batchResults.map(r => r.response));
```

## Monitoring & Analytics

TahuJS provides real-time analytics to monitor your LLM usage and performance.

```javascript
import { createTahu } from 'tahujs';

const tahu = createTahu({ /* your config */ });

// After some LLM calls or agent runs
const stats = tahu.analytics.getStats();
console.log('📊 LLM Usage Statistics:');
console.log(`   Total Requests: ${stats.totalRequests}`);
console.log(`   Successful Requests: ${stats.successfulRequests}`);
console.log(`   Failed Requests: ${stats.failedRequests}`);
console.log(`   Success Rate: ${stats.successRate.toFixed(2)}%`);
console.log(`   Total Tokens Used: ${stats.totalTokensUsed}`);
console.log(`   Estimated Total Cost: $${stats.estimatedCost.toFixed(6)}`);
console.log(`   Total Response Time: ${stats.totalResponseTimeMs.toFixed(2)} ms`);
console.log(`   Average Response Time: ${stats.averageResponseTimeMs.toFixed(2)} ms`);

// You can also reset the statistics
// tahu.analytics.resetStats();
```

## Plugin System

Extend TahuJS by creating and loading custom plugins. Plugins can add new tools, modify behavior, or integrate with external services.

```javascript
import { createTahu, plugins } from 'tahujs';

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
*   **Supabase (PostgreSQL with pgvector)**:
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
git clone https://github.com/Cloud-Dark/tahujs.git
cd tahujs
npm install
# Run examples
node example/quick-start.js
node example/demo.js
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