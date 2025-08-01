// src/tahu.js - Enhanced Version with Multiple Services
import axios from 'axios';
import { evaluate } from 'mathjs';
import * as cheerio from 'cheerio';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';
import fs from 'fs'; // Import Node.js File System module
import Database from 'better-sqlite3'; // Import better-sqlite3

// --- LANGCHAIN INTEGRATION: Imports ---
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "@langchain/community/tools/dynamic";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { HumanMessage, AIMessage } from "langchain/schema"; // NEW: Import message types
import { ChatOllama } from "@langchain/community/chat_models/ollama"; // NEW: Import Ollama chat model

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
            provider: config.provider || 'openrouter', // 'openrouter', 'gemini', 'openai', 'ollama'
            apiKey: config.apiKey,
            model: config.model || 'google/gemini-2.0-flash-exp:free',
            temperature: config.temperature || 0.7,
            maxTokens: config.maxTokens || 2000,
            googleMapsApiKey: config.googleMapsApiKey,
            serpApiKey: config.serpApiKey,
            mapboxKey: config.mapboxKey,
            ollamaBaseUrl: config.ollamaBaseUrl || 'http://localhost:11434', // Default for Ollama
            httpReferer: config.httpReferer, // For OpenRouter
            xTitle: config.xTitle, // For OpenRouter
            ...config
        };

        if (!this.config.apiKey && this.config.provider !== 'ollama') {
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

        // Initialize memory directory for JSON/SQLite
        this.memoryDir = './memory';
        if (!fs.existsSync(this.memoryDir)) {
            fs.mkdirSync(this.memoryDir);
        }
        this.sqliteDb = new Database(`${this.memoryDir}/tahu_memory.db`);
        this.sqliteDb.exec(`
            CREATE TABLE IF NOT EXISTS agent_memory (
                agent_name TEXT PRIMARY KEY,
                memory_data TEXT
            );
        `);

        console.log('🥘 TahuJS initialized successfully!');
    }

    // =============== CORE AI METHODS ===============

    initializeLangChain() {
        this.langchain = {};

        // Initialize Chat Model based on provider
        try {
            switch (this.config.provider) {
                case 'openrouter':
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
                    break;
                case 'gemini':
                    const geminiModelName = this.config.model.includes('gemini') ? "gemini-pro" : this.config.model;
                    this.langchain.chatModel = new ChatGoogleGenerativeAI({
                        modelName: geminiModelName,
                        apiKey: this.config.apiKey,
                        temperature: this.config.temperature,
                        maxOutputTokens: this.config.maxTokens,
                    });
                    break;
                case 'openai':
                    this.langchain.chatModel = new ChatOpenAI({
                        modelName: this.config.model,
                        temperature: this.config.temperature,
                        maxTokens: this.config.maxTokens,
                        openAIApiKey: this.config.apiKey,
                    });
                    break;
                case 'ollama':
                    this.langchain.chatModel = new ChatOllama({
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
            this.langchain.chatModel = null; // Ensure it's null if initialization fails
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
        if (!this.langchain.chatModel) {
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

        try {
            console.log(`🔄 Calling LLM via LangChain (${this.config.provider})...`);
            const response = await this.langchain.chatModel.invoke(lcMessages, {
                temperature: options.temperature || this.config.temperature,
                maxTokens: options.maxTokens || this.config.maxTokens,
            });

            const responseContent = response.content;
            history.push({ role: 'assistant', content: responseContent });

            return {
                response: responseContent,
                conversationId: conversation,
                // LangChain models might provide token usage in different ways,
                // this is a simplified estimate for now.
                tokenUsage: options.includeUsage ? this.estimateTokens(message + responseContent) : undefined
            };

        } catch (error) {
            // Generic error handling for LangChain model calls
            console.error(chalk.red(`❌ LLM Chat Error (${this.config.provider}):`), error);
            let errorMessage = `TahuJS Chat Error with ${this.config.provider}: ${error.message}`;

            // Attempt to parse common API errors from LangChain's underlying errors
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

    // Removed callOpenRouter and callGemini as chat method now uses LangChain directly.

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

    // --- NEW FEATURE: Plugin System ---
    use(plugin) {
        if (typeof plugin === 'function') {
            plugin(this); // Pass the TahuJS instance to the plugin function
        } else {
            console.warn('⚠️  Warning: Plugin must be a function.');
        }
    }

    // --- NEW FEATURE: Auto-discovery plugins ---
    loadPlugins(directory) {
        if (!fs.existsSync(directory)) {
            console.warn(chalk.yellow(`⚠️  Warning: Plugin directory "${directory}" not found.`));
            return;
        }
        const files = fs.readdirSync(directory);
        for (const file of files) {
            if (file.endsWith('.js')) {
                try {
                    // Use dynamic import for ESM modules
                    import(`${directory}/${file}`).then(module => {
                        if (typeof module.default === 'function') {
                            this.use(module.default);
                        } else {
                            console.warn(chalk.yellow(`⚠️  Warning: Plugin file "${file}" does not export a default function.`));
                        }
                    }).catch(error => {
                        console.error(chalk.red(`❌ Error loading plugin "${file}": ${error.message}`));
                    });
                } catch (error) {
                    console.error(chalk.red(`❌ Error loading plugin "${file}": ${error.message}`));
                }
            }
        }
    }

    // =============== ENHANCED AGENT MANAGEMENT ===============
    createAgent(name, config = {}) {
        const agent = {
            name,
            systemPrompt: config.systemPrompt || `You are ${name}, a helpful AI assistant.`,
            tools: config.tools || [],
            personality: config.personality || 'helpful',
            memory: [], // Default to volatile in-memory
            memoryType: config.memoryType || 'volatile', // 'volatile', 'json', 'sqlite'
            memoryPath: config.memoryPath, // Path for JSON file or SQLite table name
            maxMemorySize: config.maxMemorySize || 10, // NEW: Limit for in-memory conversation history
            capabilities: config.capabilities || ['chat', 'search', 'calculate'],
            created: new Date().toISOString()
        };

        if (typeof config.personality === 'object' && config.personality !== null) {
            agent.personality = {
                traits: config.personality.traits || [],
                mood: config.personality.mood || '',
                expertise: config.personality.expertise || [],
            };
        } else {
            agent.personality = config.personality || 'helpful';
        }

        // Load existing memory if available
        agent.memory = this._loadAgentMemory(agent.name, agent.memoryType, agent.memoryPath);

        this.agents.set(name, agent);
        console.log(`🤖 Agent "${name}" created successfully! Memory type: ${agent.memoryType}`);
        return agent;
    }

    // --- NEW FEATURE: Smart Agent Templates ---
    createPrebuiltAgent(type, customConfig = {}) {
        let agentConfig = {};
        let agentName = type;

        switch (type.toLowerCase()) {
            case 'coder':
                agentName = customConfig.name || 'CoderAgent';
                agentConfig = {
                    systemPrompt: 'You are an expert software engineer, highly skilled in various programming languages and architectural design. You provide clean, efficient, and well-documented code.',
                    capabilities: ['chat', 'search', 'calculate', 'webScrape'],
                    personality: {
                        traits: ['logical', 'precise', 'problem-solver'],
                        mood: 'focused',
                        expertise: ['javascript', 'python', 'architecture', 'algorithms']
                    }
                };
                break;
            case 'writer':
                agentName = customConfig.name || 'WriterAgent';
                agentConfig = {
                    systemPrompt: 'You are a creative and articulate writer, capable of generating engaging content, articles, and stories across various styles and tones.',
                    capabilities: ['chat', 'search', 'webScrape'],
                    personality: {
                        traits: ['creative', 'eloquent', 'imaginative'],
                        mood: 'inspired',
                        expertise: ['content creation', 'storytelling', 'copywriting']
                    }
                };
                break;
            case 'analyst':
                agentName = customConfig.name || 'AnalystAgent';
                agentConfig = {
                    systemPrompt: 'You are a meticulous data analyst, skilled in interpreting complex data, identifying trends, and providing insightful reports and recommendations.',
                    capabilities: ['chat', 'search', 'calculate', 'webScrape'],
                    personality: {
                        traits: ['analytical', 'detail-oriented', 'objective'],
                        mood: 'observant',
                        expertise: ['data analysis', 'statistics', 'market research']
                    }
                };
                break;
            case 'researcher':
                agentName = customConfig.name || 'ResearcherAgent';
                agentConfig = {
                    systemPrompt: 'You are a comprehensive research assistant, adept at finding, synthesizing, and summarizing information from various sources.',
                    capabilities: ['chat', 'search', 'webScrape', 'dateTime'],
                    personality: {
                        traits: ['curious', 'thorough', 'objective'],
                        mood: 'inquisitive',
                        expertise: ['information retrieval', 'academic research', 'fact-checking']
                    }
                };
                break;
            default:
                throw new Error(`Unknown pre-built agent type: ${type}. Available types: coder, writer, analyst, researcher.`);
        }

        // Merge with custom config, allowing customConfig to override defaults
        const finalConfig = { ...agentConfig, ...customConfig };
        return this.createAgent(agentName, finalConfig);
    }

    async runAgent(agentName, task, options = {}) {
        const agent = this.agents.get(agentName);
        if (!agent) throw new Error(`Agent "${agentName}" not found`);

        // Load memory before running the agent (if not volatile)
        if (agent.memoryType !== 'volatile') {
            agent.memory = this._loadAgentMemory(agent.name, agent.memoryType, agent.memoryPath);
        }

        const enhancedPrompt = `${agent.systemPrompt}\n\nUser Task: ${task}\n\nYour capabilities: ${agent.capabilities.join(', ')}`;

        const result = await this.chat(enhancedPrompt, {
            ...options,
            conversationId: `agent_${agentName}_${Date.now()}` // Use a unique conversation ID for each run
        });

        // Add current task and result to agent's memory
        agent.memory.push({
            task,
            result: result.response,
            timestamp: new Date().toISOString()
        });

        // Trim memory if it exceeds maxMemorySize (for volatile and loaded memory)
        if (agent.memory.length > agent.maxMemorySize) {
            agent.memory = agent.memory.slice(-agent.maxMemorySize);
        }

        // Save memory after running the agent (if not volatile)
        if (agent.memoryType !== 'volatile') {
            this._saveAgentMemory(agent.name, agent.memory, agent.memoryType, agent.memoryPath);
        }

        return result;
    }

    // --- NEW FEATURE: Multi-agent workflows ---
    async createWorkflow(workflowDefinition) {
        const tahuInstance = this; // Capture 'this' for use in inner functions
        return {
            definition: workflowDefinition,
            async execute(initialInput) {
                console.log(chalk.magenta(`🚀 Starting workflow with initial input: "${initialInput}"`));
                const results = {};
                const taskQueue = [...workflowDefinition]; // Copy to allow modification

                while (taskQueue.length > 0) {
                    const currentTask = taskQueue.shift();
                    const { agent: agentName, task: taskName, depends } = currentTask;

                    // Check dependencies
                    let allDependenciesMet = true;
                    let dependencyResults = {};
                    if (depends && depends.length > 0) {
                        for (const dep of depends) {
                            if (!results[dep]) {
                                allDependenciesMet = false;
                                break;
                            }
                            dependencyResults[dep] = results[dep];
                        }
                    }

                    if (!allDependenciesMet) {
                        // If dependencies not met, push back to queue and try later
                        taskQueue.push(currentTask);
                        continue;
                    }

                    console.log(chalk.cyan(`  Executing task "${taskName}" by agent "${agentName}"...`));
                    let inputForAgent = initialInput;
                    if (depends && depends.length > 0) {
                        // Combine initial input with dependency results
                        inputForAgent = `${initialInput}\n\nPrevious results: ${JSON.stringify(dependencyResults)}`;
                    }

                    try {
                        const agentResult = await tahuInstance.runAgent(agentName, inputForAgent);
                        results[taskName] = agentResult.response;
                        console.log(chalk.green(`  ✅ Task "${taskName}" completed. Result stored.`));
                    } catch (error) {
                        console.error(chalk.red(`  ❌ Task "${taskName}" failed for agent "${agentName}": ${error.message}`));
                        results[taskName] = `Error: ${error.message}`;
                        // Decide whether to stop workflow or continue
                        throw new Error(`Workflow failed at task "${taskName}": ${error.message}`);
                    }
                }
                console.log(chalk.magenta('🎉 Workflow completed!')); // FIX: Changed console to console.log
                return results;
            }
        };
    }

    // --- NEW FEATURE: Parallel agent execution ---
    async parallel(tasks) {
        console.log(chalk.blue(`⚡ Executing ${tasks.length} tasks in parallel...`));
        const promises = tasks.map(task => {
            if (task instanceof Promise) {
                return task; // If it's already a promise (e.g., agent.process call)
            } else if (task.agent && task.input) {
                return this.runAgent(task.agent, task.input, task.options);
            } else if (task.prompt) {
                return this.chat(task.prompt, task.options);
            }
            return Promise.reject(new Error('Invalid task format for parallel execution.'));
        });

        try {
            const results = await Promise.all(promises);
            console.log(chalk.green('✅ All parallel tasks completed.'));
            return results;
        } catch (error) {
            console.error(chalk.red(`❌ One or more parallel tasks failed: ${error.message}`));
            throw error;
        }
    }

    // --- NEW FEATURE: Batch processing (simple parallel chat) ---
    async batch(promptsAndOptions) {
        console.log(chalk.blue(`📦 Processing ${promptsAndOptions.length} prompts in batch...`));
        const promises = promptsAndOptions.map(item => {
            if (!item.prompt) {
                return Promise.reject(new Error('Each batch item must have a "prompt" property.'));
            }
            return this.chat(item.prompt, item.options);
        });

        try {
            const results = await Promise.all(promises);
            console.log(chalk.green('✅ All batch prompts processed.'));
            return results;
        } catch (error) {
            console.error(chalk.red(`❌ One or more batch prompts failed: ${error.message}`));
            throw error;
        }
    }

    // --- Memory Management Helpers (existing) ---
    _getJsonMemoryPath(agentName) {
        return `${this.memoryDir}/agent_${agentName}.json`;
    }

    _loadAgentMemory(agentName, memoryType, memoryPath) {
        if (memoryType === 'json') {
            const filePath = memoryPath || this._getJsonMemoryPath(agentName);
            if (fs.existsSync(filePath)) {
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    return JSON.parse(data);
                } catch (error) {
                    console.error(chalk.red(`❌ Error loading JSON memory for agent "${agentName}": ${error.message}`));
                    return [];
                }
            }
        } else if (memoryType === 'sqlite') {
            const stmt = this.sqliteDb.prepare('SELECT memory_data FROM agent_memory WHERE agent_name = ?');
            const row = stmt.get(agentName);
            if (row) {
                try {
                    return JSON.parse(row.memory_data);
                } catch (error) {
                    console.error(chalk.red(`❌ Error parsing SQLite memory for agent "${agentName}": ${error.message}`));
                    return [];
                }
            }
        }
        return []; // Default to empty array for volatile or if no saved memory
    }

    _saveAgentMemory(agentName, memoryData, memoryType, memoryPath) {
        if (memoryType === 'json') {
            const filePath = memoryPath || this._getJsonMemoryPath(agentName);
            try {
                fs.writeFileSync(filePath, JSON.stringify(memoryData, null, 2), 'utf8');
                console.log(chalk.green(`💾 JSON memory saved for agent "${agentName}" to ${filePath}`));
            } catch (error) {
                console.error(chalk.red(`❌ Error saving JSON memory for agent "${agentName}": ${error.message}`));
            }
        } else if (memoryType === 'sqlite') {
            const stmt = this.sqliteDb.prepare('INSERT OR REPLACE INTO agent_memory (agent_name, memory_data) VALUES (?, ?)');
            try {
                stmt.run(agentName, JSON.stringify(memoryData));
                console.log(chalk.green(`💾 SQLite memory saved for agent "${agentName}"`));
            } catch (error) {
                console.error(chalk.red(`❌ Error saving SQLite memory for agent "${agentName}": ${error.message}`));
            }
        }
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