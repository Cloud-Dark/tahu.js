// example/ocr_test/analyze_cvs.js - Script for analyzing CV files

import { createTahu } from '../../src/tahu.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load environment variables from project root

async function analyzeCvFiles() {
  console.log('🚀 TahuJS CV Analysis starting...');
  const cvDir = path.join(__dirname, 'cv_files');

  // Ensure the CV directory exists
  if (!fs.existsSync(cvDir)) {
    console.error(`❌ CV directory not found: ${cvDir}. Please create it and add CV files.`);
    return;
  }

  console.log(`Analyzing CV files in: ${cvDir}`);

  // --- IMPORTANT: Get API key from .env ---
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error(
      '❌ GEMINI_API_KEY not found in .env file! Please create a .env file in the project root with GEMINI_API_KEY=YOUR_API_KEY.'
    );
    return;
  }

  // Initialize TahuJS with Gemini and the relevant tools
  const tahu = createTahu({
    provider: 'gemini',
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    tools: {
      enabled: ['cv_analyzer', 'pdf_analyzer', 'ocr_advanced'], // Enable all relevant tools
    },
    debug: false, // Set to true for verbose TahuJS logs
  });

  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.bmp', '.gif'];
  const allFiles = fs.readdirSync(cvDir);

  if (allFiles.length === 0) {
    console.log(`ℹ️ No CV files found in '${cvDir}'. Skipping analysis.`);
    return;
  }

  for (const file of allFiles) {
    const filePath = path.join(cvDir, file);
    const stat = fs.statSync(filePath);
    const ext = path.extname(file).toLowerCase();

    // Skip directories and non-allowed file types
    if (stat.isDirectory() || !allowedExtensions.includes(ext)) {
      console.log(`-> Skipping '${file}' (unsupported file type).`);
      continue;
    }

    console.log(`
--- Analyzing CV: ${file} ---`);

    try {
      // --- 1. CV Analysis (using cv_analyzer) ---
      console.log(`  Running CV Analysis...`);
      const cvResult = await tahu.useTool('cv_analyzer', filePath);
      console.log('  ✅ CV Analysis Result:');
      console.log(cvResult);

      // --- 2. Baseline PDF/OCR Analysis (for comparison) ---
      if (ext === '.pdf') {
        console.log(`  Running Baseline PDF Analysis...`);
        const pdfResult = await tahu.useTool('pdf_analyzer', filePath);
        console.log('  ✅ PDF Analysis Result (Raw Text):');
        // Using the improved logging from analyze_pdfs.js
        console.log(`    File Path: ${pdfResult.filePath}`);
        console.log(`    Page Count: ${pdfResult.pageCount}`);
        console.log(`    Text Content Length: ${pdfResult.textContent.length} characters`);
        if (pdfResult.pdfInfo) {
          console.log(`    PDF Info: ${JSON.stringify(pdfResult.pdfInfo, null, 2)}`);
        } else {
          console.log(`    PDF Info: Not Available`);
        }
        console.log(`    Full Text Content (first 500 chars):\n'''\n${pdfResult.textContent.substring(0, 500)}\n'''`);
      } else if (['.png', '.jpg', '.jpeg', '.bmp', '.gif'].includes(ext)) {
        console.log(`  Running Baseline OCR Analysis...`);
        const ocrResult = await tahu.useTool('ocr_advanced', filePath, { language: 'eng' });
        console.log('  ✅ OCR Analysis Result (Raw Data):');
        console.log(JSON.stringify(ocrResult.rawOcrResult, null, 2));
      }

    } catch (error) {
      console.error(`❌ Failed to analyze ${file}: ${error.message}`);
      if (error.message.includes('Unknown format') || error.message.includes('unsupported file type')) {
        console.warn(`💡 Tip: The file '${file}' might be corrupted or not a valid image/PDF format.`);
      } else if (error.message.includes('Failed to extract text from PDF')) {
        console.warn(`💡 Tip: Ensure 'pdf.js-extract' is installed (npm install pdf.js-extract) and the PDF is not corrupted/protected.`);
      }
    }
  }

  console.log(`
🎉 CV Analysis Finished!`);
}

analyzeCvFiles().catch(console.error);
