// src/tools/ocr-advanced-tool.js
import { createWorker } from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getColorFromURL } from 'color-thief-node';

// Helper to convert RGB array to HEX string
const rgbToHex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

const newDefaultPrompt = `
**Task:** You are an expert document analyst. Below, you will receive a JSON object containing the raw results of an Optical Character Recognition (OCR) process performed on an image.

Your task is to analyze this JSON data and generate a comprehensive, well-structured report in Markdown format. 

The report should include the following sections:

1.  **📄 Document Summary:** A brief, one-paragraph summary of the document's content and purpose.
2.  **📝 Corrected Text:** Present the OCR text, but correct any obvious errors or formatting issues. Format it for readability (e.g., using paragraphs, lists, or code blocks as appropriate).
3.  **🎨 Color Palette:** If color information is available, list the dominant colors found in the image in a table with their RGB and HEX codes.
4.  **📋 Metadata:** Briefly list the most important metadata, such as the file name and size.

**Constraint:** Respond *only* with the Markdown report. Do not include any preamble or explanation before the report.
`;

export const ocrAdvancedTool = {
  name: 'ocr_advanced',
  description:
    'Performs a flexible, multi-stage OCR and analysis on a local image file. Can optionally use an AI to enhance and format the raw OCR text. Language and custom model path for OCR are configurable.',
  execute: async (filePath, options = {}, llmManager) => {
    // --- 1. Configure Options ---
    const {
      debug = false,
      language = 'eng',
      langPath = null, // New: Path to the directory containing custom .traineddata models
      aiEnhanced = false,
      aiPrompt = newDefaultPrompt,
      outputFields = null,
    } = options;

    if (debug) {
      console.log(
        chalk.blue(`[DEBUG] OCR Advanced Tool started for: ${filePath}`)
      );
      console.log(
        chalk.blue(`[DEBUG] Options:`, JSON.stringify(options, null, 2))
      );
    }

    if (!filePath) {
      throw new Error('File path is required for Advanced OCR.');
    }
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at: ${absolutePath}`);
    }

    // --- 2. Perform Raw OCR (Stage 1) ---
    let rawOcrResult = {};
    const fileExtension = path.extname(absolutePath).toLowerCase();
    const stats = fs.statSync(absolutePath);

    try {
      if (debug)
        console.log(
          chalk.yellow(
            `[DEBUG] Stage 1: Performing Raw OCR using language '${language}'...`
          )
        );
      if (debug && langPath)
        console.log(
          chalk.yellow(`[DEBUG] Using custom model path: ${langPath}`)
        );

      const metadata = {
        filePath: absolutePath,
        fileType: fileExtension,
        fileSize: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };

      let fullText = null;
      let confidence = null;
      let words = [];
      let colors = [];

      if (['.png', '.jpg', '.jpeg', '.bmp', '.gif'].includes(fileExtension)) {
        // Configure Tesseract worker with custom language path if provided
        const worker = await createWorker(language, 1, {
          langPath: langPath,
        });
        const { data } = await worker.recognize(absolutePath);
        await worker.terminate();

        fullText = data.text;
        confidence = data.confidence;
        words = data.words.map((w) => ({
          text: w.text,
          confidence: w.confidence,
          bbox: w.bbox,
        }));

        // Robust color detection
        try {
          const rgbColors = await getColorFromURL(absolutePath);
          if (Array.isArray(rgbColors)) {
            colors = rgbColors
              .map((rgb) => {
                if (Array.isArray(rgb) && rgb.length === 3) {
                  return { rgb: rgb, hex: rgbToHex(rgb[0], rgb[1], rgb[2]) };
                }
                return null;
              })
              .filter((c) => c !== null);
          }
        } catch (colorError) {
          if (debug)
            console.warn(
              chalk.yellow(
                `[DEBUG] Could not detect colors for ${filePath}. Error: ${colorError.message}`
              )
            );
          colors = []; // Default to empty array on error
        }
      } else if (fileExtension === '.pdf') {
        throw new Error(
          `PDF files are not directly supported for raw OCR by this tool. Please convert PDF pages to images first, or ensure a PDF-to-image conversion library (e.g., 'pdf-poppler' or 'pdf2pic') is integrated if you intend to use this tool for PDFs.`
        );
      } else {
        throw new Error(
          `Unsupported file type for OCR: ${fileExtension}. This tool only supports image and PDF (with external conversion) files.`
        );
      }

      rawOcrResult = { metadata, fullText, confidence, words, colors };
      if (debug)
        console.log(chalk.green('[DEBUG] Stage 1: Raw OCR successful.'));
    } catch (error) {
      if (debug)
        console.error(
          chalk.red(
            `❌ [DEBUG] Error during Raw OCR (Stage 1): ${error.message}`
          ),
          error
        );
      throw new Error(`Failed during raw OCR stage: ${error.message}`);
    }

    // --- 3. Perform AI Enhancement (Stage 2) ---
    let aiEnhancedResult = null;
    if (aiEnhanced) {
      if (debug)
        console.log(
          chalk.yellow('[DEBUG] Stage 2: Performing AI Enhancement...')
        );
      if (!llmManager) {
        throw new Error(
          'AI enhancement requires the LLMManager to be configured and passed to the tool.'
        );
      }
      if (!rawOcrResult.fullText || rawOcrResult.fullText.trim() === '') {
        if (debug)
          console.warn(
            chalk.yellow(
              '[DEBUG] Skipping AI enhancement because raw OCR text is empty.'
            )
          );
        aiEnhancedResult = 'Skipped: Raw OCR text was empty.';
      } else {
        // Pass the entire raw result as JSON to the AI for better analysis
        const fullPrompt = `${aiPrompt}\n\n--- JSON DATA START ---\n${JSON.stringify(rawOcrResult, null, 2)}\n--- JSON DATA END ---`;
        try {
          const aiResponse = await llmManager.chat(fullPrompt, {
            responseFormat: 'text',
          });
          aiEnhancedResult = aiResponse.response; // Assuming .response holds the text
          if (debug)
            console.log(
              chalk.green('[DEBUG] Stage 2: AI Enhancement successful.')
            );
        } catch (error) {
          if (debug)
            console.error(
              chalk.red(
                `❌ [DEBUG] Error during AI Enhancement (Stage 2): ${error.message}`
              ),
              error
            );
          throw new Error(
            `Failed during AI enhancement stage: ${error.message}`
          );
        }
      }
    }

    // --- 4. Construct Final Output ---
    const allData = {
      rawOcrResult,
      aiEnhancedResult,
    };

    if (!outputFields || !Array.isArray(outputFields)) {
      if (debug)
        console.log(
          chalk.blue('[DEBUG] No outputFields specified, returning all data.')
        );
      return allData;
    }

    const finalResult = {};
    for (const field of outputFields) {
      if (allData.hasOwnProperty(field) && allData[field] !== null) {
        finalResult[field] = allData[field];
      }
    }

    if (debug)
      console.log(
        chalk.green.bold('[DEBUG] OCR Advanced process completed successfully.')
      );
    return finalResult;
  },
};
