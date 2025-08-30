// src/tools/cv-analyzer-tool.js
// IMPORTANT: This tool requires 'tesseract.js' and 'pdf.js-extract'.
// Please install them by running: npm install tesseract.js pdf.js-extract

import { createWorker } from 'tesseract.js';
import { PDFExtract } from 'pdf.js-extract';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const cvAnalyzerTool = {
  name: 'cv_analyzer',
  description:
    'Analyzes a CV (resume) from an image or PDF file using OCR and AI to extract structured information.',
  execute: async (filePath, options = {}, llmManager) => {
    const { debug = false } = options;

    if (debug) {
      console.log(chalk.blue(`[DEBUG] CV Analyzer started for: ${filePath}`));
    }

    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at: ${absolutePath}`);
    }

    const fileExtension = path.extname(absolutePath).toLowerCase();
    let extractedText = '';
    let analysisPrompt = '';

    try {
      if (['.png', '.jpg', '.jpeg', '.bmp', '.gif'].includes(fileExtension)) {
        if (debug)
          console.log(
            chalk.blue('[DEBUG] Processing image CV with Tesseract.')
          );
        const worker = await createWorker('eng'); // Default to English for OCR
        const { data } = await worker.recognize(absolutePath);
        await worker.terminate();
        extractedText = data.text;
      } else if (fileExtension === '.pdf') {
        if (debug)
          console.log(
            chalk.blue('[DEBUG] Processing PDF CV with pdf.js-extract.')
          );
        const pdfExtract = new PDFExtract();
        const data = await pdfExtract.extract(absolutePath, {});
        extractedText = data.pages
          .map((page) => page.content.map((item) => item.str).join(' '))
          .join('\n\n');
      } else {
        throw new Error(
          `Unsupported file type for CV analysis: ${fileExtension}. Only image and PDF files are supported.`
        );
      }

      if (!extractedText || extractedText.trim() === '') {
        throw new Error('No text could be extracted from the CV file.');
      }

      // --- AI Analysis of Extracted Text ---
      if (debug)
        console.log(
          chalk.blue('[DEBUG] Sending extracted text to LLM for CV analysis.')
        );
      if (!llmManager) {
        throw new Error('LLMManager is required for AI analysis of CVs.');
      }

      analysisPrompt = `You are an expert CV (resume) analyzer. Extract the following information from the provided text and return it as a JSON object. If a field is not found, use null.

Fields to extract:
- name: Full name of the candidate
- contact: { email: string, phone: string, linkedin: string (URL), github: string (URL) }
- summary: A brief professional summary
- skills: [string] (List of key skills)
- experience: [{ title: string, company: string, duration: string, description: string }] (List of work experiences)
- education: [{ degree: string, institution: string, duration: string }] (List of educational backgrounds)

CV Text:
\
\
${extractedText}
\
\

Return only the JSON object.`;

      const aiResponse = await llmManager.chat(analysisPrompt, {
        responseFormat: 'json',
      });

      if (debug)
        console.log(chalk.green('[DEBUG] CV analysis by LLM successful.'));
      return aiResponse.response; // Assuming .response holds the JSON object
    } catch (error) {
      if (debug) {
        console.error(
          chalk.red('❌ [DEBUG] CV Analyzer Tool Error: ${error.message}'),
          error
        );
      }
      throw new Error(`Failed to analyze CV: ${error.message}`);
    }
  },
};
