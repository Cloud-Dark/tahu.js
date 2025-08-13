# Configuration

Customize TahuJS to fit your needs. It's recommended to use environment variables for API keys in production.

```javascript
const config = {
  // Required for most providers
  provider: 'openrouter', // 'openrouter', 'gemini', 'openai', 'ollama'
  apiKey: process.env.OPENROUTER_API_KEY, // Use environment variables for production

  // Optional AI settings
  model: 'anthropic/claude-3-sonnet', // Model name varies by provider
  embeddingModel: 'text-embedding-ada-002', // Recommended for knowledge base features (can be changed based on provider)
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

import { createTahu } from 'tahu.js';
const tahu = createTahu(config);
```