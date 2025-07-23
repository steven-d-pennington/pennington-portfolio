// Simple unit test to verify Jest setup is working
describe('Math Utils', () => {
  describe('Basic arithmetic', () => {
    it('should add two numbers correctly', () => {
      expect(2 + 2).toBe(4);
    });

    it('should subtract numbers correctly', () => {
      expect(5 - 3).toBe(2);
    });

    it('should multiply numbers correctly', () => {
      expect(3 * 4).toBe(12);
    });

    it('should handle division correctly', () => {
      expect(10 / 2).toBe(5);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero correctly', () => {
      expect(0 + 0).toBe(0);
      expect(0 * 5).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(-5 + 3).toBe(-2);
      expect(-2 * -3).toBe(6);
    });

    it('should handle decimal numbers', () => {
      expect(0.1 + 0.2).toBeCloseTo(0.3);
      expect(1.5 * 2).toBe(3);
    });
  });
});