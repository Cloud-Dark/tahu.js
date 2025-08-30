// test/calculate-tool.test.js
import { calculateTool } from '../src/tools/calculate-tool.js';

describe('calculateTool', () => {
  // Existing tests (will keep them)
  test('should correctly evaluate a simple addition expression', async () => {
    const expression = '1 + 1';
    const expected = '✅ Calculation: 1 + 1 = 2';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should correctly evaluate a complex expression', async () => {
    const expression = '(2 + 3) * 4 / 2';
    const expected = '✅ Calculation: (2 + 3) * 4 / 2 = 10';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should handle invalid expressions', async () => {
    const expression = '1 + abc';
    const result = await calculateTool.execute(expression);
    expect(result).toContain('❌ Calculation error');
  });

  test('should handle empty expression', async () => {
    const expression = '';
    const result = await calculateTool.execute(expression);
    expect(result).toContain('❌ Calculation error');
  });

  test('should handle expressions with spaces', async () => {
    const expression = '  5  *  2  ';
    const expected = '✅ Calculation:   5  *  2   = 10';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  // NEW TEST CASES

  test('should correctly evaluate subtraction', async () => {
    const expression = '10 - 3';
    const expected = '✅ Calculation: 10 - 3 = 7';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should correctly evaluate multiplication', async () => {
    const expression = '6 * 7';
    const expected = '✅ Calculation: 6 * 7 = 42';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should correctly evaluate division', async () => {
    const expression = '100 / 4';
    const expected = '✅ Calculation: 100 / 4 = 25';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should correctly evaluate modulo', async () => {
    const expression = '10 % 3';
    const expected = '✅ Calculation: 10 % 3 = 1';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should correctly evaluate exponentiation', async () => {
    const expression = '2 ^ 3'; // or '2 ** 3' depending on mathjs config
    const expected = '✅ Calculation: 2 ^ 3 = 8';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should handle floating point numbers with precision', async () => {
    const expression = '0.1 + 0.2';
    const result = await calculateTool.execute(expression);
    // Extract the numeric part of the result string
    const numericResult = parseFloat(result.split('=')[1].trim());
    expect(numericResult).toBeCloseTo(0.3);
  });

  test('should handle negative numbers', async () => {
    const expression = '-5 + 3';
    const expected = '✅ Calculation: -5 + 3 = -2';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should handle division by zero with error', async () => {
    const expression = '10 / 0';
    const result = await calculateTool.execute(expression);
    expect(result).toContain(
      '❌ Calculation error: Division by zero or an operation resulting in infinity.'
    );
  });

  test('should handle invalid function calls (e.g., sqrt(-1)) with error', async () => {
    const expression = 'sqrt(-1)';
    const result = await calculateTool.execute(expression);
    expect(result).toContain(
      '❌ Calculation error: Operation resulted in a complex number. This tool only supports real numbers.'
    );
  });

  test('should handle unbalanced parentheses with error', async () => {
    const expression = '(1 + 2';
    const result = await calculateTool.execute(expression);
    expect(result).toContain('❌ Calculation error: Parenthesis ) expected'); // mathjs specific error
  });

  test('should handle non-numeric input with error', async () => {
    const expression = 'five + 3';
    const result = await calculateTool.execute(expression);
    expect(result).toContain('❌ Calculation error: Undefined symbol five'); // mathjs specific error
  });

  test('should correctly evaluate expressions with math functions (e.g., sqrt)', async () => {
    const expression = 'sqrt(9)';
    const expected = '✅ Calculation: sqrt(9) = 3';
    const result = await calculateTool.execute(expression);
    expect(result).toBe(expected);
  });

  test('should correctly evaluate expressions with math constants (e.g., pi)', async () => {
    const expression = '2 * pi';
    const result = await calculateTool.execute(expression);
    const numericResult = parseFloat(result.split('=')[1].trim());
    expect(numericResult).toBeCloseTo(2 * Math.PI);
  });
});
