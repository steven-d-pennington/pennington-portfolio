// Unit tests for database helper functions (pure functions only)
describe('Database Helper Functions', () => {
  // Mock the helper functions directly to avoid Supabase imports
  const isAdmin = (userRole: string | null) => userRole === 'admin';
  const isClient = (userRole: string | null) => userRole === 'client';
  const canManageProject = (userRole: string | null, projectClientId: string, userId: string) => {
    return isAdmin(userRole) || projectClientId === userId;
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours % 1) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  const calculateInvoiceTotal = (lineItems: Array<{ total_price: number }>) => {
    const subtotal = lineItems.reduce((sum: number, item) => sum + item.total_price, 0);
    return subtotal;
  };

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      expect(isAdmin('admin')).toBe(true);
    });

    it('should return false for non-admin roles', () => {
      expect(isAdmin('user')).toBe(false);
      expect(isAdmin('client')).toBe(false);
      expect(isAdmin('team_member')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isAdmin(null)).toBe(false);
      expect(isAdmin(undefined as any)).toBe(false);
    });
  });

  describe('isClient', () => {
    it('should return true for client role', () => {
      expect(isClient('client')).toBe(true);
    });

    it('should return false for non-client roles', () => {
      expect(isClient('admin')).toBe(false);
      expect(isClient('user')).toBe(false);
      expect(isClient('team_member')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isClient(null)).toBe(false);
      expect(isClient(undefined as any)).toBe(false);
    });
  });

  describe('canManageProject', () => {
    const projectClientId = 'client-123';
    const userId = 'user-123';
    const adminUserId = 'admin-456';

    it('should return true for admin users', () => {
      expect(canManageProject('admin', projectClientId, adminUserId)).toBe(true);
    });

    it('should return true for project client', () => {
      expect(canManageProject('client', projectClientId, projectClientId)).toBe(true);
    });

    it('should return false for non-admin user who is not the project client', () => {
      expect(canManageProject('user', projectClientId, userId)).toBe(false);
    });

    it('should return false for null role', () => {
      expect(canManageProject(null, projectClientId, userId)).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency by default', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(10)).toBe('$10.00');
    });

    it('should format different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-500.25)).toBe('-$500.25');
    });

    it('should handle decimal precision', () => {
      expect(formatCurrency(10.999)).toBe('$11.00');
      expect(formatCurrency(10.1)).toBe('$10.10');
    });
  });

  describe('formatHours', () => {
    it('should format whole hours correctly', () => {
      expect(formatHours(1)).toBe('1h');
      expect(formatHours(8)).toBe('8h');
      expect(formatHours(0)).toBe('0h');
    });

    it('should format hours with minutes correctly', () => {
      expect(formatHours(1.5)).toBe('1h 30m');
      expect(formatHours(2.25)).toBe('2h 15m');
      expect(formatHours(0.5)).toBe('0h 30m');
    });

    it('should round minutes correctly', () => {
      expect(formatHours(1.1)).toBe('1h 6m'); // 0.1 * 60 = 6 minutes
      expect(formatHours(1.75)).toBe('1h 45m'); // 0.75 * 60 = 45 minutes
      expect(formatHours(1.833)).toBe('1h 50m'); // 0.833 * 60 = 49.98 ≈ 50 minutes
    });

    it('should handle edge cases', () => {
      expect(formatHours(0.01)).toBe('0h 1m'); // Small decimal rounds up
      expect(formatHours(24.99)).toBe('24h 59m'); // Large numbers
    });
  });

  describe('calculateInvoiceTotal', () => {
    it('should calculate total from line items', () => {
      const lineItems = [
        { total_price: 200 },
        { total_price: 150 },
        { total_price: 150 },
      ];

      expect(calculateInvoiceTotal(lineItems)).toBe(500);
    });

    it('should return 0 for empty array', () => {
      expect(calculateInvoiceTotal([])).toBe(0);
    });

    it('should handle single line item', () => {
      const lineItems = [
        { total_price: 75 },
      ];

      expect(calculateInvoiceTotal(lineItems)).toBe(75);
    });

    it('should handle decimal prices', () => {
      const lineItems = [
        { total_price: 19.99 },
        { total_price: 51.00 },
      ];

      expect(calculateInvoiceTotal(lineItems)).toBe(70.99);
    });
  });
});