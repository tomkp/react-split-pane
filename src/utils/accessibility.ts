/**
 * Announce a message to screen readers.
 * SSR-safe: no-op when document is not available.
 */
export function announce(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  // SSR safety check
  if (typeof document === 'undefined') {
    return;
  }

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Format size for screen reader announcement
 */
export function formatSizeForAnnouncement(size: number): string {
  if (size < 1000) {
    return `${Math.round(size)} pixels`;
  }
  return `${Math.round(size / 10) / 100} thousand pixels`;
}

/**
 * Generate accessible label for divider
 */
export function getDividerLabel(
  index: number,
  direction: 'horizontal' | 'vertical'
): string {
  const orientation = direction === 'horizontal' ? 'vertical' : 'horizontal';
  return `${orientation} divider ${index + 1}`;
}

/**
 * Get keyboard instructions for divider
 */
export function getKeyboardInstructions(
  direction: 'horizontal' | 'vertical'
): string {
  const keys =
    direction === 'horizontal'
      ? 'left and right arrow keys'
      : 'up and down arrow keys';

  return `Use ${keys} to resize. Hold Shift for larger steps. Press Home or End to minimize or maximize.`;
}
