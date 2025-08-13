# AI Application Development Rules

This document outlines the core technologies and library usage guidelines for developing and extending this AI application.

## Tech Stack Overview

- **Core Language & Runtime:** JavaScript (ESM) running on Node.js.
- **AI Orchestration:** LangChain.js for building complex AI agents, chaining LLM calls, and integrating tools.
- **LLM Providers:** Integration with OpenRouter (supporting various models like Claude, GPT, Gemini) and Google Gemini.
- **HTTP Requests:** Axios for making all external API calls (e.g., to LLM providers, search engines, map services).
- **Web Scraping:** Cheerio for parsing and extracting data from HTML content.
- **Mathematical Operations:** Math.js for robust mathematical calculations.
- **Terminal Utilities:** `chalk` for colored console output and `qrcode-terminal` for generating QR codes in the terminal.
- **Search Services:** Custom `SearchService` class leveraging SerpApi (primary), DuckDuckGo, and direct Google scraping (fallback).
- **Mapping & Location Services:** Custom `MapService` class utilizing OpenStreetMap (Nominatim for geocoding, StaticMap for static images), Open-Elevation API, and potentially Mapbox.
- **Configuration Management:** A custom `ConfigValidator` class for validating application settings.

## Library Usage Guidelines

To maintain consistency and efficiency, please adhere to the following rules for library usage:

- **LLM Interaction & Agents:**
  - Use **LangChain.js** (`@langchain/openai`, `@langchain/google-genai`, `langchain`) for all interactions with Large Language Models and for creating AI agents.
  - Utilize `DynamicTool` from `@langchain/community/tools/dynamic` to expose custom application functionalities as tools to LangChain agents.
  - Agent creation should leverage `createReactAgent` and prompt pulling from `langchain/hub`.
- **Network Requests:**
  - All HTTP/HTTPS requests to external APIs (LLMs, search, maps, web scraping) **must** be made using **Axios**.
- **HTML Parsing:**
  - For any web scraping or parsing of HTML content, **Cheerio** is the designated library.
- **Mathematical Computations:**
  - Complex mathematical expressions and calculations should be handled by **Math.js**.
- **Terminal Output:**
  - Use **Chalk** for adding colors and styles to console output for better readability.
  - For generating QR codes in the terminal, use **qrcode-terminal**.
- **Custom Services:**
  - The `SearchService` and `MapService` classes encapsulate their respective functionalities and should be extended or modified for new search/map features. Do not implement direct API calls for these services outside of these classes.
