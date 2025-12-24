/**
 * Combines class names, filtering out falsy values.
 * Similar to the popular `clsx` or `classnames` packages.
 *
 * @param classes - Class names to combine (strings, undefined, null, false)
 * @returns Combined class name string
 *
 * @example
 * ```ts
 * cn('foo', 'bar') // 'foo bar'
 * cn('foo', false && 'bar', 'baz') // 'foo baz'
 * cn('foo', undefined, 'bar') // 'foo bar'
 * ```
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}
