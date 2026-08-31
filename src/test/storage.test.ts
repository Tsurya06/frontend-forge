import { describe, it, expect, beforeEach } from 'vitest';
import { getFromStorage, setToStorage, removeFromStorage, clearStorage } from '../utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('setToStorage and getFromStorage should serialize and deserialize JSON', () => {
    setToStorage('test_key', { a: 1, b: 'hello' });
    const result = getFromStorage<{ a: number; b: string }>('test_key', { a: 0, b: '' });
    expect(result).toEqual({ a: 1, b: 'hello' });
  });

  it('getFromStorage should return fallback value if key does not exist', () => {
    const fallback = { fallback: true };
    const result = getFromStorage('non_existent', fallback);
    expect(result).toEqual(fallback);
  });

  it('removeFromStorage should remove specific key', () => {
    setToStorage('k1', 'v1');
    expect(getFromStorage('k1', null)).toBe('v1');
    removeFromStorage('k1');
    expect(getFromStorage('k1', null)).toBeNull();
  });

  it('clearStorage should wipe all stored items', () => {
    setToStorage('k1', 'v1');
    setToStorage('k2', 'v2');
    clearStorage();
    expect(getFromStorage('k1', null)).toBeNull();
    expect(getFromStorage('k2', null)).toBeNull();
  });
});
