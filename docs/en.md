# TahuJS Documentation

This document provides comprehensive information about TahuJS, a powerful Node.js framework for building AI applications.

## Introduction

TahuJS is a JavaScript framework designed to streamline and accelerate the development of artificial intelligence-powered applications. By integrating various leading AI libraries and providing a robust set of built-in tools, TahuJS allows developers to focus on their application's core logic, rather than the complexities of AI integration.

Whether you aim to build intelligent agents that can interact dynamically, automate information retrieval from the web, analyze location data, or perform complex calculations, TahuJS provides a solid and easy-to-use foundation.

## Installation and Quick Start

To get started with TahuJS, follow these simple steps:

1.  **Ensure Node.js is Installed:** TahuJS requires Node.js version 18 or higher.
2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Cloud-Dark/tahu.js.git
    cd tahu.js
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Configure API Keys:** Set your API keys in environment variables or directly in your configuration when creating a TahuJS instance.

### Basic Usage (Hello World)

Here's a minimal example to get TahuJS running:

```javascript
import { createTahu } from 'tahu.js';

async function runHelloWorld() {
  const tahu = createTahu({
    provider: 'openrouter', // or 'openai', 'gemini', 'ollama'
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual API key
    model: 'google/gemini-2.0-flash-exp:free', // Or your preferred model
  });

  const chatResult = await tahu.chat('Hello TahuJS, how are you?');
  console.log(chatResult.response);
}
runHelloWorld();
```

## Plugin System

Extend TahuJS by creating and loading custom plugins. Plugins can add new tools, modify behavior, or integrate with external services.

```javascript
import { createTahu, plugins } from 'tahu.js';

const tahu = createTahu({
  /* your config */
});

// Manually load a specific plugin
tahu.use(plugins.tahuCryptoPlugin);
const cryptoPrice = await tahu.useTool('cryptoPrice', 'ETH');
console.log(cryptoPrice);

// Automatically load all plugins from a directory
tahu.loadPlugins('./src/plugins');
```

## Roadmap

### Current (v2.0)

- ✅ Core agent framework
- ✅ Multi-provider LLM integration (OpenRouter, OpenAI, Gemini, Ollama)
- ✅ Comprehensive built-in tools (web search, maps, calculations, scraping, summarization, OCR)
- ✅ Persistent memory (JSON, SQLite)
- ✅ Multi-agent workflows, parallel, and batch processing
- ✅ Plugin system
- ✅ Real-time analytics
- ✅ Knowledge Base (RAG) with SQLite, ChromaDB, and Supabase support
- ✅ Enhanced agent communication protocols
- ✅ More advanced memory types (e.g., dedicated vector stores for RAG)
- ✅ Improved cost optimization strategies
- ✅ Deeper integration with external data sources
- ✅ Supabase (PostgreSQL with pgvector) integration for knowledge base
- ✅ Multi-modal support (image, audio, video processing)
- ✅ Advanced reasoning capabilities
- ✅ Visual workflow builder (UI)
- ✅ CLI tools for agent management and deployment

### Future (v3.0)

- 🔄 _Define your next big features here!_

## Examples

This section provides a comprehensive overview of TahuJS examples, categorized by LLM provider.

### Gemini Examples

This section provides examples for using TahuJS with Gemini.

#### Quick Start

A simple example to get started with Gemini.

[View Quick Start Example](<../example/gemini/quick-start.js>)

#### Comprehensive Demo

A more comprehensive demonstration of TahuJS features with Gemini.

[View Comprehensive Demo](<../example/gemini/demo.js>)

### Ollama Examples

This section provides examples for using TahuJS with Ollama.

#### Quick Start

A simple example to get started with Ollama.

[View Quick Start Example](<../example/ollama/quick-start.js>)

#### Comprehensive Demo

A more comprehensive demonstration of TahuJS features with Ollama.

[View Comprehensive Demo](<../example/ollama/demo.js>)

### OpenAI Examples

This section provides examples for using TahuJS with OpenAI.

#### Quick Start

A simple example to get started with OpenAI.

[View Quick Start Example](<../example/openai/quick-start.js>)

#### Comprehensive Demo

A more comprehensive demonstration of TahuJS features with OpenAI.

[View Comprehensive Demo](<../example/openai/demo.js>)

### OpenRouter Examples

This section provides examples for using TahuJS with OpenRouter.

#### Quick Start

A simple example to get started with OpenRouter.

[View Quick Start Example](<../example/openrouter/quick-start.js>)

#### Comprehensive Demo

A more comprehensive demonstration of TahuJS features with OpenRouter.

[View Comprehensive Demo](<../example/openrouter/demo.js>)

## Built-in Tools

TahuJS comes with a set of powerful built-in tools that can be used by agents or directly.

### OCR Tool

The OCR tool allows you to extract text from image and PDF files.

```javascript
import { createTahu } from '../../src/tahu.js';
import path from 'path';
import process from 'process'; // Import process for process.cwd()

async function runOcrExample() {
  const tahu = createTahu({
    provider: 'openrouter', // You can use 'gemini', 'ollama', 'openai', or 'openrouter'
    apiKey: 'YOUR_API_KEY',
    model: 'google/gemini-2.0-flash-exp:free', // Or your preferred model for the chosen provider
    tools: {
      enabled: ['ocr'], // Enable only the OCR tool
    },
  });

  try {
    console.log('\n--- OCR Tool Example ---');
    const imagePath = path.join(process.cwd(), 'example', 'gemini', 'sample.png'); // Path to your image/PDF
    // For a real test, replace 'sample.png' with an image/PDF containing text.
    // You might need to install 'tesseract.js' language data for specific languages.
    const extractedText = await tahu.useTool('ocr', imagePath);
    console.log('Extracted Text:', extractedText);
  } catch (error) {
    console.error('❌ OCR Example Error:', error.message);
  }
}
runOcrExample();
```
