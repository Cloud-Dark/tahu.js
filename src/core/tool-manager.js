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
    toolsMap,
    searchService,
    mapService,
    llmManager,
    vectorStoreManager
  ) {
    // Add vectorStoreManager
    this.tools = toolsMap; // Reference to the main tools Map
    this.searchService = searchService;
    this.mapService = mapService;
    this.llmManager = llmManager;
    this.vectorStoreManager = vectorStoreManager; // Store vectorStoreManager
    this.initializeBuiltInTools();
  }

  initializeBuiltInTools() {
    this.registerTool(webSearchTool.name, {
      description: webSearchTool.description,
      execute: (query) => webSearchTool.execute(query, this.searchService),
    });

    this.registerTool(calculateTool.name, {
      description: calculateTool.description,
      execute: calculateTool.execute,
    });

    this.registerTool(findLocationTool.name, {
      description: findLocationTool.description,
      execute: (query) => findLocationTool.execute(query, this.mapService),
    });

    this.registerTool(getDirectionsTool.name, {
      description: getDirectionsTool.description,
      execute: (input) => getDirectionsTool.execute(input, this.mapService),
    });

    this.registerTool(getElevationTool.name, {
      description: getElevationTool.description,
      execute: (input) => getElevationTool.execute(input, this.mapService),
    });

    this.registerTool(webScrapeTool.name, {
      description: webScrapeTool.description,
      execute: webScrapeTool.execute,
    });

    this.registerTool(dateTimeTool.name, {
      description: dateTimeTool.description,
      execute: dateTimeTool.execute,
    });

    this.registerTool(summarizeTool.name, {
      description: summarizeTool.description,
      execute: (text) => summarizeTool.execute(text, this.llmManager),
    });

    // Register the new trainKnowledge tool
    this.registerTool(trainKnowledgeTool.name, {
      description: trainKnowledgeTool.description,
      execute: (input) =>
        trainKnowledgeTool.execute(input, this.vectorStoreManager), // Pass vectorStoreManager
    });

    // Register the new retrieveKnowledge tool
    this.registerTool(retrieveKnowledgeTool.name, {
      description: retrieveKnowledgeTool.description,
      execute: (input) =>
        retrieveKnowledgeTool.execute(input, this.vectorStoreManager), // Pass vectorStoreManager
    });
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
