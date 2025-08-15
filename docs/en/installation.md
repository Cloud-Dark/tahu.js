# Installation and Quick Start

## What is TahuJS?

TahuJS is a JavaScript framework designed to streamline and accelerate the development of artificial intelligence-powered applications. It provides a simple, fast, and flexible way to create intelligent applications using various leading AI providers.

## Installation

To get started with TahuJS, follow these simple steps:

1.  **Ensure Node.js is Installed:** TahuJS requires Node.js version 18 or higher.
2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Cloud-Dark/tahu.js.git
    cd tahu.js
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Configure API Keys:** Set your API keys in environment variables or directly in your configuration when creating a TahuJS instance.

## Basic Usage (Hello World)

Here's a minimal example to get TahuJS running:

```javascript
import { createTahu } from 'tahu.js';

async function runHelloWorld() {
  const tahu = createTahu({
    provider: 'openrouter', // or 'openai', 'gemini', 'ollama'
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual API key
    model: 'google/gemini-2.0-flash-exp:free', // Or your preferred model
  });

  const chatResult = await tahu.chat('Hello TahuJS, how are you?');
  console.log(chatResult.response);
}
runHelloWorld();
```

For more detailed examples and provider-specific guides, please refer to the [Examples section](./examples.md).
