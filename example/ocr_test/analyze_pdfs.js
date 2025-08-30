// example/ocr_test/analyze_pdfs.js - Script for analyzing PDF files

import { createTahu } from '../../src/tahu.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load environment variables from project root

async function analyzePdfFiles() {
  console.log('🚀 TahuJS PDF Analysis starting...');
  const pdfDir = path.join(__dirname, 'pdf_files');
  console.log(`Analyzing PDF files in: ${pdfDir}
`);

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
      enabled: ['pdf_analyzer', 'ocr_advanced'], // Enable both for comprehensive PDF analysis
    },
    debug: false, // Set to true for verbose TahuJS logs
  });

  const allowedExtensions = ['.pdf'];
  const allFiles = fs.readdirSync(pdfDir);

  for (const file of allFiles) {
    const filePath = path.join(pdfDir, file);
    const stat = fs.statSync(filePath);
    const ext = path.extname(file).toLowerCase();

    // Skip directories and non-allowed file types
    if (stat.isDirectory() || !allowedExtensions.includes(ext)) {
      console.log(`
-> Skipping '${file}' (not a supported PDF file).`);
      continue;
    }

    console.log(`

==================================================`);
    console.log(`====== Analyzing PDF: ${file} ======`);
    console.log(`==================================================`);

    try {
      // --- 1. Standard PDF Analysis (Raw Text Extraction) ---
      console.log(`
--- 1. Standard PDF Analysis (Raw Text Extraction) ---`);
      const pdfResult = await tahu.useTool('pdf_analyzer', filePath);
      console.log('✅ PDF Analysis Result (Raw Text):');
      console.log(`  File Path: ${pdfResult.filePath}`);
      console.log(`  Page Count: ${pdfResult.pageCount}`);
      console.log(
        `  Text Content Length: ${pdfResult.textContent.length} characters`
      );
      if (pdfResult.pdfInfo) {
        console.log(
          `  PDF Info: ${JSON.stringify(pdfResult.pdfInfo, null, 2)}`
        );
      } else {
        console.log(`  PDF Info: Not Available`);
      }
      console.log(
        `  Full Text Content (first 500 chars):\n'''\n${pdfResult.textContent.substring(0, 500)}\n'''`
      );

      // --- 2. AI-Enhanced Text Refinement (with LLM) ---
      console.log(`
--- 2. AI-Enhanced Text Refinement (with LLM) ---`);
      if (pdfResult.textContent && pdfResult.textContent.trim() !== '') {
        console.log(`Sending extracted text to AI for refinement...
`);
        const refinementPrompt = `Refine and tidy up the following text. Correct any grammatical errors, improve readability, and format it nicely. If the text is a document, summarize its key points.

Text to refine:
'''
${pdfResult.textContent}
'''`;
        const aiRefinedResult = await tahu.llmManager.chat(refinementPrompt, {
          responseFormat: 'text',
        });
        console.log('✅ AI-Refined Text:');
        console.log(aiRefinedResult.response);
      } else {
        console.log('ℹ️ No text extracted from PDF, skipping AI refinement.');
      }
    } catch (error) {
      console.error(`❌ Failed to analyze ${file}: ${error.message}`);
      if (error.message.includes('Failed to extract text from PDF')) {
        console.warn(
          `💡 Tip: Ensure 'pdf.js-extract' is installed (npm install pdf.js-extract) and the PDF is not corrupted/protected.`
        );
      }
    }
  }

  console.log(`
🎉 PDF Analysis Finished!`);
}

analyzePdfFiles().catch(console.error);
