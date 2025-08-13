# Tech Stack Overview

TahuJS is built on a foundation of modern and proven technologies:

- **Core Language & Runtime:** JavaScript (ESM) running on Node.js.
- **AI Orchestration:** LangChain.js (`@langchain/openai`, `@langchain/google-genai`, `langchain`, `@langchain/community`).
- **LLM Providers:** OpenRouter, OpenAI, Google Gemini, Ollama.
- **HTTP Requests:** Axios for all external API calls.
- **Web Scraping:** Cheerio for HTML parsing.
- **Mathematical Operations:** Math.js for calculations.
- **Terminal Utilities:** `chalk` for colored console output and `qrcode-terminal` for generating QR codes.
- **Search Services:** Custom `SearchService` (SerpApi, DuckDuckGo, Google scraping).
- **Mapping & Location Services:** Custom `MapService` (OpenStreetMap Nominatim, StaticMap, Open-Elevation API, Mapbox).
- **Configuration Management:** Custom `ConfigValidator`.

- **Database:** `better-sqlite3` for SQLite memory persistence and knowledge base.
- **Vector Database:** `chromadb` for ChromaDB integration, `@supabase/supabase-js` and `@langchain/supabase` for Supabase integration.