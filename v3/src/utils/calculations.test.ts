import { describe, it, expect } from 'vitest';
import {
  convertToPixels,
  clamp,
  snapToPoint,
  distributeSizes,
  calculateDraggedSizes,
  applyStep,
} from './calculations';

describe('convertToPixels', () => {
  it('converts percentage to pixels', () => {
    expect(convertToPixels('50%', 1000)).toBe(500);
    expect(convertToPixels('25%', 800)).toBe(200);
  });

  it('converts px string to number', () => {
    expect(convertToPixels('100px', 1000)).toBe(100);
    expect(convertToPixels('250px', 500)).toBe(250);
  });

  it('returns number as is', () => {
    expect(convertToPixels(100, 1000)).toBe(100);
    expect(convertToPixels(350, 500)).toBe(350);
  });

  it('handles invalid strings', () => {
    expect(convertToPixels('invalid', 1000)).toBe(0);
  });
});

describe('clamp', () => {
  it('clamps value between min and max', () => {
    expect(clamp(50, 0, 100)).toBe(50);
    expect(clamp(-10, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
  });
});

describe('snapToPoint', () => {
  it('snaps to nearest point within tolerance', () => {
    expect(snapToPoint(105, [100, 200, 300], 10)).toBe(100);
    expect(snapToPoint(195, [100, 200, 300], 10)).toBe(200);
  });

  it('does not snap if outside tolerance', () => {
    expect(snapToPoint(120, [100, 200, 300], 10)).toBe(120);
  });
});

describe('distributeSizes', () => {
  it('distributes sizes proportionally', () => {
    const currentSizes = [300, 700];
    const newContainerSize = 500;
    const result = distributeSizes(currentSizes, newContainerSize);

    expect(result[0]).toBe(150); // 300/1000 * 500
    expect(result[1]).toBe(350); // 700/1000 * 500
  });

  it('distributes equally when current sizes are zero', () => {
    const currentSizes = [0, 0, 0];
    const newContainerSize = 900;
    const result = distributeSizes(currentSizes, newContainerSize);

    expect(result).toEqual([300, 300, 300]);
  });
});

describe('calculateDraggedSizes', () => {
  it('calculates new sizes after drag', () => {
    const sizes = [300, 700];
    const result = calculateDraggedSizes(sizes, 0, 50, [100, 100], [500, 900]);

    expect(result[0]).toBe(350);
    expect(result[1]).toBe(650);
  });

  it('respects minimum constraints', () => {
    const sizes = [300, 700];
    const result = calculateDraggedSizes(sizes, 0, -250, [100, 100], [500, 900]);

    expect(result[0]).toBe(100); // Cannot go below min
    expect(result[1]).toBe(900);
  });

  it('respects maximum constraints', () => {
    const sizes = [300, 700];
    const result = calculateDraggedSizes(sizes, 0, 300, [100, 100], [500, 900]);

    expect(result[0]).toBe(500); // Cannot exceed max
    expect(result[1]).toBe(500);
  });
});

describe('applyStep', () => {
  it('applies step-based resizing', () => {
    expect(applyStep(23, 10)).toBe(20);
    expect(applyStep(27, 10)).toBe(30);
    expect(applyStep(-23, 10)).toBe(-20);
  });

  it('returns delta unchanged if step is 0 or negative', () => {
    expect(applyStep(23, 0)).toBe(23);
    expect(applyStep(23, -5)).toBe(23);
  });
});
