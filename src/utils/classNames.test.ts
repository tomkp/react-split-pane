import { describe, it, expect } from 'vitest';
import { cn } from './classNames';

describe('cn', () => {
  it('combines multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out false values', () => {
    const shouldInclude = false;
    expect(cn('foo', shouldInclude && 'bar', 'baz')).toBe('foo baz');
  });

  it('filters out undefined values', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('filters out null values', () => {
    expect(cn('foo', null, 'bar')).toBe('foo bar');
  });

  it('filters out empty strings', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
  });

  it('returns empty string when no valid classes', () => {
    expect(cn(false, undefined, null)).toBe('');
  });

  it('handles single class name', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('handles conditional class names', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe(
      'base active'
    );
  });
});
