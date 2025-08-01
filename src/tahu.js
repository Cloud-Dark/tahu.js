// src/tahu.js - Enhanced Version with Modular Managers
import Database from 'better-sqlite3';
import chalk from 'chalk';
import fs from 'fs';

// Import services
import { SearchService } from './services/search-service.js';
import { MapService } from './services/map-service.js';

// Import modular managers
import { MemoryManager } from './core/memory-manager.js';
import { LLMManager } from './core/llm-manager.js';
import { ToolManager } from './core/tool-manager.js';
import { AgentManager } from './core/agent-manager.js';
import { WorkflowManager } from './core/workflow-manager.js';
import { PluginManager } from './core/plugin-manager.js';
import { AnalyticsManager } from './core/analytics-manager.js';
import { VectorStoreManager } from './core/vector-store-manager.js'; // Import VectorStoreManager

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
            ollamaBaseUrl: config.ollamaBaseUrl || 'http://localhost:11434',
            httpReferer: config.httpReferer,
            xTitle: config.xTitle,
            embeddingModel: config.embeddingModel, // New: for specific embedding model
            chromaDbUrl: config.chromaDbUrl, // New: for ChromaDB URL
            ...config
        };

        if (!this.config.apiKey && this.config.provider !== 'ollama') {
            console.warn('⚠️  Warning: API key not provided. Some features may not work.');
        }

        this.tools = new Map();
        this.agents = new Map();
        this.conversations = new Map();

        // Initialize core components and managers
        this.memoryDir = './memory';
        if (!fs.existsSync(this.memoryDir)) {
            fs.mkdirSync(this.memoryDir);
        }
        this.sqliteDb = new Database(`${this.memoryDir}/tahu_memory.db`);

        this.searchService = new SearchService(this.config);
        this.mapService = new MapService(this.config);
        this.analyticsManager = new AnalyticsManager();

        this.memoryManager = new MemoryManager(this.memoryDir, this.sqliteDb);
        this.llmManager = new LLMManager(this.config, this.tools, this.conversations, this.analyticsManager);
        this.vectorStoreManager = new VectorStoreManager(this.config, this.llmManager, this.memoryDir, this.sqliteDb); // New: Initialize VectorStoreManager
        this.toolManager = new ToolManager(this.tools, this.searchService, this.mapService, this.llmManager, this.vectorStoreManager); // Pass vectorStoreManager
        this.agentManager = new AgentManager(this.agents, this.llmManager, this.memoryManager);
        this.workflowManager = new WorkflowManager(this.llmManager, this.agentManager);
        this.pluginManager = new PluginManager(this);

        // Expose managers
        this.analytics = this.analyticsManager;
        this.vectorStore = this.vectorStoreManager; // New: Expose vectorStoreManager

        console.log('🥘 TahuJS initialized successfully!');
    }

    // =============== CORE AI METHODS (Delegated to Managers) ===============

    async chat(message, options = {}) {
        return this.llmManager.chat(message, options);
    }

    async createLangChainAgent(systemPrompt) {
        return this.llmManager.createLangChainAgent(systemPrompt);
    }

    // =============== TOOL MANAGEMENT (Delegated to ToolManager) ===============

    registerTool(name, tool) {
        this.toolManager.registerTool(name, tool);
    }

    async useTool(toolName, ...args) {
        return this.toolManager.useTool(toolName, ...args);
    }

    listTools() {
        return this.toolManager.listTools();
    }

    // =============== AGENT MANAGEMENT (Delegated to AgentManager) ===============

    createAgent(name, config = {}) {
        return this.agentManager.createAgent(name, config);
    }

    createPrebuiltAgent(type, customConfig = {}) {
        return this.agentManager.createPrebuiltAgent(type, customConfig);
    }

    async runAgent(agentName, task, options = {}) {
        return this.agentManager.runAgent(agentName, task, options);
    }

    listAgents() {
        return this.agentManager.listAgents();
    }

    getAgentInfo(agentName) {
        return this.agentManager.getAgentInfo(agentName);
    }

    // =============== WORKFLOW & PARALLEL PROCESSING (Delegated to WorkflowManager) ===============

    createWorkflow(workflowDefinition) {
        return this.workflowManager.createWorkflow(workflowDefinition);
    }

    async parallel(tasks) {
        return this.workflowManager.parallel(tasks);
    }

    async batch(promptsAndOptions) {
        return this.workflowManager.batch(promptsAndOptions);
    }

    // =============== PLUGIN SYSTEM (Delegated to PluginManager) ===============

    use(plugin) {
        this.pluginManager.use(plugin);
    }

    loadPlugins(directory) {
        this.pluginManager.loadPlugins(directory);
    }

    // =============== UTILITY METHODS (Remaining in TahuJS or delegated if appropriate) ===============

    clearConversation(conversationId = 'default') {
        this.llmManager.clearConversation(conversationId);
    }

    // AgentBuilder (tetap di sini atau bisa dipindahkan ke AgentManager jika lebih kompleks)
    builder() {
        const tahuInstance = this; // Capture 'this' for the builder methods
        const agentConfig = {
            name: 'NewAgent',
            systemPrompt: 'You are a helpful AI assistant.',
            capabilities: [],
            personality: 'helpful',
            memoryType: 'volatile',
            maxMemorySize: 10,
            memoryPath: undefined
        };

        return {
            name: function(name) {
                agentConfig.name = name;
                return this;
            },
            systemPrompt: function(prompt) {
                agentConfig.systemPrompt = prompt;
                return this;
            },
            addCapabilities: function(...capabilities) {
                agentConfig.capabilities = [...new Set([...agentConfig.capabilities, ...capabilities])];
                return this;
            },
            addPersonality: function(traits, mood, expertise) {
                agentConfig.personality = { traits, mood, expertise };
                return this;
            },
            addMemory: function(type, options = {}) {
                agentConfig.memoryType = type;
                agentConfig.maxMemorySize = options.maxMemorySize || agentConfig.maxMemorySize;
                agentConfig.memoryPath = options.memoryPath;
                return this;
            },
            build: function() {
                return tahuInstance.createAgent(agentConfig.name, agentConfig);
            }
        };
    }
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