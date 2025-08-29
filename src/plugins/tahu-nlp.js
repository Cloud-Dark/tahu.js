// src/plugins/tahu-nlp.js - Natural Language Processing Plugin
import { dockStart } from '@nlpjs/basic';

class TahuNLPPlugin {
  constructor() {
    this.name = 'TahuNLP';
    this.description = 'Natural Language Processing plugin using NLP.js';
    this.version = '1.0.0';
    this.dock = null;
    this.nlp = null;
    this.isInitialized = false;
  }

  async install(tahu) {
    console.log('🧠 Installing TahuNLP plugin...');
    
    try {
      // Initialize NLP.js dock with basic configuration
      this.dock = await dockStart({
        settings: {
          nlp: {
            defaultLanguage: 'en',
            languages: ['en', 'id'], // Support English and Indonesian
            nluThreshold: 0.5,
            log: false,
          },
        },
        use: ['Basic'],
      });
      
      this.nlp = this.dock.get('nlp');
      this.isInitialized = true;
      
      // Add NLP tools to TahuJS
      this._registerNLPTools(tahu);
      
      console.log('✅ TahuNLP plugin installed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to install TahuNLP plugin:', error);
      return false;
    }
  }

  _registerNLPTools(tahu) {
    // Sentiment Analysis Tool
    tahu.registerTool('analyzeSentiment', {
      name: 'analyzeSentiment',
      description: 'Analyze sentiment of text (positive, negative, neutral)',
      parameters: {
        text: { type: 'string', description: 'Text to analyze sentiment' },
        language: { type: 'string', description: 'Language code (en, id)', default: 'en' }
      },
      execute: async (params) => {
        if (!this.isInitialized) {
          throw new Error('NLP plugin not initialized');
        }
        
        const { text, language = 'en' } = params;
        const result = await this.nlp.process(language, text);
        
        return {
          text,
          language,
          sentiment: result.sentiment,
          score: result.sentiment?.score || 0,
          comparative: result.sentiment?.comparative || 0,
          vote: result.sentiment?.vote || 'neutral'
        };
      }
    });

    // Intent Recognition Tool
    tahu.registerTool('recognizeIntent', {
      name: 'recognizeIntent',
      description: 'Recognize intent from text using trained NLP model',
      parameters: {
        text: { type: 'string', description: 'Text to recognize intent from' },
        language: { type: 'string', description: 'Language code (en, id)', default: 'en' }
      },
      execute: async (params) => {
        if (!this.isInitialized) {
          throw new Error('NLP plugin not initialized');
        }
        
        const { text, language = 'en' } = params;
        const result = await this.nlp.process(language, text);
        
        return {
          text,
          language,
          intent: result.intent || 'None',
          score: result.score || 0,
          entities: result.entities || [],
          classifications: result.classifications || []
        };
      }
    });

    // Entity Extraction Tool
    tahu.registerTool('extractEntities', {
      name: 'extractEntities',
      description: 'Extract named entities from text',
      parameters: {
        text: { type: 'string', description: 'Text to extract entities from' },
        language: { type: 'string', description: 'Language code (en, id)', default: 'en' }
      },
      execute: async (params) => {
        if (!this.isInitialized) {
          throw new Error('NLP plugin not initialized');
        }
        
        const { text, language = 'en' } = params;
        const result = await this.nlp.process(language, text);
        
        return {
          text,
          language,
          entities: result.entities || [],
          entitiesCount: result.entities?.length || 0
        };
      }
    });

    // Language Detection Tool
    tahu.registerTool('detectLanguage', {
      name: 'detectLanguage',
      description: 'Detect the language of given text',
      parameters: {
        text: { type: 'string', description: 'Text to detect language' }
      },
      execute: async (params) => {
        if (!this.isInitialized) {
          throw new Error('NLP plugin not initialized');
        }
        
        const { text } = params;
        const result = await this.nlp.process(text);
        
        return {
          text,
          language: result.locale || 'unknown',
          score: result.localeIso2 || 'unknown'
        };
      }
    });

    // Text Classification Tool
    tahu.registerTool('classifyText', {
      name: 'classifyText',
      description: 'Classify text into predefined categories',
      parameters: {
        text: { type: 'string', description: 'Text to classify' },
        language: { type: 'string', description: 'Language code (en, id)', default: 'en' }
      },
      execute: async (params) => {
        if (!this.isInitialized) {
          throw new Error('NLP plugin not initialized');
        }
        
        const { text, language = 'en' } = params;
        const result = await this.nlp.process(language, text);
        
        return {
          text,
          language,
          classifications: result.classifications || [],
          intent: result.intent || 'None',
          score: result.score || 0
        };
      }
    });
  }

  // Method to train custom intents
  async trainIntent(intent, utterances, language = 'en') {
    if (!this.isInitialized) {
      throw new Error('NLP plugin not initialized');
    }

    try {
      // Add utterances for the intent
      utterances.forEach(utterance => {
        this.nlp.addDocument(language, utterance, intent);
      });

      // Train the model
      await this.nlp.train();
      
      console.log(`✅ Intent '${intent}' trained with ${utterances.length} utterances`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to train intent '${intent}':`, error);
      return false;
    }
  }

  // Method to add named entity
  async addNamedEntity(entityName, entityType, utterances, language = 'en') {
    if (!this.isInitialized) {
      throw new Error('NLP plugin not initialized');
    }

    try {
      this.nlp.addNamedEntityText(entityType, entityName, language, utterances);
      await this.nlp.train();
      
      console.log(`✅ Named entity '${entityName}' of type '${entityType}' added`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to add named entity '${entityName}':`, error);
      return false;
    }
  }

  // Method to save trained model
  async saveModel(filepath) {
    if (!this.isInitialized) {
      throw new Error('NLP plugin not initialized');
    }

    try {
      await this.nlp.save(filepath);
      console.log(`✅ NLP model saved to ${filepath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to save model to ${filepath}:`, error);
      return false;
    }
  }

  // Method to load trained model
  async loadModel(filepath) {
    if (!this.isInitialized) {
      throw new Error('NLP plugin not initialized');
    }

    try {
      await this.nlp.load(filepath);
      console.log(`✅ NLP model loaded from ${filepath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to load model from ${filepath}:`, error);
      return false;
    }
  }

  // Get plugin info
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      version: this.version,
      isInitialized: this.isInitialized,
      supportedLanguages: ['en', 'id'],
      availableTools: [
        'analyzeSentiment',
        'recognizeIntent', 
        'extractEntities',
        'detectLanguage',
        'classifyText'
      ]
    };
  }
}

export default TahuNLPPlugin;