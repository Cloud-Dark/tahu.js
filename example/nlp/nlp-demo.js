// example/nlp/nlp-demo.js - NLP Plugin Demo
import { createTahu, TahuNLPPlugin } from '../../index.js';

async function runNLPDemo() {
  console.log('🧠 TahuJS NLP Plugin Demo');
  console.log('='.repeat(50));

  try {
    // Initialize TahuJS
    const tahu = createTahu({
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
      model: 'gemini-1.5-flash',
    });

    // Install NLP plugin
    const nlpPlugin = new TahuNLPPlugin();
    await tahu.use(nlpPlugin);

    // Demo texts for analysis
    const texts = [
      "I absolutely love this new AI framework! It's amazing and so easy to use.",
      'This product is terrible. I hate it and want my money back.',
      'The weather is okay today, nothing special.',
      'Can you please help me find the nearest restaurant?',
      'I want to book a flight to New York for tomorrow.',
      'What is the capital of France?',
      'Saya sangat senang dengan aplikasi ini! Luar biasa sekali.',
      'Aplikasi ini sangat buruk. Saya tidak suka sama sekali.',
    ];

    console.log('\n📊 Sentiment Analysis Demo');
    console.log('-'.repeat(30));

    for (const text of texts.slice(0, 4)) {
      console.log(`\nText: "${text}"`);

      const sentiment = await tahu.useTool('analyzeSentiment', { text });
      console.log(
        `Sentiment: ${sentiment.vote} (Score: ${sentiment.score.toFixed(2)})`
      );
    }

    console.log('\n🎯 Intent Recognition Demo');
    console.log('-'.repeat(30));

    // Train some basic intents first
    await nlpPlugin.trainIntent('greeting', [
      'hello',
      'hi there',
      'good morning',
      'hey',
      'greetings',
    ]);

    await nlpPlugin.trainIntent('booking', [
      'book a flight',
      'reserve a table',
      'make a reservation',
      'schedule an appointment',
      'book a hotel',
    ]);

    await nlpPlugin.trainIntent('question', [
      'what is',
      'how do I',
      'can you tell me',
      'where is',
      'when does',
    ]);

    // Test intent recognition
    const intentTexts = [
      'Hi there, how are you?',
      'I want to book a flight to London',
      'What is the capital of Germany?',
      'Can you please help me find information?',
    ];

    for (const text of intentTexts) {
      console.log(`\nText: "${text}"`);

      const intent = await tahu.useTool('recognizeIntent', { text });
      console.log(
        `Intent: ${intent.intent} (Confidence: ${intent.score.toFixed(2)})`
      );
    }

    console.log('\n🔤 Language Detection Demo');
    console.log('-'.repeat(30));

    const multilingualTexts = [
      'Hello, how are you today?',
      'Hola, ¿cómo estás hoy?',
      "Bonjour, comment allez-vous aujourd'hui?",
      'Hallo, wie geht es dir heute?',
      'Halo, apa kabar hari ini?',
    ];

    for (const text of multilingualTexts) {
      console.log(`\nText: "${text}"`);

      const detection = await tahu.useTool('detectLanguage', { text });
      console.log(`Detected Language: ${detection.language}`);
    }

    console.log('\n🏷️ Entity Extraction Demo');
    console.log('-'.repeat(30));

    // Add some named entities
    await nlpPlugin.addNamedEntity('John Doe', 'person', [
      'John Doe',
      'Mr. Doe',
    ]);
    await nlpPlugin.addNamedEntity('New York', 'city', [
      'New York',
      'NYC',
      'New York City',
    ]);
    await nlpPlugin.addNamedEntity('2024-01-15', 'date', [
      'January 15th',
      'Jan 15, 2024',
    ]);

    const entityTexts = [
      'John Doe lives in New York and was born on January 15th.',
      'I need to fly to NYC tomorrow morning.',
      'Mr. Doe will meet us at the New York office.',
    ];

    for (const text of entityTexts) {
      console.log(`\nText: "${text}"`);

      const entities = await tahu.useTool('extractEntities', { text });
      console.log(`Entities found: ${entities.entitiesCount}`);

      entities.entities.forEach((entity) => {
        console.log(
          `  - ${entity.entity}: ${entity.option} (${entity.sourceText})`
        );
      });
    }

    console.log('\n🤖 Create NLP Agent Demo');
    console.log('-'.repeat(30));

    // Create specialized NLP agent
    const nlpAgent = tahu.createPrebuiltAgent('nlp', {
      name: 'SmartNLPBot',
      memoryType: 'volatile',
    });

    console.log(`Created agent: ${nlpAgent.name}`);
    console.log(`Capabilities: ${nlpAgent.capabilities.join(', ')}`);

    // Test the NLP agent
    const agentResponse = await tahu.runAgent(
      'SmartNLPBot',
      "Analyze the sentiment of this text: 'I love using AI tools for natural language processing!'"
    );

    console.log('\nNLP Agent Response:');
    console.log(agentResponse.response);

    console.log('\n🎉 NLP Plugin Info');
    console.log('-'.repeat(20));
    const pluginInfo = nlpPlugin.getInfo();
    console.log(JSON.stringify(pluginInfo, null, 2));

    console.log('\n✅ NLP Demo completed successfully!');
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run the demo
runNLPDemo();
