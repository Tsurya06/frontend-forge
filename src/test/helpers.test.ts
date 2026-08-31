import { describe, it, expect, vi } from 'vitest';
import {
  generateId,
  slugify,
  truncate,
  highlightText,
  debounce,
  formatDate,
  calculatePercentage,
  getRandomItems,
} from '../utils/helpers';

describe('Utility Helpers', () => {
  it('generateId should produce unique non-empty string IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('slugify should normalize and create url-safe strings', () => {
    expect(slugify('Hello World & React!')).toBe('hello-world-react');
    expect(slugify('  CSS Grid vs Flexbox  ')).toBe('css-grid-vs-flexbox');
  });

  it('truncate should truncate strings longer than maxLength with ellipsis', () => {
    expect(truncate('Short text', 20)).toBe('Short text');
    expect(truncate('This is a much longer string that should be truncated', 10)).toBe('This is a…');
  });

  it('highlightText should wrap query matches in <mark> tags', () => {
    const res = highlightText('JavaScript Promises and Async/Await', 'Promises');
    expect(res).toBe('JavaScript <mark>Promises</mark> and Async/Await');
  });

  it('calculatePercentage should compute correct rounded percentage', () => {
    expect(calculatePercentage(5, 10)).toBe(50);
    expect(calculatePercentage(1, 3)).toBe(33);
    expect(calculatePercentage(0, 0)).toBe(0);
  });

  it('formatDate should format valid date strings', () => {
    const formatted = formatDate('2026-09-01T00:00:00Z');
    expect(formatted).toContain('2026');
  });

  it('getRandomItems should return the requested count of items', () => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8];
    const picked = getRandomItems(list, 3);
    expect(picked.length).toBe(3);
    picked.forEach(item => expect(list).toContain(item));
  });

  it('debounce should delay invocation until after wait period', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('a');
    debounced('b');
    debounced('c');

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(250);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
    vi.useRealTimers();
  });
});
