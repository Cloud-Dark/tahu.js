// src/core/vector-store-manager.js
import chalk from 'chalk';
import { SQLiteVectorStore } from '../vector-stores/sqlite-vector-store.js';
import { ChromaVectorStore } from '../vector-stores/chroma-vector-store.js';
import TahuJS from '../tahu.js';

export class VectorStoreManager {
  constructor(config, llmManager, memoryDir, sqliteDb) {
    this.config = config;
    this.llmManager = llmManager;
    this.memoryDir = memoryDir;
    this.sqliteDb = sqliteDb;
    this.stores = new Map(); // Map to hold active vector store instances

    // Default embedding dimension (e.g., for text-embedding-ada-002)
    // This should ideally be dynamic based on the chosen embedding model
    this.defaultEmbeddingDimension = 1536;
  }

  // Debug logging methods - only logs when debug mode is enabled
  _debugLog(message, ...args) {
    TahuJS.debugLog(this.config.debug, message, ...args);
  }

  _debugInfo(message, ...args) {
    TahuJS.debugInfo(this.config.debug, message, ...args);
  }

  _debugWarn(message, ...args) {
    TahuJS.debugWarn(this.config.debug, message, ...args);
  }

  _debugError(message, ...args) {
    TahuJS.debugError(this.config.debug, message, ...args);
  }

  /**
   * Gets or creates a vector store instance.
   * @param {string} name The name of the knowledge base/collection.
   * @param {string} type The type of vector store ('sqlite', 'chroma', 'supabase').
   * @param {object} options Specific options for the store type.
   * @returns {object} The vector store instance.
   */
  getStore(name, type, options = {}) {
    const storeKey = `${name}_${type}`;
    if (this.stores.has(storeKey)) {
      return this.stores.get(storeKey);
    }

    let store;
    switch (type) {
      case 'sqlite':
        const dbPath = options.dbPath || `${this.memoryDir}/${name}.sqlite`;
        store = new SQLiteVectorStore(dbPath, this.defaultEmbeddingDimension);
        break;
      case 'chroma':
        const chromaUrl =
          options.url || this.config.chromaDbUrl || 'http://localhost:8000';
        store = new ChromaVectorStore(name, chromaUrl);
        break;
      case 'supabase':
        throw new Error(
          chalk.yellow('💡 Supabase vector store is coming soon!')
        );
        break;
      default:
        throw new Error(`Unsupported vector store type: ${type}`);
    }
    this.stores.set(storeKey, store);
    return store;
  }

  /**
   * Adds a document to a specified knowledge base.
   * @param {string} knowledgeBaseName The name of the knowledge base.
   * @param {string} text The text content to add.
   * @param {string} storeType The type of vector store ('sqlite', 'chroma', 'supabase').
   * @param {object} storeOptions Options for the specific store.
   * @returns {Promise<void>}
   */
  async addDocument(knowledgeBaseName, text, storeType, storeOptions = {}) {
    const store = this.getStore(knowledgeBaseName, storeType, storeOptions);
    // For other stores, we generate embedding first.
    const embedding = await this.llmManager.getEmbeddings(text);
    await store.addDocument(text, embedding);
  }

  /**
   * Retrieves relevant documents from a specified knowledge base based on a query.
   * @param {string} knowledgeBaseName The name of the knowledge base.
   * @param {string} query The query text.
   * @param {string} storeType The type of vector store ('sqlite', 'chroma', 'supabase').
   * @param {object} storeOptions Options for the specific store.
   * @param {number} k The number of top results to retrieve.
   * @returns {Promise<Array<object>>} An array of retrieved documents.
   */
  async retrieveDocuments(
    knowledgeBaseName,
    query,
    storeType,
    storeOptions = {},
    k = 3
  ) {
    const store = this.getStore(knowledgeBaseName, storeType, storeOptions);
    const queryEmbedding = await this.llmManager.getEmbeddings(query);
    return await store.retrieveDocuments(queryEmbedding, k);
  }

  /**
   * Clears a specified knowledge base.
   * @param {string} knowledgeBaseName The name of the knowledge base.
   * @param {string} storeType The type of vector store ('sqlite', 'chroma', 'supabase').
   * @param {object} storeOptions Options for the specific store.
   * @returns {Promise<void>}
   */
  async clearKnowledgeBase(knowledgeBaseName, storeType, storeOptions = {}) {
    const store = this.getStore(knowledgeBaseName, storeType, storeOptions);
    await store.clear();
    this.stores.delete(`${knowledgeBaseName}_${storeType}`);
  }
}
