// src/core/tool-manager.js
import chalk from 'chalk';
import TahuJS from '../tahu.js';

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
import { ocrTool } from '../tools/ocr-tool.js'; // Import new OCR tool
import { ocrAdvancedTool } from '../tools/ocr-advanced-tool.js';
import { pdfAnalyzerTool } from '../tools/pdf-analyzer-tool.js';
import { cvAnalyzerTool } from '../tools/cv-analyzer-tool.js';

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
    this.tools = toolsMap; // Reference to the main tools Map (for enabled tools)
    this.allTools = new Map(); // New: Store all built-in tools
    this.searchService = searchService;
    this.mapService = mapService;
    this.llmManager = llmManager;
    this.vectorStoreManager = vectorStoreManager; // Store vectorStoreManager
    this.initializeBuiltInTools();
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

  initializeBuiltInTools() {
    const allBuiltInTools = [
      {
        name: webSearchTool.name,
        description: webSearchTool.description,
        execute: (query) => webSearchTool.execute(query, this.searchService),
      },
      {
        name: calculateTool.name,
        description: calculateTool.description,
        execute: calculateTool.execute,
      },
      {
        name: findLocationTool.name,
        description: findLocationTool.description,
        execute: (query) => findLocationTool.execute(query, this.mapService),
      },
      {
        name: getDirectionsTool.name,
        description: getDirectionsTool.description,
        execute: (input) => getDirectionsTool.execute(input, this.mapService),
      },
      {
        name: getElevationTool.name,
        description: getElevationTool.description,
        execute: (input) => getElevationTool.execute(input, this.mapService),
      },
      {
        name: webScrapeTool.name,
        description: webScrapeTool.description,
        execute: webScrapeTool.execute,
      },
      {
        name: dateTimeTool.name,
        description: dateTimeTool.description,
        execute: dateTimeTool.execute,
      },
      {
        name: summarizeTool.name,
        description: summarizeTool.description,
        execute: (text) => summarizeTool.execute(text, this.llmManager),
      },
      {
        name: trainKnowledgeTool.name,
        description: trainKnowledgeTool.description,
        execute: (input) =>
          trainKnowledgeTool.execute(input, this.vectorStoreManager),
      },
      {
        name: retrieveKnowledgeTool.name,
        description: retrieveKnowledgeTool.description,
        execute: (input) =>
          retrieveKnowledgeTool.execute(input, this.vectorStoreManager),
      },
      {
        name: ocrTool.name,
        description: ocrTool.description,
        execute: ocrTool.execute,
      }, // New OCR tool
      {
        name: ocrAdvancedTool.name,
        description: ocrAdvancedTool.description,
        execute: (filePath, options) =>
          ocrAdvancedTool.execute(filePath, options, this.llmManager),
      },
      {
        name: pdfAnalyzerTool.name,
        description: pdfAnalyzerTool.description,
        execute: pdfAnalyzerTool.execute,
      },
      {
        name: cvAnalyzerTool.name,
        description: cvAnalyzerTool.description,
        execute: (filePath, options) =>
          cvAnalyzerTool.execute(filePath, options, this.llmManager),
      },
    ];

    // Populate allTools map
    for (const tool of allBuiltInTools) {
      this.allTools.set(tool.name, tool);
    }

    const enabledToolsConfig = this.config.tools?.enabled;

    for (const { name, description, execute } of allBuiltInTools) {
      if (!enabledToolsConfig || enabledToolsConfig.includes(name)) {
        this.registerTool(name, {
          description: description,
          execute: execute,
        });
      } else {
        // Tool skipped (not enabled in config), no console log
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
    this._debugLog(`🔧 Tool "${name}" registered successfully!`);
  }

  async useTool(toolName, ...args) {
    const tool = this.tools.get(toolName); // Check if the tool is currently enabled and registered

    if (!tool) {
      // If not found in enabled tools, check if it exists in all tools
      if (this.allTools.has(toolName)) {
        throw new Error(`Tool "${toolName}" is disabled by configuration.`);
      } else {
        throw new Error(`Tool "${toolName}" not found.`);
      }
    }

    try {
      this._debugLog(`🔧 Using tool: ${toolName}`);
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
