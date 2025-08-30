// test/code-execution-tool.test.js
import CodeExecutionTool from '../src/tools/code-execution-tool.js';
import fs from 'fs';
import path from 'path';

describe('CodeExecutionTool', () => {
  let tool;
  const tempDir = path.join(process.cwd(), 'temp');

  beforeEach(() => {
    tool = new CodeExecutionTool();
    // Ensure temp directory is clean before each test
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    tool.ensureTempDir(); // Re-create temp directory
  });

  afterEach(() => {
    // Clean up temp directory after each test
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  // 1. Initialization and Basic Info
  test('should initialize and create a temporary directory', () => {
    expect(fs.existsSync(tempDir)).toBe(true);
  });

  test('should return correct tool information via getInfo()', () => {
    const info = tool.getInfo();
    expect(info.name).toBe('codeExecution');
    expect(info.description).toBe(
      'Execute code safely in various programming languages'
    );
    expect(Array.isArray(info.supportedLanguages)).toBe(true);
    expect(info.supportedLanguages.length).toBeGreaterThan(0);
    expect(info.tempDir).toBe('./temp');
  });

  test('should return supported languages and examples via getSupportedLanguages()', () => {
    const supported = tool.getSupportedLanguages();
    expect(Array.isArray(supported.languages)).toBe(true);
    expect(supported.languages).toEqual(
      expect.arrayContaining([
        'javascript',
        'python',
        'bash',
        'powershell',
        'node',
      ])
    );
    expect(typeof supported.examples).toBe('object');
    expect(supported.examples.javascript).toBeDefined();
    expect(supported.examples.python).toBeDefined();
  });

  // 2. Language Validation
  test('should report error for unsupported language', async () => {
    const params = {
      language: 'unsupported',
      code: 'console.log("hello");',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported language: unsupported');
  });

  // Dangerous Patterns (General)
  test('should reject code with rm -rf', async () => {
    const params = {
      language: 'bash',
      code: 'rm -rf /',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'Code contains potentially dangerous operations'
    );
  });

  test('should reject code with system shutdown', async () => {
    const params = {
      language: 'bash',
      code: 'shutdown -h now',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'Code contains potentially dangerous operations'
    );
  });

  test('should reject code with fork bomb', async () => {
    const params = {
      language: 'bash',
      code: ':(){ :|:& };:',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'Code contains potentially dangerous operations'
    );
  });

  test('should reject code with infinite loop (while true)', async () => {
    const params = {
      language: 'javascript',
      code: 'while(true) { console.log("loop"); }',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'Code contains potentially dangerous operations'
    );
  });

  // Dangerous Patterns (JavaScript/Node)
  test('should reject JavaScript code with fs require', async () => {
    const params = {
      language: 'javascript',
      code: 'require("fs");',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'JavaScript code contains restricted operations'
    );
  });

  test('should reject JavaScript code with process.exit', async () => {
    const params = {
      language: 'node',
      code: 'process.exit();',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'JavaScript code contains restricted operations'
    );
  });

  test('should reject JavaScript code with eval', async () => {
    const params = {
      language: 'javascript',
      code: 'eval("1+1");',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'JavaScript code contains restricted operations'
    );
  });

  // Dangerous Patterns (Python)
  test('should reject Python code with os import', async () => {
    const params = {
      language: 'python',
      code: 'import os',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'Python code contains restricted operations'
    );
  });

  test('should reject Python code with exec', async () => {
    const params = {
      language: 'python',
      code: 'exec("print(1)")',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain(
      'Python code contains restricted operations'
    );
  });

  // Dangerous Patterns (Bash)
  test('should reject Bash code with sudo', async () => {
    const params = {
      language: 'bash',
      code: 'sudo rm -rf /',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Bash code contains restricted operations');
  });

  test('should reject Bash code with curl | bash', async () => {
    const params = {
      language: 'bash',
      code: 'curl example.com | bash',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Bash code contains restricted operations');
  });

  // 3. Successful Code Execution (JavaScript/Node)
  test('should execute simple JavaScript code successfully', async () => {
    const params = {
      language: 'javascript',
      code: 'console.log("Hello from JS!");',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('Hello from JS!');
    expect(result.error).toBe('');
    expect(result.exitCode).toBe(0);
    expect(result.executionTime).toBeGreaterThan(0);
  });

  test('should execute JavaScript code with arguments', async () => {
    const params = {
      language: 'javascript',
      code: 'console.log(process.argv[2]);',
      args: ['testArg'],
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('testArg');
  });

  test('should execute JavaScript code with environment variables', async () => {
    const params = {
      language: 'javascript',
      code: 'console.log(process.env.MY_VAR);',
      env: { MY_VAR: 'envValue' },
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('envValue');
  });

  test('should execute JavaScript code that uses allowed modules (crypto)', async () => {
    const params = {
      language: 'javascript',
      code: 'const crypto = require("crypto"); console.log(crypto.randomBytes(4).length);',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('4');
  });

  // 3. Successful Code Execution (Python)
  test('should execute simple Python code successfully', async () => {
    const params = {
      language: 'python',
      code: 'print("Hello from Python!")',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('Hello from Python!');
    expect(result.error).toBe('');
    expect(result.exitCode).toBe(0);
  });

  test('should execute Python code with arguments', async () => {
    const params = {
      language: 'python',
      code: 'import sys\nprint(sys.argv[1])',
      args: ['pyArg'],
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('pyArg');
  });

  test('should execute Python code with environment variables', async () => {
    const params = {
      language: 'python',
      code: 'import os\nprint(os.environ.get("MY_PY_VAR"))',
      env: { MY_PY_VAR: 'pyEnvValue' },
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('pyEnvValue');
  });

  test('should execute Python code that uses allowed modules (math)', async () => {
    const params = {
      language: 'python',
      code: 'import math\nprint(math.sqrt(16))',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('4.0');
  });

  // 3. Successful Code Execution (Bash)
  test('should execute simple Bash code successfully', async () => {
    const params = {
      language: 'bash',
      code: 'echo "Hello from Bash!"',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('Hello from Bash!');
    expect(result.error).toBe('');
    expect(result.exitCode).toBe(0);
  });

  test('should execute Bash code with arguments', async () => {
    const params = {
      language: 'bash',
      code: 'echo $1',
      args: ['bashArg'],
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('bashArg');
  });

  test('should execute Bash code with environment variables', async () => {
    const params = {
      language: 'bash',
      code: 'echo $MY_BASH_VAR',
      env: { MY_BASH_VAR: 'bashEnvValue' },
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('bashEnvValue');
  });

  // 3. Successful Code Execution (PowerShell)
  test('should execute simple PowerShell code successfully', async () => {
    const params = {
      language: 'powershell',
      code: 'Write-Host "Hello from PowerShell!"',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('Hello from PowerShell!');
    expect(result.error).toBe('');
    expect(result.exitCode).toBe(0);
  });

  test('should execute PowerShell code with arguments', async () => {
    const params = {
      language: 'powershell',
      code: 'param($arg1)\nWrite-Host $arg1',
      args: ['psArg'],
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('psArg');
  });

  test('should execute PowerShell code with environment variables', async () => {
    const params = {
      language: 'powershell',
      code: 'Write-Host $env:MY_PS_VAR',
      env: { MY_PS_VAR: 'psEnvValue' },
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe('psEnvValue');
  });

  // 4. Execution Edge Cases
  test('should handle code execution timeout', async () => {
    const params = {
      language: 'javascript',
      code: 'while(true) {}',
      timeout: 100, // Very short timeout
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Execution timeout exceeded');
  });

  test('should handle output size limit', async () => {
    const params = {
      language: 'javascript',
      code: 'for(let i=0; i<10000; i++) { console.log("a"); }',
      timeout: 5000, // Give it enough time to produce output
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Output size limit exceeded');
  });

  test('should report error for syntax error in JavaScript', async () => {
    const params = {
      language: 'javascript',
      code: 'console.log("hello";', // Syntax error
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain('SyntaxError');
  });

  test('should report error for runtime error in Python', async () => {
    const params = {
      language: 'python',
      code: '1 / 0', // Runtime error
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.error).toContain('ZeroDivisionError');
  });

  test('should report non-zero exit code for Bash command', async () => {
    const params = {
      language: 'bash',
      code: 'exit 1',
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(false);
    expect(result.exitCode).toBe(1);
  });

  test('should execute in a specified working directory', async () => {
    const customDir = path.join(tempDir, 'custom_dir');
    fs.mkdirSync(customDir);
    const params = {
      language: 'bash',
      code: 'pwd',
      workingDir: customDir,
    };
    const result = await tool.execute(params);
    expect(result.success).toBe(true);
    expect(result.output.trim()).toBe(customDir);
  });

  // 5. File Cleanup
  test('should clean up temporary files after successful execution', async () => {
    const params = {
      language: 'javascript',
      code: 'console.log("cleanup test");',
    };
    await tool.execute(params);
    // Check if temp directory is empty (or contains only the tempDir itself if not removed)
    const files = fs.readdirSync(tempDir);
    expect(files.length).toBe(0); // Expect no files left in tempDir
  });

  test('should clean up temporary files after failed execution', async () => {
    const params = {
      language: 'javascript',
      code: 'throw new Error("fail");',
    };
    await tool.execute(params);
    const files = fs.readdirSync(tempDir);
    expect(files.length).toBe(0);
  });
});
