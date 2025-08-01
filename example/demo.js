// examples/enhanced-demo.js - Test all the new features
import TahuJS, { createTahu } from '../src/tahu.js';

async function enhancedDemo() {
  console.log('🥘 Enhanced TahuJS Demo Starting...\n');

  const API_KEY = 'sk-or-v1-XXXXXXXXXXXXX'; // Replace with your real API key
  
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Please set your API key!');
    return;
  }

  const tahu = createTahu({
    provider: 'openrouter',
    apiKey: API_KEY,
      model: 'google/gemini-2.0-flash-exp:free',
    // Optional: Add these for enhanced features
    // serpApiKey: 'your-serpapi-key',
    // googleMapsApiKey: 'your-google-maps-key',
    // mapboxKey: 'your-mapbox-key'
  });

  try {
    // Test Enhanced Web Search with fallbacks
    console.log('🔍 Testing Enhanced Web Search:');
    const searchResult = await tahu.useTool('webSearch', 'latest JavaScript frameworks 2024');
    console.log(searchResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Enhanced Location Search
    console.log('📍 Testing Enhanced Location Search:');
    const locationResult = await tahu.useTool('findLocation', 'Monas Jakarta');
    console.log(locationResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Directions
    console.log('🗺️  Testing Directions:');
    const directionsResult = await tahu.useTool('getDirections', 'from Jakarta to Bandung');
    console.log(directionsResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Elevation
    console.log('⛰️  Testing Elevation:');
    const elevationResult = await tahu.useTool('getElevation', '-6.2088,106.8456'); // Jakarta coordinates
    console.log('Elevation Result:', elevationResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Calculator
    console.log('🧮 Testing Calculator:');
    const calcResult = await tahu.useTool('calculate', '25 * 4 + sqrt(16)');
    console.log(calcResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test Web Scraping
    console.log('🌐 Testing Web Scraping:');
    const scrapeResult = await tahu.useTool('webScrape', 'https://www.wikipedia.org');
    console.log(scrapeResult);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test AI Chat
      console.log('💬 Testing AI Chat:');
    const chatResult = await tahu.chat('Tell me about the weather in Jakarta and search for current weather information');
    console.log(chatResult.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // Create specialized agents
    console.log('🤖 Testing Specialized Agents:');
    
    // Travel Agent (using existing createAgent for custom example)
    const travelAgent = tahu.createAgent('TravelExpert', {
      systemPrompt: 'You are a professional travel agent. You help plan trips, find locations, and provide travel advice.',
      capabilities: ['search', 'location', 'directions', 'recommendations'],
      personality: { // Enhanced personality
        traits: ['organized', 'friendly'],
        mood: 'optimistic',
        expertise: ['travel planning', 'destination knowledge']
      }
    });

    const travelResult = await tahu.runAgent('TravelExpert', 'Plan a day trip to Jakarta. Find interesting places to visit and provide directions.');
    console.log('Travel Agent:', travelResult.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // Research Agent (using new createPrebuiltAgent)
    console.log('🔬 Testing Pre-built Research Agent:');
    const researchAgent = tahu.createPrebuiltAgent('researcher', { name: 'MySmartResearcher' });
    const researchResult = await tahu.runAgent('MySmartResearcher', 'Research the current state of AI development in Indonesia');
    console.log('Research Agent:', researchResult.response);
    console.log('\n' + '='.repeat(50) + '\n');

    // Coder Agent (using new createPrebuiltAgent)
    console.log('👨‍💻 Testing Pre-built Coder Agent:');
    const coderAgent = tahu.createPrebuiltAgent('coder'); // Uses default name 'CoderAgent'
    const coderResult = await tahu.runAgent('CoderAgent', 'Write a simple Python function to calculate factorial.');
    console.log('Coder Agent:', coderResult.response);
    console.log('\n' + '='.repeat(50) + '\n');


    console.log('\n🎉 Enhanced Demo completed successfully!');
console.log('📊 Available tools:', tahu.listTools());
   console.log('🤖 Available agents:', tahu.listAgents());

 } catch (error) {
   console.error('❌ Demo Error:', error.message);
 }
}

// Run enhanced demo
enhancedDemo().catch(console.error);