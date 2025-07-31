// src/tools/web-scrape-tool.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export const webScrapeTool = {
    name: 'webScrape',
    description: 'Extract content from web pages',
    execute: async (url) => {
        try {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 15000,
                maxRedirects: 5
            });

            const $ = cheerio.load(response.data);

            $('script, style').remove();

            const title = $('title').text().trim();
            const description = $('meta[name="description"]').attr('content') ||
                $('meta[property="og:description"]').attr('content') || '';

            let content = '';
            const contentSelectors = ['main', 'article', '.content', '#content', '.post', '.entry'];

            for (const selector of contentSelectors) {
                const element = $(selector);
                if (element.length > 0) {
                    content = element.text().trim().substring(0, 500);
                    break;
                }
            }

            if (!content) {
                content = $('body').text().trim().substring(0, 500);
            }

            return `📄 Title: ${title}\n📝 Description: ${description}\n📖 Content Preview: ${content}...`;

        } catch (error) {
            return `❌ Web scraping error: ${error.message}`;
        }
    }
};