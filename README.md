# 🥘 TahuJS: Comprehensive AI Application Development Framework

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Cloud-Dark/tahu.js?style=social)](https://github.com/Cloud-Dark/tahu.js/stargazers)

**Documentation:** [English](./docs/en/introduction.md) | [Bahasa Indonesia](./docs/id/introduction.md)
**Examples:** [English](./docs/en/examples.md) | [Bahasa Indonesia](./docs/id/examples.md)

**The Ultimate Node.js Library for AI Agents & LLM Integration**

Build powerful AI agents in minutes, not hours. TahuJS provides a simple, fast, and flexible way to create intelligent applications using OpenRouter, Gemini, OpenAI, Ollama, and other leading AI providers.

```javascript
import { createTahu } from 'tahu.js';

// Create an AI agent in a few lines
const tahu = createTahu({
  provider: 'openrouter',
  apiKey: 'YOUR_API_KEY',
  model: 'google/gemini-2.0-flash-exp:free',
});

const simpleAgent = tahu
  .builder()
  .name('SimpleAssistant')
  .systemPrompt('You are a friendly and helpful AI assistant.')
  .addCapabilities('chat', 'calculate')
  .build();

const response = await tahu.runAgent(
  'SimpleAssistant',
  'What is 150 divided by 3 minus 10?'
);
console.log(response.response);
```

## ✨ Why TahuJS?

- **🚀 Plug & Play**: Zero-config setup for basic usage, works out of the box.
- **⚡ Optimized Performance**: Designed for speed with efficient LLM calls and tool execution.
- **💰 Cost Awareness**: Basic analytics for tracking token usage and estimated costs.
- **🔧 Developer First**: Intuitive API, modular design, and clear logging.
- **🌍 Multi-Provider**: Seamless integration with OpenRouter, OpenAI, Google Gemini, and Ollama (local).
- **🤖 Agent Framework**: Build complex multi-agent workflows with persistent memory.
- **📊 Production Ready**: Robust error handling, configuration validation, and real-time analytics.

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
const coder = tahu
  .builder()
  .name('CodeAssistant')
  .systemPrompt('You are an expert JavaScript developer.')
  .addCapabilities(tools.calculateTool.name, tools.webSearchTool.name)
  .addMemory('json', { maxMemorySize: 5, memoryPath: './coder_memory.json' })
  .build();

const codeResult = await tahu.runAgent(
  'CodeAssistant',
  'Write a simple Express.js server that returns "Hello World" on /.'
);
console.log(codeResult.response);

// Use a built-in tool directly
const calcResult = await tahu.useTool('calculate', '15 * 3 + (10 / 2)');
console.log('Calculation Result:', calcResult);

// Load a plugin and use its tool
tahu.use(plugins.tahuCryptoPlugin);
const cryptoPrice = await tahu.useTool('cryptoPrice', 'BTC');
console.log('Bitcoin Price:', cryptoPrice);

// Train custom knowledge
await tahu.useTool(
  'trainKnowledge',
  'my_docs|sqlite|TahuJS is a comprehensive AI framework.'
);
const retrievedKnowledge = await tahu.useTool(
  'retrieveKnowledge',
  'my_docs|sqlite|What is TahuJS?'
);
console.log('Retrieved:', retrievedKnowledge);
```

### Provider-Specific Quick Start Guides

For quick start examples tailored to each LLM provider, refer to the following:

*   [Gemini Quick Start](example/gemini/quick-start.js)
*   [Ollama Quick Start](example/ollama/quick-start.js)
*   [OpenAI Quick Start](example/openai/quick-start.js)
*   [OpenRouter Quick Start](example/openrouter/quick-start.js)
