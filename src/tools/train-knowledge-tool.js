// src/tools/train-knowledge-tool.js
import chalk from 'chalk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const trainKnowledgeTool = {
    name: 'trainKnowledge',
    description: 'Adds text data to a specified knowledge base for later retrieval. Input format: "knowledgeBaseName|storeType|source_type|source_data". Supported store types: sqlite, chroma, supabase. Supported source types: text, file, url. Example: "my_docs|sqlite|text|This is a document about TahuJS features." or "my_docs|sqlite|file|/path/to/your/knowledge.txt" or "my_docs|sqlite|url|https://example.com/knowledge.txt".',
    execute: async (input, vectorStoreManager) => {
        const parts = input.split('|');
        if (parts.length < 4) {
            return "❌ Invalid input format. Please use 'knowledgeBaseName|storeType|source_type|source_data'.";
        }

        const knowledgeBaseName = parts[0].trim();
        const storeType = parts[1].trim().toLowerCase();
        const sourceType = parts[2].trim().toLowerCase();
        const sourceData = parts.slice(3).join('|').trim(); // Rejoin remaining parts as source data

        if (!knowledgeBaseName || !storeType || !sourceType || !sourceData) {
            return "❌ Knowledge base name, store type, source type, and source data cannot be empty.";
        }

        if (!['sqlite', 'chroma', 'supabase'].includes(storeType)) {
            return `❌ Unsupported store type: ${storeType}. Supported types are 'sqlite', 'chroma', 'supabase'.`;
        }

        let textToTrain = '';

        try {
            if (sourceType === 'text') {
                textToTrain = sourceData;
            } else if (sourceType === 'file') {
                const filePath = path.resolve(sourceData); // Resolve to absolute path
                if (!fs.existsSync(filePath)) {
                    return `❌ File not found at: ${filePath}`;
                }
                textToTrain = fs.readFileSync(filePath, 'utf8');
            } else if (sourceType === 'url') {
                console.log(chalk.blue(`🌐 Fetching content from URL: ${sourceData}...`));
                const response = await axios.get(sourceData, {
                    headers: {
                        'User-Agent': 'TahuJS/1.0.0 (https://github.com/Cloud-Dark/tahujs)'
                    },
                    timeout: 15000
                });
                textToTrain = response.data;
                // Basic HTML cleaning - remove script and style tags
                textToTrain = textToTrain.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                textToTrain = textToTrain.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
                textToTrain = textToTrain.replace(/<[^>]*>/g, ''); // Remove remaining HTML tags
                textToTrain = textToTrain.replace(/\s+/g, ' ').trim(); // Normalize whitespace
            } else {
                return `❌ Unsupported source type: ${sourceType}. Supported types are 'text', 'file', 'url'.`;
            }

            if (!textToTrain || textToTrain.trim() === '') {
                return `❌ No content found or extracted from source: ${sourceData}`;
            }

            console.log(chalk.blue(`📚 Training knowledge for '${knowledgeBaseName}' using ${storeType} store...`));
            await vectorStoreManager.addDocument(knowledgeBaseName, textToTrain, storeType);
            return `✅ Knowledge successfully added to '${knowledgeBaseName}' (${storeType} store) from ${sourceType}: ${sourceData.substring(0, 50)}...`;

        } catch (error) {
            if (sourceType === 'supabase' && error.message.includes('Supabase vector store requires additional setup')) {
                return `❌ Training failed: ${error.message}. Please ensure Supabase integration is set up.`;
            }
            return `❌ Training failed for '${knowledgeBaseName}' from ${sourceType} ${sourceData}: ${error.message}`;
        }
    }
};