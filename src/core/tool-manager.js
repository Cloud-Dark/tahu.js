// src/core/tool-manager.js
import chalk from 'chalk';

// Import tools
import { webSearchTool } from '../tools/web-search-tool.js';
import { calculateTool } from '../tools/calculate-tool.js';
import { findLocationTool } from '../tools/find-location-tool.js';
import { getDirectionsTool } from '../tools/get-directions-tool.js';
import { getElevationTool } from '../tools/get-elevation-tool.js';
import { webScrapeTool } from '../tools/web-scrape-tool.js';
import { dateTimeTool } from '../tools/date-time-tool.js';
import { summarizeTool } from '../tools/summarize-tool.js';
import { trainKnowledgeTool } from '../tools/train-knowledge-tool.js'; // Import new tool
import { retrieveKnowledgeTool } from '../tools/retrieve-knowledge-tool.js'; // Import new tool

export class ToolManager {
  constructor(
    config, // New: Pass config here
    toolsMap,
    searchService,
    mapService,
    llmManager,
    vectorStoreManager
  ) {
    this.config = config; // Store config
    this.tools = toolsMap; // Reference to the main tools Map
    this.searchService = searchService;
    this.mapService = mapService;
    this.llmManager = llmManager;
    this.vectorStoreManager = vectorStoreManager; // Store vectorStoreManager
    this.initializeBuiltInTools();
  }

  initializeBuiltInTools() {
    const toolsToRegister = [
      { name: webSearchTool.name, tool: webSearchTool, execute: (query) => webSearchTool.execute(query, this.searchService) },
      { name: calculateTool.name, tool: calculateTool, execute: calculateTool.execute },
      { name: findLocationTool.name, tool: findLocationTool, execute: (query) => findLocationTool.execute(query, this.mapService) },
      { name: getDirectionsTool.name, tool: getDirectionsTool, execute: (input) => getDirectionsTool.execute(input, this.mapService) },
      { name: getElevationTool.name, tool: getElevationTool, execute: (input) => getElevationTool.execute(input, this.mapService) },
      { name: webScrapeTool.name, tool: webScrapeTool, execute: webScrapeTool.execute },
      { name: dateTimeTool.name, tool: dateTimeTool, execute: dateTimeTool.execute },
      { name: summarizeTool.name, tool: summarizeTool, execute: (text) => summarizeTool.execute(text, this.llmManager) },
      { name: trainKnowledgeTool.name, tool: trainKnowledgeTool, execute: (input) => trainKnowledgeTool.execute(input, this.vectorStoreManager) },
      { name: retrieveKnowledgeTool.name, tool: retrieveKnowledgeTool, execute: (input) => retrieveKnowledgeTool.execute(input, this.vectorStoreManager) },
    ];

    const enabledToolsConfig = this.config.tools?.enabled;

    for (const { name, tool, execute } of toolsToRegister) {
      if (!enabledToolsConfig || enabledToolsConfig.includes(name)) {
        this.registerTool(name, {
          description: tool.description,
          execute: execute,
        });
      } else {
        console.log(chalk.gray(`🔧 Tool "${name}" skipped (not enabled in config).`));
      }
    }
  }

  registerTool(name, tool) {
    this.tools.set(name, {
      name,
      description: tool.description,
      execute: tool.execute,
      parameters: tool.parameters || {},
      registered: new Date().toISOString(),
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

  listTools() {
    return Array.from(this.tools.keys());
  }
}
