// src/tools/web-search-tool.js
export const webSearchTool = {
    name: 'webSearch',
    description: 'Search the web using multiple search engines (SerpApi, DuckDuckGo, Google Scraping)',
    execute: async (query, searchService) => {
        return await searchService.search(query);
    }
};