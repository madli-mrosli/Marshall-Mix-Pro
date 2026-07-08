/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type JkrMixType = 'AC10' | 'AC14' | 'AC28';
export type TrafficType = 'STANDARD' | 'HEAVY';

export interface JkrSpecification {
  mixType: JkrMixType;
  name: string;
  description: string;
  minBinderContent: number;
  maxBinderContent: number;
  minStability: number; // in N
  minStabilityHeavy: number; // in N
  minFlow: number; // in mm
  maxFlow: number; // in mm
  minVTM: number; // Voids in Total Mix (%)
  maxVTM: number; // Voids in Total Mix (%)
  minVFB: number; // Voids Filled with Bitumen (%)
  maxVFB: number; // Voids Filled with Bitumen (%)
  minVMA: number; // Voids in Mineral Aggregate (%)
  minStiffness: number; // Stiffness ratio (N/mm)
  minStiffnessHeavy: number; // Stiffness ratio (N/mm) for heavy traffic
}

export const JKR_SPECS: Record<JkrMixType, JkrSpecification> = {
  AC10: {
    mixType: 'AC10',
    name: 'AC10 - Wearing Course',
    description: 'Asphaltic Concrete AC10. Fine wearing course. Binder content: 4.5% - 6.5%. Max aggregate size: 10mm.',
    minBinderContent: 4.5,
    maxBinderContent: 6.5,
    minStability: 8000,
    minStabilityHeavy: 10000,
    minFlow: 2.0,
    maxFlow: 4.0,
    minVTM: 3.0,
    maxVTM: 5.0,
    minVFB: 70.0,
    maxVFB: 80.0,
    minVMA: 15.0,
    minStiffness: 2000,
    minStiffnessHeavy: 2500,
  },
  AC14: {
    mixType: 'AC14',
    name: 'AC14 - Wearing Course',
    description: 'Asphaltic Concrete AC14. Standard wearing course. Binder content: 4.0% - 6.0%. Max aggregate size: 14mm.',
    minBinderContent: 4.0,
    maxBinderContent: 6.0,
    minStability: 8000,
    minStabilityHeavy: 10000,
    minFlow: 2.0,
    maxFlow: 4.0,
    minVTM: 3.0,
    maxVTM: 5.0,
    minVFB: 70.0,
    maxVFB: 80.0,
    minVMA: 14.0,
    minStiffness: 2000,
    minStiffnessHeavy: 2500,
  },
  AC28: {
    mixType: 'AC28',
    name: 'AC28 - Binder/Base Course',
    description: 'Asphaltic Concrete AC28. Heavy binder or base course. Binder content: 3.5% - 5.5%. Max aggregate size: 28mm.',
    minBinderContent: 3.5,
    maxBinderContent: 5.5,
    minStability: 8000,
    minStabilityHeavy: 10000,
    minFlow: 2.0,
    maxFlow: 4.0,
    minVTM: 3.0,
    maxVTM: 7.0,
    minVFB: 65.0,
    maxVFB: 75.0, // Or sometimes up to 80%, but 65-75% is standard JKR base course.
    minVMA: 13.0,
    minStiffness: 2000,
    minStiffnessHeavy: 2500,
  },
};

export interface MarshallSample {
  id: string;
  asphaltContent: number; // Pb (%)
  
  // Weight measurements (for Density Gmb calculation)
  weightInAir: number; // A (g)
  weightSsd: number; // B (g)
  weightInWater: number; // C (g)
  
  // Directly input Bulk Density (if they don't want to use weights)
  useDirectBulkDensity: boolean;
  directBulkDensity: number; // Gmb

  // Specific Gravities
  maxTheoreticalSpecificGravity: number; // Gmm
  useCalculatedGmm: boolean; // if true, calculated from Gse & Pb

  // Stability measurements
  specimenThickness: number; // mm (Standard is 63.5 mm)
  measuredStability: number; // kg or N
  stabilityUnit: 'N' | 'kg';
  
  // Flow measurements
  flow: number; // mm
}

export interface CalculatedProperties {
  asphaltContent: number;
  bulkDensity: number; // Gmb (g/cm3)
  maxTheoreticalGravity: number; // Gmm
  correctedStability: number; // N
  flow: number; // mm
  vtm: number; // Voids in Total Mix (%)
  vma: number; // Voids in Mineral Aggregate (%)
  vfb: number; // Voids Filled with Bitumen (%)
  stiffness: number; // N/mm
  
  // Compliance statuses
  stabilityPass: boolean;
  flowPass: boolean;
  vtmPass: boolean;
  vmaPass: boolean;
  vfbPass: boolean;
  stiffnessPass: boolean;
}

export interface OptimizationResult {
  obc: number; // Optimum Binder Content (%)
  densityAtObc: number;
  stabilityAtObc: number;
  flowAtObc: number;
  vtmAtObc: number;
  vfbAtObc: number;
  vmaAtObc: number;
  stiffnessAtObc: number;
  
  // Parameter values at OBC
  isCompliantAtObc: boolean;
  failParameters: string[];
}
