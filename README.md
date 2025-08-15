# 🥘 TahuJS: Comprehensive AI Application Development Framework

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Cloud-Dark/tahu.js?style=social)](https://github.com/Cloud-Dark/tahu.js/stargazers)

**Documentation:** [English](./docs/en/installation.md) | [Bahasa Indonesia](./docs/id/installation.md)
**Examples:** [English](./docs/en/examples.md) | [Bahasa Indonesia](./docs/id/examples.md)

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

  const response = await tahu.chat('Hello Gemini, what is the capital of France?');
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

## 🚀 Quick Start

For detailed installation instructions and basic usage, please refer to the [Installation and Quick Start Guide](./docs/en/installation.md) (English) or [Panduan Instalasi dan Mulai Cepat](./docs/id/installation.md) (Bahasa Indonesia).

For comprehensive code examples across different LLM providers, visit the [Examples section](./docs/en/examples.md) (English) or [Bagian Contoh](./docs/id/examples.md) (Bahasa Indonesia).
