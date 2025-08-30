// example/advanced-features/advanced-demo.js - Advanced Features Demo
import { createTahu, TahuNLPPlugin } from '../../index.js';
import path from 'path';

async function runAdvancedDemo() {
  console.log('🚀 TahuJS Advanced Features Demo');
  console.log('='.repeat(50));

  try {
    // Initialize TahuJS with debug mode
    const tahu = createTahu({
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
      model: 'gemini-1.5-flash',
      debug: true,
      responseFormat: 'json',
    });

    // Install NLP plugin
    const nlpPlugin = new TahuNLPPlugin();
    await tahu.use(nlpPlugin);

    console.log('\n🖼️ Image Analysis Demo');
    console.log('-'.repeat(30));

    // Demo image analysis (using example images if they exist)
    const exampleImagePath = './example/ocr_test/image_files/full_color.png';

    try {
      const imageAnalysis = await tahu.useTool('imageAnalysis', {
        imagePath: exampleImagePath,
        analysisType: 'full',
        extractPalette: true,
        colorCount: 5,
      });

      console.log('Image Analysis Results:');
      console.log(`- File: ${imageAnalysis.fileName}`);
      console.log(
        `- Dimensions: ${imageAnalysis.analysis.dimensions?.width}x${imageAnalysis.analysis.dimensions?.height}`
      );
      console.log(`- Size: ${imageAnalysis.analysis.fileInfo?.sizeFormatted}`);
      console.log(`- Format: ${imageAnalysis.analysis.dimensions?.format}`);

      if (imageAnalysis.analysis.colors) {
        console.log(
          '- Dominant Color:',
          imageAnalysis.analysis.colors.dominant.hex
        );
        console.log(
          '- Color Palette:',
          imageAnalysis.analysis.colors.palette.map((c) => c.hex).join(', ')
        );
      }

      if (imageAnalysis.analysis.quality) {
        console.log(`- Quality: ${imageAnalysis.analysis.quality.overall}`);
        console.log(
          `- Sharpness: ${imageAnalysis.analysis.quality.sharpness.assessment}`
        );
      }
    } catch (error) {
      console.log(
        'Image analysis skipped (no sample image found):',
        error.message
      );
    }

    console.log('\n⏰ Task Scheduler Demo');
    console.log('-'.repeat(30));

    // Schedule a simple task
    const scheduleResult = await tahu.useTool('scheduler', {
      action: 'schedule',
      taskName: 'Daily Greeting',
      cronPattern: '*/30 * * * * *', // Every 30 seconds for demo
      taskFunction: 'console.log("Hello from scheduled task!")',
      immediate: false,
    });

    console.log('Scheduled Task:', scheduleResult.taskName);
    console.log('Task ID:', scheduleResult.taskId);
    console.log('Next Run:', scheduleResult.nextRun);

    // List all tasks
    const taskList = await tahu.useTool('scheduler', { action: 'list' });
    console.log(`Total scheduled tasks: ${taskList.totalTasks}`);
    console.log(`Active tasks: ${taskList.activeTasks}`);

    // Stop the demo task after showing it
    setTimeout(async () => {
      await tahu.useTool('scheduler', {
        action: 'cancel',
        taskId: scheduleResult.taskId,
      });
      console.log('Demo task cancelled');
    }, 5000);

    console.log('\n💻 Safe Code Execution Demo');
    console.log('-'.repeat(30));

    // JavaScript execution
    const jsResult = await tahu.useTool('codeExecution', {
      language: 'javascript',
      code: `
        const numbers = [1, 2, 3, 4, 5];
        const sum = numbers.reduce((a, b) => a + b, 0);
        console.log('Sum of numbers:', sum);
        console.log('Average:', sum / numbers.length);
      `,
    });

    console.log('JavaScript Execution:');
    console.log('Success:', jsResult.success);
    console.log('Output:', jsResult.output);
    console.log('Execution Time:', jsResult.executionTime + 'ms');

    // Python execution
    const pythonResult = await tahu.useTool('codeExecution', {
      language: 'python',
      code: `
import math

def calculate_circle_area(radius):
    return math.pi * radius ** 2

radius = 5
area = calculate_circle_area(radius)
print(f"Circle with radius {radius} has area: {area:.2f}")

# Generate fibonacci sequence
def fibonacci(n):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

fib_sequence = fibonacci(10)
print(f"First 10 Fibonacci numbers: {fib_sequence}")
      `,
    });

    console.log('\nPython Execution:');
    console.log('Success:', pythonResult.success);
    console.log('Output:', pythonResult.output);
    console.log('Execution Time:', pythonResult.executionTime + 'ms');

    console.log('\n🤖 Multi-Agent Collaboration Demo');
    console.log('-'.repeat(30));

    // Create specialized agents
    const coderAgent = tahu.createPrebuiltAgent('coder', {
      name: 'CodeExpert',
      memoryType: 'volatile',
    });

    const nlpAgent = tahu.createPrebuiltAgent('nlp', {
      name: 'TextAnalyzer',
      memoryType: 'volatile',
    });

    const analystAgent = tahu.createPrebuiltAgent('analyst', {
      name: 'DataCruncher',
      memoryType: 'volatile',
    });

    console.log('Created agents:');
    console.log('- CodeExpert (Coder)');
    console.log('- TextAnalyzer (NLP)');
    console.log('- DataCruncher (Analyst)');

    // Test collaboration
    const codeTask =
      'Write a simple function to calculate the factorial of a number';
    const codeResponse = await tahu.runAgent('CodeExpert', codeTask);
    console.log('\nCoder Agent Response:');
    console.log(codeResponse.response);

    const textAnalysisTask =
      "Analyze the sentiment of this review: 'This product is absolutely fantastic! I love everything about it.'";
    const nlpResponse = await tahu.runAgent('TextAnalyzer', textAnalysisTask);
    console.log('\nNLP Agent Response:');
    console.log(nlpResponse.response);

    console.log('\n📊 Workflow Management Demo');
    console.log('-'.repeat(30));

    // Parallel task execution
    const parallelTasks = [
      () => tahu.chat('What is 25 * 17?'),
      () => tahu.chat('Name 3 programming languages'),
      () => tahu.chat('What is the capital of Japan?'),
    ];

    console.log('Executing 3 tasks in parallel...');
    const startTime = Date.now();
    const parallelResults = await tahu.parallel(parallelTasks);
    const parallelTime = Date.now() - startTime;

    console.log(`Parallel execution completed in ${parallelTime}ms`);
    parallelResults.forEach((result, index) => {
      console.log(`Task ${index + 1}: ${result.response}`);
    });

    console.log('\n🔧 Plugin System Demo');
    console.log('-'.repeat(30));

    // Show available tools
    const availableTools = tahu.listTools();
    console.log(`Available tools: ${availableTools.length}`);
    console.log('Tools:', availableTools.join(', '));

    // Show analytics
    const analytics = tahu.analytics.getReport();
    console.log('\nAnalytics Report:');
    console.log(JSON.stringify(analytics, null, 2));

    console.log('\n🧠 Advanced Agent Builder Demo');
    console.log('-'.repeat(30));

    // Create custom agent using builder pattern
    const customAgent = tahu
      .builder()
      .name('SuperAgent')
      .systemPrompt(
        'You are a versatile AI assistant with expertise in coding, analysis, and natural language processing.'
      )
      .addCapabilities(
        'chat',
        'search',
        'calculate',
        'analyzeSentiment',
        'codeExecution',
        'imageAnalysis'
      )
      .addPersonality(['intelligent', 'helpful', 'creative'], 'enthusiastic', [
        'ai',
        'programming',
        'data',
      ])
      .addMemory('volatile', { maxMemorySize: 50 })
      .build();

    console.log('Custom Agent Created:');
    console.log(`Name: ${customAgent.name}`);
    console.log(`Capabilities: ${customAgent.capabilities.join(', ')}`);
    console.log(`Memory Type: ${customAgent.memoryType}`);

    // Test the custom agent
    const customResponse = await tahu.runAgent(
      'SuperAgent',
      'Analyze this text sentiment and then write a simple Python function: "I am so excited about learning AI programming!"'
    );
    console.log('\nCustom Agent Response:');
    console.log(customResponse.response);

    console.log('\n✅ Advanced Features Demo completed successfully!');
    console.log('🎉 TahuJS is ready for production use!');
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
runAdvancedDemo();
