// index.js - Main entry point
import TahuJS, { createTahu, quickChat, createQuickAgent } from './src/tahu.js';

// Import and re-export aggregated modules
import * as tools from './src/exports/tools.js';
import * as plugins from './src/exports/plugins.js';
import * as services from './src/exports/services.js';
import * as utils from './src/exports/utils.js';

export default TahuJS;
export { createTahu, quickChat, createQuickAgent, tools, plugins, services, utils };