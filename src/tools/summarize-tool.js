// src/tools/summarize-tool.js
import chalk from 'chalk';

export const summarizeTool = {
  name: 'summarizeText',
  description:
    'Summarize a given text using the AI model. Useful for long inputs before further processing. Input: The text to be summarized.',
  execute: async (text, llmManager) => {
    if (!text || text.trim() === '') {
      return '❌ No text provided for summarization.';
    }
    console.log(chalk.blue(`📝 Summarizing text (length: ${text.length})...`));
    try {
      // Craft a prompt for summarization
      const prompt = `Please summarize the following text concisely and accurately:\n\n${text}`;

      // Use the LLM to summarize
      const result = await llmManager.chat(prompt, {
        // Optionally, set a lower temperature for more factual summaries
        temperature: 0.3,
        // Optionally, set a maxTokens for the summary output
        maxTokens: 500, // Adjust as needed for desired summary length
      });

      return `✅ Summarized Text:\n${result.response}`;
    } catch (error) {
      return `❌ Summarization error: ${error.message}`;
    }
  },
};
