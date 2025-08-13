// src/tools/get-directions-tool.js
export const getDirectionsTool = {
  name: 'getDirections',
  description:
    'Get directions between two locations. Input must be a string in the format "from [origin] to [destination]".',
  execute: async (input, mapService) => {
    return await mapService.getDirections(input);
  },
};
