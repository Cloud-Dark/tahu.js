// src/tools/get-elevation-tool.js
export const getElevationTool = {
    name: 'getElevation',
    description: 'Gets the elevation data for a specific geographic coordinate. Input must be a string with "latitude,longitude". Example: "-6.2088,106.8456".',
    execute: async (input, mapService) => {
        const parts = String(input).split(',');
        if (parts.length !== 2) return "❌ Invalid format. Please provide coordinates as 'latitude,longitude'.";
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        return await mapService.getElevation(lat, lng);
    }
};