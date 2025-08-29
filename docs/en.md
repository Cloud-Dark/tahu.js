# TahuJS Documentation

This document provides comprehensive information about TahuJS, a powerful Node.js framework for building AI applications.

## Introduction

TahuJS is a comprehensive JavaScript framework designed to streamline and accelerate the development of artificial intelligence-powered applications. By integrating various leading AI providers (OpenRouter, Gemini, OpenAI, Ollama) and providing a robust set of built-in tools, TahuJS allows developers to focus on their application's core logic, rather than the complexities of AI integration.

Whether you aim to build intelligent agents, chatbots, automate information retrieval from the web, analyze images and documents with OCR, perform natural language processing, execute code safely, schedule tasks, or perform complex calculations, TahuJS provides a solid and easy-to-use foundation.

## Key Features

- **🚀 Multi-Provider Support**: Seamless integration with OpenRouter, OpenAI, Google Gemini, and Ollama
- **🤖 Advanced Agent System**: Create specialized agents for different tasks (coder, writer, analyst, NLP, etc.)
- **🧠 Natural Language Processing**: Built-in NLP capabilities with sentiment analysis, intent recognition, and entity extraction
- **🖼️ Image Analysis**: Advanced image processing with color extraction, quality assessment, and visual analysis
- **💻 Safe Code Execution**: Execute JavaScript, Python, Bash, and PowerShell code in a sandboxed environment
- **⏰ Task Scheduling**: Cron-based task scheduling and management system
- **📊 OCR & Document Analysis**: Extract text and analyze documents and images
- **🔧 Extensive Plugin System**: Modular architecture with crypto, finance, social, and NLP plugins
- **📈 Analytics & Monitoring**: Built-in usage analytics and performance tracking
- **💾 Multiple Memory Types**: Support for volatile, JSON, and SQLite-based agent memory

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

## Available Plugins

TahuJS comes with several built-in plugins that extend its functionality:

### TahuNLP Plugin
Natural Language Processing capabilities including:
- Sentiment analysis
- Intent recognition
- Entity extraction
- Language detection
- Text classification

```javascript
import { TahuNLPPlugin } from 'tahu.js';

const nlpPlugin = new TahuNLPPlugin();
await tahu.use(nlpPlugin);

// Use NLP tools
const sentiment = await tahu.useTool('analyzeSentiment', { 
  text: 'I love this framework!' 
});
console.log(sentiment.vote); // 'positive'
```

### Crypto Plugin
Cryptocurrency utilities and tools.

### Finance Plugin
Financial calculations and market data tools.

### Social Plugin
Social media integration and analysis tools.

### Currency Plugin
Currency conversion and exchange rate tools.

## Advanced Tools

### Image Analysis Tool
Analyze images for colors, dimensions, quality, and visual characteristics:

```javascript
const analysis = await tahu.useTool('imageAnalysis', {
  imagePath: './image.jpg',
  analysisType: 'full',
  extractPalette: true,
  colorCount: 5
});
```

### Code Execution Tool
Safely execute code in multiple languages:

```javascript
const result = await tahu.useTool('codeExecution', {
  language: 'python',
  code: 'print("Hello from Python!")',
  timeout: 30000
});
```

### Task Scheduler Tool
Schedule and manage recurring tasks:

```javascript
const task = await tahu.useTool('scheduler', {
  action: 'schedule',
  taskName: 'Daily Report',
  cronPattern: '0 9 * * *', // Daily at 9 AM
  taskFunction: 'generateReport'
});
```

## Enhanced Agent Types

TahuJS now supports additional pre-built agent types:

- **coder**: Expert software engineer
- **writer**: Creative content writer
- **analyst**: Data analyst and researcher
- **researcher**: Information research specialist
- **nlp**: Natural language processing expert
- **translator**: Multilingual translation expert
- **chatbot**: Friendly conversational agent
- **support**: Customer support specialist

```javascript
// Create specialized agents
const nlpAgent = tahu.createPrebuiltAgent('nlp', {
  name: 'TextAnalyzer',
  memoryType: 'sqlite'
});

const coderAgent = tahu.createPrebuiltAgent('coder', {
  name: 'CodeExpert',
  capabilities: ['chat', 'search', 'codeExecution']
});
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

This section provides a comprehensive overview of TahuJS examples, categorized by LLM provider and functionality.

### OCR and Document Analysis Examples

This section provides examples for using TahuJS's OCR and document analysis capabilities.

*   **Analyze CVs**: Demonstrates how to use `cv_analyzer` to extract structured information from CV files.
    [View Example](<../example/ocr_test/analyze_cvs.js>)
*   **Analyze Images**: Shows how to perform OCR on image files using `ocr_advanced`.
    [View Example](<../example/ocr_test/analyze_images.js>)
*   **Analyze PDFs**: Illustrates how to extract text from PDF files using `pdf_analyzer` and refine it with AI.
    [View Example](<../example/ocr_test/analyze_pdfs.js>)

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

### OCR and Document Analysis Tools

TahuJS provides advanced tools for Optical Character Recognition (OCR) and document analysis, enabling your AI agents to extract and understand text from various file formats.

*   **`ocr_advanced`**: Performs flexible, multi-stage OCR on image files (PNG, JPG, JPEG, BMP, GIF). It can extract raw text and optionally use an AI to enhance and format the results.
*   **`pdf_analyzer`**: Extracts all text content from PDF files. This tool is essential for processing text-based PDFs and can be combined with AI for further analysis.
*   **`cv_analyzer`**: Specifically designed to analyze CV (Curriculum Vitae) files, extracting structured information such as name, contact details, summary, skills, experience, and education. It leverages both PDF and OCR capabilities.

### Other Built-in Tools

(This section will be populated with other tools like web search, maps, calculations, etc.)
