// src/tools/calculate-tool.js
import { evaluate, isComplex } from 'mathjs'; // Import isComplex

export const calculateTool = {
  name: 'calculate',
  description: 'Perform mathematical calculations and expressions',
  execute: async (expression) => {
    try {
      if (!expression || !expression.trim()) {
        return `❌ Calculation error: Empty or invalid mathematical expression.`;
      }

      const result = evaluate(expression);

      // Check for complex numbers
      if (isComplex(result)) {
        return `❌ Calculation error: Operation resulted in a complex number. This tool only supports real numbers.`;
      }

      // Handle Infinity and NaN results using standard JavaScript functions
      if (!Number.isFinite(result)) {
        if (Number.isNaN(result)) {
          return `❌ Calculation error: Invalid mathematical expression or operation resulting in NaN.`;
        } else {
          return `❌ Calculation error: Division by zero or an operation resulting in infinity.`;
        }
      }

      return `✅ Calculation: ${expression} = ${result}`;
    } catch (error) {
      return `❌ Calculation error: ${error.message}. Please check your mathematical expression.`;
    }
  },
};