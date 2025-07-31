// src/tools/calculate-tool.js
import { evaluate } from 'mathjs';

export const calculateTool = {
    name: 'calculate',
    description: 'Perform mathematical calculations and expressions',
    execute: async (expression) => {
        try {
            const cleanExpression = expression.replace(/[^0-9+\-*/().\s^√]/g, '');
            const result = evaluate(cleanExpression);
            return `✅ Calculation: ${expression} = ${result}`;
        } catch (error) {
            return `❌ Calculation error: ${error.message}. Please check your mathematical expression.`;
        }
    }
};