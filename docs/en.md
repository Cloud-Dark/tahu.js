# TahuJS Documentation (English)

TahuJS is a powerful and flexible JavaScript framework for building AI-powered applications. It integrates various libraries and services to provide comprehensive AI functionalities.

## Table of Contents

1.  [Tech Stack Overview](#1-tech-stack-overview)
2.  [Installation](#2-installation)
3.  [Configuration](#3-configuration)
4.  [Basic Usage](#4-basic-usage)
    *   [Creating a TahuJS Instance](#creating-a-tahujs-instance)
    *   [Performing AI Chat](#performing-ai-chat)
    *   [Using Tools](#using-tools)
    *   [Creating and Running AI Agents](#creating-and-running-ai-agents)
    *   [LangChain Integration](#langchain-integration)
5.  [Built-in Tools List](#5-built-in-tools-list)
6.  [Error Handling](#6-error-handling)
7.  [Contributing](#7-contributing)
8.  [License](#8-license)

---

## 1. Tech Stack Overview

TahuJS is built on the following technology stack:

*   **Core Language & Runtime:** JavaScript (ESM) running on Node.js.
*   **AI Orchestration:** [LangChain.js](https://js.langchain.com/) for building complex AI agents, chaining LLM calls, and integrating tools.
*   **LLM Providers:** Integration with OpenRouter (supporting various models like Claude, GPT, Gemini) and Google Gemini.
*   **HTTP Requests:** [Axios](https://axios-http.com/) for making all external API calls.
*   **Web Scraping:** [Cheerio](https://cheerio.js.org/) for parsing and extracting data from HTML content.
*   **Mathematical Operations:** [Math.js](https://mathjs.org/) for robust mathematical calculations.
*   **Terminal Utilities:** `chalk` for colored console output and `qrcode-terminal` for generating QR codes in the terminal.
*   **Search Services:** Custom `SearchService` class leveraging SerpApi (primary), DuckDuckGo, and direct Google scraping (fallback).
*   **Mapping & Location Services:** Custom `MapService` class utilizing OpenStreetMap (Nominatim for geocoding, StaticMap for static images), Open-Elevation API, and potentially Mapbox.
*   **Configuration Management:** A custom `ConfigValidator` class for validating application settings.

## 2. Installation

Ensure you have Node.js (version 18 or higher) installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/tahujs.git
    cd tahujs
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 3. Configuration

TahuJS is configured via a `config` object when creating a `TahuJS` instance.

**Example Configuration:**

```javascript
const config = {
    provider: 'openrouter', // or 'gemini'
    apiKey: 'YOUR_API_KEY_HERE', // API Key from OpenRouter or Google Gemini
    model: 'google/gemini-2.0-flash-exp:free', // LLM model to use
    temperature: 0.7, // Model creativity (0.0 - 2.0)
    maxTokens: 2000, // Output token limit
    serpApiKey: 'YOUR_SERPAPI_KEY', // Optional, for better web search
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Optional, for certain map features
    mapboxKey: 'YOUR_MAPBOX_KEY', // Optional, if using Mapbox
    httpReferer: 'YOUR_HTTP_REFERER', // Optional, for OpenRouter
    xTitle: 'YOUR_X_TITLE' // Optional, for OpenRouter
};
```

**Important Note for OpenRouter:** If you are using OpenRouter, ensure that the `httpReferer` and `xTitle` in your TahuJS configuration match the settings you have configured in your OpenRouter account for that specific API Key. Mismatching these can lead to 403 (Forbidden) errors.

## 4. Basic Usage

### Creating a TahuJS Instance

```javascript
import { createTahu } from './src/tahu.js';

const tahu = createTahu({
    provider: 'openrouter',
    apiKey: 'YOUR_API_KEY_HERE',
    model: 'google/gemini-2.0-flash-exp:free',
    serpApiKey: 'YOUR_SERPAPI_KEY' // If available
});
```

### Performing AI Chat

```javascript
async function runChat() {
    const chatResult = await tahu.chat('Explain the concept of AI briefly.');
    console.log(chatResult.response);
}
runChat();
```

### Using Tools

TahuJS provides various built-in tools that you can use directly.

```javascript
async function useTools() {
    // Web Search
    const searchResult = await tahu.useTool('webSearch', 'latest technology news');
    console.log('Web Search Result:', searchResult);

    // Mathematical Calculation
    const calcResult = await tahu.useTool('calculate', '15 * 3 + (10 / 2)');
    console.log('Calculation Result:', calcResult);

    // Location Search
    const locationResult = await tahu.useTool('findLocation', 'Eiffel Tower Paris');
    console.log('Location Info:', locationResult);

    // Directions
    const directionsResult = await tahu.useTool('getDirections', 'from Monas to Ragunan Zoo');
    console.log('Directions:', directionsResult);

    // Elevation
    const elevationResult = await tahu.useTool('getElevation', '-6.2088,106.8456'); // Jakarta coordinates
    console.log('Elevation:', elevationResult);

    // Web Scraping
    const scrapeResult = await tahu.useTool('webScrape', 'https://www.wikipedia.org');
    console.log('Web Scrape Result:', scrapeResult);

    // Date & Time
    const dateTimeResult = await tahu.useTool('dateTime', 'America/New_York');
    console.log('Date & Time:', dateTimeResult);
}
useTools();
```

### Creating and Running AI Agents

You can create specialized AI agents with specific roles and capabilities.

```javascript
async function runAgentDemo() {
    const travelAgent = tahu.createAgent('TravelExpert', {
        systemPrompt: 'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.',
        capabilities: ['chat', 'search', 'location', 'directions']
    });

    const travelResult = await tahu.runAgent('TravelExpert', 'Plan a day trip to Bali. Find interesting places to visit and provide directions.');
    console.log('Travel Agent Result:', travelResult.response);
}
runAgentDemo();
```

### LangChain Integration

TahuJS allows you to create LangChain agents that can automatically leverage all TahuJS tools.

```javascript
import { createTahu } from './src/tahu.js';

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

## 5. Built-in Tools List

*   `webSearch`: Searches the web using multiple search engines (SerpApi, DuckDuckGo, Google Scraping).
*   `calculate`: Performs mathematical calculations and expressions.
*   `findLocation`: Finds a location using multiple map services with links and QR codes.
*   `getDirections`: Gets directions between two locations. Input must be a string in the format "from [origin] to [destination]".
*   `getElevation`: Gets the elevation data for a specific geographic coordinate. Input must be a string with "latitude,longitude".
*   `webScrape`: Extracts content from web pages.
*   `dateTime`: Gets current date and time information.

## 6. Error Handling

TahuJS provides basic error handling for common API issues such as:

*   `401 Unauthorized`: Invalid API key.
*   `429 Too Many Requests`: Rate limit exceeded.
*   `402 Payment Required`: Insufficient credits.
*   `403 Forbidden`: Especially for OpenRouter, check your `httpReferer` and `xTitle`.
*   Other general errors will be reported with relevant messages.

## 7. Contributing

We welcome contributions! If you'd like to contribute to TahuJS, please fork the repository, create a feature branch, and submit a pull request.

## 8. License

This project is licensed under the MIT License. See the `LICENSE` file for more details.