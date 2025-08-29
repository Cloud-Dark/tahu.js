// src/exports/tools.js
export { webSearchTool } from '../tools/web-search-tool.js';
export { calculateTool } from '../tools/calculate-tool.js';
export { findLocationTool } from '../tools/find-location-tool.js';
export { getDirectionsTool } from '../tools/get-directions-tool.js';
export { getElevationTool } from '../tools/get-elevation-tool.js';
export { webScrapeTool } from '../tools/web-scrape-tool.js';
export { dateTimeTool } from '../tools/date-time-tool.js';
export { summarizeTool } from '../tools/summarize-tool.js';
export { trainKnowledgeTool } from '../tools/train-knowledge-tool.js';
export { retrieveKnowledgeTool } from '../tools/retrieve-knowledge-tool.js';
export { ocrAdvancedTool } from '../tools/ocr-advanced-tool.js';

// New enhanced tools
import ImageAnalysisTool from '../tools/image-analysis-tool.js';
import SchedulerTool from '../tools/scheduler-tool.js';
import CodeExecutionTool from '../tools/code-execution-tool.js';

export const imageAnalysisTool = new ImageAnalysisTool();
export const schedulerTool = new SchedulerTool();
export const codeExecutionTool = new CodeExecutionTool();
