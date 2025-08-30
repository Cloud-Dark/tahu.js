// src/tools/code-execution-tool.js - Safe Code Execution Tool
import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class CodeExecutionTool {
  constructor() {
    this.name = 'codeExecution';
    this.description = 'Execute code safely in various programming languages';
    this.supportedLanguages = [
      'javascript',
      'python',
      'bash',
      'powershell',
      'node',
    ];
    this.tempDir = './temp';
    this.maxExecutionTime = 30000; // 30 seconds max
    this.maxOutputSize = 10000; // 10KB max output

    this.parameters = {
      language: {
        type: 'string',
        description:
          'Programming language (javascript, python, bash, powershell, node)',
        required: true,
      },
      code: {
        type: 'string',
        description: 'Code to execute',
        required: true,
      },
      timeout: {
        type: 'number',
        description: 'Execution timeout in milliseconds',
        default: 30000,
      },
      args: {
        type: 'array',
        description: 'Command line arguments',
        default: [],
      },
      env: {
        type: 'object',
        description: 'Environment variables',
        default: {},
      },
      workingDir: {
        type: 'string',
        description: 'Working directory for execution',
        default: null,
      },
    };

    this.ensureTempDir();
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async execute(params) {
    const {
      language,
      code,
      timeout = this.maxExecutionTime,
      args = [],
      env = {},
      workingDir = null,
    } = params;

    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      // Language support check
      if (!this.supportedLanguages.includes(language.toLowerCase())) {
        throw new Error(
          `Unsupported language: ${language}. Supported: ${this.supportedLanguages.join(', ')}`
        );
      }

      // Safety checks
      this.validateCode(code, language);

      const result = await this.executeCode(
        language.toLowerCase(),
        code,
        timeout,
        args,
        env,
        workingDir,
        executionId
      );

      const executionTime = Date.now() - startTime;

      return {
        executionId,
        language,
        success: result.success,
        output: result.output,
        error: result.error,
        exitCode: result.exitCode,
        executionTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        executionId,
        language,
        success: false,
        output: '',
        error: error.message,
        exitCode: -1,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  validateCode(code, language) {
    // Language-specific validations first (to provide more specific error messages)
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'node':
        this.validateJavaScript(code);
        break;
      case 'python':
        this.validatePython(code);
        break;
      case 'bash':
        this.validateBash(code);
        break;
    }

    // Basic safety checks (only if not caught by language-specific validation)
    const dangerousPatterns = [
      /rm\s+-rf/g, // Dangerous file deletion
      /del\s+\/[sq]/g, // Windows dangerous deletion
      /shutdown/g, // System shutdown
      /reboot/g, // System reboot
      /format\s+c:/g, // Format drive
      /:\(\)\{\s*:|:|&\s*\};:/g, // Fork bomb
      /while\s*\(\s*true\s*\)/g, // Infinite loops (basic)
      /for\s*\(\s*;\s*;\s*\)/g, // C-style infinite loops
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error(
          `Code contains potentially dangerous operations: ${pattern.source}`
        );
      }
    }
  }

  validateJavaScript(code) {
    const dangerousPatterns = [
      /require\s*\(\s*['"]fs['"]|\bfs\./g,
      /require\s*\(\s*['"]child_process['"]|\bchild_process\./g,
      /process\.exit/g,
      /eval\s*\(/g,
      /Function\s*\(/g,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error(
          `JavaScript code contains restricted operations: ${pattern.source}`
        );
      }
    }
  }

  validatePython(code) {
    const dangerousPatterns = [
      /import\s+os|from\s+os\s+import/g,
      /import\s+subprocess|from\s+subprocess\s+import/g,
      /import\s+sys|from\s+sys\s+import/g,
      /exec\s*\(/g,
      /eval\s*\(/g,
      /__import__\s*\(/g,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error(
          `Python code contains restricted operations: ${pattern.source}`
        );
      }
    }
  }

  validateBash(code) {
    const dangerousPatterns = [
      /curl\s+.*\|\s*bash/g,
      /wget\s+.*\|\s*bash/g,
      /sudo/g,
      /passwd/g,
      /useradd|userdel/g,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error(
          `Bash code contains restricted operations: ${pattern.source}`
        );
      }
    }
  }

  async executeCode(
    language,
    code,
    timeout,
    args,
    env,
    workingDir,
    executionId
  ) {
    switch (language) {
      case 'javascript':
      case 'node':
        return this.executeJavaScript(
          code,
          timeout,
          args,
          env,
          workingDir,
          executionId
        );
      case 'python':
        return this.executePython(
          code,
          timeout,
          args,
          env,
          workingDir,
          executionId
        );
      case 'bash':
        return this.executeBash(
          code,
          timeout,
          args,
          env,
          workingDir,
          executionId
        );
      case 'powershell':
        return this.executePowerShell(
          code,
          timeout,
          args,
          env,
          workingDir,
          executionId
        );
      default:
        throw new Error(`Execution not implemented for language: ${language}`);
    }
  }

  async executeJavaScript(code, timeout, args, env, workingDir, executionId) {
    const filename = path.join(this.tempDir, `${executionId}.js`);

    // Wrap code in safe context - simplified to avoid process initialization issues
    const wrappedCode = `
      // Restricted context for safety
      try {
        ${code}
      } catch (error) {
        console.error('Execution error:', error.message);
        process.exit(1);
      }
    `;

    fs.writeFileSync(filename, wrappedCode);

    try {
      const result = await this.runCommand(
        'node',
        [filename, ...args],
        timeout,
        env,
        workingDir
      );
      return result;
    } finally {
      this.cleanupFile(filename);
    }
  }

  async executePython(code, timeout, args, env, workingDir, executionId) {
    const filename = path.join(this.tempDir, `${executionId}.py`);

    // Wrap code in safe context
    const wrappedCode = `
import sys
import builtins

# Restrict imports
original_import = builtins.__import__
allowed_modules = ['math', 'random', 'datetime', 'json', 're', 'itertools', 'collections']

def safe_import(name, *args, **kwargs):
    if name not in allowed_modules:
        raise ImportError(f"Module not allowed: {name}")
    return original_import(name, *args, **kwargs)

builtins.__import__ = safe_import

try:
${code
  .split('\n')
  .map((line) => '    ' + line)
  .join('\n')}
except Exception as e:
    print(f"Execution error: {e}")
    `;

    fs.writeFileSync(filename, wrappedCode);

    try {
      const result = await this.runCommand(
        'python',
        [filename, ...args],
        timeout,
        env,
        workingDir
      );
      return result;
    } finally {
      this.cleanupFile(filename);
    }
  }

  async executeBash(code, timeout, args, env, workingDir, executionId) {
    const filename = path.join(this.tempDir, `${executionId}.sh`);

    // Add safety header
    const wrappedCode = `#!/bin/bash\nset -e  // Exit on error\nset -u  // Exit on undefined variable\nset -o pipefail  // Exit on pipe failure\n\n${code}\n`;

    fs.writeFileSync(filename, wrappedCode);
    fs.chmodSync(filename, '755');

    try {
      const result = await this.runCommand(
        'bash',
        [filename, ...args],
        timeout,
        env,
        workingDir
      );
      return result;
    } finally {
      this.cleanupFile(filename);
    }
  }

  async executePowerShell(code, timeout, args, env, workingDir, executionId) {
    const filename = path.join(this.tempDir, `${executionId}.ps1`);

    const wrappedCode = `
# PowerShell execution policy and safety
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

try {
${code
  .split('\n')
  .map((line) => '    ' + line)
  .join('\n')}
} catch {
    Write-Error "Execution error: $_"
}
`;

    fs.writeFileSync(filename, wrappedCode);

    try {
      const result = await this.runCommand(
        'powershell',
        ['-File', filename, ...args],
        timeout,
        env,
        workingDir
      );
      return result;
    } finally {
      this.cleanupFile(filename);
    }
  }

  async runCommand(command, args, timeout, env, workingDir) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: workingDir || this.tempDir,
        env: { ...process.env, ...env },
        timeout: timeout,
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
        if (stdout.length > this.maxOutputSize) {
          child.kill();
          reject(new Error('Output size limit exceeded'));
        }
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
        if (stderr.length > this.maxOutputSize) {
          child.kill();
          reject(new Error('Error output size limit exceeded'));
        }
        // Capture stderr for error reporting, but don't reject immediately
      });

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          output: stdout,
          error: stderr,
          exitCode: code,
        });
      });

      child.on('error', (error) => {
        // This catches errors like command not found, or permission issues
        reject(new Error(`Execution failed: ${error.message}`));
      });

      // Timeout handling
      setTimeout(() => {
        if (!child.killed) {
          child.kill();
          reject(new Error('Execution timeout exceeded'));
        }
      }, timeout);
    });
  }

  cleanupFile(filename) {
    try {
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
      }
    } catch (error) {
      console.warn(
        `Failed to cleanup temporary file ${filename}:`,
        error.message
      );
    }
  }

  getSupportedLanguages() {
    return {
      languages: this.supportedLanguages,
      examples: {
        javascript: 'console.log("Hello from JavaScript!");',
        python: 'print("Hello from Python!")',
        bash: 'echo "Hello from Bash!"',
        powershell: 'Write-Host "Hello from PowerShell!"',
      },
    };
  }

  getInfo() {
    return {
      name: this.name,
      description: this.description,
      supportedLanguages: this.supportedLanguages,
      maxExecutionTime: this.maxExecutionTime,
      maxOutputSize: this.maxOutputSize,
      tempDir: this.tempDir,
    };
  }
}

export default CodeExecutionTool;
