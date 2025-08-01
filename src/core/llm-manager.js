// src/core/llm-manager.js
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "@langchain/community/tools/dynamic";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { HumanMessage, AIMessage } from "langchain/schema";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import chalk from 'chalk';

export class LLMManager {
    constructor(config, toolsMap, conversationsMap, analyticsManager) { // Tambahkan analyticsManager
        this.config = config;
        this.toolsMap = toolsMap; // Reference to the main tools Map
        this.conversations = conversationsMap; // Reference to the main conversations Map
        this.analyticsManager = analyticsManager; // Simpan instance AnalyticsManager
        this.chatModel = null;
        this.initializeChatModel();
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
                    const geminiModelName = this.config.model.includes('gemini') ? "gemini-pro" : this.config.model;
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
            console.log(`🔗 LangChain chat model initialized for provider: ${this.config.provider}`);
        } catch (error) {
            console.error('❌ Failed to initialize LangChain chat model:', error.message);
            this.chatModel = null; // Ensure it's null if initialization fails
        }
    }

    getLangChainTools() {
        const lcTools = [];
        for (const [name, tool] of this.toolsMap.entries()) {
            // LangChain agents work best with tools that expect a single string input.
            // We adapt our multi-argument tools here if necessary.
            const func = async (input) => {
                // For tools that might take multiple args in the future, but are simple now.
                // This ensures they are called correctly by the agent.
                return await tool.execute(input);
            };

            lcTools.push(new DynamicTool({
                name: name,
                description: tool.description,
                func: func,
            }));
        }
        return lcTools;
    }

    async createLangChainAgent(systemPrompt = 'You are a helpful assistant that can use tools to answer questions.') {
        if (!this.chatModel) {
            throw new Error("LangChain chat model is not initialized. Check your configuration.");
        }
        console.log('🤖 Creating LangChain agent...');
        const tools = this.getLangChainTools();

        // Pull a pre-designed "ReAct" (Reasoning and Acting) agent prompt from LangChain Hub
        const prompt = await pull("hwchase17/react");

        const agent = await createReactAgent({
            llm: this.chatModel,
            tools,
            prompt,
        });

        const agentExecutor = new AgentExecutor({
            agent,
            tools,
            verbose: true, // Set to true to see the agent's thought process
        });

        console.log('🤖 LangChain Agent Executor created successfully!');
        return agentExecutor;
    }

    async chat(message, options = {}) {
        if (!this.chatModel) {
            throw new Error('TahuJS chat model is not initialized. Check your configuration and API key/Ollama setup.');
        }

        const conversation = options.conversationId || 'default';

        if (!this.conversations.has(conversation)) {
            this.conversations.set(conversation, []);
        }

        const history = this.conversations.get(conversation);
        history.push({ role: 'user', content: message });

        // Convert history to LangChain message format
        const lcMessages = history.map(msg => {
            if (msg.role === 'user') {
                return new HumanMessage({ content: msg.content });
            } else if (msg.role === 'assistant') {
                return new AIMessage({ content: msg.content });
            }
            return null; // Should not happen with 'user' and 'assistant' roles
        }).filter(Boolean);

        const startTime = process.hrtime.bigint(); // Start timer

        try {
            console.log(`🔄 Calling LLM via LangChain (${this.config.provider})...`);
            const response = await this.chatModel.invoke(lcMessages, {
                temperature: options.temperature || this.config.temperature,
                maxTokens: options.maxTokens || this.config.maxTokens,
            });

            const endTime = process.hrtime.bigint(); // End timer
            const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

            const responseContent = response.content;
            history.push({ role: 'assistant', content: responseContent });

            // Record analytics
            const estimatedTokens = this.estimateTokens(message + responseContent);
            this.analyticsManager.recordCompletion(estimatedTokens, duration, this.config.model, this.config.provider);

            return {
                response: responseContent,
                conversationId: conversation,
                tokenUsage: options.includeUsage ? estimatedTokens : undefined
            };

        } catch (error) {
            const endTime = process.hrtime.bigint(); // End timer even on error
            const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
            this.analyticsManager.recordError(duration); // Record error in analytics

            console.error(chalk.red(`❌ LLM Chat Error (${this.config.provider}):`), error);
            let errorMessage = `TahuJS Chat Error with ${this.config.provider}: ${error.message}`;

            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = `Authentication failed. Please check your API key for ${this.config.provider}.`;
                } else if (error.response.status === 429) {
                    errorMessage = 'Rate limit exceeded. Please try again later.';
                } else if (error.response.status === 402) {
                    errorMessage = 'Insufficient credits. Please check your account balance.';
                } else if (error.response.status === 403 && this.config.provider === 'openrouter') {
                    errorMessage = `Request Forbidden (403). Check your 'httpReferer' and 'xTitle' settings in the TahuJS config for OpenRouter.`;
                } else if (error.response.data && error.response.data.error) {
                    errorMessage = `API Error from ${this.config.provider}: ${error.response.data.error.message || JSON.stringify(error.response.data.error)}`;
                }
            } else if (error.code === 'ECONNREFUSED' && this.config.provider === 'ollama') {
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