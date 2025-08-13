// src/tools/find-location-tool.js
export const findLocationTool = {
  name: 'findLocation',
  description:
    'Find location using multiple map services with links and QR codes',
  execute: async (query, mapService) => {
    return await mapService.findLocation(query);
  },
};
