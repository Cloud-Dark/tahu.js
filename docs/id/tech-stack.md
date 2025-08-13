# Ikhtisar Teknologi

TahuJS dibangun di atas fondasi teknologi modern dan terbukti:

- **Bahasa Inti & Runtime:** JavaScript (ESM) berjalan di Node.js.
- **Orkestrasi AI:** LangChain.js (`@langchain/openai`, `@langchain/google-genai`, `langchain`, `@langchain/community`).
- **LLM Providers:** OpenRouter, OpenAI, Google Gemini, Ollama.
- **Permintaan HTTP:** Axios untuk semua panggilan API eksternal.
- **Web Scraping:** Cheerio untuk parsing HTML.
- **Operasi Matematika:** Math.js untuk perhitungan.
- **Utilitas Terminal:** `chalk` untuk output konsol berwarna dan `qrcode-terminal` untuk menghasilkan kode QR.
- **Layanan Pencarian:** `SearchService` kustom (SerpApi, DuckDuckGo, Google scraping).
- **Layanan Pemetaan & Lokasi:** `MapService` kustom (OpenStreetMap Nominatim, StaticMap, Open-Elevation API, Mapbox).
- **Manajemen Konfigurasi:** `ConfigValidator` kustom.

- **Database:** `better-sqlite3` untuk persistensi memori SQLite dan basis pengetahuan.
- **Basis Data Vektor:** `chromadb` untuk integrasi ChromaDB, `@supabase/supabase-js` dan `@langchain/community` untuk integrasi Supabase.