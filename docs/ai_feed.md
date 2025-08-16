# TahuJS Library Comprehensive Information

This document provides a comprehensive and detailed overview of the TahuJS library, designed for AI consumption.

## 1. Introduction to TahuJS

TahuJS is a powerful Node.js library designed to simplify and accelerate the development of artificial intelligence-powered applications. It provides a robust framework for integrating various leading AI models and services, enabling developers to build intelligent agents, automate complex tasks, and process diverse data types with ease.

**Core Philosophy:** TahuJS aims to abstract away the complexities of AI integration, allowing developers to focus on the application's core logic and innovative features. It emphasizes modularity, extensibility through a plugin system, and comprehensive built-in tools.

**Use Cases:**
*   Building intelligent chatbots and conversational AI agents.
*   Automating data extraction and analysis from web pages, documents, and images.
*   Integrating advanced AI capabilities into existing Node.js applications.
*   Developing multi-agent systems for complex problem-solving.
*   Creating applications that leverage large language models (LLMs) for tasks like summarization, translation, and content generation.

**Key Features:**
*   **Multi-Provider LLM Integration:** Seamlessly connect with various LLM providers (OpenRouter, OpenAI, Gemini, Ollama).
*   **Comprehensive Built-in Tools:** A rich set of pre-built tools for web search, mapping, calculations, web scraping, summarization, and advanced OCR.
*   **Modular Manager System:** Organized architecture with dedicated managers for LLM, Tools, Agents, Workflows, Plugins, Memory, and Vector Stores.
*   **Persistent Memory:** Built-in support for memory management using SQLite, with options for advanced vector stores.
*   **Multi-Agent Workflows:** Capabilities for orchestrating complex interactions between multiple AI agents, including parallel and batch processing.
*   **Extensible Plugin System:** Easily extend TahuJS functionality by creating and loading custom plugins.
*   **Real-time Analytics:** Monitor LLM usage, token consumption, and costs.
*   **Knowledge Base (RAG) Support:** Integrate Retrieval-Augmented Generation with various vector store options.
*   **Configurable and Debuggable:** Flexible configuration options and a debug mode for detailed insights.

## 2. Installation and Setup

To get started with TahuJS, ensure you have Node.js installed and then configure your API keys.

### Prerequisites

TahuJS requires **Node.js version 18 or higher**.

### Installation Steps

1.  **Clone the Repository (if applicable):** If you're working with the TahuJS source directly, clone its repository.
    ```bash
    git clone https://github.com/Cloud-Dark/tahu.js.git
    cd tahu.js
    ```
2.  **Install Dependencies:** Navigate to your project directory and install TahuJS and its dependencies using npm.
    ```bash
    npm install tahu.js
    # Or if you cloned the repo:
    # npm install
    ```

### Configuration

TahuJS is initialized by creating an instance of the `TahuJS` class (or using the `createTahu` factory function) and passing a configuration object.

#### `createTahu(config)` Function

This is the primary way to initialize TahuJS. It returns a new `TahuJS` instance.

```javascript
import { createTahu } from 'tahu.js';

const tahu = createTahu({
  // Your configuration parameters here
});
```

#### `config` Object Parameters

The `config` object allows you to customize the behavior of TahuJS and its integrated components.

*   `provider` (String, **Required**): Specifies the primary LLM provider to use.
    *   **Default:** `'openrouter'`
    *   **Accepted Values:** `'openrouter'`, `'openai'`, `'gemini'`, `'ollama'`
*   `apiKey` (String, **Required**): Your API key for the chosen LLM provider. This is crucial for authentication.
*   `model` (String): The specific LLM model to use.
    *   **Default:** `'google/gemini-2.0-flash-exp:free'` (for OpenRouter/Gemini)
    *   **Example Values:** `'gpt-4-turbo'`, `'gemini-1.5-flash'`, `'llama2'`, etc.
*   `temperature` (Number): Controls the randomness of the LLM's output. Higher values mean more creative/random output.
    *   **Default:** `0.7`
    *   **Range:** `0.0` to `1.0`
*   `maxTokens` (Number): The maximum number of tokens (words/characters) the LLM should generate in its response.
    *   **Default:** `2000`
*   `googleMapsApiKey` (String, Optional): API key for Google Maps services, required for certain map-related tools.
*   `serpApiKey` (String, Optional): API key for SerpApi, used for enhanced web search capabilities.
*   `mapboxKey` (String, Optional): API key for Mapbox services, an alternative for map-related tools.
*   `ollamaBaseUrl` (String): Base URL for your local Ollama instance, if using Ollama as a provider.
    *   **Default:** `'http://localhost:11434'`
*   `httpReferer` (String, Optional): HTTP Referer header to send with requests, useful for some API providers.
*   `xTitle` (String, Optional): Custom header for some API providers.
*   `embeddingProvider` (String): Specifies the provider for embedding models.
    *   **Default:** Same as `provider`
    *   **Accepted Values:** `'openrouter'`, `'openai'`, `'gemini'`, `'ollama'`
*   `embeddingModel` (String): The specific embedding model to use.
    *   **Default:** Automatically determined based on `embeddingProvider` (e.g., `'embedding-001'` for Gemini, `'text-embedding-ada-002'` for OpenAI/OpenRouter, `'nomic-embed-text'` for Ollama).
*   `chromaDbUrl` (String, Optional): URL for your ChromaDB instance, if using ChromaDB for vector storage.
*   `supabaseUrl` (String, Optional): URL for your Supabase project, if using Supabase for vector storage.
*   `supabaseAnonKey` (String, Optional): Anonymous key for your Supabase project.
*   `debug` (Boolean): Enables verbose logging for debugging purposes.
    *   **Default:** `false`
*   `responseFormat` (String): Specifies the desired format for LLM responses.
    *   **Default:** `'json'`
    *   **Accepted Values:** `'json'`, `'text'`

        *   Applies `responseFormat` from `config` (`raw`, `md`, `json`).
    *   `estimateTokens(text)`: Estimates the number of tokens in a given text (simple character-based estimation).
    *   `clearConversation(conversationId)`: Clears the conversation history for a given `conversationId`.
*   **Dependencies:** Relies heavily on `@langchain/openai`, `@langchain/google-genai`, `@langchain/community/chat_models/ollama`, `langchain/agents`, `langchain/hub`, `langchain/schema`.

### 3.2. `ToolManager`

*   **Purpose:** Manages the registration, availability, and execution of all tools within TahuJS. It initializes built-in tools and provides methods for using them.
*   **Constructor Parameters:**
    *   `config`: The main TahuJS configuration object.
    *   `toolsMap`: A `Map` (passed from `TahuJS` instance) where currently enabled and registered tools are stored.
    *   `searchService`: An instance of `SearchService` for tools requiring web search.
    *   `mapService`: An instance of `MapService` for tools requiring map functionalities.
    *   `llmManager`: An instance of `LLMManager` for tools that might need LLM capabilities (e.g., summarization).
    *   `vectorStoreManager`: An instance of `VectorStoreManager` for tools interacting with knowledge bases.
*   **Key Properties:**
    *   `this.tools`: A `Map` containing tools that are currently enabled and registered for use.
    *   `this.allTools`: A `Map` containing all built-in tools, regardless of whether they are enabled in the configuration.
*   **Key Methods:**
    *   `initializeBuiltInTools()`: Populates `this.allTools` with all predefined tools and then registers them into `this.tools` based on the `config.tools.enabled` array. If `config.tools.enabled` is not specified, all built-in tools are enabled by default.
    *   `registerTool(name, tool)`: Registers a new tool with TahuJS. This method is used internally for built-in tools and can be used by plugins to add custom tools.
        *   `name` (String): The unique name of the tool.
        *   `tool` (Object): An object containing `description`, `execute` function, and optional `parameters`.
    *   `useTool(toolName, ...args)`: Executes a registered tool by its name.
        *   `toolName` (String): The name of the tool to execute.
        *   `...args`: Arguments to pass to the tool's `execute` function.
        *   Throws an error if the tool is not found or is disabled by configuration.
    *   `listTools()`: Returns an array of names of all currently enabled and registered tools.
*   **Built-in Tools Initialized (and their dependencies):**
    *   `webSearchTool` (requires `SearchService`)
    *   `calculateTool`
    *   `findLocationTool` (requires `MapService`)
    *   `getDirectionsTool` (requires `MapService`)
    *   `getElevationTool` (requires `MapService`)
    *   `webScrapeTool`
    *   `dateTimeTool`
    *   `summarizeTool` (requires `LLMManager`)
    *   `trainKnowledgeTool` (requires `VectorStoreManager`)
    *   `retrieveKnowledgeTool` (requires `VectorStoreManager`)
    *   `ocrTool`
    *   `ocrAdvancedTool` (requires `LLMManager`)
    *   `pdfAnalyzerTool`
    *   `cvAnalyzerTool` (requires `LLMManager`)

### 3.3. `AgentManager`

*   **Purpose:** Provides functionalities to create, configure, run, list, and retrieve information about AI agents. It allows defining agents with specific roles, personalities, capabilities, and memory types.
*   **Constructor Parameters:**
    *   `agentsMap`: A `Map` (passed from `TahuJS` instance) where created agents are stored.
    *   `llmManager`: An instance of `LLMManager` to enable agents to interact with LLMs.
    *   `memoryManager`: An instance of `MemoryManager` to handle agent-specific memory persistence.
*   **Key Methods:**
    *   `createAgent(name, config = {})`: Creates a new AI agent with a given name and configuration.
        *   `name` (String): Unique name for the agent.
        *   `config` (Object):
            *   `systemPrompt` (String): The initial instruction or role for the agent (default: `You are ${name}, a helpful AI assistant.`).
            *   `tools` (Array): (Potentially deprecated if using LangChain agent directly) A list of tools the agent can use.
            *   `personality` (String or Object): Defines the agent's personality. Can be a simple string (e.g., `'helpful'`) or an object with `traits`, `mood`, `expertise`.
            *   `memoryType` (String): Specifies how the agent's memory is stored.
                *   **Default:** `'volatile'` (in-memory, non-persistent).
                *   **Accepted Values:** `'volatile'`, `'json'`, `'sqlite'`.
            *   `memoryPath` (String, Optional): Path for JSON file or SQLite table name, depending on `memoryType`.
            *   `maxMemorySize` (Number): Maximum number of memory entries to retain.
                *   **Default:** `10`.
            *   `capabilities` (Array): A list of capabilities the agent possesses (e.g., `['chat', 'search', 'calculate']`).
    *   `createPrebuiltAgent(type, customConfig = {})`: Creates a pre-configured agent based on a predefined type.
        *   `type` (String): The type of pre-built agent to create.
            *   **Accepted Values:** `'coder'`, `'writer'`, `'analyst'`, `'researcher'`.
        *   `customConfig` (Object, Optional): Overrides default configurations for the pre-built agent.
    *   `runAgent(agentName, task, options = {})`: Executes a specific task for a named agent.
        *   `agentName` (String): The name of the agent to run.
        *   `task` (String): The task description for the agent.
        *   `options` (Object, Optional): Additional options passed to the underlying LLM chat call.
        *   Loads and saves agent memory based on `memoryType`.
        *   Constructs an enhanced prompt including the agent's system prompt and capabilities.
    *   `listAgents()`: Returns an array of names of all created agents.
    *   `getAgentInfo(agentName)`: Retrieves the configuration and current state of a specific agent.
*   **Agent Memory:** Agents can maintain memory, which is loaded before running a task and saved after. Memory can be volatile (in-memory), JSON file-based, or SQLite database-based.
*   **Agent Builder (`tahu.builder()`):** This provides a fluent API for creating agents.

### 3.4. `WorkflowManager`

*   **Purpose:** Enables the creation and execution of multi-step AI workflows, allowing for sequential task dependencies, parallel execution of independent tasks, and batch processing of multiple prompts.
*   **Constructor Parameters:**
    *   `llmManager`: An instance of `LLMManager` for direct LLM interactions.
    *   `agentManager`: An instance of `AgentManager` for running agent-specific tasks within workflows.
*   **Key Methods:**
    *   `createWorkflow(workflowDefinition)`: Creates a new workflow instance based on a defined sequence of tasks and their dependencies.
        *   `workflowDefinition` (Array of Objects): An array where each object defines a task in the workflow. Each task object should have:
            *   `agent` (String): The name of the agent responsible for this task.
            *   `task` (String): The description of the task for the agent.
            *   `depends` (Array of Strings, Optional): An array of task names that this task depends on. The task will only execute after its dependencies are met.
        *   Returns an object with an `execute(initialInput)` method to start the workflow.
        *   `execute(initialInput)`: Runs the defined workflow. Tasks are executed sequentially, respecting dependencies. Results of completed tasks are stored and can be used as input for dependent tasks.
    *   `parallel(tasks)`: Executes multiple tasks concurrently.
        *   `tasks` (Array of Promises or Task Objects): An array where each element can be:
            *   A `Promise` directly.
            *   An object with `agent` (String) and `input` (String) properties for running an agent.
            *   An object with `prompt` (String) for direct LLM chat.
        *   Returns a `Promise` that resolves with an array of results from all tasks once they complete. Throws an error if any task fails.
    *   `batch(promptsAndOptions)`: Processes multiple LLM prompts in a single batch operation.
        *   `promptsAndOptions` (Array of Objects): An array where each object has a `prompt` (String) and optional `options` for the LLM chat call.
        *   Returns a `Promise` that resolves with an array of responses from the LLM for each prompt. Throws an error if any prompt processing fails.

### 3.5. `PluginManager`

*   **Purpose:** Provides mechanisms to extend TahuJS functionality by loading and integrating custom plugins. Plugins are typically JavaScript files that export a default function.
*   **Constructor Parameters:**
    *   `tahuInstance`: A reference to the main `TahuJS` instance. This allows plugins to interact with and extend the core TahuJS functionalities (e.g., register new tools, access managers).
*   **Key Methods:**
    *   `use(plugin)`: Integrates a single plugin into TahuJS.
        *   `plugin` (Function): The plugin itself, which should be a function that accepts the `tahuInstance` as an argument. This function will be executed, allowing the plugin to register tools, modify behavior, or perform other setup tasks.
        *   Logs a warning if the provided `plugin` is not a function.
    *   `loadPlugins(directory)`: Discovers and loads all JavaScript files within a specified directory as plugins.
        *   `directory` (String): The absolute or relative path to the directory containing plugin files.
        *   Reads all `.js` files in the directory.
        *   For each `.js` file, it attempts to dynamically import it.
        *   If the imported module exports a default function, it calls `this.use()` with that function.
        *   Logs warnings if the directory is not found or if a plugin file does not export a default function.
        *   Logs errors if a plugin fails to load.

### 3.6. `MemoryManager`

*   **Purpose:** Provides functionalities for loading and saving agent-specific memory, ensuring persistence across sessions for non-volatile memory types. It supports JSON file storage and SQLite database storage.
*   **Constructor Parameters:**
    *   `memoryDir`: The directory where memory files (like JSON files) and the SQLite database will be stored.
    *   `sqliteDb`: An instance of a `better-sqlite3` database connection. The constructor also ensures the `agent_memory` table exists in the SQLite database.
*   **Key Methods:**
    *   `_getJsonMemoryPath(agentName)`: A private helper method to construct the file path for JSON memory based on the agent's name.
    *   `loadAgentMemory(agentName, memoryType, memoryPath)`: Loads the memory for a specified agent.
        *   `agentName` (String): The name of the agent whose memory is to be loaded.
        *   `memoryType` (String): The type of memory to load (`'volatile'`, `'json'`, `'sqlite'`).
        *   `memoryPath` (String, Optional): Custom path for JSON file or SQLite table name.
        *   Returns the loaded memory data (an array of objects) or an empty array if no memory is found or an error occurs.
        *   Handles reading from JSON files and querying the SQLite database.
    *   `saveAgentMemory(agentName, memoryData, memoryType, memoryPath)`: Saves the memory data for a specified agent.
        *   `agentName` (String): The name of the agent whose memory is to be saved.
        *   `memoryData` (Array of Objects): The data to be saved as memory.
        *   `memoryType` (String): The type of memory to save (`'json'`, `'sqlite'`).
        *   `memoryPath` (String, Optional): Custom path for JSON file or SQLite table name.
        *   Handles writing to JSON files and inserting/replacing data in the SQLite database.
        *   Logs success or error messages during saving.

### 3.7. `VectorStoreManager`

*   **Purpose:** Provides a unified interface for interacting with various vector database implementations, enabling the storage and retrieval of document embeddings for knowledge base functionalities. It supports SQLite and ChromaDB, with Supabase planned.
*   **Constructor Parameters:**
    *   `config`: The main TahuJS configuration object, used for `chromaDbUrl` and other potential store-specific configurations.
    *   `llmManager`: An instance of `LLMManager` to generate embeddings for documents and queries.
    *   `memoryDir`: The directory for storing SQLite database files.
    *   `sqliteDb`: An instance of a `better-sqlite3` database connection (used by `SQLiteVectorStore`).
*   **Key Properties:**
    *   `this.stores`: A `Map` to hold active instances of different vector stores, keyed by `name_type` (e.g., `myKnowledgeBase_sqlite`).
    *   `this.defaultEmbeddingDimension`: A default dimension for embeddings (e.g., 1536 for `text-embedding-ada-002`). This should ideally be dynamic based on the chosen embedding model.
*   **Key Methods:**
    *   `getStore(name, type, options = {})`: Gets an existing vector store instance or creates a new one if it doesn't exist.
        *   `name` (String): The name of the knowledge base or collection.
        *   `type` (String): The type of vector store to use.
            *   **Accepted Values:** `'sqlite'`, `'chroma'`, `'supabase'` (Supabase is "coming soon").
        *   `options` (Object, Optional): Specific options for the store type (e.g., `dbPath` for SQLite, `url` for Chroma).
        *   Returns the vector store instance. Throws an error for unsupported types.
    *   `addDocument(knowledgeBaseName, text, storeType, storeOptions = {})`: Adds a text document to a specified knowledge base.
        *   Generates embeddings for the `text` using `llmManager.getEmbeddings`.
        *   Calls the `addDocument` method of the underlying vector store.
    *   `retrieveDocuments(knowledgeBaseName, query, storeType, storeOptions = {}, k = 3)`: Retrieves relevant documents from a knowledge base based on a query.
        *   Generates embeddings for the `query` using `llmManager.getEmbeddings`.
        *   Calls the `retrieveDocuments` method of the underlying vector store to find the top `k` most similar documents.
        *   `k` (Number): The number of top results to retrieve (default: 3).
        *   Returns an array of retrieved documents.
    *   `clearKnowledgeBase(knowledgeBaseName, storeType, storeOptions = {})`: Clears all documents from a specified knowledge base.
        *   Calls the `clear` method of the underlying vector store.
        *   Removes the store instance from `this.stores`.
*   **Supported Vector Stores:**
    *   `SQLiteVectorStore`: Uses SQLite for local vector storage.
    *   `ChromaVectorStore`: Integrates with an external ChromaDB instance.
    *   `Supabase`: Planned for future integration.

### 3.8. `AnalyticsManager`

*   **Purpose:** Provides real-time analytics and statistics on LLM interactions, including token usage, estimated costs, response times, and request outcomes. This helps in monitoring and optimizing LLM usage.
*   **Constructor:** Initializes all tracking metrics to zero.
*   **Key Methods:**
    *   `_getCostPerThousandTokens(model, provider)`: A private helper method that provides an illustrative (mock) cost per thousand tokens based on the LLM `model` and `provider`. **Note:** These are example prices and should be updated with actual provider pricing for accurate cost tracking.
    *   `recordCompletion(tokens, duration, model, provider)`: Records data for a successful LLM completion.
        *   `tokens` (Number): Number of tokens used in the completion.
        *   `duration` (Number): Response time in milliseconds.
        *   `model` (String): The LLM model used.
        *   `provider` (String): The LLM provider used.
        *   Updates total tokens, estimated cost, total response time, and successful request counts. Logs a summary of the completion.
    *   `recordError(duration)`: Records data for a failed LLM request.
        *   `duration` (Number): Response time in milliseconds.
        *   Updates total response time and failed request counts. Logs an error message.
    *   `getStats()`: Returns an object containing comprehensive analytics statistics.
        *   `totalTokensUsed`: Total tokens consumed across all requests.
        *   `estimatedCost`: Total estimated cost based on token usage and mock pricing.
        *   `totalResponseTimeMs`: Cumulative response time for all requests.
        *   `averageResponseTimeMs`: Average response time per request.
        *   `successfulRequests`: Number of successful LLM requests.
        *   `failedRequests`: Number of failed LLM requests.
        *   `totalRequests`: Total number of LLM requests (successful + failed).
        *   `successRate`: Percentage of successful requests.
    *   `resetStats()`: Resets all analytics tracking metrics to zero.

## 4. Built-in Tools (Detailed Reference)

This section provides a detailed reference for each built-in tool available in TahuJS, including their purpose, parameters, and expected output.

### 4.1. OCR and Document Analysis Tools

### 4.1.1. `ocr_advanced` Tool

*   **Name:** `ocr_advanced`
*   **Description:** Performs a flexible, multi-stage Optical Character Recognition (OCR) and analysis on a local image file. It can optionally use an AI to enhance and format the raw OCR text. Language and custom model path for OCR are configurable.
*   **`execute` Method Parameters:**
    *   `filePath` (String, **Required**): The absolute path to the image file to be processed. Supported image formats: `.png`, `.jpg`, `.jpeg`, `.bmp`, `.gif`.
    *   `options` (Object, Optional): Configuration options for the OCR process.
        *   `debug` (Boolean): If `true`, enables verbose logging for debugging the tool's execution.
        *   `language` (String): The language for OCR (e.g., `'eng'` for English).
            *   **Default:** `'eng'`
        *   `langPath` (String, Optional): Path to the directory containing custom `.traineddata` models for Tesseract.js.
        *   `aiEnhanced` (Boolean): If `true`, the raw OCR result will be sent to an LLM for AI-enhanced analysis and formatting.
            *   **Default:** `false`
        *   `aiPrompt` (String, Optional): A custom prompt to use for AI enhancement. If `aiEnhanced` is `true` and this is not provided, a default prompt for document analysis will be used.
        *   `outputFields` (Array of Strings, Optional): An array specifying which fields to include in the final output (e.g., `['rawOcrResult', 'aiEnhancedResult']`). If omitted, all available data is returned.
    *   `llmManager` (Object): An instance of `LLMManager`, required if `aiEnhanced` is `true`.
*   **Functionality:**
    1.  **File Validation:** Checks if `filePath` is provided, exists, and has a supported image extension. Throws an error for unsupported file types (e.g., PDFs, unless a PDF-to-image conversion is integrated externally).
    2.  **Raw OCR (Stage 1):** Uses `tesseract.js` to perform OCR on the image.
        *   Extracts `fullText`, `confidence`, and `words` (with bounding boxes).
        *   Attempts to detect dominant colors in the image using `color-thief-node`.
        *   Returns `rawOcrResult` containing `metadata` (filePath, fileType, fileSize, createdAt, modifiedAt), `fullText`, `confidence`, `words`, and `colors`.
    3.  **AI Enhancement (Stage 2 - Optional):** If `aiEnhanced` is `true`, the `rawOcrResult` (specifically `fullText`) is passed to the `llmManager` with a predefined or custom `aiPrompt`. The LLM generates a structured report or refined text.
    4.  **Output Construction:** Combines `rawOcrResult` and `aiEnhancedResult` (if applicable) into the final output.
*   **Output:** An object containing:
    *   `rawOcrResult` (Object): Contains the raw OCR data (metadata, fullText, confidence, words, colors).
    *   `aiEnhancedResult` (String, Optional): The AI-generated report or refined text, present only if `aiEnhanced` was `true`.
*   **Dependencies:** `tesseract.js`, `fs`, `path`, `chalk`, `color-thief-node`. Requires `LLMManager` for AI enhancement.

### 4.1.2. `pdf_analyzer` Tool

*   **Name:** `pdf_analyzer`
*   **Description:** Extracts all text content from a PDF file. This tool is essential for processing text-based PDFs and can be combined with AI for further analysis.
*   **`execute` Method Parameters:**
    *   `filePath` (String, **Required**): The absolute path to the PDF file to be processed.
    *   `options` (Object, Optional): Configuration options for the PDF analysis.
        *   `debug` (Boolean): If `true`, enables verbose logging for debugging the tool's execution.
*   **Functionality:**
    1.  **File Validation:** Checks if `filePath` is provided and exists.
    2.  **Text Extraction:** Uses `pdf.js-extract` to parse the PDF and extract text content from all pages.
    3.  **Concatenation:** Concatenates text from all pages into a single `fullText` string, with double newlines separating content from different pages.
*   **Output:** An object containing:
    *   `filePath` (String): The absolute path to the analyzed PDF file.
    *   `textContent` (String): The extracted text content from the PDF.
    *   `pageCount` (Number): The total number of pages in the PDF.
    *   `pdfInfo` (Object, Optional): Metadata about the PDF, if available from `pdf.js-extract`. May be `undefined` for some PDFs.
    *   **Dependencies:** `pdf.js-extract`, `fs`, `path`, `chalk`.

### 4.1.3. `cv_analyzer` Tool

*   **Name:** `cv_analyzer`
*   **Description:** Analyzes a CV (resume) from an image or PDF file using OCR and AI to extract structured information.
*   **`execute` Method Parameters:**
    *   `filePath` (String, **Required**): The absolute path to the CV file (image or PDF) to be processed. Supported formats: `.png`, `.jpg`, `.jpeg`, `.bmp`, `.gif`, `.pdf`.
    *   `options` (Object, Optional): Configuration options for the CV analysis.
        *   `debug` (Boolean): If `true`, enables verbose logging for debugging the tool's execution.
    *   `llmManager` (Object): An instance of `LLMManager`, which is **required** for the AI analysis of the extracted text.
*   **Functionality:**
    1.  **File Validation:** Checks if `filePath` is provided and exists.
    2.  **Text Extraction:**
        *   If the file is an image (`.png`, `.jpg`, etc.), it uses `tesseract.js` to perform OCR and extract text.
        *   If the file is a PDF (`.pdf`), it uses `pdf.js-extract` to extract text content.
        *   Throws an error if the file type is unsupported or if no text can be extracted.
    3.  **AI Analysis:** The extracted text is then sent to the `llmManager` with a specific prompt. The prompt instructs the LLM to act as an expert CV analyzer and extract structured information into a JSON object.
        *   **Fields to Extract (JSON format):**
            *   `name`: Full name of the candidate.
            *   `contact`: `{ email: string, phone: string, linkedin: string (URL), github: string (URL) }`.
            *   `summary`: A brief professional summary.
            *   `skills`: `[string]` (List of key skills).
            *   `experience`: `[{ title: string, company: string, duration: string, description: string }]` (List of work experiences).
            *   `education`: `[{ degree: string, institution: string, duration: string }]` (List of educational backgrounds).
            *   If a field is not found, its value should be `null`.
*   **Output:** A JSON object containing the structured CV information extracted by the AI.
    *   **Dependencies:** `tesseract.js`, `pdf.js-extract`, `fs`, `path`, `chalk`. Requires `LLMManager` for AI analysis.

### 4.2.1. `webSearch` Tool

*   **Name:** `webSearch`
*   **Description:** Searches the web using multiple search engines (SerpApi, DuckDuckGo, Google Scraping).
*   **`execute` Method Parameters:**
    *   `query` (String, **Required**): The search query.
    *   `searchService` (Object): An instance of `SearchService`, which performs the actual web search.
*   **Functionality:** Delegates the search operation to the `SearchService`.
*   **Output:** The search results provided by the `SearchService`. The exact format depends on the `SearchService` implementation (e.g., an array of search result objects with titles, snippets, and URLs).
*   **Dependencies:** Requires `SearchService`.

### 4.2.2. `calculate` Tool

*   **Name:** `calculate`
*   **Description:** Performs mathematical calculations and evaluates expressions.
*   **`execute` Method Parameters:**
    *   `expression` (String, **Required**): The mathematical expression to be evaluated (e.g., `"2 + 2 * 3"`, `"sqrt(16)"`, `"5^2"`).
*   **Functionality:**
    1.  **Expression Cleaning:** Removes any characters from the input `expression` that are not numbers, basic arithmetic operators (`+`, `-`, `*`, `/`, `(`, `)`, `.`, `^`, `√`), or whitespace.
    2.  **Validation:** Checks if the cleaned expression is empty or contains only whitespace.
    3.  **Evaluation:** Uses the `mathjs` library to evaluate the cleaned mathematical expression.
    4.  **Error Handling:** Catches and returns an error message if the calculation fails (e.g., due to invalid syntax or division by zero).
*   **Output:** A string indicating the result of the calculation in the format `✅ Calculation: [expression] = [result]`, or an error message in the format `❌ Calculation error: [error message]`.
    *   **Dependencies:** `mathjs`.

### 4.2.3. `findLocation` Tool

*   **Name:** `findLocation`
*   **Description:** Finds a location using multiple map services and provides relevant links and QR codes.
*   **`execute` Method Parameters:**
    *   `query` (String, **Required**): The location query (e.g., "Eiffel Tower", "1600 Amphitheatre Parkway, Mountain View, CA").
    *   `mapService` (Object): An instance of `MapService`, which performs the actual location finding.
*   **Functionality:** Delegates the location finding operation to the `MapService`.
*   **Output:** The location details provided by the `MapService`. The exact format depends on the `MapService` implementation, but typically includes coordinates, address, and links to map services (e.g., Google Maps, OpenStreetMap) and QR codes.
*   **Dependencies:** Requires `MapService`.

## 3. Core Components and Managers
TahuJS is built around a modular architecture with several key managers.

### 3.1. `LLMManager` (Language Model Manager)

*   **Purpose:** Manages connections and interactions with various Large Language Model (LLM) providers (OpenAI, Gemini, OpenRouter, Ollama) and their respective chat and embedding models. It handles model initialization, chat completions, and embedding generation.
*   **Constructor Parameters:**
    *   `config`: The main TahuJS configuration object.
    *   `toolsMap`: A `Map` containing registered tools, used for agent capabilities.
    *   `conversationsMap`: A `Map` to store conversation history.
    *   `analyticsManager`: An instance of `AnalyticsManager` for recording LLM usage.
*   **Key Methods:**
    *   `initializeChatModel()`: Initializes the appropriate chat model based on `config.provider`. Supports `openrouter`, `gemini`, `openai`, `ollama`.
    *   `initializeEmbeddingModel()`: Initializes the embedding model based on `config.embeddingProvider`. Supports `openai`, `openrouter`, `gemini`, `ollama`.
    *   `getEmbeddings(text)`: Generates vector embeddings for a given text using the initialized embedding model. Throws an error if the embedding model is not initialized.
    *   `getLangChainTools()`: Converts TahuJS's internal `toolsMap` into a format compatible with LangChain's `DynamicTool`, used for creating LangChain agents.
    *   `createLangChainAgent(systemPrompt)`: Creates and returns a LangChain `AgentExecutor` instance, enabling the LLM to use registered tools. Requires `chatModel` to be initialized.
    *   `chat(message, options = {})`: The primary method for interacting with the LLM. Sends a user message, maintains conversation history, and returns the LLM's response.
        *   `message`: The user's input message.
        *   `options` (Object):
            *   `conversationId` (String): Identifier for the conversation history (defaults to `'default'`).
            *   `temperature` (Number): Overrides the global `config.temperature` for this specific chat.
            *   `maxTokens` (Number): Overrides the global `config.maxTokens` for this specific chat.
            *   `includeUsage` (Boolean): If `true`, includes token usage in the response.
        *   Handles various API errors (authentication, rate limits, insufficient credits, connection refused for Ollama).
        *   Applies `responseFormat` from `config` (`raw`, `md`, `json`).
    *   `estimateTokens(text)`: Estimates the number of tokens in a given text (simple character-based estimation).
    *   `clearConversation(conversationId)`: Clears the conversation history for a given `conversationId`.
*   **Dependencies:** Relies heavily on `@langchain/openai`, `@langchain/google-genai`, `@langchain/community/chat_models/ollama`, `langchain/agents`, `langchain/hub`, `langchain/schema`.

### 3.2. `ToolManager`

*   **Purpose:** Manages the registration, availability, and execution of all tools within TahuJS. It initializes built-in tools and provides methods for using them.
*   **Constructor Parameters:**
    *   `config`: The main TahuJS configuration object.
    *   `toolsMap`: A `Map` (passed from `TahuJS` instance) where currently enabled and registered tools are stored.
    *   `searchService`: An instance of `SearchService` for tools requiring web search.
    *   `mapService`: An instance of `MapService` for tools requiring map functionalities.
    *   `llmManager`: An instance of `LLMManager` for tools that might need LLM capabilities (e.g., summarization).
    *   `vectorStoreManager`: An instance of `VectorStoreManager` for tools interacting with knowledge bases.
*   **Key Properties:**
    *   `this.tools`: A `Map` containing tools that are currently enabled and registered for use.
    *   `this.allTools`: A `Map` containing all built-in tools, regardless of whether they are enabled in the configuration.
*   **Key Methods:**
    *   `initializeBuiltInTools()`: Populates `this.allTools` with all predefined tools and then registers them into `this.tools` based on the `config.tools.enabled` array. If `config.tools.enabled` is not specified, all built-in tools are enabled by default.
    *   `registerTool(name, tool)`: Registers a new tool with TahuJS. This method is used internally for built-in tools and can be used by plugins to add custom tools.
        *   `name` (String): The unique name of the tool.
        *   `tool` (Object): An object containing `description`, `execute` function, and optional `parameters`.
    *   `useTool(toolName, ...args)`: Executes a registered tool by its name.
        *   `toolName` (String): The name of the tool to execute.
        *   `...args`: Arguments to pass to the tool's `execute` function.
        *   Throws an error if the tool is not found or is disabled by configuration.
    *   `listTools()`: Returns an array of names of all currently enabled and registered tools.
*   **Built-in Tools Initialized (and their dependencies):**
    *   `webSearchTool` (requires `SearchService`)
    *   `calculateTool`
    *   `findLocationTool` (requires `MapService`)
    *   `getDirectionsTool` (requires `MapService`)
    *   `getElevationTool` (requires `MapService`)
    *   `webScrapeTool`
    *   `dateTimeTool`
    *   `summarizeTool` (requires `LLMManager`)
    *   `trainKnowledgeTool` (requires `VectorStoreManager`)
    *   `retrieveKnowledgeTool` (requires `VectorStoreManager`)
    *   `ocrTool`
    *   `ocrAdvancedTool` (requires `LLMManager`)
    *   `pdfAnalyzerTool`
    *   `cvAnalyzerTool` (requires `LLMManager`)
