# Basic Usage

### Creating a TahuJS Instance

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({
  provider: 'openrouter',
  apiKey: 'YOUR_API_KEY_HERE',
  model: 'google/gemini-2.0-flash-exp:free',
  embeddingModel: 'text-embedding-ada-002', // Example: Using OpenAI's embedding model
  // embeddingModel: 'embedding-001', // Example: Using Gemini's embedding model
  // embeddingModel: 'nomic-embed-text', // Example: Using Ollama's embedding model
  serpApiKey: 'YOUR_SERPAPI_KEY', // If available
});
```

### Performing AI Chat

```javascript
import { createTahu } from 'tahu.js';

async function runChat() {
  const tahu = createTahu({
    /* your config */
  });
  const chatResult = await tahu.chat('Explain the concept of AI briefly.');
  console.log(chatResult.response);
}
runChat();
```

### Using Tools

```javascript
import { createTahu, tools } from 'tahu.js';

async function useTools() {
  const tahu = createTahu({
    /* your config */
  });
  // Web Search
  const searchResult = await tahu.useTool(
    tools.webSearchTool.name,
    'latest technology news'
  );
  console.log('Web Search Result:', searchResult);

  // Mathematical Calculation
  const calcResult = await tahu.useTool(
    tools.calculateTool.name,
    '15 * 3 + (10 / 2)'
  );
  console.log('Calculation Result:', calcResult);

  // Location Search
  const locationResult = await tahu.useTool(
    tools.findLocationTool.name,
    'Eiffel Tower Paris'
  );
  console.log('Location Info:', locationResult);

  // Directions
  const directionsResult = await tahu.useTool(
    tools.getDirectionsTool.name,
    'from Monas to Ragunan Zoo'
  );
  console.log('Directions:', directionsResult);

  // Elevation
  const elevationResult = await tahu.useTool(
    tools.getElevationTool.name,
    '-6.2088,106.8456'
  ); // Jakarta coordinates
  console.log('Elevation:', elevationResult);

  // Web Scraping
  const scrapeResult = await tahu.useTool(
    tools.webScrapeTool.name,
    'https://www.wikipedia.org'
  );
  console.log('Web Scrape Result:', scrapeResult);

  // Date & Time
  const dateTimeResult = await tahu.useTool(
    tools.dateTimeTool.name,
    'America/New_York'
  );
  console.log('Date & Time:', dateTimeResult);

  // Summarize Text
  const longText =
    'This is a very long text that needs to be summarized. It contains a lot of information about various topics, and the purpose is to demonstrate how the summarization tool can work effectively. The longer the text, the more useful this tool becomes for extracting key points and presenting them in a more concise and digestible format. This is particularly helpful in scenarios where you are dealing with large documents, articles, or transcripts and just need a quick overview.';
  const summaryResult = await tahu.useTool(tools.summarizeTool.name, longText);
  console.log('Summary Result:', summaryResult);
}
useTools();
```

### Creating and Running AI Agents

```javascript
import { createTahu } from 'tahu.js';

async function runAgentDemo() {
  const tahu = createTahu({
    /* your config */
  });
  const travelAgent = tahu.createAgent('TravelExpert', {
    systemPrompt:
      'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.',
    capabilities: ['chat', 'search', 'location', 'directions'],
    memoryType: 'json', // Persist memory to a JSON file
    maxMemorySize: 5, // Keep last 5 interactions
  });

  const travelResult = await tahu.runAgent(
    'TravelExpert',

    'Plan a day trip to Bali. Find interesting places to visit and provide directions.'
  );
  console.log('Travel Agent Result:', travelResult.response);

  // Use a pre-built agent
  const coderAgent = tahu.createPrebuiltAgent('coder', {
    name: 'MyCoderAgent',
  });
  const codeResult = await tahu.runAgent(
    'MyCoderAgent',
    'Write a simple JavaScript function to reverse a string.'
  );
  console.log('Coder Agent Result:', codeResult.response);
}
runAgentDemo();
```

### LangChain Integration

TahuJS leverages LangChain.js under the hood, and you can directly create and use LangChain agents for more advanced scenarios.

```javascript
import { createTahu } from 'tahu.js';

async function langchainIntegrationDemo() {
  const tahu = createTahu({
    provider: 'openrouter',
    apiKey: 'YOUR_API_KEY_HERE',
    model: 'google/gemini-2.0-flash-exp:free',
    serpApiKey: 'YOUR_SERPAPI_KEY',
  });

  const researchAgent = await tahu.createLangChainAgent(
    'You are a powerful research assistant. You can search the web, find locations, and perform calculations.'
  );

  const task =
    "Find the latest news about AI development in Indonesia, then find the location of Google Indonesia's headquarters and provide its Google Maps link.";
  const result = await researchAgent.invoke({ input: task });
  console.log('LangChain Agent Result:', result.output);
}
langchainIntegrationDemo();
```

## Provider-Specific Examples

TahuJS supports various LLM providers. Here are examples demonstrating how to use TahuJS with each specific provider:

*   [Gemini Examples](gemini-examples.md)
*   [Ollama Examples](ollama-examples.md)
*   [OpenAI Examples](openai-examples.md)
*   [OpenRouter Examples](openrouter-examples.md)
