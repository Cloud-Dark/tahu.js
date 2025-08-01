# 🥘 TahuJS: Comprehensive AI Application Development Framework

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Cloud-Dark/tahujs?style=social)](https://github.com/Cloud-Dark/tahujs/stargazers)

Welcome to **TahuJS**! A JavaScript framework designed to simplify and accelerate the development of Artificial Intelligence (AI) powered applications. With TahuJS, you can easily integrate Large Language Models (LLMs), leverage a variety of built-in tools, and build intelligent and dynamic AI agents.

Our focus is on providing an exceptional backend development experience, allowing you to concentrate on your application's core logic, rather than the complexities of AI integration.

## ✨ Why Choose TahuJS?

*   **Multi-LLM Provider Support**: Flexibility to choose your favorite LLM provider, including **OpenRouter**, **OpenAI**, **Google Gemini**, and **Ollama** (local).
*   **Powerful Built-in Tools**: Equipped with tools for web search (with smart fallbacks), advanced map services (location, directions, elevation, QR Code), calculations, web scraping, and date/time information.
*   **Advanced Agent Orchestration**: Build intelligent AI agents with persistent memory management (JSON/SQLite), multi-agent workflows, and parallel processing capabilities.
*   **Flexible Plugin Architecture**: Easily extend TahuJS functionality through an auto-discoverable plugin system.
*   **Optimal Developer Experience**: Designed for ease of use, with clear logging and robust error handling.

## 🚀 Quick Start

Follow these simple steps to get your TahuJS project up and running:

### 1. Installation

Ensure you have **Node.js version 18 or higher** installed on your system.

```bash
# Clone the TahuJS repository
git clone https://github.com/Cloud-Dark/tahujs.git
cd tahujs

# Install all necessary dependencies
npm install
```

### 2. API Key Configuration

TahuJS requires API keys to interact with LLM providers and other external services. You can set them when creating a TahuJS instance.

Basic configuration example:

```javascript
const config = {
  provider: 'openrouter', // Choose 'openrouter', 'openai', 'gemini', or 'ollama'
  apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual API key
  model: 'google/gemini-2.0-flash-exp:free', // The LLM model you want to use
  // ollamaBaseUrl: 'http://localhost:11434', // Only if using local Ollama
  // serpApiKey: 'YOUR_SERPAPI_KEY', // Optional, for better web search
  // googleMapsApiKey: 'YOUR_GOOGLE_MAPS_KEY' // Optional, for enhanced map features
};
```

### 3. Run the `quick-start.js` Example

This file will give you a quick overview of how to use TahuJS for AI chat and built-in tools.

```bash
node example/quick-start.js
```

### 4. Explore `demo.js`

To see all TahuJS features comprehensively, including multi-provider support, agent management, workflows, and parallel processing, run `demo.js`:

```bash
node example/demo.js
```

## 📚 Full Documentation

For more in-depth guides on installation, configuration, API usage, and code examples, please visit our comprehensive documentation:

*   **[Documentation in English](docs/en.md)**
*   **[Dokumentasi dalam Bahasa Indonesia](docs/id.md)**

---

Thank you for using TahuJS! We hope this framework accelerates your AI application development journey.