// index.js - Enhanced Version with Multiple Services
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
        // Enhanced Web Search with 3 fallback options
        this.registerTool('webSearch', {
            description: 'Search the web using multiple search engines (SerpApi, DuckDuckGo, Google Scraping)',
            execute: async (query) => {
                return await this.searchService.search(query);
            }
        });

        // Enhanced Calculator Tool
        this.registerTool('calculate', {
            description: 'Perform mathematical calculations and expressions',
            execute: async (expression) => {
                try {
                    const cleanExpression = expression.replace(/[^0-9+\-*/().\s^√]/g, '');
                    const result = evaluate(cleanExpression);
                    return `✅ Calculation: ${expression} = ${result}`;
                } catch (error) {
                    return `❌ Calculation error: ${error.message}. Please check your mathematical expression.`;
                }
            }
        });

        // --- LANGCHAIN FIX: Modified for single string input ---
        this.registerTool('getElevation', {
            description: 'Gets the elevation data for a specific geographic coordinate. Input must be a string with "latitude,longitude". Example: "-6.2088,106.8456".',
            execute: (input) => {
                const parts = String(input).split(',');
                if (parts.length !== 2) return "❌ Invalid format. Please provide coordinates as 'latitude,longitude'.";
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                return this.mapService.getElevation(lat, lng);
            }
        });

        // Enhanced Map Services with multiple providers
        this.registerTool('findLocation', {
            description: 'Find location using multiple map services with links and QR codes',
            execute: async (query) => {
                return await this.mapService.findLocation(query);
            }
        });

        // Get directions between two locations
        this.registerTool('getDirections', {
            description: 'Get directions between two locations',
            execute: async (from, to) => {
                return await this.mapService.getDirections(from, to);
            }
        });

        // Get elevation data
        this.registerTool('getElevation', {
            description: 'Get elevation data for coordinates',
            execute: async (lat, lng) => {
                return await this.mapService.getElevation(lat, lng);
            }
        });

        // Enhanced Web Scraper Tool
        this.registerTool('webScrape', {
            description: 'Extract content from web pages',
            execute: async (url) => {
                try {
                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        url = 'https://' + url;
                    }

                    const response = await axios.get(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        },
                        timeout: 15000,
                        maxRedirects: 5
                    });

                    const $ = cheerio.load(response.data);

                    $('script, style').remove();

                    const title = $('title').text().trim();
                    const description = $('meta[name="description"]').attr('content') ||
                        $('meta[property="og:description"]').attr('content') || '';

                    let content = '';
                    const contentSelectors = ['main', 'article', '.content', '#content', '.post', '.entry'];

                    for (const selector of contentSelectors) {
                        const element = $(selector);
                        if (element.length > 0) {
                            content = element.text().trim().substring(0, 500);
                            break;
                        }
                    }

                    if (!content) {
                        content = $('body').text().trim().substring(0, 500);
                    }

                    return `📄 Title: ${title}\n📝 Description: ${description}\n📖 Content Preview: ${content}...`;

                } catch (error) {
                    return `❌ Web scraping error: ${error.message}`;
                }
            }
        });

        // Time and Date Tool
        this.registerTool('dateTime', {
            description: 'Get current date and time information',
            execute: async (timezone = 'UTC') => {
                try {
                    const now = new Date();
                    const options = {
                        timeZone: timezone,
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        weekday: 'long'
                    };

                    const formatter = new Intl.DateTimeFormat('en-US', options);
                    const formattedDate = formatter.format(now);

                    return `🕐 Current Date & Time (${timezone}): ${formattedDate}\n⏰ Timestamp: ${now.getTime()}\n📅 ISO String: ${now.toISOString()}`;
                } catch (error) {
                    return `❌ DateTime error: ${error.message}`;
                }
            }
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

// =============== SEARCH SERVICE CLASS ===============
class SearchService {
    constructor(config) {
        this.config = config;
    }

    async search(query) {
        console.log(chalk.blue(`🔍 Searching for: "${query}"`));

        // Try SerpApi first (most reliable)
        if (this.config.serpApiKey) {
            console.log(chalk.yellow('📡 Trying SerpApi...'));
            try {
                const result = await this.searchWithSerpApi(query);
                if (result && !result.includes('❌')) {
                    return result;
                }
            } catch (error) {
                console.log(chalk.red('❌ SerpApi failed:', error.message));
            }
        }

        // Try DuckDuckGo (free but limited)
        console.log(chalk.yellow('🦆 Trying DuckDuckGo...'));
        try {
            const result = await this.searchWithDuckDuckGo(query);
            if (result && !result.includes('❌')) {
                return result;
            }
        } catch (error) {
            console.log(chalk.red('❌ DuckDuckGo failed:', error.message));
        }

        // Try Google scraping (last resort)
        console.log(chalk.yellow('🌐 Trying Google scraping...'));
        try {
            const result = await this.searchWithGoogleScraping(query);
            if (result && !result.includes('❌')) {
                return result;
            }
        } catch (error) {
            console.log(chalk.red('❌ Google scraping failed:', error.message));
        }

        return `❌ All search methods failed for "${query}". Please try again later or check your internet connection.`;
    }

    async searchWithSerpApi(query) {
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                q: query,
                api_key: this.config.serpApiKey,
                engine: 'google',
                num: 3,
                gl: 'id', // Indonesia
                hl: 'id'
            },
            timeout: 10000
        });

        const results = response.data.organic_results || [];
        if (results.length === 0) {
            return `❌ No results found via SerpApi for "${query}"`;
        }

        const formattedResults = results.slice(0, 3).map((result, index) =>
            `${index + 1}. ${result.title}\n   ${result.snippet}\n   🔗 ${result.link}`
        ).join('\n\n');

        return `🔍 Search results (SerpApi) for "${query}":\n\n${formattedResults}`;
    }

    async searchWithDuckDuckGo(query) {
        // Use DuckDuckGo's instant answer API
        const response = await axios.get('https://api.duckduckgo.com/', {
            params: {
                q: query,
                format: 'json',
                no_html: '1',
                skip_disambig: '1'
            },
            timeout: 10000
        });

        const data = response.data;

        // Check for instant answer
        if (data.AbstractText) {
            return `🦆 DuckDuckGo Result for "${query}":\n\n${data.AbstractText}\n🔗 ${data.AbstractURL}`;
        }

        // Check for related topics
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            const topics = data.RelatedTopics.slice(0, 3).map((topic, index) => {
                if (topic.Text) {
                    return `${index + 1}. ${topic.Text}\n   🔗 ${topic.FirstURL}`;
                }
                return null;
            }).filter(Boolean);

            if (topics.length > 0) {
                return `🦆 DuckDuckGo Results for "${query}":\n\n${topics.join('\n\n')}`;
            }
        }

        return `❌ No results found via DuckDuckGo for "${query}"`;
    }

    async searchWithGoogleScraping(query) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=5&hl=id`;

        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);
        const results = [];

        // Try multiple selectors for Google results
        const selectors = [
            '.g .yuRUbf', // Current Google structure
            '.rc', // Classic Google structure
            '[data-ved] h3', // Alternative structure
        ];

        for (const selector of selectors) {
            $(selector).each((index, element) => {
                if (results.length >= 3) return false;

                let title, link, snippet;

                if (selector === '.g .yuRUbf') {
                    title = $(element).find('h3').text();
                    link = $(element).find('a').attr('href');
                    snippet = $(element).closest('.g').find('.VwiC3b, .s3v9rd').text();
                } else if (selector === '.rc') {
                    title = $(element).find('h3').text();
                    link = $(element).find('a').first().attr('href');
                    snippet = $(element).find('.s').text();
                } else {
                    title = $(element).text();
                    link = $(element).closest('a').attr('href');
                    snippet = $(element).closest('.g, .rc').find('.VwiC3b, .s, .s3v9rd').text();
                }

                if (title && title.length > 0) {
                    results.push({
                        title: title.trim(),
                        link: link || '',
                        snippet: snippet?.trim() || 'No description available'
                    });
                }
            });

            if (results.length > 0) break;
        }

        if (results.length === 0) {
            return `❌ No results found via Google scraping for "${query}"`;
        }

        const formattedResults = results.map((result, index) =>
            `${index + 1}. ${result.title}\n   ${result.snippet}\n   🔗 ${result.link}`
        ).join('\n\n');

        return `🌐 Google Search Results for "${query}":\n\n${formattedResults}`;
    }
}

// =============== MAP SERVICE CLASS ===============
class MapService {
    constructor(config) {
        this.config = config;
        this.services = {
            nominatim: 'https://nominatim.openstreetmap.org',
            overpass: 'https://overpass-api.de/api/interpreter',
            elevation: 'https://api.open-elevation.com/api/v1/lookup',
            staticMap: 'https://staticmap.openstreetmap.de/staticmap.php'
        };
    }

    async findLocation(query) {
        try {
            console.log(chalk.blue(`📍 Finding location: "${query}"`));

            // Get coordinates from Nominatim (OpenStreetMap)
            const response = await axios.get(`${this.services.nominatim}/search`, {
                params: {
                    format: 'json',
                    q: query,
                    limit: 1,
                    addressdetails: 1,
                    extratags: 1
                },
                headers: {
                    'User-Agent': 'TahuJS/1.0.0 (https://github.com/yourusername/tahu.js)'
                },
                timeout: 10000
            });

            if (response.data.length === 0) {
                return `❌ Location "${query}" not found.`;
            }

            const result = response.data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);

            // Get elevation data
            const elevation = await this.getElevation(lat, lng);

            // Generate all map links
            const mapLinks = this.generateLocationLinks(lat, lng);

            // Create static map URL
            const staticMapUrl = this.getStaticMapUrl(lat, lng);

            let locationInfo = `📍 Location Found: ${result.display_name}\n`;
            locationInfo += `📊 Coordinates: ${lat}, ${lng}\n`;
            if (elevation) {
                locationInfo += `⛰️  Elevation: ${elevation}m above sea level\n`;
            }
            locationInfo += `🏷️  OSM ID: ${result.osm_id}\n\n`;
            locationInfo += `🌍 Map Links:\n${mapLinks}\n\n`;
            locationInfo += `🗺️  Static Map: ${staticMapUrl}\n`;

            // Generate QR code for Google Maps link
            const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
            console.log(chalk.white('\n📱 QR Code (Google Maps):'));
            this.generateQRCode(googleMapsUrl);

            return locationInfo;

        } catch (error) {
            return `❌ Location search error: ${error.message}`;
        }
    }

    generateLocationLinks(lat, lng) {
        const links = [];

        // OpenStreetMap
        const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;
        links.push(`• OpenStreetMap: ${osmUrl}`);

        // Google Maps
        const googleUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
        links.push(`• Google Maps: ${googleUrl}`);

        // Bing Maps
        const bingUrl = `https://www.bing.com/maps?cp=${lat}~${lng}&lvl=15`;
        links.push(`• Bing Maps: ${bingUrl}`);

        // WikiMapia
        const wikiMapiaUrl = `http://wikimapia.org/#lang=id&lat=${lat}&lon=${lng}&z=15`;
        links.push(`• WikiMapia: ${wikiMapiaUrl}`);

        // Apple Maps
        const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}&z=15`;
        links.push(`• Apple Maps: ${appleMapsUrl}`);

        // Mapbox (if available)
        if (this.config.mapboxKey) {
            const mapboxUrl = `https://www.mapbox.com/maps/?center=${lng},${lat}&zoom=15`;
            links.push(`• Mapbox: ${mapboxUrl}`);
        }

        return links.join('\n');
    }

    generateQRCode(url) {
        qrcode.generate(url, { small: true }, (qr) => {
            console.log(qr);
        });
    }

    getStaticMapUrl(lat, lng, zoom = 15, width = 400, height = 300) {
        return `${this.services.staticMap}?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
    }

    async getElevation(lat, lng) {
        try {
            const response = await axios.get(`${this.services.elevation}?locations=${lat},${lng}`, {
                timeout: 5000
            });
            return response.data.results[0]?.elevation || null;
        } catch (error) {
            return null;
        }
    }

    // --- LANGCHAIN FIX: Modified to accept a single string input ---
    async getDirections(input) {
        try {
            // Use a regex to robustly parse the "from ... to ..." format
            const match = String(input).match(/from (.*) to (.*)/i);
            if (!match) {
                return `❌ Invalid format for directions. Please use "from [origin] to [destination]".`;
            }

            const from = match[1].trim();
            const to = match[2].trim();

            if (!from || !to) {
                return `❌ Origin or destination is missing. Please use "from [origin] to [destination]".`;
            }

            const directionsLinks = [];
            directionsLinks.push(`• Google Maps: https://maps.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`);
            directionsLinks.push(`• Bing Maps: https://www.bing.com/maps/directions?rtp=adr.${encodeURIComponent(from)}~adr.${encodeURIComponent(to)}`);

            return `🗺️  Directions from "${from}" to "${to}":\n\n${directionsLinks.join('\n')}`;

        } catch (error) {
            return `❌ Directions error: ${error.message}`;
        }
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