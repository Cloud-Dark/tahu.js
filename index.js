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
     * @description Kumpulan alat bawaan TahuJS yang dapat digunakan oleh agen atau secara langsung.
     */
    tools, 
    /**
     * @namespace plugins
     * @description Kumpulan plugin TahuJS yang dapat memperluas fungsionalitas.
     */
    plugins, 
    /**
     * @namespace services
     * @description Layanan inti TahuJS seperti SearchService dan MapService.
     */
    services, 
    /**
     * @namespace utils
     * @description Utilitas umum TahuJS seperti ConfigValidator.
     */
    utils 
};