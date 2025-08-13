// src/core/analytics-manager.js
import chalk from 'chalk';

export class AnalyticsManager {
  constructor() {
    this.totalTokensUsed = 0;
    this.totalCost = 0; // Estimated cost
    this.totalResponseTime = 0; // in milliseconds
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.requestCount = 0;
  }

  // Simple mock for cost per 1000 tokens (adjust as needed for real pricing)
  _getCostPerThousandTokens(model, provider) {
    // These are illustrative prices and should be updated with actual provider pricing
    switch (provider) {
      case 'openrouter':
        if (model.includes('claude-3-opus')) return 75.0; // Example: $75 per 1M tokens (input)
        if (model.includes('claude-3-sonnet')) return 3.0; // Example: $3 per 1M tokens (input)
        if (model.includes('gpt-4')) return 30.0; // Example: $30 per 1M tokens (input)
        if (model.includes('gpt-3.5-turbo')) return 0.5; // Example: $0.50 per 1M tokens (input)
        if (model.includes('gemini-pro')) return 0.125; // Example: $0.125 per 1M tokens (input)
        return 1.0; // Default for unknown OpenRouter models
      case 'openai':
        if (model.includes('gpt-4')) return 30.0;
        if (model.includes('gpt-3.5-turbo')) return 0.5;
        return 1.0;
      case 'gemini':
        return 0.125; // Gemini Pro pricing example
      case 'ollama':
        return 0.0; // Typically free for local models
      default:
        return 0.0;
    }
  }

  recordCompletion(tokens, duration, model, provider) {
    this.totalTokensUsed += tokens;
    const costPerThousand = this._getCostPerThousandTokens(model, provider);
    this.totalCost += (tokens / 1000) * costPerThousand;
    this.totalResponseTime += duration;
    this.successfulRequests++;
    this.requestCount++;
    console.log(
      chalk.gray(
        `📊 Analytics: Tokens: ${tokens}, Time: ${duration}ms, Cost: $${((tokens / 1000) * costPerThousand).toFixed(4)}`
      )
    );
  }

  recordError(duration) {
    this.totalResponseTime += duration;
    this.failedRequests++;
    this.requestCount++;
    console.log(chalk.red(`📊 Analytics: Request failed, Time: ${duration}ms`));
  }

  getStats() {
    const successRate =
      this.requestCount > 0
        ? (this.successfulRequests / this.requestCount) * 100
        : 0;
    const averageResponseTime =
      this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0;

    return {
      totalTokensUsed: this.totalTokensUsed,
      estimatedCost: parseFloat(this.totalCost.toFixed(6)),
      totalResponseTimeMs: this.totalResponseTime,
      averageResponseTimeMs: parseFloat(averageResponseTime.toFixed(2)),
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      totalRequests: this.requestCount,
      successRate: parseFloat(successRate.toFixed(2)),
    };
  }

  resetStats() {
    this.totalTokensUsed = 0;
    this.totalCost = 0;
    this.totalResponseTime = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.requestCount = 0;
    console.log(chalk.yellow('📊 Analytics stats reset.'));
  }
}
