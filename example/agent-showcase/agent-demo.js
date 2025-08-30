// example/agent-showcase/agent-demo.js - Agent Showcase Demo
import { createTahu, TahuNLPPlugin } from '../../index.js';

async function runAgentDemo() {
  console.log('🤖 TahuJS Agent Showcase Demo');
  console.log('='.repeat(50));

  try {
    // Initialize TahuJS
    const tahu = createTahu({
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
      model: 'gemini-1.5-flash',
    });

    // Install NLP plugin for advanced agents
    const nlpPlugin = new TahuNLPPlugin();
    await tahu.use(nlpPlugin);

    console.log('\n🏗️ Creating Specialized Agents');
    console.log('-'.repeat(30));

    // Create different types of agents
    const coderAgent = tahu.createPrebuiltAgent('coder', {
      name: 'CodeMaster',
      memoryType: 'volatile',
      maxMemorySize: 20,
    });

    const nlpAgent = tahu.createPrebuiltAgent('nlp', {
      name: 'TextAnalyzer',
      memoryType: 'volatile',
    });

    const supportAgent = tahu.createPrebuiltAgent('support', {
      name: 'HelpDesk',
      memoryType: 'volatile',
    });

    const translatorAgent = tahu.createPrebuiltAgent('translator', {
      name: 'PolyGlot',
      memoryType: 'volatile',
    });

    console.log('Created agents:');
    console.log(`- ${coderAgent.name} (${coderAgent.capabilities.join(', ')})`);
    console.log(`- ${nlpAgent.name} (${nlpAgent.capabilities.join(', ')})`);
    console.log(
      `- ${supportAgent.name} (${supportAgent.capabilities.join(', ')})`
    );
    console.log(
      `- ${translatorAgent.name} (${translatorAgent.capabilities.join(', ')})`
    );

    console.log('\n💼 Agent Tasks Demonstration');
    console.log('-'.repeat(30));

    // Coder Agent - Programming task
    console.log('\n🔧 CodeMaster - Programming Task');
    const codeTask =
      'Write a simple JavaScript function that calculates the factorial of a number recursively';
    const codeResult = await tahu.runAgent('CodeMaster', codeTask);
    console.log('Task:', codeTask);
    console.log('Response:', codeResult.response);

    // NLP Agent - Text analysis task
    console.log('\n🧠 TextAnalyzer - Sentiment Analysis Task');
    const nlpTask =
      "Analyze the sentiment and extract key entities from this customer review: 'I absolutely love the new iPhone 15 Pro! The camera quality is amazing and the battery life has improved significantly. Apple really outdid themselves this time.'";
    const nlpResult = await tahu.runAgent('TextAnalyzer', nlpTask);
    console.log('Task:', nlpTask);
    console.log('Response:', nlpResult.response);

    // Support Agent - Customer service task
    console.log('\n🎧 HelpDesk - Customer Support Task');
    const supportTask =
      "A customer is complaining that their order hasn't arrived after 2 weeks and they're very upset. They want a refund immediately. How should I handle this situation?";
    const supportResult = await tahu.runAgent('HelpDesk', supportTask);
    console.log('Task:', supportTask);
    console.log('Response:', supportResult.response);

    // Translator Agent - Translation task
    console.log('\n🌍 PolyGlot - Translation Task');
    const translationTask =
      "Translate this business email to Spanish and French: 'Dear valued customer, thank you for your interest in our products. We would be happy to schedule a meeting to discuss your requirements.'";
    const translationResult = await tahu.runAgent('PolyGlot', translationTask);
    console.log('Task:', translationTask);
    console.log('Response:', translationResult.response);

    console.log('\n🏗️ Custom Agent Builder Demo');
    console.log('-'.repeat(30));

    // Create a custom agent using the builder pattern
    const customAgent = tahu
      .builder()
      .name('AIConsultant')
      .systemPrompt(
        'You are an AI consultant specializing in helping businesses implement AI solutions. You provide practical advice, technical guidance, and strategic recommendations.'
      )
      .addCapabilities(
        'chat',
        'search',
        'calculate',
        'analyzeSentiment',
        'classifyText'
      )
      .addPersonality(
        ['professional', 'knowledgeable', 'strategic'],
        'confident',
        ['ai', 'business', 'technology']
      )
      .addMemory('volatile', { maxMemorySize: 30 })
      .build();

    console.log('Custom Agent Created:');
    console.log(`Name: ${customAgent.name}`);
    console.log(
      `System Prompt: ${customAgent.systemPrompt.substring(0, 100)}...`
    );
    console.log(`Capabilities: ${customAgent.capabilities.join(', ')}`);
    console.log(`Memory Type: ${customAgent.memoryType}`);

    // Test the custom agent
    const consultantTask =
      'A small retail business wants to implement AI to improve customer experience and increase sales. They have a limited budget of $10,000. What AI solutions would you recommend?';
    const consultantResult = await tahu.runAgent(
      'AIConsultant',
      consultantTask
    );
    console.log('\nAI Consultant Task:', consultantTask);
    console.log('Response:', consultantResult.response);

    console.log('\n🔄 Agent Collaboration Demo');
    console.log('-'.repeat(30));

    // Simulate agent collaboration
    console.log('Scenario: Creating a customer feedback analysis system');

    // Step 1: NLP Agent analyzes feedback
    const feedback =
      "The new app is pretty good but the loading times are terrible. The user interface is confusing and I can't find basic features easily. Customer support was helpful though.";

    console.log('\n1. TextAnalyzer analyzing customer feedback...');
    const feedbackAnalysis = await tahu.runAgent(
      'TextAnalyzer',
      `Analyze this customer feedback for sentiment, key issues, and positive aspects: "${feedback}"`
    );
    console.log('Analysis:', feedbackAnalysis.response);

    // Step 2: Support Agent suggests response strategy
    console.log('\n2. HelpDesk suggesting response strategy...');
    const responseStrategy = await tahu.runAgent(
      'HelpDesk',
      `Based on this feedback analysis: "${feedbackAnalysis.response}", suggest a customer response strategy and action items for the development team.`
    );
    console.log('Strategy:', responseStrategy.response);

    // Step 3: Coder Agent suggests technical solutions
    console.log('\n3. CodeMaster suggesting technical improvements...');
    const technicalSolution = await tahu.runAgent(
      'CodeMaster',
      `Based on the customer feedback about loading times and confusing UI, suggest specific technical improvements and code optimizations that could be implemented.`
    );
    console.log('Technical Solutions:', technicalSolution.response);

    console.log('\n📊 Agent Information & Statistics');
    console.log('-'.repeat(30));

    // List all agents and their information
    const allAgents = tahu.listAgents();
    console.log(`Total Agents Created: ${allAgents.length}`);

    allAgents.forEach((agentName) => {
      const agentInfo = tahu.getAgentInfo(agentName);
      console.log(`\n${agentName}:`);
      console.log(`  - Memory Items: ${agentInfo.memory.length}`);
      console.log(`  - Memory Type: ${agentInfo.memoryType}`);
      console.log(`  - Created: ${agentInfo.created}`);
      console.log(`  - Capabilities: ${agentInfo.capabilities.join(', ')}`);
    });

    // Show analytics
    const analytics = tahu.analytics.getReport();
    console.log('\n📈 System Analytics:');
    console.log(`Total Requests: ${analytics.totalRequests}`);
    console.log(
      `Average Response Time: ${analytics.avgResponseTime?.toFixed(2)}ms`
    );
    console.log(`Success Rate: ${analytics.successRate?.toFixed(2)}%`);

    console.log('\n✅ Agent Showcase Demo completed successfully!');
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
runAgentDemo();
