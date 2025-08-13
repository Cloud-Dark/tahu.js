# Monitoring & Analytics

TahuJS provides real-time analytics to monitor your LLM usage and performance.

```javascript
// Get real-time statistics
const stats = tahu.analytics.getStats();
console.log(`Total Tokens Used: ${stats.totalTokensUsed}`);
console.log(`Estimated Cost: $${stats.estimatedCost.toFixed(6)}`);
console.log(
  `Average Response Time: ${stats.averageResponseTimeMs.toFixed(2)} ms`
);
console.log(`Success Rate: ${stats.successRate.toFixed(2)}%`);

// Reset stats
tahu.analytics.resetStats();
```