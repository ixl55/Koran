import { distanceToKaaba, normalizeAngle, qiblaBearing, qiblaOffset } from '@/lib/qibla';

describe('qibla', () => {
  it('computes known bearings', () => {
    expect(qiblaBearing(30.0444, 31.2357)).toBeCloseTo(136.1, 0); // Cairo
    expect(qiblaBearing(40.7128, -74.006)).toBeCloseTo(58.5, 0); // New York
    expect(qiblaBearing(-6.2088, 106.8456)).toBeCloseTo(295.1, 0); // Jakarta
  });

  it('computes distance to Makkah', () => {
    const km = distanceToKaaba(30.0444, 31.2357);
    expect(km).toBeGreaterThan(1250);
    expect(km).toBeLessThan(1300);
  });

  it('normalises offsets to (-180, 180]', () => {
    expect(normalizeAngle(350)).toBe(-10);
    expect(normalizeAngle(-190)).toBe(170);
    expect(qiblaOffset(10, 350)).toBe(20);
    expect(qiblaOffset(350, 10)).toBe(-20);
  });
});
