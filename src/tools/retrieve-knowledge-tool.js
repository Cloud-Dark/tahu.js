// src/tools/retrieve-knowledge-tool.js
import chalk from 'chalk';

export const retrieveKnowledgeTool = {
    name: 'retrieveKnowledge',
    description: 'Retrieves relevant information from a specified knowledge base. Input format: "knowledgeBaseName|storeType|query_text|k". Supported store types: sqlite, chromadb. k is optional (default 3). Example: "my_docs|sqlite|What are TahuJS features?|2"',
    execute: async (input, vectorStoreManager) => {
        const parts = input.split('|');
        if (parts.length < 3) {
            return "❌ Invalid input format. Please use 'knowledgeBaseName|storeType|query_text|k'.";
        }

        const knowledgeBaseName = parts[0].trim();
        const storeType = parts[1].trim().toLowerCase();
        const queryText = parts[2].trim();
        const k = parts.length > 3 ? parseInt(parts[3].trim(), 10) : 3;

        if (!knowledgeBaseName || !storeType || !queryText) {
            return "❌ Knowledge base name, store type, and query text cannot be empty.";
        }

        if (!['sqlite', 'chroma', 'supabase'].includes(storeType)) {
            return `❌ Unsupported store type: ${storeType}. Supported types are 'sqlite', 'chroma', 'supabase'.`;
        }

        if (isNaN(k) || k <= 0) {
            return "❌ Invalid value for k. It must be a positive number.";
        }

        console.log(chalk.blue(`📚 Retrieving knowledge from '${knowledgeBaseName}' using ${storeType} store for query: "${queryText}" (k=${k})...`));
        try {
            const results = await vectorStoreManager.retrieveDocuments(knowledgeBaseName, queryText, storeType, {}, k);
            if (results.length === 0) {
                return `ℹ️ No relevant knowledge found in '${knowledgeBaseName}' for query: "${queryText}".`;
            }
            
            const formattedResults = results.map((doc, index) => 
                `${index + 1}. Content: "${doc.text.substring(0, 200)}..."` // Show snippet
            ).join('\n');

            return `✅ Retrieved knowledge from '${knowledgeBaseName}':\n${formattedResults}`;
        } catch (error) {
            if (storeType === 'supabase' && error.message.includes('Supabase vector store requires additional setup')) {
                return `❌ Retrieval failed: ${error.message}. Please ensure Supabase integration is set up.`;
            }
            return `❌ Retrieval failed for '${knowledgeBaseName}': ${error.message}`;
        }
    }
};