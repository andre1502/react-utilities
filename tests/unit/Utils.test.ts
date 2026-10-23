import { describe, expect, it } from 'vitest';
import {
  getLastPathName,
  getUniquePermutations,
  getV,
  padNumber,
  parseQueryString,
} from '../../src/Utils/Utils';
import {
  joinWithoutFalsy,
  padArrayStart,
  sliceFromEnd,
} from '../../src/Utils/Array';

describe('Utils Module', () => {
  describe('parseQueryString', () => {
    it('parses standard query string into an object', () => {
      const url = 'https://example.com/search?q=test&page=2&filter=active';
      const parsed = parseQueryString(url);

      expect(parsed.originValue).toBe('https://example.com/search');
      expect(parsed.q).toBe('test');
      expect(parsed.page).toBe('2');
      expect(parsed.filter).toBe('active');
    });

    it('returns empty object with originValue for URL with no query params', () => {
      const url = 'https://example.com/home';
      const parsed = parseQueryString(url);
      expect(parsed.originValue).toBe('https://example.com/home');
    });

    it('handles values with equal signs correctly', () => {
      const url = 'https://example.com/auth?token=abc=123==&user=admin';
      const parsed = parseQueryString(url);
      expect(parsed.token).toBe('abc=123==');
      expect(parsed.user).toBe('admin');
    });

    it('prevents prototype pollution from malicious query keys', () => {
      const maliciousUrl =
        'https://example.com/api?__proto__[polluted]=true&constructor[prototype][admin]=true&prototype[test]=1';
      parseQueryString(maliciousUrl);

      const plainObj: any = {};
      expect(plainObj.polluted).toBeUndefined();
      expect(plainObj.admin).toBeUndefined();
      expect(plainObj.test).toBeUndefined();
    });
  });

  describe('getUniquePermutations', () => {
    it('returns all unique permutations of specified length', () => {
      const input = ['A', 'B', 'C'];
      const result = getUniquePermutations(input, 2);
      expect(result).toEqual([
        ['A', 'B'],
        ['A', 'C'],
        ['B', 'A'],
        ['B', 'C'],
        ['C', 'A'],
        ['C', 'B'],
      ]);
      expect(result.length).toBe(6);
    });

    it('returns empty array when length is 0', () => {
      expect(getUniquePermutations(['A', 'B'], 0)).toEqual([]);
    });

    it('returns empty array when input is empty', () => {
      expect(getUniquePermutations([], 2)).toEqual([]);
    });

    it('respects optional maxLength when input does not exceed it', () => {
      const result = getUniquePermutations(['A', 'B'], 2, 5);
      expect(result.length).toBe(2);
    });

    it('throws error when input array length exceeds maxLength', () => {
      expect(() => {
        getUniquePermutations(['A', 'B', 'C', 'D'], 2, 3);
      }).toThrow(/Input length exceeds maximum allowed limit/);
    });
  });

  describe('padNumber', () => {
    it('pads single digit number with zero', () => {
      expect(padNumber(5)).toBe('05');
    });

    it('keeps two digit numbers as string', () => {
      expect(padNumber(12)).toBe('12');
    });
  });

  describe('getLastPathName', () => {
    it('returns last segment of path', () => {
      expect(getLastPathName('/home/user/profile')).toBe('profile');
    });

    it('defaults to "bet" if path ends with trailing slash or empty', () => {
      expect(getLastPathName('')).toBe('bet');
    });
  });

  describe('getV', () => {
    it('calculates timestamp divided by divider', () => {
      const now = Date.now();
      const val = getV(1000);
      expect(val).toBeGreaterThan(0);
      expect(typeof val).toBe('number');
    });
  });

  describe('Array Utils', () => {
    it('pads start of array', () => {
      const res = padArrayStart(['1', '2'], 4, '0');
      expect(res).toEqual(['0', '0', '1', '2']);
    });

    it('slices elements from end', () => {
      const res = sliceFromEnd(['A', 'B', 'C', 'D'], 2);
      expect(res).toEqual(['C', 'D']);
    });

    it('returns empty array if sliceFromEnd position <= 0', () => {
      expect(sliceFromEnd(['A', 'B'], 0)).toEqual([]);
    });

    it('joins array without falsy values', () => {
      const res = joinWithoutFalsy(['foo', '', 'bar', 'baz']);
      expect(res).toBe('foo,bar,baz');
    });
  });
});
