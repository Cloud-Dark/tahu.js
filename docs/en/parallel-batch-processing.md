# Parallel & Batch Processing

Efficiently handle multiple LLM calls or agent tasks simultaneously.

```javascript
// Parallel execution of agent tasks
const parallelResults = await tahu.parallel([
  { agent: 'MyCoder', input: 'Explain recursion.' },
  { agent: 'MyResearcher', input: 'What is quantum computing?' },
]);
console.log(
  'Parallel Results:',
  parallelResults.map((r) => r.response)
);

// Simple batch processing of chat prompts
const batchResults = await tahu.batch([
  { prompt: 'Tell me a short story about a space cat.' },
  { prompt: 'List 5 benefits of cloud computing.' },
  { prompt: 'What is the main purpose of blockchain?' },
]);
console.log(
  'Batch Results:',
  batchResults.map((r) => r.response)
);
```