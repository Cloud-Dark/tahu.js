# Knowledge Base & RAG

TahuJS allows you to "train" (ingest) your own custom knowledge and retrieve it for AI augmentation. This is crucial for providing your AI with up-to-date or domain-specific information beyond its initial training data.

### How it Works:

1.  **Ingestion (`trainKnowledge`)**: You provide text data. TahuJS converts this text into numerical representations called "embeddings" using an embedding model. These embeddings, along with the original text, are stored in a chosen vector store.
2.  **Retrieval (`retrieveKnowledge`)**: When you have a query, TahuJS converts the query into an embedding and searches the vector store for the most semantically similar pieces of stored knowledge.
3.  **Augmentation**: The retrieved knowledge can then be passed to an LLM as context, allowing it to generate more informed and accurate responses.

### Tools:

- **`trainKnowledge`**:
  - **Description**: Adds text data to a specified knowledge base for later retrieval.
  - **Input Format**: `"knowledgeBaseName|storeType|source_type|source_data"`
  - **Supported Store Types**: `sqlite`, `chroma`, `supabase`
  - **Supported Source Types**: `text`, `file`, `url`
  - **Examples**:
    - `"my_docs|sqlite|text|This is a document about TahuJS features."`
    - `"my_docs|sqlite|file|/path/to/your/knowledge.txt"`
    - `"my_docs|sqlite|url|https://example.com/knowledge.txt"`
- **`retrieveKnowledge`**:
  - **Description**: Retrieves relevant information from a specified knowledge base.
  - **Input Format**: `"knowledgeBaseName|storeType|query_text|k"` (k is optional, default 3)
  - **Supported Store Types**: `sqlite`, `chroma`, `supabase`
  - **Example**: `"my_docs|sqlite|What are TahuJS features?|2"`

### Storage Options:

- **SQLite**:
  - **Type**: `sqlite`
  - **Description**: A simple, file-based local database. Ideal for small to medium-sized knowledge bases or local development. No external server required.
  - **Configuration**: Automatically uses a `.sqlite` file in the `memory` directory.
- **ChromaDB**:
  - **Type**: `chroma`
  - **Description**: A dedicated open-source vector database. Suitable for larger knowledge bases and more efficient similarity searches. Requires running a separate ChromaDB server.
  - **Configuration**: Set `chromaDbUrl` in TahuJS config (default `http://localhost:8000`).
  - **Setup**: You need to run a ChromaDB instance. Refer to [ChromaDB documentation](https://www.trychroma.com/) for installation.
- **Supabase (PostgreSQL with pgvector)**:
  - **Type**: `supabase`
  - **Description**: A powerful, scalable cloud-based PostgreSQL database with `pgvector` extension for vector storage. Ideal for production applications requiring robust data management and scalability.
  - **Configuration**: Requires `supabaseUrl` and `supabaseAnonKey` in TahuJS config.
  - **Setup**: You need to set up a Supabase project, enable the `pgvector` extension, and configure your tables. See example SQL in the "Basic Usage" section above.