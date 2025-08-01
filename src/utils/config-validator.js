// utils/config-validator.js - Configuration Validator
export class ConfigValidator {
    static validateConfig(config) {
        const warnings = [];
        const errors = [];

        // Required fields
        if (!config.apiKey && config.provider !== 'ollama') {
            errors.push('API key is required for non-Ollama providers');
        }

        if (!config.provider || !['openrouter', 'gemini', 'openai', 'ollama'].includes(config.provider)) {
            errors.push('Provider must be one of "openrouter", "gemini", "openai", or "ollama"');
        }

        // Optional field warnings
        if (!config.serpApiKey) {
            warnings.push('SerpApi key not provided - web search will use fallback methods');
        }

        if (!config.googleMapsApiKey) {
            warnings.push('Google Maps API key not provided - some location features will be limited');
        }

        // Supabase validation
        if (config.supabaseUrl && !config.supabaseAnonKey) {
            warnings.push('Supabase URL provided but Supabase Anon Key is missing. Supabase features may not work.');
        }
        if (!config.supabaseUrl && config.supabaseAnonKey) {
            warnings.push('Supabase Anon Key provided but Supabase URL is missing. Supabase features may not work.');
        }


        // Model validation
        if (config.provider === 'openrouter' && config.model) {
            const validModels = [
                'anthropic/claude-3-sonnet',
                'anthropic/claude-3-opus',
                'openai/gpt-4',
                'openai/gpt-3.5-turbo',
                'google/gemini-pro'
            ];

            if (!validModels.some(model => config.model.includes(model.split('/')[1]))) {
                warnings.push(`Model "${config.model}" may not be supported by OpenRouter`);
            }
        }

        // Temperature validation
        if (config.temperature && (config.temperature < 0 || config.temperature > 2)) {
            warnings.push('Temperature should be between 0 and 2');
        }

        // Max tokens validation
        if (config.maxTokens && config.maxTokens > 4000) {
            warnings.push('MaxTokens above 4000 may cause issues or extra costs');
        }

        return { warnings, errors };
    }

    static printValidation(config) {
        const { warnings, errors } = this.validateConfig(config);

        if (errors.length > 0) {
            console.error('❌ Configuration Errors:');
            errors.forEach(error => console.error(`   • ${error}`));
        }

        if (warnings.length > 0) {
            console.warn('⚠️  Configuration Warnings:');
            warnings.forEach(warning => console.warn(`   • ${warning}`));
        }

        if (errors.length === 0 && warnings.length === 0) {
            console.log('✅ Configuration is valid');
        }

        return errors.length === 0;
    }
}