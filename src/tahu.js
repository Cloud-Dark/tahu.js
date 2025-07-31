// src/tahu.js - Enhanced Version with Multiple Services
import axios from 'axios';
import { evaluate } from 'mathjs';
import * as cheerio from 'cheerio';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';

// --- LANGCHAIN INTEGRATION: Imports ---
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "@langchain/community/tools/dynamic";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";

// Import services
import { SearchService } from './services/search-service.js';
import { MapService } from './services/map-service.js';

// Import tools
import { webSearchTool } from './tools/web-search-tool.js';
import { calculateTool } from './tools/calculate-tool.js';
import { findLocationTool } from './tools/find-location-tool.js';
import { getDirectionsTool } from './tools/get-directions-tool.js';
import { getElevationTool } from './tools/get-elevation-tool.js';
import { webScrapeTool } from './tools/web-scrape-tool.js';
import { dateTimeTool } from './tools/date-time-tool.js';


class TahuJS {
    constructor(config = {}) {
        this.config = {
            provider: config.provider || 'openrouter',
            apiKey: config.apiKey,
            model: config.model || 'google/gemini-2.0-flash-exp:free',
            temperature: config.temperature || 0.7,
            maxTokens: config.maxTokens || 2000,
            googleMapsApiKey: config.googleMapsApiKey,
            serpApiKey: config.serpApiKey,
            mapboxKey: config.mapboxKey,
            ...config
        };

        if (!this.config.apiKey) {
            console.warn('⚠️  Warning: API key not provided. Some features may not work.');
        }

        this.tools = new Map();
        this.agents = new Map();
        this.conversations = new Map();

        // Initialize services
        this.searchService = new SearchService(this.config);
        this.mapService = new MapService(this.config);

        // Initialize built-in tools
        this.initializeBuiltInTools();

        // --- LANGCHAIN INTEGRATION: Initialize LangChain components ---
        this.initializeLangChain();

        console.log('🥘 TahuJS initialized successfully!');
    }

    // =============== CORE AI METHODS ===============

    initializeLangChain() {
        this.langchain = {};

        // Initialize Chat Model based on provider
        try {
            if (this.config.provider === 'openrouter') {
                this.langchain.chatModel = new ChatOpenAI({
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
            } else if (this.config.provider === 'gemini') {
                // Note: Gemini model names might differ in LangChain
                const modelName = this.config.model.includes('gemini') ? "gemini-pro" : this.config.model;
                this.langchain.chatModel = new ChatGoogleGenerativeAI({
                    modelName: modelName,
                    apiKey: this.config.apiKey,
                    temperature: this.config.temperature,
                    maxOutputTokens: this.config.maxTokens,
                });
            }
            console.log('🔗 LangChain components initialized.');
        } catch (error) {
            console.error('❌ Failed to initialize LangChain components:', error.message);
        }
    }

    // --- LANGCHAIN INTEGRATION: Convert TahuJS tools to LangChain format ---
    getLangChainTools() {
        const lcTools = [];
        for (const [name, tool] of this.tools.entries()) {
            // LangChain agents work best with tools that expect a single string input.
            // We adapt our multi-argument tools here if necessary.
            let func;
            if (name === 'getDirections' || name === 'getElevation') {
                func = (input) => tool.execute(input);
            } else {
                func = async (input) => {
                    // For tools that might take multiple args in the future, but are simple now.
                    // This ensures they are called correctly by the agent.
                    return await tool.execute(input);
                };
            }

            lcTools.push(new DynamicTool({
                name: name,
                description: tool.description,
                func: func,
            }));
        }
        return lcTools;
    }

    // --- LANGCHAIN INTEGRATION: Create a powerful LangChain Agent ---
    async createLangChainAgent(systemPrompt = 'You are a helpful assistant that can use tools to answer questions.') {
        if (!this.langchain.chatModel) {
            throw new Error("LangChain chat model is not initialized. Check your configuration.");
        }
        console.log('🤖 Creating LangChain agent...');
        const tools = this.getLangChainTools();

        // Pull a pre-designed "ReAct" (Reasoning and Acting) agent prompt from LangChain Hub
        const prompt = await pull("hwchase17/react");

        const agent = await createReactAgent({
            llm: this.langchain.chatModel,
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
        if (!this.config.apiKey) {
            throw new Error('API key is required. Please set apiKey in config.');
        }

        const conversation = options.conversationId || 'default';

        if (!this.conversations.has(conversation)) {
            this.conversations.set(conversation, []);
        }

        const history = this.conversations.get(conversation);
        history.push({ role: 'user', content: message });

        try {
            let response;

            if (this.config.provider === 'openrouter') {
                response = await this.callOpenRouter(history, options);
            } else if (this.config.provider === 'gemini') {
                response = await this.callGemini(history, options);
            } else {
                throw new Error(`Unsupported provider: ${this.config.provider}`);
            }

            history.push({ role: 'assistant', content: response });

            // This part is a placeholder for actual tool call processing
            const processedResponse = response;

            return {
                response: processedResponse,
                conversationId: conversation,
                tokenUsage: options.includeUsage ? this.estimateTokens(message + processedResponse) : undefined
            };

        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error(`Authentication failed. Please check your API key for ${this.config.provider}.`);
            } else if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (error.response?.status === 402) {
                throw new Error('Insufficient credits. Please check your account balance.');
            }
            // --- FIX: Provide more detail on 403 errors ---
            else if (error.response?.status === 403) {
                throw new Error(`Request Forbidden (403). Check your 'httpReferer' and 'xTitle' settings in the TahuJS config. They must match what you've set in your OpenRouter account.`);
            }
            throw new Error(`TahuJS Chat Error: ${error.message}`);
        }
    }

    async callOpenRouter(messages, options = {}) {
        const payload = {
            model: options.model || this.config.model,
            messages: messages,
            temperature: options.temperature || this.config.temperature,
            max_tokens: options.maxTokens || this.config.maxTokens,
        };

        console.log('🔄 Calling OpenRouter API...');

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', payload, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
            timeout: 30000
        });

        return response.data.choices[0].message.content;
    }

    async callGemini(messages, options = {}) {
        const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

        console.log('🔄 Calling Gemini API...');

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.apiKey}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: options.temperature || this.config.temperature,
                    maxOutputTokens: options.maxTokens || this.config.maxTokens,
                }
            },
            {
                timeout: 30000
            }
        );

        return response.data.candidates[0].content.parts[0].text;
    }

    // =============== ENHANCED TOOLS WITH MULTIPLE SERVICES ===============

    initializeBuiltInTools() {
        this.registerTool(webSearchTool.name, {
            description: webSearchTool.description,
            execute: (query) => webSearchTool.execute(query, this.searchService)
        });

        this.registerTool(calculateTool.name, {
            description: calculateTool.description,
            execute: calculateTool.execute
        });

        this.registerTool(findLocationTool.name, {
            description: findLocationTool.description,
            execute: (query) => findLocationTool.execute(query, this.mapService)
        });

        this.registerTool(getDirectionsTool.name, {
            description: getDirectionsTool.description,
            execute: (input) => getDirectionsTool.execute(input, this.mapService) // FIX: Pass input and mapService correctly
        });

        this.registerTool(getElevationTool.name, {
            description: getElevationTool.description,
            execute: (input) => getElevationTool.execute(input, this.mapService)
        });

        this.registerTool(webScrapeTool.name, {
            description: webScrapeTool.description,
            execute: webScrapeTool.execute
        });

        this.registerTool(dateTimeTool.name, {
            description: dateTimeTool.description,
            execute: dateTimeTool.execute
        });
    }

    // Rest of the methods remain the same...
    createAgent(name, config = {}) {
        const agent = {
            name,
            systemPrompt: config.systemPrompt || `You are ${name}, a helpful AI assistant.`,
            tools: config.tools || [],
            personality: config.personality || 'helpful',
            memory: [],
            capabilities: config.capabilities || ['chat', 'search', 'calculate'],
            created: new Date().toISOString()
        };

        this.agents.set(name, agent);
        console.log(`🤖 Agent "${name}" created successfully!`);
        return agent;
    }

    async runAgent(agentName, task, options = {}) {
        const agent = this.agents.get(agentName);
        if (!agent) throw new Error(`Agent "${agentName}" not found`);

        const enhancedPrompt = `${agent.systemPrompt}\n\nUser Task: ${task}\n\nYour capabilities: ${agent.capabilities.join(', ')}`;

        const result = await this.chat(enhancedPrompt, {
            ...options,
            conversationId: `agent_${agentName}_${Date.now()}`
        });

        agent.memory.push({
            task,
            result: result.response,
            timestamp: new Date().toISOString()
        });

        return result;
    }

    registerTool(name, tool) {
        this.tools.set(name, {
            name,
            description: tool.description,
            execute: tool.execute,
            parameters: tool.parameters || {},
            registered: new Date().toISOString()
        });
        console.log(`🔧 Tool "${name}" registered successfully!`);
    }

    async useTool(toolName, ...args) {
        const tool = this.tools.get(toolName);
        if (!tool) throw new Error(`Tool "${toolName}" not found`);

        try {
            console.log(`🔧 Using tool: ${toolName}`);
            const result = await tool.execute(...args);
            return result;
        } catch (error) {
            throw new Error(`Tool execution failed: ${error.message}`);
        }
    }

    // Other utility methods remain the same...
    listAgents() { return Array.from(this.agents.keys()); }
    listTools() { return Array.from(this.tools.keys()); }
    getAgentInfo(agentName) { return this.agents.get(agentName); }
    clearConversation(conversationId = 'default') { this.conversations.delete(conversationId); }
    estimateTokens(text) { return Math.ceil(text.length / 4); }
}

// Factory functions
export function createTahu(config) {
    return new TahuJS(config);
}

export function quickChat(apiKey, message, provider = 'openrouter') {
    const tahu = new TahuJS({ apiKey, provider });
    return tahu.chat(message);
}

export function createQuickAgent(name, apiKey, systemPrompt) {
    const tahu = new TahuJS({ apiKey });
    return tahu.createAgent(name, { systemPrompt });
}

export default TahuJS;