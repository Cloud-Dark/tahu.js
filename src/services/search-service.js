// src/services/search-service.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import chalk from 'chalk';

export class SearchService {
  constructor(config) {
    this.config = config;
  }

  async search(query) {
    console.log(chalk.blue(`🔍 Searching for: "${query}"`));

    // Try SerpApi first (most reliable)
    if (this.config.serpApiKey) {
      console.log(chalk.yellow('📡 Trying SerpApi...'));
      try {
        const result = await this.searchWithSerpApi(query);
        if (result && !result.includes('❌')) {
          return result;
        }
      } catch (error) {
        console.log(chalk.red('❌ SerpApi failed:', error.message));
      }
    }

    // Try DuckDuckGo (free but limited)
    console.log(chalk.yellow('🦆 Trying DuckDuckGo...'));
    try {
      const result = await this.searchWithDuckDuckGo(query);
      if (result && !result.includes('❌')) {
        return result;
      }
    } catch (error) {
      console.log(chalk.red('❌ DuckDuckGo failed:', error.message));
    }

    // Try Google scraping (last resort)
    console.log(chalk.yellow('🌐 Trying Google scraping...'));
    try {
      const result = await this.searchWithGoogleScraping(query);
      if (result && !result.includes('❌')) {
        return result;
      }
    } catch (error) {
      console.log(chalk.red('❌ Google scraping failed:', error.message));
    }

    return `❌ All search methods failed for "${query}". Please try again later or check your internet connection.`;
  }

  async searchWithSerpApi(query) {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: this.config.serpApiKey,
        engine: 'google',
        num: 3,
        gl: 'id', // Indonesia
        hl: 'id',
      },
      timeout: 10000,
    });

    const results = response.data.organic_results || [];
    if (results.length === 0) {
      return `❌ No results found via SerpApi for "${query}"`;
    }

    const formattedResults = results
      .slice(0, 3)
      .map(
        (result, index) =>
          `${index + 1}. ${result.title}\n   ${result.snippet}\n   🔗 ${result.link}`
      )
      .join('\n\n');

    return `🔍 Search results (SerpApi) for "${query}":\n\n${formattedResults}`;
  }

  async searchWithDuckDuckGo(query) {
    // Use DuckDuckGo's instant answer API
    const response = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format: 'json',
        no_html: '1',
        skip_disambig: '1',
      },
      timeout: 10000,
    });

    const data = response.data;

    // Check for instant answer
    if (data.AbstractText) {
      return `🦆 DuckDuckGo Result for "${query}":\n\n${data.AbstractText}\n🔗 ${data.AbstractURL}`;
    }

    // Check for related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const topics = data.RelatedTopics.slice(0, 3)
        .map((topic, index) => {
          if (topic.Text) {
            return `${index + 1}. ${topic.Text}\n   🔗 ${topic.FirstURL}`;
          }
          return null;
        })
        .filter(Boolean);

      if (topics.length > 0) {
        return `🦆 DuckDuckGo Results for "${query}":\n\n${topics.join('\n\n')}`;
      }
    }

    return `❌ No results found via DuckDuckGo for "${query}"`;
  }

  async searchWithGoogleScraping(query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=5&hl=id`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Try multiple selectors for Google results
    const selectors = [
      '.g .yuRUbf', // Current Google structure
      '.rc', // Classic Google structure
      '[data-ved] h3', // Alternative structure
    ];

    for (const selector of selectors) {
      $(selector).each((index, element) => {
        if (results.length >= 3) return false;

        let title, link, snippet;

        if (selector === '.g .yuRUbf') {
          title = $(element).find('h3').text();
          link = $(element).find('a').attr('href');
          snippet = $(element).closest('.g').find('.VwiC3b, .s3v9rd').text();
        } else if (selector === '.rc') {
          title = $(element).find('h3').text();
          link = $(element).find('a').first().attr('href');
          snippet = $(element).find('.s').text();
        } else {
          title = $(element).text();
          link = $(element).closest('a').attr('href');
          snippet = $(element)
            .closest('.g, .rc')
            .find('.VwiC3b, .s, .s3v9rd')
            .text();
        }

        if (title && title.length > 0) {
          results.push({
            title: title.trim(),
            link: link || '',
            snippet: snippet?.trim() || 'No description available',
          });
        }
      });

      if (results.length > 0) break;
    }

    if (results.length === 0) {
      return `❌ No results found via Google scraping for "${query}"`;
    }

    const formattedResults = results
      .map(
        (result, index) =>
          `${index + 1}. ${result.title}\n   ${result.snippet}\n   🔗 ${result.link}`
      )
      .join('\n\n');

    return `🌐 Google Search Results for "${query}":\n\n${formattedResults}`;
  }
}
