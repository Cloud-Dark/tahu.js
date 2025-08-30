// src/core/memory-manager.js
import fs from 'fs';
import Database from 'better-sqlite3';
import chalk from 'chalk';
import TahuJS from '../tahu.js';

export class MemoryManager {
  constructor(memoryDir, sqliteDb, config = {}) {
    this.memoryDir = memoryDir;
    this.sqliteDb = sqliteDb;
    this.config = config;

    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir);
    }
    this.sqliteDb.exec(`
            CREATE TABLE IF NOT EXISTS agent_memory (
                agent_name TEXT PRIMARY KEY,
                memory_data TEXT
            );
        `);
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

  _getJsonMemoryPath(agentName) {
    return `${this.memoryDir}/agent_${agentName}.json`;
  }

  loadAgentMemory(agentName, memoryType, memoryPath) {
    if (memoryType === 'json') {
      const filePath = memoryPath || this._getJsonMemoryPath(agentName);
      if (fs.existsSync(filePath)) {
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          console.error(
            chalk.red(
              `❌ Error loading JSON memory for agent "${agentName}": ${error.message}`
            )
          );
          return [];
        }
      }
    } else if (memoryType === 'sqlite') {
      const stmt = this.sqliteDb.prepare(
        'SELECT memory_data FROM agent_memory WHERE agent_name = ?'
      );
      const row = stmt.get(agentName);
      if (row) {
        try {
          return JSON.parse(row.memory_data);
        } catch (error) {
          console.error(
            chalk.red(
              `❌ Error parsing SQLite memory for agent "${agentName}": ${error.message}`
            )
          );
          return [];
        }
      }
    }
    return []; // Default to empty array for volatile or if no saved memory
  }

  saveAgentMemory(agentName, memoryData, memoryType, memoryPath) {
    if (memoryType === 'json') {
      const filePath = memoryPath || this._getJsonMemoryPath(agentName);
      try {
        fs.writeFileSync(filePath, JSON.stringify(memoryData, null, 2), 'utf8');
        this._debugLog(
          chalk.green(
            `💾 JSON memory saved for agent "${agentName}" to ${filePath}`
          )
        );
      } catch (error) {
        console.error(
          chalk.red(
            `❌ Error saving JSON memory for agent "${agentName}": ${error.message}`
          )
        );
      }
    } else if (memoryType === 'sqlite') {
      const stmt = this.sqliteDb.prepare(
        'INSERT OR REPLACE INTO agent_memory (agent_name, memory_data) VALUES (?, ?)'
      );
      try {
        stmt.run(agentName, JSON.stringify(memoryData));
        this._debugLog(
          chalk.green(`💾 SQLite memory saved for agent "${agentName}"`)
        );
      } catch (error) {
        console.error(
          chalk.red(
            `❌ Error saving SQLite memory for agent "${agentName}": ${error.message}`
          )
        );
      }
    }
  }
}
