import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  announce,
  formatSizeForAnnouncement,
  getDividerLabel,
  getKeyboardInstructions,
} from './accessibility';

describe('announce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Clean up any remaining announcements
    document.body.innerHTML = '';
  });

  it('creates an announcement element with correct attributes', () => {
    announce('Test message');

    const announcement = document.querySelector('[role="status"]');
    expect(announcement).toBeInTheDocument();
    expect(announcement).toHaveAttribute('aria-live', 'polite');
    expect(announcement).toHaveAttribute('aria-atomic', 'true');
    expect(announcement).toHaveTextContent('Test message');
  });

  it('uses assertive priority when specified', () => {
    announce('Urgent message', 'assertive');

    const announcement = document.querySelector('[role="status"]');
    expect(announcement).toHaveAttribute('aria-live', 'assertive');
  });

  it('positions element off-screen for screen readers only', () => {
    announce('Hidden message');

    const announcement = document.querySelector('[role="status"]') as HTMLElement;
    expect(announcement.style.position).toBe('absolute');
    expect(announcement.style.left).toBe('-10000px');
    expect(announcement.style.width).toBe('1px');
    expect(announcement.style.height).toBe('1px');
    expect(announcement.style.overflow).toBe('hidden');
  });

  it('removes announcement after 1 second', () => {
    announce('Temporary message');

    expect(document.querySelector('[role="status"]')).toBeInTheDocument();

    vi.advanceTimersByTime(1000);

    expect(document.querySelector('[role="status"]')).not.toBeInTheDocument();
  });
});

describe('formatSizeForAnnouncement', () => {
  it('formats small sizes in pixels', () => {
    expect(formatSizeForAnnouncement(100)).toBe('100 pixels');
    expect(formatSizeForAnnouncement(500)).toBe('500 pixels');
    expect(formatSizeForAnnouncement(999)).toBe('999 pixels');
  });

  it('rounds small sizes to nearest pixel', () => {
    expect(formatSizeForAnnouncement(100.4)).toBe('100 pixels');
    expect(formatSizeForAnnouncement(100.6)).toBe('101 pixels');
  });

  it('formats large sizes in thousands', () => {
    expect(formatSizeForAnnouncement(1000)).toBe('1 thousand pixels');
    expect(formatSizeForAnnouncement(1500)).toBe('1.5 thousand pixels');
    expect(formatSizeForAnnouncement(2500)).toBe('2.5 thousand pixels');
  });
});

describe('getDividerLabel', () => {
  it('returns correct label for horizontal direction', () => {
    // Horizontal split = vertical divider (side-by-side panes)
    expect(getDividerLabel(0, 'horizontal')).toBe('vertical divider 1');
    expect(getDividerLabel(1, 'horizontal')).toBe('vertical divider 2');
    expect(getDividerLabel(2, 'horizontal')).toBe('vertical divider 3');
  });

  it('returns correct label for vertical direction', () => {
    // Vertical split = horizontal divider (stacked panes)
    expect(getDividerLabel(0, 'vertical')).toBe('horizontal divider 1');
    expect(getDividerLabel(1, 'vertical')).toBe('horizontal divider 2');
  });
});

describe('getKeyboardInstructions', () => {
  it('returns horizontal arrow key instructions for horizontal direction', () => {
    const instructions = getKeyboardInstructions('horizontal');
    expect(instructions).toContain('left and right arrow keys');
    expect(instructions).toContain('Shift for larger steps');
    expect(instructions).toContain('Home or End');
  });

  it('returns vertical arrow key instructions for vertical direction', () => {
    const instructions = getKeyboardInstructions('vertical');
    expect(instructions).toContain('up and down arrow keys');
    expect(instructions).toContain('Shift for larger steps');
    expect(instructions).toContain('Home or End');
  });
});
