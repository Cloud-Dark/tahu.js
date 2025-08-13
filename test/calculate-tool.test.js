// test/calculate-tool.test.js
import { calculateTool } from '../src/tools/calculate-tool.js';

describe('calculateTool', () => {
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
});