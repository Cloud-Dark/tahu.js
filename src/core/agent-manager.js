// src/core/agent-manager.js
import chalk from 'chalk';
import TahuJS from '../tahu.js';

export class AgentManager {
  constructor(agentsMap, llmManager, memoryManager, config = {}) {
    this.agents = agentsMap; // Reference to the main agents Map
    this.llmManager = llmManager;
    this.memoryManager = memoryManager;
    this.config = config;
  }

  // Debug logging methods - only logs when debug mode is enabled
  _debugLog(message, ...args) {
    TahuJS.debugLog(this.config.debug, message, ...args);
  }

  _debugInfo(message, ...args) {
    TahuJS.debugInfo(this.config.debug, message, ...args);
  }

  _debugWarn(message, ...args) {
    TahuJS.debugWarn(this.config.debug, message, ...args);
  }

  _debugError(message, ...args) {
    TahuJS.debugError(this.config.debug, message, ...args);
  }

  createAgent(name, config = {}) {
    const agent = {
      name,
      systemPrompt:
        config.systemPrompt || `You are ${name}, a helpful AI assistant.`,
      tools: config.tools || [], // This might be deprecated if using LangChain agent directly
      personality: config.personality || 'helpful',
      memory: [], // Default to volatile in-memory
      memoryType: config.memoryType || 'volatile', // 'volatile', 'json', 'sqlite'
      memoryPath: config.memoryPath, // Path for JSON file or SQLite table name
      maxMemorySize: config.maxMemorySize || 10,
      capabilities: config.capabilities || ['chat', 'search', 'calculate'],
      created: new Date().toISOString(),
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
    agent.memory = this.memoryManager.loadAgentMemory(
      agent.name,
      agent.memoryType,
      agent.memoryPath
    );

    this.agents.set(name, agent);
    this._debugLog(
      `🤖 Agent "${name}" created successfully! Memory type: ${agent.memoryType}`
    );
    return agent;
  }

  createPrebuiltAgent(type, customConfig = {}) {
    let agentConfig = {};
    let agentName = type;

    switch (type.toLowerCase()) {
      case 'coder':
        agentName = customConfig.name || 'CoderAgent';
        agentConfig = {
          systemPrompt:
            'You are an expert software engineer, highly skilled in various programming languages and architectural design. You provide clean, efficient, and well-documented code.',
          capabilities: ['chat', 'search', 'calculate', 'webScrape'],
          personality: {
            traits: ['logical', 'precise', 'problem-solver'],
            mood: 'focused',
            expertise: ['javascript', 'python', 'architecture', 'algorithms'],
          },
        };
        break;
      case 'writer':
        agentName = customConfig.name || 'WriterAgent';
        agentConfig = {
          systemPrompt:
            'You are a creative and articulate writer, capable of generating engaging content, articles, and stories across various styles and tones.',
          capabilities: ['chat', 'search', 'webScrape'],
          personality: {
            traits: ['creative', 'eloquent', 'imaginative'],
            mood: 'inspired',
            expertise: ['content creation', 'storytelling', 'copywriting'],
          },
        };
        break;
      case 'analyst':
        agentName = customConfig.name || 'AnalystAgent';
        agentConfig = {
          systemPrompt:
            'You are a meticulous data analyst, skilled in interpreting complex data, identifying trends, and providing insightful reports and recommendations.',
          capabilities: ['chat', 'search', 'calculate', 'webScrape'],
          personality: {
            traits: ['analytical', 'detail-oriented', 'objective'],
            mood: 'observant',
            expertise: ['data analysis', 'statistics', 'market research'],
          },
        };
        break;
      case 'researcher':
        agentName = customConfig.name || 'ResearcherAgent';
        agentConfig = {
          systemPrompt:
            'You are a comprehensive research assistant, adept at finding, synthesizing, and summarizing information from various sources.',
          capabilities: ['chat', 'search', 'webScrape', 'dateTime'],
          personality: {
            traits: ['curious', 'thorough', 'objective'],
            mood: 'inquisitive',
            expertise: [
              'information retrieval',
              'academic research',
              'fact-checking',
            ],
          },
        };
        break;
      case 'nlp':
        agentName = customConfig.name || 'NLPAgent';
        agentConfig = {
          systemPrompt:
            'You are a natural language processing expert, specialized in text analysis, sentiment analysis, intent recognition, and language understanding.',
          capabilities: [
            'chat',
            'analyzeSentiment',
            'recognizeIntent',
            'extractEntities',
            'detectLanguage',
            'classifyText',
          ],
          personality: {
            traits: ['analytical', 'linguistic', 'precise'],
            mood: 'focused',
            expertise: [
              'nlp',
              'text analysis',
              'language processing',
              'machine learning',
            ],
          },
        };
        break;
      case 'translator':
        agentName = customConfig.name || 'TranslatorAgent';
        agentConfig = {
          systemPrompt:
            'You are a multilingual translation expert, capable of translating text between various languages while preserving context and meaning.',
          capabilities: ['chat', 'detectLanguage', 'analyzeSentiment'],
          personality: {
            traits: ['multilingual', 'cultural-aware', 'precise'],
            mood: 'helpful',
            expertise: ['translation', 'linguistics', 'cultural context'],
          },
        };
        break;
      case 'chatbot':
        agentName = customConfig.name || 'ChatbotAgent';
        agentConfig = {
          systemPrompt:
            'You are a friendly and intelligent chatbot, designed to provide helpful responses and engage in natural conversations with users.',
          capabilities: [
            'chat',
            'analyzeSentiment',
            'recognizeIntent',
            'search',
          ],
          personality: {
            traits: ['friendly', 'helpful', 'engaging'],
            mood: 'cheerful',
            expertise: [
              'conversation',
              'customer service',
              'general knowledge',
            ],
          },
        };
        break;
      case 'support':
        agentName = customConfig.name || 'SupportAgent';
        agentConfig = {
          systemPrompt:
            'You are a customer support specialist, trained to provide helpful assistance, troubleshoot issues, and ensure customer satisfaction.',
          capabilities: [
            'chat',
            'analyzeSentiment',
            'recognizeIntent',
            'search',
            'classifyText',
          ],
          personality: {
            traits: ['patient', 'empathetic', 'solution-oriented'],
            mood: 'professional',
            expertise: ['customer service', 'problem solving', 'communication'],
          },
        };
        break;
      default:
        throw new Error(
          `Unknown pre-built agent type: ${type}. Available types: coder, writer, analyst, researcher, nlp, translator, chatbot, support.`
        );
    }

    const finalConfig = { ...agentConfig, ...customConfig };
    return this.createAgent(agentName, finalConfig);
  }

  async runAgent(agentName, task, options = {}) {
    const agent = this.agents.get(agentName);
    if (!agent) throw new Error(`Agent "${agentName}" not found`);

    if (agent.memoryType !== 'volatile') {
      agent.memory = this.memoryManager.loadAgentMemory(
        agent.name,
        agent.memoryType,
        agent.memoryPath
      );
    }

    const enhancedPrompt = `${agent.systemPrompt}\n\nUser Task: ${task}\n\nYour capabilities: ${agent.capabilities.join(', ')}`;

    const result = await this.llmManager.chat(enhancedPrompt, {
      ...options,
      conversationId: `agent_${agentName}_${Date.now()}`,
    });

    agent.memory.push({
      task,
      result: result.response,
      timestamp: new Date().toISOString(),
    });

    if (agent.memory.length > agent.maxMemorySize) {
      agent.memory = agent.memory.slice(-agent.maxMemorySize);
    }

    if (agent.memoryType !== 'volatile') {
      this.memoryManager.saveAgentMemory(
        agent.name,
        agent.memory,
        agent.memoryType,
        agent.memoryPath
      );
    }

    return result;
  }

  listAgents() {
    return Array.from(this.agents.keys());
  }

  getAgentInfo(agentName) {
    return this.agents.get(agentName);
  }
}
