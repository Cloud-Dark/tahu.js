
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore as LangchainSupabaseVectorStore } from '@langchain/supabase';
import chalk from 'chalk';

export class SupabaseVectorStore {
    constructor(supabaseUrl, supabaseAnonKey, tableName, queryName, embeddings) {
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase URL and Anon Key are required for SupabaseVectorStore.");
        }
        if (!embeddings) {
            throw new Error("Embeddings instance (from LLMManager) is required for SupabaseVectorStore.");
        }

        this.client = createClient(supabaseUrl, supabaseAnonKey);
        this.tableName = tableName || 'documents'; // Default table name
        this.queryName = queryName || 'match_documents'; // Default RPC function name
        this.embeddings = embeddings;
        this.langchainStore = null;
        this.initializeLangchainStore();
    }

    async initializeLangchainStore() {
        try {
            this.langchainStore = await LangchainSupabaseVectorStore.fromExistingIndex(this.embeddings, {
                client: this.client,
                tableName: this.tableName,
                queryName: this.queryName,
            });
            console.log(chalk.green(`🗄️  SupabaseVectorStore initialized with table: ${this.tableName}`));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to initialize SupabaseVectorStore: ${error.message}`));
            console.error(chalk.yellow('💡 Ensure Supabase project is set up, pgvector extension is enabled, and table/function exist.'));
            this.langchainStore = null;
        }
    }

    async addDocument(text, embedding, id = null) {
        if (!this.langchainStore) {
            throw new Error("SupabaseVectorStore not initialized. Ensure Supabase client is configured correctly.");
        }
        try {
            // Langchain Supabase store expects documents and metadata, it handles embeddings internally
            // For direct embedding addition, we might need a custom RPC or direct insert.
            // For simplicity, we'll use addDocuments which re-embeds, or rely on the Langchain store's internal embedding.
            // If `embedding` is already generated, we can pass it as metadata or ensure Langchain's `addVectors` is used.
            // For now, let's assume `addDocuments` which takes care of embedding.
            await this.langchainStore.addDocuments([text], [{ id: id || `doc_${Date.now()}` }]);
            console.log(chalk.green(`➕ Document added to Supabase knowledge base.`));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to add document to Supabase: ${error.message}`));
            throw error;
        }
    }

    async retrieveDocuments(queryEmbedding, k = 5) {
        if (!this.langchainStore) {
            throw new Error("SupabaseVectorStore not initialized. Ensure Supabase client is configured correctly.");
        }
        try {
            // Langchain Supabase store's similaritySearchVectorWithScore takes query embedding directly
            const results = await this.langchainStore.similaritySearchVectorWithScore(queryEmbedding, k);
            console.log(chalk.blue(`🔍 Retrieved ${results.length} documents from Supabase.`));
            return results.map(([doc, score]) => ({
                text: doc.pageContent,
                metadata: doc.metadata,
                score: score // Similarity score
            }));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to retrieve documents from Supabase: ${error.message}`));
            throw error;
        }
    }

    async clear() {
        if (!this.client) {
            console.warn(chalk.yellow('⚠️  Supabase client not initialized, cannot clear.'));
            return;
        }
        try {
            // This will delete all rows from the specified table
            const { error } = await this.client.from(this.tableName).delete().neq('id', '0'); // Delete all where id is not 0 (to avoid deleting table itself)
            if (error) throw error;
            console.log(chalk.yellow(`🗑️  Supabase table '${this.tableName}' cleared.`));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to clear Supabase table: ${error.message}`));
            throw error;
        }
    }
}
