// src/plugins/tahu-social.js
// Plugin untuk tren media sosial (menggunakan data tiruan)

export default function tahuSocialPlugin(tahuInstance) {
    tahuInstance.registerTool('socialTrends', {
        name: 'socialTrends',
        description: 'Get mock trending topics on social media platforms. Input: platform name (e.g., "Twitter", "TikTok").',
        execute: async (platform) => {
            const trends = {
                'twitter': ['#AIRevolution', '#TechNews', '#ClimateAction', '#GamingUpdates'],
                'tiktok': ['#DanceChallenge', '#LifeHacks', '#ViralVideos', '#FoodieAdventures'],
                'instagram': ['#Photography', '#TravelGoals', '#FashionTrends', '#ArtDaily']
            };
            const lowerPlatform = platform.toLowerCase();
            const platformTrends = trends[lowerPlatform];

            if (platformTrends) {
                return `🔥 Trending on ${platform}: ${platformTrends.join(', ')}. (Mock data)`;
            } else {
                return `❌ No mock trends available for platform: ${platform}.`;
            }
        }
    });
    console.log('🔌 Tahu-Social plugin loaded: socialTrends tool registered.');
}