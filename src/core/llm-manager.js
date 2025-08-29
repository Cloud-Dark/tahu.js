// src/core/llm-manager.js
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai';
import { DynamicTool } from '@langchain/community/tools/dynamic';
import { AgentExecutor, createReactAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';
import { HumanMessage, AIMessage } from 'langchain/schema';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import chalk from 'chalk';

export class LLMManager {
  constructor(config, toolsMap, conversationsMap, analyticsManager) {
    this.config = config;
    this.toolsMap = toolsMap;
    this.conversations = conversationsMap;
    this.analyticsManager = analyticsManager;
    this.chatModel = null;
    this.embeddingModel = null; // New: Embedding model
    this.initializeChatModel();
    this.initializeEmbeddingModel(); // New: Initialize embedding model
  }

  initializeChatModel() {
    try {
      switch (this.config.provider) {
        case 'openrouter':
          this.chatModel = new ChatOpenAI({
            modelName: this.config.model,
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
            openAIApiKey: this.config.apiKey,
            configuration: {
              baseURL: 'https://openrouter.ai/api/v1',
              defaultHeaders: {
                'HTTP-Referer': this.config.httpReferer,
                'X-Title': this.config.xTitle,
              },
            },
          });
          break;
        case 'gemini':
          const geminiModelName = this.config.model;
          this.chatModel = new ChatGoogleGenerativeAI({
            modelName: geminiModelName,
            apiKey: this.config.apiKey,
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxTokens,
          });
          break;
        case 'openai':
          this.chatModel = new ChatOpenAI({
            modelName: this.config.model,
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
            openAIApiKey: this.config.apiKey,
          });
          break;
        case 'ollama':
          this.chatModel = new ChatOllama({
            baseUrl: this.config.ollamaBaseUrl,
            model: this.config.model,
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
          });
          break;
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }
      console.log(
        `🔗 LangChain chat model initialized for provider: ${this.config.provider}`
      );
    } catch (error) {
      console.error(
        '❌ Failed to initialize LangChain chat model:',
        error.message
      );
      this.chatModel = null; // Ensure it's null if initialization fails
    }
  }

  // New: Initialize embedding model based on embeddingProvider
  initializeEmbeddingModel() {
    try {
      const embeddingProvider = this.config.embeddingProvider;
      const embeddingModelName = this.config.embeddingModel;

      if (!embeddingProvider || !embeddingModelName) {
        console.warn(
          chalk.yellow(
            `⚠️  Embedding model not fully configured (provider: ${embeddingProvider}, model: ${embeddingModelName}). Skipping embedding model initialization.`
          )
        );
        this.embeddingModel = null;
        return;
      }

      switch (embeddingProvider) {
        case 'openai':
        case 'openrouter': // OpenRouter uses OpenAI's embedding API
          this.embeddingModel = new OpenAIEmbeddings({
            openAIApiKey: this.config.apiKey, // Assuming API key is same for OpenAI embeddings
            configuration:
              embeddingProvider === 'openrouter'
                ? {
                    baseURL: 'https://openrouter.ai/api/v1',
                    defaultHeaders: {
                      'HTTP-Referer': this.config.httpReferer,
                      'X-Title': this.config.xTitle,
                    },
                  }
                : {},
            modelName: embeddingModelName,
          });
          break;
        case 'gemini':
          this.embeddingModel = new GoogleGenerativeAIEmbeddings({
            apiKey: this.config.apiKey, // Assuming API key is same for Gemini embeddings
            model: embeddingModelName,
          });
          break;
        case 'ollama':
          this.embeddingModel = new OpenAIEmbeddings({
            // LangChain's Ollama embeddings often use OpenAIEmbeddings as a wrapper
            openAIApiKey: 'ollama', // Dummy API key for Ollama
            configuration: {
              baseURL: `${this.config.ollamaBaseUrl}/api`,
            },
            modelName: embeddingModelName,
          });
          break;
        default:
          console.warn(
            chalk.yellow(
              `⚠️  Unsupported embedding provider: ${embeddingProvider}. Skipping embedding model initialization.`
            )
          );
          this.embeddingModel = null;
          return;
      }
      console.log(
        `🔗 LangChain embedding model initialized for provider: ${embeddingProvider} with model: ${embeddingModelName}`
      );
    } catch (error) {
      console.error(
        chalk.red(
          '❌ Failed to initialize LangChain embedding model:',
          error.message
        )
      );
      this.embeddingModel = null;
    }
  }

  // New: Method to get embeddings for a text
  async getEmbeddings(text) {
    if (!this.embeddingModel) {
      throw new Error(
        'Embedding model is not initialized. Please check your configuration and API key/Ollama setup.'
      );
    }
    try {
      console.log(
        chalk.blue(
          `🧠 Generating embeddings for text (length: ${text.length})...`
        )
      );
      const embeddings = await this.embeddingModel.embedQuery(text);
      return embeddings;
    } catch (error) {
      console.error(
        chalk.red('❌ Embedding generation failed:', error.message)
      );
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  }

  getLangChainTools() {
    const lcTools = [];
    for (const [name, tool] of this.toolsMap.entries()) {
      const func = async (input) => {
        return await tool.execute(input);
      };

      lcTools.push(
        new DynamicTool({
          name: name,
          description: tool.description,
          func: func,
        })
      );
    }
    return lcTools;
  }

  async createLangChainAgent(
    systemPrompt = 'You are a helpful assistant that can use tools to answer questions.'
  ) {
    if (!this.chatModel) {
      throw new Error(
        'LangChain chat model is not initialized. Check your configuration.'
      );
    }
    console.log('🤖 Creating LangChain agent...');
    const tools = this.getLangChainTools();

    const prompt = await pull('hwchase17/react');

    const agent = await createReactAgent({
      llm: this.chatModel,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
    });

    console.log('🤖 LangChain Agent Executor created successfully!');
    return agentExecutor;
  }

  async chat(message, options = {}) {
    if (!this.chatModel) {
      throw new Error(
        'TahuJS chat model is not initialized. Check your configuration and API key/Ollama setup.'
      );
    }

    const conversation = options.conversationId || 'default';
    const streaming = options.streaming || false;

    if (!this.conversations.has(conversation)) {
      this.conversations.set(conversation, []);
    }

    const history = this.conversations.get(conversation);
    history.push({ role: 'user', content: message });

    const lcMessages = history
      .map((msg) => {
        if (msg.role === 'user') {
          return new HumanMessage({ content: msg.content });
        } else if (msg.role === 'assistant') {
          return new AIMessage({ content: msg.content });
        }
        return null;
      })
      .filter(Boolean);

    const startTime = process.hrtime.bigint();

    try {
      if (this.config.debug) {
        console.log(`🔄 Calling LLM via LangChain (${this.config.provider})...`);
      }

      let response;
      let responseContent = '';

      if (streaming) {
        // Streaming response
        const stream = await this.chatModel.stream(lcMessages, {
          temperature: options.temperature || this.config.temperature,
          maxTokens: options.maxTokens || this.config.maxTokens,
        });

        if (options.onChunk && typeof options.onChunk === 'function') {
          // Handle streaming with callback
          for await (const chunk of stream) {
            const chunkContent = chunk.content || '';
            responseContent += chunkContent;
            options.onChunk({
              content: chunkContent,
              totalContent: responseContent,
              finished: false
            });
          }
          
          // Final chunk
          options.onChunk({
            content: '',
            totalContent: responseContent,
            finished: true
          });
        } else {
          // Collect all chunks
          for await (const chunk of stream) {
            responseContent += chunk.content || '';
          }
        }
      } else {
        // Non-streaming response
        response = await this.chatModel.invoke(lcMessages, {
          temperature: options.temperature || this.config.temperature,
          maxTokens: options.maxTokens || this.config.maxTokens,
        });
        responseContent = response.content;
      }

      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1_000_000;

      // Apply response formatting based on config
      switch (this.config.responseFormat) {
        case 'raw':
          // No special formatting, return as is
          break;
        case 'md':
          // Assume LLM output is already markdown or wrap if needed (basic markdown)
          responseContent = `${responseContent}`;
          break;
        case 'json':
        default:
          // Attempt to parse as JSON, if fails, return as raw text
          try {
            responseContent = JSON.parse(responseContent);
          } catch (e) {
            if (this.config.debug) {
              console.warn(chalk.yellow('⚠️  LLM response not valid JSON, returning as raw text.'));
            }
          }
          break;
      }

      history.push({ role: 'assistant', content: responseContent });

      const estimatedTokens = this.estimateTokens(message + responseContent);
      this.analyticsManager.recordCompletion(
        estimatedTokens,
        duration,
        this.config.model,
        this.config.provider
      );

      return {
        response: responseContent,
        conversationId: conversation,
        tokenUsage: options.includeUsage ? estimatedTokens : undefined,
        streaming,
        duration
      };
    } catch (error) {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1_000_000;
      this.analyticsManager.recordError(duration);

      if (this.config.debug) {
        console.error(
          chalk.red(`❌ LLM Chat Error (${this.config.provider}):`),
          error
        );
      }
      
      let errorMessage = `TahuJS Chat Error with ${this.config.provider}: ${error.message}`;

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = `Authentication failed. Please check your API key for ${this.config.provider}.`;
        } else if (error.response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (error.response.status === 402) {
          errorMessage =
            'Insufficient credits. Please check your account balance.';
        } else if (
          error.response.status === 403 &&
          this.config.provider === 'openrouter'
        ) {
          errorMessage = `Request Forbidden (403). Check your 'httpReferer' and 'xTitle' settings in the TahuJS config for OpenRouter.`;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = `API Error from ${this.config.provider}: ${error.response.data.error.message || JSON.stringify(error.response.data.error)}`;
        }
      } else if (
        error.code === 'ECONNREFUSED' &&
        this.config.provider === 'ollama'
      ) {
        errorMessage = `Could not connect to Ollama. Is Ollama server running at ${this.config.ollamaBaseUrl}?`;
      }

      throw new Error(errorMessage);
    }
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  clearConversation(conversationId = 'default') {
    this.conversations.delete(conversationId);
  }
}
