// index.js - Main entry point
import TahuJS, { createTahu, quickChat, createQuickAgent } from './src/tahu.js';

// Import and re-export aggregated modules
import * as tools from './src/exports/tools.js';
import * as plugins from './src/exports/plugins.js';
import * as services from './src/exports/services.js';
import * as utils from './src/exports/utils.js';

export default TahuJS;
export {
  createTahu,
  quickChat,
  createQuickAgent,
  /**
   * @namespace tools
   * @description A collection of TahuJS built-in tools that can be used by agents or directly. Includes: `webSearchTool`, `calculateTool`, `findLocationTool`, `trainKnowledgeTool`, and more.
   */
  tools,
  /**
   * @namespace plugins
   * @description A collection of TahuJS plugins that can extend functionality. Examples: `tahuCryptoPlugin`, `tahuSocialPlugin`, `tahuFinancePlugin`, `tahuCurrencyPlugin`.
   */
  plugins,
  /**
   * @namespace services
   * @description Core TahuJS services providing specific functionalities. Includes: `SearchService` and `MapService`.
   */
  services,
  /**
   * @namespace utils
   * @description General TahuJS utilities that assist in configuration and validation. Includes: `ConfigValidator`.
   */
  utils,
};
