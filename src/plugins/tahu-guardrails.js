// src/plugins/tahu-guardrails.js - Safety Guardrails Plugin
import winston from 'winston';

class TahuGuardrailsPlugin {
  constructor() {
    this.name = 'TahuGuardrails';
    this.description = 'AI Safety Guardrails Plugin for content validation and filtering';
    this.version = '1.0.0';
    this.guards = new Map();
    this.logger = null;
    this.isInitialized = false;
  }

  async install(tahu) {
    console.log('🛡️ Installing TahuGuardrails plugin...');
    
    try {
      // Initialize logger for guardrails
      this.logger = winston.createLogger({
        level: tahu.config.debug ? 'debug' : 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
        transports: [
          new winston.transports.File({ 
            filename: './logs/guardrails-error.log', 
            level: 'error' 
          }),
          new winston.transports.File({ 
            filename: './logs/guardrails-combined.log' 
          }),
          ...(tahu.config.debug ? [new winston.transports.Console({
            format: winston.format.simple()
          })] : [])
        ]
      });

      this.isInitialized = true;
      
      // Register guardrails tools
      this._registerGuardrailsTools(tahu);
      
      // Set up default safety guards
      this._setupDefaultGuards();
      
      console.log('✅ TahuGuardrails plugin installed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to install TahuGuardrails plugin:', error);
      return false;
    }
  }

  _setupDefaultGuards() {
    // Content Safety Guard
    this.addGuard('content_safety', {
      name: 'Content Safety Filter',
      description: 'Filters harmful, inappropriate, or dangerous content',
      rules: [
        {
          type: 'blocked_content',
          patterns: [
            /\b(kill|murder|suicide|bomb|weapon|drug|hack|virus)\b/gi,
            /\b(nude|porn|sex|adult)\b/gi,
            /\b(hate|racism|discrimination)\b/gi,
            /\b(password|credit card|ssn|social security)\b/gi
          ]
        },
        {
          type: 'code_injection',
          patterns: [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /eval\s*\(/gi,
            /setTimeout\s*\(/gi,
            /setInterval\s*\(/gi
          ]
        }
      ],
      action: 'block', // 'block', 'warn', 'sanitize'
      severity: 'high'
    });

    // PII Protection Guard
    this.addGuard('pii_protection', {
      name: 'PII Protection',
      description: 'Protects personally identifiable information',
      rules: [
        {
          type: 'email',
          pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
        },
        {
          type: 'phone',
          pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
        },
        {
          type: 'ssn',
          pattern: /\b\d{3}-\d{2}-\d{4}\b/g
        },
        {
          type: 'credit_card',
          pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
        }
      ],
      action: 'sanitize',
      severity: 'medium'
    });

    // Prompt Injection Guard
    this.addGuard('prompt_injection', {
      name: 'Prompt Injection Protection',
      description: 'Protects against prompt injection attacks',
      rules: [
        {
          type: 'injection_attempts',
          patterns: [
            /ignore\s+(previous|above|all)\s+(instructions?|prompts?|rules?)/gi,
            /forget\s+(everything|all|previous)/gi,
            /new\s+(instructions?|prompts?|rules?)/gi,
            /system\s*[:]\s*/gi,
            /\\n\\n|\\r\\n|\\n/g,
            /<\|.*?\|>/g
          ]
        }
      ],
      action: 'block',
      severity: 'critical'
    });
  }

  _registerGuardrailsTools(tahu) {
    // Validate Content Tool
    tahu.registerTool('validateContent', {
      name: 'validateContent',
      description: 'Validate content against safety guardrails',
      parameters: {
        content: { type: 'string', description: 'Content to validate', required: true },
        guardNames: { type: 'array', description: 'Specific guards to apply', default: [] },
        strictMode: { type: 'boolean', description: 'Enable strict validation mode', default: false }
      },
      execute: async (params) => {
        return this.validateContent(params.content, params.guardNames, params.strictMode);
      }
    });

    // Sanitize Content Tool
    tahu.registerTool('sanitizeContent', {
      name: 'sanitizeContent',
      description: 'Sanitize content by removing or masking sensitive information',
      parameters: {
        content: { type: 'string', description: 'Content to sanitize', required: true },
        sanitizeOptions: { type: 'object', description: 'Sanitization options', default: {} }
      },
      execute: async (params) => {
        return this.sanitizeContent(params.content, params.sanitizeOptions);
      }
    });

    // Create Safe Guard Tool
    tahu.registerTool('createGuard', {
      name: 'createGuard',
      description: 'Create a custom safety guard with rules',
      parameters: {
        guardName: { type: 'string', description: 'Name of the guard', required: true },
        rules: { type: 'array', description: 'Array of validation rules', required: true },
        action: { type: 'string', description: 'Action to take: block, warn, sanitize', default: 'warn' }
      },
      execute: async (params) => {
        return this.addGuard(params.guardName, {
          name: params.guardName,
          rules: params.rules,
          action: params.action,
          severity: 'custom'
        });
      }
    });
  }

  addGuard(guardName, guardConfig) {
    this.guards.set(guardName, {
      ...guardConfig,
      createdAt: new Date().toISOString(),
      usageCount: 0
    });
    
    this.logger?.info('Guard added', {
      guardName,
      action: guardConfig.action,
      severity: guardConfig.severity
    });

    return {
      success: true,
      guardName,
      message: `Guard '${guardName}' added successfully`
    };
  }

  async validateContent(content, guardNames = [], strictMode = false) {
    if (!this.isInitialized) {
      throw new Error('Guardrails plugin not initialized');
    }

    const validationResults = {
      content,
      isValid: true,
      violations: [],
      warnings: [],
      sanitizedContent: content,
      guardsApplied: [],
      timestamp: new Date().toISOString()
    };

    const guardsToApply = guardNames.length > 0 
      ? guardNames.filter(name => this.guards.has(name))
      : Array.from(this.guards.keys());

    for (const guardName of guardsToApply) {
      const guard = this.guards.get(guardName);
      if (!guard) continue;

      guard.usageCount++;
      validationResults.guardsApplied.push(guardName);

      const guardResult = await this._applyGuard(content, guard, strictMode);
      
      if (guardResult.violations.length > 0) {
        validationResults.violations.push(...guardResult.violations);
        
        if (guard.action === 'block' || (strictMode && guard.severity === 'critical')) {
          validationResults.isValid = false;
        }
      }

      if (guardResult.warnings.length > 0) {
        validationResults.warnings.push(...guardResult.warnings);
      }

      if (guardResult.sanitizedContent !== content) {
        validationResults.sanitizedContent = guardResult.sanitizedContent;
      }
    }

    // Log validation results
    this.logger?.info('Content validation completed', {
      isValid: validationResults.isValid,
      violationsCount: validationResults.violations.length,
      warningsCount: validationResults.warnings.length,
      guardsApplied: validationResults.guardsApplied
    });

    if (validationResults.violations.length > 0) {
      this.logger?.warn('Content violations detected', {
        violations: validationResults.violations,
        content: content.substring(0, 100) + '...'
      });
    }

    return validationResults;
  }

  async _applyGuard(content, guard, strictMode) {
    const result = {
      violations: [],
      warnings: [],
      sanitizedContent: content
    };

    for (const rule of guard.rules) {
      if (rule.patterns) {
        // Multiple patterns rule
        for (const pattern of rule.patterns) {
          const matches = content.match(pattern);
          if (matches) {
            const violation = {
              guardName: guard.name,
              ruleType: rule.type,
              matches: matches,
              severity: guard.severity,
              action: guard.action,
              message: `${rule.type} violation detected`
            };

            if (guard.action === 'block' || (strictMode && guard.severity === 'critical')) {
              result.violations.push(violation);
            } else {
              result.warnings.push(violation);
            }

            // Apply sanitization if needed
            if (guard.action === 'sanitize' || rule.type === 'pii_protection') {
              result.sanitizedContent = this._sanitizeContent(result.sanitizedContent, pattern, rule.type);
            }
          }
        }
      } else if (rule.pattern) {
        // Single pattern rule
        const matches = content.match(rule.pattern);
        if (matches) {
          const violation = {
            guardName: guard.name,
            ruleType: rule.type,
            matches: matches,
            severity: guard.severity,
            action: guard.action,
            message: `${rule.type} detected`
          };

          if (guard.action === 'block') {
            result.violations.push(violation);
          } else {
            result.warnings.push(violation);
          }

          // Apply sanitization
          if (guard.action === 'sanitize') {
            result.sanitizedContent = this._sanitizeContent(result.sanitizedContent, rule.pattern, rule.type);
          }
        }
      }
    }

    return result;
  }

  _sanitizeContent(content, pattern, ruleType) {
    let replacement = '[REDACTED]';
    
    switch (ruleType) {
      case 'email':
        replacement = '[EMAIL_REDACTED]';
        break;
      case 'phone':
        replacement = '[PHONE_REDACTED]';
        break;
      case 'ssn':
        replacement = '[SSN_REDACTED]';
        break;
      case 'credit_card':
        replacement = '[CARD_REDACTED]';
        break;
      case 'code_injection':
        replacement = '[SCRIPT_BLOCKED]';
        break;
      default:
        replacement = '[CONTENT_FILTERED]';
    }

    return content.replace(pattern, replacement);
  }

  sanitizeContent(content, options = {}) {
    const {
      maskEmails = true,
      maskPhones = true,
      maskSSNs = true,
      maskCreditCards = true,
      removeScripts = true
    } = options;

    let sanitized = content;

    if (maskEmails) {
      sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');
    }

    if (maskPhones) {
      sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
    }

    if (maskSSNs) {
      sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');
    }

    if (maskCreditCards) {
      sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD_REDACTED]');
    }

    if (removeScripts) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SCRIPT_BLOCKED]');
    }

    return {
      originalContent: content,
      sanitizedContent: sanitized,
      changesMade: content !== sanitized,
      timestamp: new Date().toISOString()
    };
  }

  getGuardInfo(guardName) {
    if (guardName) {
      return this.guards.get(guardName);
    }
    
    return {
      totalGuards: this.guards.size,
      guards: Array.from(this.guards.entries()).map(([name, guard]) => ({
        name,
        description: guard.description,
        action: guard.action,
        severity: guard.severity,
        usageCount: guard.usageCount,
        createdAt: guard.createdAt
      }))
    };
  }

  removeGuard(guardName) {
    const removed = this.guards.delete(guardName);
    
    if (removed) {
      this.logger?.info('Guard removed', { guardName });
    }

    return {
      success: removed,
      message: removed ? `Guard '${guardName}' removed successfully` : `Guard '${guardName}' not found`
    };
  }

  getViolationStats() {
    const stats = {
      totalValidations: 0,
      totalViolations: 0,
      guardUsage: {},
      severityBreakdown: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };

    for (const [guardName, guard] of this.guards) {
      stats.totalValidations += guard.usageCount;
      stats.guardUsage[guardName] = guard.usageCount;
      
      if (guard.severity && stats.severityBreakdown[guard.severity] !== undefined) {
        stats.severityBreakdown[guard.severity] += guard.usageCount;
      }
    }

    return stats;
  }

  getInfo() {
    return {
      name: this.name,
      description: this.description,
      version: this.version,
      isInitialized: this.isInitialized,
      totalGuards: this.guards.size,
      availableTools: [
        'validateContent',
        'sanitizeContent',
        'createGuard'
      ],
      defaultGuards: [
        'content_safety',
        'pii_protection', 
        'prompt_injection'
      ]
    };
  }
}

export default TahuGuardrailsPlugin;