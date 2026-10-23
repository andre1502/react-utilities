import { describe, expect, it } from 'vitest';
import {
  getItemRow,
  getNextPage,
  getTotalPages,
} from '../../src/Utils/Pagination';

describe('Pagination Utils', () => {
  describe('getItemRow', () => {
    it('calculates the 1-based row index for the first page', () => {
      expect(getItemRow(0, 1, 10)).toBe(1);
      expect(getItemRow(4, 1, 10)).toBe(5);
    });

    it('calculates the row index across multiple pages', () => {
      // Page 2, index 0 of pageSize 10 -> row 11
      expect(getItemRow(0, 2, 10)).toBe(11);
      // Page 3, index 5 of pageSize 20 -> row 46
      expect(getItemRow(5, 3, 20)).toBe(46);
    });

    it('handles default values when page or pageSize is omitted', () => {
      expect(getItemRow(2)).toBe(3);
    });
  });

  describe('getNextPage', () => {
    it('returns the next page number when more pages exist', () => {
      expect(getNextPage(1, 10, 25)).toBe(2);
      expect(getNextPage(2, 10, 25)).toBe(3);
    });

    it('returns undefined when already on the last page', () => {
      expect(getNextPage(3, 10, 25)).toBeUndefined();
    });

    it('returns undefined when totalRecords or pageSize is missing/zero', () => {
      expect(getNextPage(1, 0, 0)).toBeUndefined();
    });
  });

  describe('getTotalPages', () => {
    it('calculates total pages based on total records and page size', () => {
      expect(getTotalPages(10, 25)).toBe(3);
      expect(getTotalPages(10, 20)).toBe(2);
      expect(getTotalPages(10, 5)).toBe(1);
    });

    it('defaults to 1 when no records exist or pageSize is omitted', () => {
      expect(getTotalPages()).toBe(1);
      expect(getTotalPages(10, 0)).toBe(1);
    });
  });
});
