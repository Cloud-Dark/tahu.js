// src/vector-stores/sqlite-vector-store.js
import Database from 'better-sqlite3';
import chalk from 'chalk';

export class SQLiteVectorStore {
  constructor(dbPath, dimension) {
    this.db = new Database(dbPath);
    this.dimension = dimension;
    this.db.exec(`
            CREATE TABLE IF NOT EXISTS knowledge_base (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                embedding BLOB NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log(chalk.green(`🗄️  SQLiteVectorStore initialized at ${dbPath}`));
  }

  async addDocument(text, embedding) {
    if (embedding.length !== this.dimension) {
      throw new Error(
        `Embedding dimension mismatch. Expected ${this.dimension}, got ${embedding.length}`
      );
    }
    const stmt = this.db.prepare(
      'INSERT INTO knowledge_base (text, embedding) VALUES (?, ?)'
    );
    stmt.run(text, JSON.stringify(embedding)); // Store embedding as JSON string
    console.log(chalk.green(`➕ Document added to SQLite knowledge base.`));
  }

  // This is a simplified retrieval. For true vector similarity, a more advanced algorithm
  // or a dedicated vector DB is needed. This just retrieves all for demonstration.
  async retrieveDocuments(queryEmbedding, k = 5) {
    // In a real scenario, you'd perform a similarity search here.
    // For SQLite, this would typically involve a custom function or iterating.
    // For simplicity, we'll just fetch recent documents.
    const rows = this.db
      .prepare(
        'SELECT text, embedding FROM knowledge_base ORDER BY timestamp DESC LIMIT ?'
      )
      .all(k);
    console.log(
      chalk.blue(
        `🔍 Retrieving ${rows.length} documents from SQLite knowledge base.`
      )
    );
    return rows.map((row) => ({
      text: row.text,
      embedding: JSON.parse(row.embedding),
    }));
  }

  async clear() {
    this.db.exec('DELETE FROM knowledge_base');
    console.log(chalk.yellow('🗑️  SQLite knowledge base cleared.'));
  }
}
