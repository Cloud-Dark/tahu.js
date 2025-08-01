// src/tools/train-knowledge-tool.js
import chalk from 'chalk';

export const trainKnowledgeTool = {
    name: 'trainKnowledge',
    description: 'Adds text data to a specified knowledge base for later retrieval. Input format: "knowledgeBaseName|storeType|text_to_train". Supported store types: sqlite, chromadb. Example: "my_docs|sqlite|This is a document about TahuJS features."',
    execute: async (input, vectorStoreManager) => {
        const parts = input.split('|');
        if (parts.length < 3) {
            return "❌ Invalid input format. Please use 'knowledgeBaseName|storeType|text_to_train'.";
        }

        const knowledgeBaseName = parts[0].trim();
        const storeType = parts[1].trim().toLowerCase();
        const textToTrain = parts.slice(2).join('|').trim(); // Rejoin remaining parts as text

        if (!knowledgeBaseName || !storeType || !textToTrain) {
            return "❌ Knowledge base name, store type, and text to train cannot be empty.";
        }

        if (!['sqlite', 'chroma', 'supabase'].includes(storeType)) {
            return `❌ Unsupported store type: ${storeType}. Supported types are 'sqlite', 'chroma', 'supabase'.`;
        }

        console.log(chalk.blue(`📚 Training knowledge for '${knowledgeBaseName}' using ${storeType} store...`));
        try {
            await vectorStoreManager.addDocument(knowledgeBaseName, textToTrain, storeType);
            return `✅ Knowledge successfully added to '${knowledgeBaseName}' (${storeType} store).`;
        } catch (error) {
            if (storeType === 'supabase' && error.message.includes('Supabase vector store requires additional setup')) {
                return `❌ Training failed: ${error.message}. Please ensure Supabase integration is set up.`;
            }
            return `❌ Training failed for '${knowledgeBaseName}': ${error.message}`;
        }
    }
};