// src/tools/date-time-tool.js
export const dateTimeTool = {
    name: 'dateTime',
    description: 'Get current date and time information',
    execute: async (timezone = 'UTC') => {
        try {
            const now = new Date();
            const options = {
                timeZone: timezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                weekday: 'long'
            };

            const formatter = new Intl.DateTimeFormat('en-US', options);
            const formattedDate = formatter.format(now);

            return `🕐 Current Date & Time (${timezone}): ${formattedDate}\n⏰ Timestamp: ${now.getTime()}\n📅 ISO String: ${now.toISOString()}`;
        } catch (error) {
            return `❌ DateTime error: ${error.message}`;
        }
    }
};