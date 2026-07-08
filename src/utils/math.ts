/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Marshall Thickness Correlation Ratios (ASTM D1559 / AASHTO T245)
// Thickness (mm) -> Correlation Ratio
const THICKNESS_FACTORS: { mm: number; factor: number }[] = [
  { mm: 25.4, factor: 3.00 },
  { mm: 28.6, factor: 2.50 },
  { mm: 31.8, factor: 2.25 },
  { mm: 34.9, factor: 2.00 },
  { mm: 38.1, factor: 1.79 },
  { mm: 41.3, factor: 1.61 },
  { mm: 44.4, factor: 1.47 },
  { mm: 47.6, factor: 1.35 },
  { mm: 50.8, factor: 1.25 },
  { mm: 54.0, factor: 1.16 },
  { mm: 57.2, factor: 1.09 },
  { mm: 60.3, factor: 1.04 },
  { mm: 63.5, factor: 1.00 },
  { mm: 66.7, factor: 0.96 },
  { mm: 69.9, factor: 0.93 },
  { mm: 73.0, factor: 0.89 },
  { mm: 76.2, factor: 0.86 },
  { mm: 79.4, factor: 0.83 },
  { mm: 82.6, factor: 0.81 },
  { mm: 85.7, factor: 0.78 },
  { mm: 88.9, factor: 0.76 },
];

/**
 * Gets the stability correction factor based on specimen thickness (mm)
 */
export function getStabilityCorrectionFactor(thickness: number): number {
  if (thickness <= THICKNESS_FACTORS[0].mm) {
    return THICKNESS_FACTORS[0].factor;
  }
  if (thickness >= THICKNESS_FACTORS[THICKNESS_FACTORS.length - 1].mm) {
    return THICKNESS_FACTORS[THICKNESS_FACTORS.length - 1].factor;
  }

  // Find the interval
  for (let i = 0; i < THICKNESS_FACTORS.length - 1; i++) {
    const p1 = THICKNESS_FACTORS[i];
    const p2 = THICKNESS_FACTORS[i + 1];
    if (thickness >= p1.mm && thickness <= p2.mm) {
      // Linear interpolation
      const ratio = (thickness - p1.mm) / (p2.mm - p1.mm);
      return p1.factor + ratio * (p2.factor - p1.factor);
    }
  }
  return 1.0;
}

/**
 * Solves a 3x3 system of linear equations using Cramer's Rule.
 * Ax = B
 */
function solve3x3(A: number[][], B: number[]): number[] | null {
  const detA =
    A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

  if (Math.abs(detA) < 1e-12) {
    return null; // Singular matrix
  }

  const detA1 =
    B[0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (B[1] * A[2][2] - A[1][2] * B[2]) +
    A[0][2] * (B[1] * A[2][1] - A[1][1] * B[2]);

  const detA2 =
    A[0][0] * (B[1] * A[2][2] - A[1][2] * B[2]) -
    B[0] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * B[2] - B[1] * A[2][0]);

  const detA3 =
    A[0][0] * (A[1][1] * B[2] - B[1] * A[2][1]) -
    A[0][1] * (A[1][0] * B[2] - B[1] * A[2][0]) +
    B[0] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

  return [detA1 / detA, detA2 / detA, detA3 / detA];
}

export interface QuadraticCurve {
  a: number;
  b: number;
  c: number;
  fitSuccess: boolean;
  evaluate: (x: number) => number;
  findPeakX: () => number | null;
  findXForY: (y: number, minX: number, maxX: number) => number | null;
}

/**
 * Fits a quadratic curve y = ax^2 + bx + c to a set of points (x, y)
 */
export function fitQuadratic(points: { x: number; y: number }[]): QuadraticCurve {
  const n = points.length;
  
  const defaultCurve: QuadraticCurve = {
    a: 0,
    b: 0,
    c: 0,
    fitSuccess: false,
    evaluate: (x) => {
      // Fallback: Linear interpolation
      if (points.length === 0) return 0;
      if (points.length === 1) return points[0].y;
      
      // Sort points by x
      const sorted = [...points].sort((a, b) => a.x - b.x);
      if (x <= sorted[0].x) return sorted[0].y;
      if (x >= sorted[sorted.length - 1].x) return sorted[sorted.length - 1].y;
      
      for (let i = 0; i < sorted.length - 1; i++) {
        if (x >= sorted[i].x && x <= sorted[i + 1].x) {
          const ratio = (x - sorted[i].x) / (sorted[i + 1].x - sorted[i].x);
          return sorted[i].y + ratio * (sorted[i + 1].y - sorted[i].y);
        }
      }
      return 0;
    },
    findPeakX: () => {
      if (points.length === 0) return null;
      // Return x of point with maximum y
      const maxPt = [...points].reduce((prev, current) => (prev.y > current.y) ? prev : current);
      return maxPt.x;
    },
    findXForY: (y, minX, maxX) => {
      if (points.length < 2) return null;
      const sorted = [...points].sort((a, b) => a.x - b.x);
      // Linear search for crossing
      for (let i = 0; i < sorted.length - 1; i++) {
        const p1 = sorted[i];
        const p2 = sorted[i+1];
        if ((p1.y <= y && y <= p2.y) || (p2.y <= y && y <= p1.y)) {
          if (Math.abs(p2.y - p1.y) > 1e-6) {
            const ratio = (y - p1.y) / (p2.y - p1.y);
            const xVal = p1.x + ratio * (p2.x - p1.x);
            if (xVal >= minX && xVal <= maxX) {
              return xVal;
            }
          }
        }
      }
      return (minX + maxX) / 2; // approximation fallback
    }
  };

  if (n < 3) {
    return defaultCurve;
  }

  // Calculate sums
  let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
  let sumY = 0, sumXY = 0, sumX2Y = 0;

  for (const p of points) {
    const x = p.x;
    const y = p.y;
    const x2 = x * x;
    const x3 = x2 * x;
    const x4 = x3 * x;

    sumX += x;
    sumX2 += x2;
    sumX3 += x3;
    sumX4 += x4;
    sumY += y;
    sumXY += x * y;
    sumX2Y += x2 * y;
  }

  const A = [
    [sumX4, sumX3, sumX2],
    [sumX3, sumX2, sumX],
    [sumX2, sumX, n]
  ];
  const B = [sumX2Y, sumXY, sumY];

  const coeff = solve3x3(A, B);
  if (!coeff) {
    return defaultCurve;
  }

  const [a, b, c] = coeff;

  return {
    a,
    b,
    c,
    fitSuccess: true,
    evaluate: (x) => a * x * x + b * x + c,
    findPeakX: () => {
      // For y = ax^2 + bx + c, the extremum is at x = -b / (2a).
      // It is a maximum if a < 0.
      if (a < 0) {
        const xPeak = -b / (2 * a);
        // Ensure the peak is within a reasonable range of our input data points
        const sortedX = points.map(p => p.x).sort((a, b) => a - b);
        const minAllowed = sortedX[0] - 1.0;
        const maxAllowed = sortedX[sortedX.length - 1] + 1.0;
        if (xPeak >= minAllowed && xPeak <= maxAllowed) {
          return xPeak;
        }
      }
      // Fallback: point of maximum y
      const maxPt = [...points].reduce((prev, current) => (prev.y > current.y) ? prev : current);
      return maxPt.x;
    },
    findXForY: (y, minX, maxX) => {
      // Find x where ax^2 + bx + c = y => ax^2 + bx + (c - y) = 0
      const cPrime = c - y;
      
      if (Math.abs(a) < 1e-9) {
        // Linear equation: bx + cPrime = 0 => x = -cPrime / b
        if (Math.abs(b) > 1e-9) {
          const xVal = -cPrime / b;
          if (xVal >= minX && xVal <= maxX) return xVal;
        }
      } else {
        const discriminant = b * b - 4 * a * cPrime;
        if (discriminant >= 0) {
          const sqrtD = Math.sqrt(discriminant);
          const x1 = (-b + sqrtD) / (2 * a);
          const x2 = (-b - sqrtD) / (2 * a);
          
          const x1Valid = x1 >= minX && x1 <= maxX;
          const x2Valid = x2 >= minX && x2 <= maxX;
          
          if (x1Valid && x2Valid) {
            // If both are valid, return the one closest to the center or depending on slope
            // VTM usually decreases as asphalt content increases. So we prefer the slope that goes down.
            // dY/dX = 2ax + b. If we want VTM to decrease, slope should be negative.
            const slope1 = 2 * a * x1 + b;
            if (slope1 < 0) return x1;
            return x2;
          }
          if (x1Valid) return x1;
          if (x2Valid) return x2;
        }
      }
      
      // Fallback to linear segment interpolation
      return defaultCurve.findXForY(y, minX, maxX);
    }
  };
}
