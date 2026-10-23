import { describe, expect, it } from 'vitest';
import {
  formatAccountNumber,
  formatNumber,
  getCurrencySymbol,
  parseFormatNumber,
} from '../../src/Format/NumberFormat';
import { CurrencySymbolEnum } from '../../src/enums/CurrencySymbolEnum';

describe('Format Module', () => {
  describe('formatAccountNumber', () => {
    it('formats a 16-digit account number with spaces by default', () => {
      const result = formatAccountNumber('1234567890123456');
      expect(result).toBe('1234 5678 9012 3456');
    });

    it('formats account number with custom separator', () => {
      const result = formatAccountNumber('123456789012', '-');
      expect(result).toBe('1234-5678-9012-');
    });

    it('strips existing whitespace before formatting', () => {
      const result = formatAccountNumber(' 1234 567890 123456 ');
      expect(result).toBe('1234 5678 9012 3456');
    });
  });

  describe('getCurrencySymbol', () => {
    it('returns correct symbol for known currencies', () => {
      expect(getCurrencySymbol('USD')).toBe(CurrencySymbolEnum.USD);
      expect(getCurrencySymbol('TWD')).toBe(CurrencySymbolEnum.TWD);
      expect(getCurrencySymbol('VND')).toBe(CurrencySymbolEnum.VND);
    });

    it('returns empty string when showCurrency is false', () => {
      expect(getCurrencySymbol('USD', false)).toBe('');
    });

    it('returns empty string for unknown currency', () => {
      expect(getCurrencySymbol('XYZ')).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('formats currency values correctly', () => {
      const formatted = formatNumber({
        lang: 'en-US',
        currency: 'USD',
        value: 1234.56,
        showValue: true,
        showCurrency: true,
      });
      expect(formatted).toContain('1,235');
      expect(formatted).toContain(CurrencySymbolEnum.USD);
    });

    it('masks value when showValue is false', () => {
      const masked = formatNumber({
        lang: 'en-US',
        currency: 'USD',
        value: 1234.56,
        showValue: false,
        showCurrency: true,
      });
      expect(masked).toContain('********');
    });

    it('handles default values when optional fields are omitted', () => {
      const result = formatNumber({
        lang: 'en-US',
        currency: 'USD',
        value: 1234.56,
      });
      expect(result).toBeDefined();
    });
  });

  describe('parseFormatNumber', () => {
    it('parses formatted numeric strings back to float', () => {
      const parsed = parseFormatNumber('en-US', '1,234.56');
      expect(parsed).toBe(1234.56);
    });

    it('returns null for empty value', () => {
      expect(parseFormatNumber('en-US', '')).toBeNull();
    });
  });
});
