// src/tools/pdf-analyzer-tool.js
// IMPORTANT: This tool requires the 'pdf.js-extract' library.
// Please install it by running: npm install pdf.js-extract

import { PDFExtract } from 'pdf.js-extract';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const pdfAnalyzerTool = {
  name: 'pdf_analyzer',
  description: 'Extracts all text content from a PDF file.',
  execute: async (filePath, options = {}) => {
    const { debug = false } = options;

    if (debug) {
      console.log(chalk.blue(`[DEBUG] PDF Analyzer started for: ${filePath}`));
    }

    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at: ${absolutePath}`);
    }

    const pdfExtract = new PDFExtract();
    let fullText = '';

    try {
      const data = await pdfExtract.extract(absolutePath, {});
      // Concatenate text from all pages
      fullText = data.pages
        .map((page) => {
          return page.content.map((item) => item.str).join(' ');
        })
        .join('\n\n');

      if (debug) {
        console.log(
          chalk.green(
            `[DEBUG] PDF text extracted successfully. Total characters: ${fullText.length}`
          )
        );
      }

      return {
        filePath: absolutePath,
        textContent: fullText,
        pageCount: data.pages.length,
        pdfInfo: data.pdfInfo,
      };
    } catch (error) {
      if (debug) {
        console.error(
          chalk.red(`❌ [DEBUG] PDF Analyzer Tool Error: ${error.message}`),
          error
        );
      }
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  },
};
