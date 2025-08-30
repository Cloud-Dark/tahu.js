// example/ocr_test/analyze_images.js - Script for analyzing image files with OCR

import { createTahu } from '../../src/tahu.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load environment variables from project root

async function analyzeImageFiles() {
  console.log('🚀 TahuJS Image OCR Analysis starting...');
  const imageDir = path.join(__dirname, 'image_files');
  console.log(`Analyzing image files in: ${imageDir}
`);

  // --- IMPORTANT: Get API key from .env ---
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error(
      '❌ GEMINI_API_KEY not found in .env file! Please create a .env file in the project root with GEMINI_API_KEY=YOUR_API_KEY.'
    );
    return;
  }

  // Initialize TahuJS with Gemini and the advanced OCR tool
  const tahu = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    tools: {
      enabled: ['ocr_advanced'], // Only enable ocr_advanced for images
    },
    debug: false, // Set to true for verbose TahuJS logs
  });

  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];
  const allFiles = fs.readdirSync(imageDir);

  for (const file of allFiles) {
    const filePath = path.join(imageDir, file);
    const stat = fs.statSync(filePath);
    const ext = path.extname(file).toLowerCase();

    // Skip directories and non-allowed file types
    if (stat.isDirectory() || !allowedExtensions.includes(ext)) {
      console.log(`
-> Skipping '${file}' (not a supported image file).`);
      continue;
    }

    console.log(`

==================================================`);
    console.log(`====== Analyzing Image: ${file} ======`);
    console.log(`==================================================`);

    try {
      // --- 1. Standard OCR Analysis (Manual/Tesseract) ---
      console.log(`
--- 1. Standard OCR Analysis (Raw Result with full object view) ---`);
      const standardResult = await tahu.useTool('ocr_advanced', filePath, {
        language: 'eng',
      });
      console.log('✅ Standard Result (Raw Data):');
      console.log(JSON.stringify(standardResult.rawOcrResult, null, 2));

      // --- 2. AI-Enhanced OCR Analysis (with LLM) ---
      console.log(`
--- 2. AI-Enhanced OCR Analysis (with LLM) ---`);
      console.log(`Using the powerful default prompt to generate a structured report...
`);
      const aiOptions = { aiEnhanced: true };
      const aiResult = await tahu.useTool('ocr_advanced', filePath, aiOptions);
      console.log('✅ AI-Generated Report:');
      console.log(aiResult.aiEnhancedResult);
    } catch (error) {
      console.error(`❌ Failed to analyze ${file}: ${error.message}`);
      if (
        error.message.includes('Unknown format') ||
        error.message.includes('unsupported file type')
      ) {
        console.warn(
          `💡 Tip: The file '${file}' might be corrupted or not a valid image format.`
        );
      }
    }
  }

  console.log(`
🎉 Image OCR Analysis Finished!`);
}

analyzeImageFiles().catch(console.error);
