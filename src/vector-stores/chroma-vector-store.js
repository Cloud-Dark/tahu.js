// src/vector-stores/chroma-vector-store.js
import { ChromaClient } from 'chromadb';
import chalk from 'chalk';

export class ChromaVectorStore {
    constructor(collectionName, url = 'http://localhost:8000') {
        this.client = new ChromaClient({ path: url });
        this.collectionName = collectionName;
        this.collection = null;
        this.initializeCollection();
    }

    async initializeCollection() {
        try {
            this.collection = await this.client.getOrCreateCollection({ name: this.collectionName });
            console.log(chalk.green(`🗄️  ChromaVectorStore initialized with collection: ${this.collectionName}`));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to initialize ChromaDB collection: ${error.message}`));
            console.error(chalk.yellow('💡 Ensure ChromaDB server is running. See https://www.trychroma.com/ for setup.'));
            this.collection = null;
        }
    }

    async addDocument(text, embedding, id = null) {
        if (!this.collection) {
            throw new Error("ChromaDB collection not initialized. Ensure the ChromaDB server is running.");
        }
        try {
            const docId = id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            await this.collection.add({
                ids: [docId],
                embeddings: [embedding],
                documents: [text],
                metadatas: [{ source: 'tahujs-train' }]
            });
            console.log(chalk.green(`➕ Document added to ChromaDB knowledge base (ID: ${docId}).`));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to add document to ChromaDB: ${error.message}`));
            throw error;
        }
    }

    async retrieveDocuments(queryEmbedding, k = 5) {
        if (!this.collection) {
            throw new Error("ChromaDB collection not initialized. Ensure the ChromaDB server is running.");
        }
        try {
            const results = await this.collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: k,
                include: ['documents', 'embeddings', 'distances']
            });
            console.log(chalk.blue(`🔍 Retrieved ${results.documents[0]?.length || 0} documents from ChromaDB.`));
            return results.documents[0].map((doc, index) => ({
                text: doc,
                embedding: results.embeddings[0][index],
                distance: results.distances[0][index]
            }));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to retrieve documents from ChromaDB: ${error.message}`));
            throw error;
        }
    }

    async clear() {
        if (!this.collection) {
            console.warn(chalk.yellow('⚠️  ChromaDB collection not initialized, cannot clear.'));
            return;
        }
        try {
            await this.client.deleteCollection({ name: this.collectionName });
            this.collection = null; // Reset collection after deletion
            await this.initializeCollection(); // Re-create an empty collection
            console.log(chalk.yellow(`🗑️  ChromaDB collection '${this.collectionName}' cleared and re-created.`));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to clear ChromaDB collection: ${error.message}`));
            throw error;
        }
    }
}