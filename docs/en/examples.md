# Examples

This section provides a comprehensive overview of TahuJS examples, categorized by LLM provider.

## Gemini Examples

This section provides examples for using TahuJS with Gemini.

### Quick Start

A simple example to get started with Gemini.

[View Quick Start Example](<../example/gemini/quick-start.js>)

### Comprehensive Demo

A more comprehensive demonstration of TahuJS features with Gemini.

[View Comprehensive Demo](<../example/gemini/demo.js>)

## Ollama Examples

This section provides examples for using TahuJS with Ollama.

### Quick Start

A simple example to get started with Ollama.

[View Quick Start Example](<../example/ollama/quick-start.js>)

### Comprehensive Demo

A more comprehensive demonstration of TahuJS features with Ollama.

[View Comprehensive Demo](<../example/ollama/demo.js>)

## OpenAI Examples

This section provides examples for using TahuJS with OpenAI.

### Quick Start

A simple example to get started with OpenAI.

[View Quick Start Example](<../example/openai/quick-start.js>)

### Comprehensive Demo

A more comprehensive demonstration of TahuJS features with OpenAI.

[View Comprehensive Demo](<../example/openai/demo.js>)

## OpenRouter Examples

This section provides examples for using TahuJS with OpenRouter.

### Quick Start

A simple example to get started with OpenRouter.

[View Quick Start Example](<../example/openrouter/quick-start.js>)

### Comprehensive Demo

A more comprehensive demonstration of TahuJS features with OpenRouter.

[View Comprehensive Demo](<../example/openrouter/demo.js>)

## Built-in Tools

TahuJS comes with a set of powerful built-in tools that can be used by agents or directly.

### OCR Tool

The OCR tool allows you to extract text from image and PDF files.

```javascript
import { createTahu } from '../../src/tahu.js';
import path from 'path';
import process from 'process'; // Import process for process.cwd()

async function runOcrExample() {
  const tahu = createTahu({
    provider: 'gemini', // Or any other provider
    apiKey: 'YOUR_API_KEY',
    model: 'gemini-1.5-flash',
    tools: {
      enabled: ['ocr'], // Enable only the OCR tool
    },
  });

  try {
    console.log('--- OCR Tool Example ---');
    const imagePath = path.join(process.cwd(), 'example', 'gemini', 'sample.png'); // Path to your image/PDF
    // For a real test, replace 'sample.png' with an image/PDF containing text.
    // You might need to install 'tesseract.js' language data for specific languages.
    const extractedText = await tahu.useTool('ocr', imagePath);
    console.log('Extracted Text:', extractedText);
  } catch (error) {
    console.error('❌ OCR Example Error:', error.message);
  }
}
runOcrExample();
```
