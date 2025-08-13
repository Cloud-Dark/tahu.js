# Agent Builder

The `AgentBuilder` provides a fluent API to construct and configure agents with various capabilities, personalities, and memory settings.

```javascript
import { createTahu, tools } from 'tahu.js';

const tahu = createTahu({
  /* your config */
});

const omniAgent = tahu
  .builder()
  .name('OmniAgent')
  .systemPrompt(
    'You are an all-knowing AI assistant capable of performing any task using all available tools and remembering past interactions.'
  )
  .addPersonality(
    ['curious', 'analytical', 'helpful', 'creative'],
    'optimistic',
    ['everything']
  )
  .addCapabilities(
    tools.webSearchTool.name,
    tools.calculateTool.name,
    tools.findLocationTool.name,
    tools.getDirectionsTool.name,
    tools.getElevationTool.name,
    tools.webScrapeTool.name,
    tools.dateTimeTool.name,
    tools.summarizeTool.name,
    tools.trainKnowledgeTool.name,
    tools.retrieveKnowledgeTool.name // New knowledge tools
  )
  .addMemory('sqlite', { maxMemorySize: 10 }) // Persist memory to SQLite
  .build();

console.log(
  `Agent '${omniAgent.name}' created. Memory Type: ${omniAgent.memoryType}`
);
console.log('Capabilities:', omniAgent.capabilities.join(', '));

const omniResult = await tahu.runAgent(
  'OmniAgent',
  'What is the current price of Bitcoin, and what are the top social trends on Twitter?'
);
console.log('OmniAgent Response:', omniResult.response);
```