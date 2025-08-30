# 🥘 TahuJS: Comprehensive AI Application Development Framework

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Cloud-Dark/tahu.js?style=social)](https://github.com/Cloud-Dark/tahu.js/stargazers)

**Documentation:** [English](./docs/en.md) | [Bahasa Indonesia](./docs/id.md)

**The Ultimate Node.js Library for AI Agents & LLM Integration**

Build powerful AI agents in minutes, not hours. TahuJS provides a simple, fast, and flexible way to create intelligent applications using OpenRouter, Gemini, OpenAI, Ollama, and other leading AI providers.

```javascript
import { createTahu } from 'tahu.js';

async function runGeminiChat() {
  const tahu = createTahu({
    provider: 'gemini',
    apiKey: 'YOUR_GEMINI_API_KEY', // Replace with your actual Gemini API key
    model: 'gemini-1.5-flash', // Or 'gemini-1.0-pro'
  });

  const response = await tahu.chat(
    'Hello Gemini, what is the capital of France?'
  );
  console.log(response.response);
}
runGeminiChat();
```

## ✨ Why TahuJS?

- **🚀 Plug & Play**: Zero-config setup for basic usage, works out of the box.
- **⚡ Optimized Performance**: Designed for speed with efficient LLM calls and tool execution.
- **💰 Cost Awareness**: Basic analytics for tracking token usage and estimated costs.
- **🔧 Developer First**: Intuitive API, modular design, and clear logging.
- **🌍 Multi-Provider**: Seamless integration with OpenRouter, OpenAI, Google Gemini, and Ollama (local).
- **🤖 Agent Framework**: Build complex multi-agent workflows with persistent memory.
- **📊 Production Ready**: Robust error handling, configuration validation, and real-time analytics.
- **👁️ OCR Support**: Extract text from images and PDF documents.
- **🧠 NLP Integration**: Built-in natural language processing with sentiment analysis, intent recognition, and entity extraction.
- **🖼️ Image Analysis**: Advanced image processing with color extraction, quality assessment, and visual analysis.
- **💻 Safe Code Execution**: Execute JavaScript, Python, Bash, and PowerShell code in a sandboxed environment.
- **⏰ Task Scheduling**: Cron-based task scheduling and management system.
- **🔌 Extensible Plugin System**: Modular architecture with crypto, finance, social, and NLP plugins.

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

Here's a minimal example to get TahuJS running:

```javascript
import { createTahu } from 'tahu.js';

async function runHelloWorld() {
  const tahu = createTahu({
    provider: 'gemini', // or 'openrouter', 'openai', 'ollama'
    apiKey: 'YOUR_API_API_KEY', // Replace with your actual API key
    model: 'gemini-1.5-flash', // Or your preferred model
    debug: false, // Set to true to enable detailed logging
  });

  const chatResult = await tahu.chat('Hello TahuJS, how are you?');
  console.log(chatResult.response);
}
runHelloWorld();
```

### 🔧 Debug Mode & Logging

TahuJS includes a powerful debug mode that provides detailed logging for troubleshooting and development:

```javascript
const tahu = createTahu({
  provider: 'gemini',
  apiKey: 'YOUR_API_KEY',
  debug: true, // Enable debug mode
});
```

**When debug mode is enabled (`debug: true`):**
- ✅ Detailed initialization logs
- ✅ Plugin loading and installation logs
- ✅ Tool execution and error logs  
- ✅ LLM API calls and responses
- ✅ Memory management operations
- ✅ Vector store operations

**When debug mode is disabled (`debug: false`, default):**
- ❌ No internal logging (cleaner output)
- ✅ Only critical errors shown
- ✅ Better performance for production

**Debug Logging Levels:**
- `[DEBUG]` - General debug information
- `[INFO]` - Important system information
- `[WARN]` - Warning messages
- `[ERROR]` - Error messages

## 🆕 New Features in v3.5.0+

### Natural Language Processing

```javascript
import { createTahu, TahuNLPPlugin } from 'tahu.js';

const tahu = createTahu({ provider: 'gemini', apiKey: 'your-key' });
const nlpPlugin = new TahuNLPPlugin();
await tahu.use(nlpPlugin);

// Sentiment analysis
const sentiment = await tahu.useTool('analyzeSentiment', {
  text: 'I love this framework!',
});
console.log(sentiment.vote); // 'positive'

// Intent recognition
const intent = await tahu.useTool('recognizeIntent', {
  text: 'Book a flight to London',
});
console.log(intent.intent); // 'booking'
```

### Advanced Agent Types

```javascript
// Create specialized agents
const nlpAgent = tahu.createPrebuiltAgent('nlp', {
  name: 'TextAnalyzer',
});

const coderAgent = tahu.createPrebuiltAgent('coder', {
  name: 'CodeExpert',
  capabilities: ['chat', 'search', 'codeExecution'],
});

const supportAgent = tahu.createPrebuiltAgent('support', {
  name: 'CustomerHelper',
});
```

### Image Analysis

```javascript
const analysis = await tahu.useTool('imageAnalysis', {
  imagePath: './image.jpg',
  analysisType: 'full',
  extractPalette: true,
  colorCount: 5,
});

console.log(analysis.analysis.colors.dominant.hex); // #ff5733
console.log(analysis.analysis.quality.overall); // 'Excellent'
```

### Safe Code Execution

```javascript
const result = await tahu.useTool('codeExecution', {
  language: 'python',
  code: `
    import math
    result = math.sqrt(16) + math.pi
    print(f"Result: {result:.2f}")
  `,
});

console.log(result.output); // "Result: 7.14"
```

### Task Scheduling

```javascript
const task = await tahu.useTool('scheduler', {
  action: 'schedule',
  taskName: 'Daily Report',
  cronPattern: '0 9 * * *', // Daily at 9 AM
  taskFunction: 'generateReport',
});

console.log(`Task scheduled: ${task.taskId}`);
```

For more detailed examples and provider-specific guides, please refer to the [Documentation](./docs/en.md) (English) or [Dokumentasi](./docs/id.md) (Bahasa Indonesia).
