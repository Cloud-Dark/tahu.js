// src/tools/ocr-tool.js
import { createWorker } from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const ocrTool = {
  name: 'ocr',
  description:
    'Performs Optical Character Recognition (OCR) on an image or PDF file. Input should be the absolute path to the file.',
  execute: async (filePath) => {
    if (!filePath) {
      throw new Error('File path is required for OCR.');
    }

    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at: ${absolutePath}`);
    }

    const worker = await createWorker('eng'); // You can specify other languages like 'ind' for Indonesian
    let text = '';

    try {
      const {
        data: { text: extractedText },
      } = await worker.recognize(absolutePath);
      text = extractedText;
    } catch (error) {
      console.error(chalk.red(`❌ OCR Tool Error: ${error.message}`));
      throw new Error(`Failed to perform OCR on ${filePath}: ${error.message}`);
    } finally {
      await worker.terminate();
    }

    return text;
  },
};
