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

# 🥘 TahuJS - Enhanced Version

Welcome to the enhanced version of TahuJS! This update brings significant improvements across core functionalities, making your AI application development even more powerful and reliable.

## 🆕 New Features

### 🔍 Enhanced Web Search
- **3 Fallback Methods**: SerpApi → DuckDuckGo → Google Scraping 🌐✨
- **Smart Retry Logic**: Automatically tries next method if one fails 🔄
- **Better Results**: More accurate and comprehensive search results ✅

### 🗺️ Advanced Map Services
- **Multiple Map Providers**: OpenStreetMap, Google Maps, Bing Maps, WikiMapia, Apple Maps 📍🌍
- **QR Code Generation**: Instant QR codes for sharing locations 📱
- **Elevation Data**: Get altitude information for any location ⛰️
- **Static Maps**: Generate map images 🖼️
- **Directions**: Multi-provider direction links 🛣️

### 🛠️ Improved Tools
- **Enhanced Error Handling**: Better error messages and fallbacks 🛡️
- **Visual Feedback**: Colored console output with emojis 🎨
- **Performance Optimized**: Faster response times 🚀
- **More Reliable**: Multiple fallbacks for each service 💪

## 🚀 Quick Start

Get up and running in no time!

```bash
npm install tahujs
```

```javascript
import { createTahu } from 'tahujs';

const tahu = createTahu({
  provider: 'openrouter',
  apiKey: 'your-api-key',
  serpApiKey: 'your-serpapi-key', // Optional for better search
  googleMapsApiKey: 'your-google-maps-key' // Optional for enhanced maps
});

// Enhanced search with fallbacks
const searchResult = await tahu.useTool('webSearch', 'latest AI news');
console.log(searchResult);

// Advanced location search with QR codes
const locationResult = await tahu.useTool('findLocation', 'Jakarta');
console.log(locationResult);

// Get directions between locations
const directions = await tahu.useTool('getDirections', 'from Jakarta to Bandung');
console.log(directions);
```

## 🎯 Use Cases

TahuJS is versatile and can power various intelligent applications:

### 1. Travel Planning ✈️
```javascript
const travelAgent = tahu.createAgent('TravelExpert', {
  systemPrompt: 'Expert travel planner for Indonesia',
  capabilities: ['search', 'location', 'directions']
});

const plan = await tahu.runAgent('TravelExpert', 
  'Plan a 3-day Jakarta itinerary with exact locations and directions'
);
console.log(plan.response);
```

### 2. Research Assistant 🔬
```javascript
const researcher = tahu.createAgent('Researcher', {
  systemPrompt: 'Thorough research assistant',
  capabilities: ['search', 'analyze', 'calculate']
});

const report = await tahu.runAgent('Researcher', 
  'Research electric vehicle market in Indonesia with statistics'
);
console.log(report.response);
```

### 3. Technical Consultant 💻
```javascript
const techExpert = tahu.createAgent('TechExpert', {
  systemPrompt: 'Senior software engineer and architect',
  capabilities: ['search', 'calculate', 'analyze']
});

const advice = await tahu.runAgent('TechExpert', 
  'Help me scale a Node.js app for 10,000 concurrent users'
);
console.log(advice.response);
```

## 🔧 Configuration Options

Customize TahuJS to fit your needs:

```javascript
const config = {
  // Required
  provider: 'openrouter', // or 'gemini'
  apiKey: 'your-api-key',
  
  // Optional AI settings
  model: 'anthropic/claude-3-sonnet',
  temperature: 0.7,
  maxTokens: 2000,
  
  // Optional service keys for enhanced features
  serpApiKey: 'your-serpapi-key', // Better web search
  googleMapsApiKey: 'your-google-maps-key', // Enhanced maps
  mapboxKey: 'your-mapbox-key' // Premium maps
};
```

## 🌟 Why Choose Enhanced TahuJS?

- **🔄 Fallback Systems**: Never fails due to single service outage
- **🎯 Multi-Provider**: Best of all worlds with multiple service providers
- **📱 Modern UX**: QR codes, colored output, visual feedback
- **🚀 Performance**: Optimized for speed and reliability
- **🛡️ Robust**: Extensive error handling and validation
- **📊 Comprehensive**: Complete toolkit for AI agents

## 🎉 Ready to Use!

The enhanced TahuJS now includes:
- ✅ 3-tier web search fallback system
- ✅ Multiple map service providers
- ✅ QR code generation for locations
- ✅ Elevation data integration
- ✅ Enhanced error handling
- ✅ Visual feedback and logging
- ✅ Configuration validation
- ✅ Complete workflow examples
- ✅ **Persistent Agent Memory**: Save agent conversations to JSON files or SQLite database.

Perfect for production use! 🚀