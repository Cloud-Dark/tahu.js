// src/core/logger-manager.js - Comprehensive Logging System
import winston from 'winston';
import fs from 'fs';
import path from 'path';
import TahuJS from '../tahu.js';

export class LoggerManager {
  constructor(config = {}) {
    this.config = config;
    this.logDir = './logs';
    this.loggers = new Map();
    this.logEntries = [];
    this.maxLogEntries = config.maxLogEntries || 10000;
    this.ensureLogDirectory();
    this.initializeDefaultLogger();
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

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  initializeDefaultLogger() {
    const logLevel = this.config.debug ? 'debug' : 'info';
    const showConsole = this.config.debug || false;

    // Create custom format
    const customFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

        if (Object.keys(meta).length > 0) {
          log += ` ${JSON.stringify(meta, null, 2)}`;
        }

        return log;
      })
    );

    // Create transports
    const transports = [
      // Error log file
      new winston.transports.File({
        filename: path.join(this.logDir, 'error.log'),
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),

      // Combined log file
      new winston.transports.File({
        filename: path.join(this.logDir, 'combined.log'),
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),

      // Daily rotating file
      new winston.transports.File({
        filename: path.join(this.logDir, 'tahu-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '7d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ];

    // Add console transport if debug mode is enabled
    if (showConsole) {
      transports.push(
        new winston.transports.Console({
          format: customFormat,
        })
      );
    }

    // Create default logger
    const defaultLogger = winston.createLogger({
      level: logLevel,
      format: winston.format.json(),
      defaultMeta: { service: 'tahu-js' },
      transports: transports,
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join(this.logDir, 'exceptions.log'),
        }),
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: path.join(this.logDir, 'rejections.log'),
        }),
      ],
    });

    this.loggers.set('default', defaultLogger);
    this.logger = defaultLogger;

    // Override console methods if not in debug mode
    if (!showConsole) {
      this.overrideConsole();
    }

    this.info('LoggerManager initialized', {
      logLevel,
      showConsole,
      logDir: this.logDir,
    });
  }

  overrideConsole() {
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };

    // Store original console for restoration
    this.originalConsole = originalConsole;

    // Override console methods to use logger instead
    console.log = (...args) => {
      this.info(args.join(' '));
    };

    console.info = (...args) => {
      this.info(args.join(' '));
    };

    console.warn = (...args) => {
      this.warn(args.join(' '));
    };

    console.error = (...args) => {
      this.error(args.join(' '));
    };

    console.debug = (...args) => {
      this.debug(args.join(' '));
    };
  }

  restoreConsole() {
    if (this.originalConsole) {
      console.log = this.originalConsole.log;
      console.info = this.originalConsole.info;
      console.warn = this.originalConsole.warn;
      console.error = this.originalConsole.error;
      console.debug = this.originalConsole.debug;
    }
  }

  createLogger(name, options = {}) {
    const logLevel = options.level || (this.config.debug ? 'debug' : 'info');
    const filename = options.filename || `${name}.log`;

    const logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.label({ label: name }),
        winston.format.json()
      ),
      defaultMeta: { service: name },
      transports: [
        new winston.transports.File({
          filename: path.join(this.logDir, filename),
        }),
        ...(this.config.debug ? [new winston.transports.Console()] : []),
      ],
    });

    this.loggers.set(name, logger);
    this.info(`Logger '${name}' created`, { level: logLevel, filename });

    return logger;
  }

  getLogger(name = 'default') {
    return this.loggers.get(name) || this.logger;
  }

  // Logging methods
  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  log(level, message, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      id: this.generateLogId(),
    };

    // Add to in-memory log entries
    this.logEntries.push(entry);

    // Maintain max entries limit
    if (this.logEntries.length > this.maxLogEntries) {
      this.logEntries = this.logEntries.slice(-this.maxLogEntries);
    }

    // Log to winston
    this.logger[level](message, meta);
  }

  generateLogId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log parsing and management methods
  parseLogFile(filename, options = {}) {
    const filePath = path.join(this.logDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Log file not found: ${filename}`);
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.trim().split('\n');

      const logs = lines
        .filter((line) => line.trim())
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch (e) {
            // Handle non-JSON lines
            return {
              timestamp: new Date().toISOString(),
              level: 'info',
              message: line,
              raw: true,
            };
          }
        });

      // Apply filters if provided
      let filteredLogs = logs;

      if (options.level) {
        filteredLogs = filteredLogs.filter(
          (log) => log.level === options.level
        );
      }

      if (options.startDate) {
        const startDate = new Date(options.startDate);
        filteredLogs = filteredLogs.filter(
          (log) => new Date(log.timestamp) >= startDate
        );
      }

      if (options.endDate) {
        const endDate = new Date(options.endDate);
        filteredLogs = filteredLogs.filter(
          (log) => new Date(log.timestamp) <= endDate
        );
      }

      if (options.search) {
        const searchTerm = options.search.toLowerCase();
        filteredLogs = filteredLogs.filter(
          (log) =>
            log.message?.toLowerCase().includes(searchTerm) ||
            JSON.stringify(log.meta || {})
              .toLowerCase()
              .includes(searchTerm)
        );
      }

      // Apply limit
      if (options.limit) {
        filteredLogs = filteredLogs.slice(-options.limit);
      }

      return {
        filename,
        totalEntries: logs.length,
        filteredEntries: filteredLogs.length,
        logs: filteredLogs,
        filters: options,
      };
    } catch (error) {
      throw new Error(`Error parsing log file ${filename}: ${error.message}`);
    }
  }

  getRecentLogs(limit = 100, level = null) {
    let logs = [...this.logEntries];

    if (level) {
      logs = logs.filter((log) => log.level === level);
    }

    return logs.slice(-limit);
  }

  searchLogs(query, options = {}) {
    const searchTerm = query.toLowerCase();
    const limit = options.limit || 100;

    const matchingLogs = this.logEntries
      .filter(
        (log) =>
          log.message?.toLowerCase().includes(searchTerm) ||
          JSON.stringify(log.meta).toLowerCase().includes(searchTerm)
      )
      .slice(-limit);

    return {
      query,
      totalMatches: matchingLogs.length,
      logs: matchingLogs,
    };
  }

  getLogStats() {
    const stats = {
      totalLogs: this.logEntries.length,
      loggers: this.loggers.size,
      levels: {},
      recent: {
        lastHour: 0,
        lastDay: 0,
        lastWeek: 0,
      },
    };

    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    for (const entry of this.logEntries) {
      // Count by level
      stats.levels[entry.level] = (stats.levels[entry.level] || 0) + 1;

      // Count by time periods
      const entryTime = new Date(entry.timestamp);
      if (entryTime >= oneHourAgo) {
        stats.recent.lastHour++;
      }
      if (entryTime >= oneDayAgo) {
        stats.recent.lastDay++;
      }
      if (entryTime >= oneWeekAgo) {
        stats.recent.lastWeek++;
      }
    }

    return stats;
  }

  clearLogs(options = {}) {
    if (options.memory) {
      this.logEntries = [];
      this.info('In-memory logs cleared');
    }

    if (options.files) {
      const logFiles = fs
        .readdirSync(this.logDir)
        .filter((file) => file.endsWith('.log'));

      for (const file of logFiles) {
        if (!options.exclude || !options.exclude.includes(file)) {
          fs.writeFileSync(path.join(this.logDir, file), '');
        }
      }

      this.info('Log files cleared', { filesCleared: logFiles.length });
    }

    return {
      success: true,
      message: 'Logs cleared successfully',
      clearedMemory: options.memory || false,
      clearedFiles: options.files || false,
    };
  }

  exportLogs(format = 'json', filename = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFilename =
      filename || `tahu-logs-export-${timestamp}.${format}`;
    const exportPath = path.join(this.logDir, exportFilename);

    try {
      let content;

      switch (format.toLowerCase()) {
        case 'json':
          content = JSON.stringify(this.logEntries, null, 2);
          break;
        case 'csv':
          const headers = 'timestamp,level,message,meta\n';
          const rows = this.logEntries
            .map(
              (log) =>
                `"${log.timestamp}","${log.level}","${log.message}","${JSON.stringify(log.meta)}"`
            )
            .join('\n');
          content = headers + rows;
          break;
        case 'txt':
          content = this.logEntries
            .map(
              (log) =>
                `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message} ${JSON.stringify(log.meta)}`
            )
            .join('\n');
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      fs.writeFileSync(exportPath, content);

      this.info('Logs exported', {
        format,
        filename: exportFilename,
        entries: this.logEntries.length,
      });

      return {
        success: true,
        filename: exportFilename,
        path: exportPath,
        entries: this.logEntries.length,
        format,
      };
    } catch (error) {
      this.error('Failed to export logs', { error: error.message });
      throw error;
    }
  }

  // Utility methods
  listLogFiles() {
    const files = fs
      .readdirSync(this.logDir)
      .filter((file) => file.endsWith('.log'))
      .map((file) => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          modified: stats.mtime,
          created: stats.birthtime,
        };
      })
      .sort((a, b) => b.modified - a.modified);

    return files;
  }

  getConfig() {
    return {
      debug: this.config.debug,
      logDir: this.logDir,
      maxLogEntries: this.maxLogEntries,
      loggersCount: this.loggers.size,
      consoleOverridden: !this.config.debug,
    };
  }

  updateConfig(newConfig) {
    const oldDebug = this.config.debug;
    this.config = { ...this.config, ...newConfig };

    // Reinitialize if debug mode changed
    if (oldDebug !== this.config.debug) {
      if (this.config.debug) {
        this.restoreConsole();
      } else {
        this.overrideConsole();
      }

      this.info('Logger configuration updated', {
        oldDebug,
        newDebug: this.config.debug,
      });
    }
  }
}

export default LoggerManager;
