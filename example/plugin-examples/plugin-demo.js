// example/plugin-examples/plugin-demo.js - Plugin System Demo
import { createTahu, TahuNLPPlugin, plugins } from '../../index.js';

async function runPluginDemo() {
  console.log('🔌 TahuJS Plugin System Demo');
  console.log('='.repeat(50));

  try {
    // Initialize TahuJS
    const tahu = createTahu({
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
      model: 'gemini-1.5-flash',
    });

    console.log('\n🧠 Installing NLP Plugin');
    console.log('-'.repeat(30));

    // Install NLP plugin
    const nlpPlugin = new TahuNLPPlugin();
    const nlpInstalled = await nlpPlugin.install(tahu);
    
    if (nlpInstalled) {
      console.log('✅ NLP Plugin installed successfully');
      
      // Show plugin info
      const nlpInfo = nlpPlugin.getInfo();
      console.log('Plugin Info:', JSON.stringify(nlpInfo, null, 2));

      // Test NLP tools
      console.log('\n🔬 Testing NLP Tools');
      console.log('-'.repeat(20));

      // Sentiment Analysis
      const sentimentResult = await tahu.useTool('analyzeSentiment', {
        text: 'I absolutely love this new AI framework! It makes development so much easier.',
        language: 'en'
      });
      console.log('Sentiment Analysis:', sentimentResult);

      // Language Detection
      const languageResult = await tahu.useTool('detectLanguage', {
        text: 'Bonjour, comment allez-vous aujourd\'hui?'
      });
      console.log('Language Detection:', languageResult);

      // Train and test intent recognition
      await nlpPlugin.trainIntent('greeting', [
        'hello', 'hi', 'hey there', 'good morning', 'good evening'
      ]);

      await nlpPlugin.trainIntent('goodbye', [
        'bye', 'goodbye', 'see you later', 'farewell', 'take care'
      ]);

      const intentResult = await tahu.useTool('recognizeIntent', {
        text: 'Hey there, how are you doing today?',
        language: 'en'
      });
      console.log('Intent Recognition:', intentResult);
    }

    console.log('\n💰 Installing Other Plugins');
    console.log('-'.repeat(30));

    // Install built-in plugins
    try {
      await tahu.use(plugins.tahuCryptoPlugin);
      console.log('✅ Crypto Plugin installed');
    } catch (error) {
      console.log('⚠️ Crypto Plugin installation skipped:', error.message);
    }

    try {
      await tahu.use(plugins.tahuFinancePlugin);
      console.log('✅ Finance Plugin installed');
    } catch (error) {
      console.log('⚠️ Finance Plugin installation skipped:', error.message);
    }

    try {
      await tahu.use(plugins.tahuSocialPlugin);
      console.log('✅ Social Plugin installed');
    } catch (error) {
      console.log('⚠️ Social Plugin installation skipped:', error.message);
    }

    try {
      await tahu.use(plugins.tahuCurrencyPlugin);
      console.log('✅ Currency Plugin installed');
    } catch (error) {
      console.log('⚠️ Currency Plugin installation skipped:', error.message);
    }

    console.log('\n🔧 Available Tools After Plugin Installation');
    console.log('-'.repeat(30));
    const availableTools = tahu.listTools();
    console.log(`Total Tools: ${availableTools.length}`);
    console.log('Tools:', availableTools.join(', '));

    console.log('\n🎯 Advanced Tool Usage');
    console.log('-'.repeat(30));

    // Image Analysis Tool Demo
    try {
      console.log('Testing Image Analysis Tool...');
      const imageAnalysisInfo = tahu.imageAnalysisTool?.getInfo();
      if (imageAnalysisInfo) {
        console.log('Image Analysis Tool Info:', imageAnalysisInfo);
        
        // Try to analyze an image if available
        const sampleImagePath = './example/ocr_test/image_files/full_color.png';
        try {
          const imageResult = await tahu.useTool('imageAnalysis', {
            imagePath: sampleImagePath,
            analysisType: 'basic'
          });
          console.log('Image Analysis Result (basic):', {
            fileName: imageResult.fileName,
            dimensions: imageResult.analysis.dimensions,
            fileSize: imageResult.analysis.fileInfo?.sizeFormatted
          });
        } catch (imgError) {
          console.log('⚠️ Image analysis skipped (no sample image):', imgError.message);
        }
      }
    } catch (error) {
      console.log('⚠️ Image Analysis Tool not available:', error.message);
    }

    // Code Execution Tool Demo
    try {
      console.log('\nTesting Code Execution Tool...');
      const codeExecInfo = tahu.codeExecutionTool?.getInfo();
      if (codeExecInfo) {
        console.log('Code Execution Tool Info:', codeExecInfo);
        
        // Execute simple JavaScript
        const jsResult = await tahu.useTool('codeExecution', {
          language: 'javascript',
          code: 'console.log("Hello from TahuJS Code Execution!"); console.log(Math.PI * 2);'
        });
        console.log('JavaScript Execution Result:', {
          success: jsResult.success,
          output: jsResult.output.trim(),
          executionTime: jsResult.executionTime
        });

        // Execute simple Python
        const pythonResult = await tahu.useTool('codeExecution', {
          language: 'python',
          code: 'print("Hello from Python!")\nprint(f"Square of 7: {7**2}")'
        });
        console.log('Python Execution Result:', {
          success: pythonResult.success,
          output: pythonResult.output.trim(),
          executionTime: pythonResult.executionTime
        });
      }
    } catch (error) {
      console.log('⚠️ Code Execution Tool not available:', error.message);
    }

    // Scheduler Tool Demo
    try {
      console.log('\nTesting Scheduler Tool...');
      const schedulerInfo = tahu.schedulerTool?.getInfo();
      if (schedulerInfo) {
        console.log('Scheduler Tool Info:', schedulerInfo);
        
        // Schedule a demo task
        const scheduleResult = await tahu.useTool('scheduler', {
          action: 'schedule',
          taskName: 'Demo Task',
          cronPattern: '*/10 * * * * *', // Every 10 seconds
          taskFunction: 'console.log("Demo task executed!")',
          immediate: false
        });
        console.log('Task Scheduled:', scheduleResult);

        // List tasks
        const taskList = await tahu.useTool('scheduler', { action: 'list' });
        console.log('Current Tasks:', taskList);

        // Cancel the demo task
        await tahu.useTool('scheduler', {
          action: 'cancel',
          taskId: scheduleResult.taskId
        });
        console.log('Demo task cancelled');
      }
    } catch (error) {
      console.log('⚠️ Scheduler Tool not available:', error.message);
    }

    console.log('\n🤖 Plugin-Enhanced Agent Demo');
    console.log('-'.repeat(30));

    // Create an agent that uses plugin tools
    const enhancedAgent = tahu.createPrebuiltAgent('nlp', {
      name: 'AdvancedNLPAgent',
      capabilities: [
        'chat', 
        'analyzeSentiment', 
        'recognizeIntent', 
        'extractEntities', 
        'detectLanguage',
        'classifyText',
        'codeExecution'
      ]
    });

    console.log(`Created Enhanced Agent: ${enhancedAgent.name}`);
    console.log(`Capabilities: ${enhancedAgent.capabilities.join(', ')}`);

    // Test the enhanced agent
    const agentTask = "Analyze the sentiment of this text and then write a simple Python script to categorize it: 'This product is absolutely amazing! I love everything about it and would definitely recommend it to others.'";
    const agentResult = await tahu.runAgent('AdvancedNLPAgent', agentTask);
    console.log('\nEnhanced Agent Task:', agentTask);
    console.log('Agent Response:', agentResult.response);

    console.log('\n📊 Plugin System Statistics');
    console.log('-'.repeat(30));

    console.log('Installed Plugins:');
    console.log('- TahuNLP Plugin (Natural Language Processing)');
    console.log('- Built-in Tool Plugins (Image Analysis, Code Execution, Scheduler)');
    
    const finalToolList = tahu.listTools();
    console.log(`\nTotal Available Tools: ${finalToolList.length}`);
    console.log('All Tools:', finalToolList.join(', '));

    // Show system analytics
    const analytics = tahu.analytics.getReport();
    console.log('\n📈 System Analytics:');
    console.log(JSON.stringify(analytics, null, 2));

    console.log('\n✅ Plugin System Demo completed successfully!');
    console.log('🎉 TahuJS Plugin System is fully functional!');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
runPluginDemo();