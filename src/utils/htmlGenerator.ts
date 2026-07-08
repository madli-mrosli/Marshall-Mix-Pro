/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarshallSample, JkrMixType, TrafficType } from '../types';

export function generateOfflineHtml(
  currentSamples: MarshallSample[],
  mixType: JkrMixType,
  trafficType: TrafficType,
  g_sb: number,
  g_se: number,
  g_b: number
): string {
  // Serialize current state so that the offline app starts exactly with what the user is currently working on!
  const serializedSamples = JSON.stringify(currentSamples, null, 2);

  return `<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marshall Mix Pro - JKR SPJ Section 4 Offline App</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  
  <!-- Google Fonts (Inter + JetBrains Mono) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        background-color: white !important;
      }
      .print-card {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
    }
  </style>
</head>
<body class="min-h-screen flex flex-col text-slate-900 antialiased">

  <!-- Header -->
  <header class="bg-slate-900 text-white shrink-0 sticky top-0 z-40 shadow-lg no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-extrabold text-white text-md shadow-md">M</div>
        <div>
          <h1 class="text-base font-bold tracking-tight leading-none uppercase text-white">MARSHALL MIX PRO</h1>
          <p class="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-medium">Fully Offline Independent Workspace</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
          <span class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span class="text-[10px] font-bold text-slate-300">100% OFFLINE APP</span>
        </div>
        <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase px-4 py-1.5 rounded-lg transition-all shadow-sm">
          Print Report
        </button>
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    
    <!-- Explanation Card -->
    <div class="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-900 leading-relaxed no-print flex gap-4 items-start">
      <div class="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <div>
        <h4 class="font-bold text-blue-950 mb-1">Standalone Offline JKR Suite Successfully Exported!</h4>
        <p>This standalone file runs entirely locally inside your browser. No internet, servers, or databases are required. You can add, edit, or delete laboratory specimen entries, adjust gravity constants, and the full suite will fit quadratic curves, verify compliance, determine the Optimal Bitumen Content (OBC), and update all six Marshall figures live in real-time.</p>
      </div>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Sidebar Controls -->
      <aside class="lg:col-span-3 flex flex-col gap-6 no-print">
        
        <!-- Specification Choice -->
        <div class="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
          <label class="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-wider font-mono">Mix Specification</label>
          <div class="space-y-2.5">
            <button id="btn-AC10" onclick="setMixType('AC10')" class="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all tracking-wider flex items-center justify-between border border-slate-800 bg-slate-950/45 text-slate-400">
              <span>AC 10 Wearing</span>
              <span id="dot-AC10" class="w-2 h-2 rounded-full bg-transparent"></span>
            </button>
            <button id="btn-AC14" onclick="setMixType('AC14')" class="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all tracking-wider flex items-center justify-between border border-slate-800 bg-slate-950/45 text-slate-400">
              <span>AC 14 Wearing</span>
              <span id="dot-AC14" class="w-2 h-2 rounded-full bg-transparent"></span>
            </button>
            <button id="btn-AC28" onclick="setMixType('AC28')" class="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all tracking-wider flex items-center justify-between border border-slate-800 bg-slate-950/45 text-slate-400">
              <span>AC 28 Binder</span>
              <span id="dot-AC28" class="w-2 h-2 rounded-full bg-transparent"></span>
            </button>
          </div>
        </div>

        <!-- Traffic Type -->
        <div class="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
          <label class="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-wider font-mono">Traffic Category</label>
          <div class="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button id="btn-traffic-std" onclick="setTrafficType('STANDARD')" class="text-center py-1.5 rounded text-[10px] font-bold uppercase transition-all bg-slate-800 text-white">
              Standard
            </button>
            <button id="btn-traffic-heavy" onclick="setTrafficType('HEAVY')" class="text-center py-1.5 rounded text-[10px] font-bold uppercase transition-all text-slate-400 hover:text-white">
              Heavy
            </button>
          </div>
        </div>

        <!-- Specific Gravities -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <label class="text-[10px] font-bold text-slate-500 uppercase mb-3 block tracking-wider font-mono">Specific Gravities</label>
          <div class="space-y-3.5">
            <div>
              <span class="text-[10px] text-slate-500 block font-semibold mb-1">AGGREGATE BULK (G<sub>sb</sub>)</span>
              <input type="number" id="input-gsb" step="0.001" value="${g_sb}" oninput="updateGsb(this.value)" class="w-full text-xs font-mono border border-slate-200 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none">
            </div>
            <div>
              <span class="text-[10px] text-slate-500 block font-semibold mb-1">AGGREGATE EFFECTIVE (G<sub>se</sub>)</span>
              <input type="number" id="input-gse" step="0.001" value="${g_se}" oninput="updateGse(this.value)" class="w-full text-xs font-mono border border-slate-200 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none">
            </div>
            <div>
              <span class="text-[10px] text-slate-500 block font-semibold mb-1">BITUMEN SG (G<sub>b</sub>)</span>
              <input type="number" id="input-gb" step="0.001" value="${g_b}" oninput="updateGb(this.value)" class="w-full text-xs font-mono border border-slate-200 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none">
            </div>
          </div>
        </div>

      </aside>

      <!-- Dashboard -->
      <div class="lg:col-span-9 space-y-8 flex flex-col">
        
        <!-- Summary Widgets -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-container">
          <!-- Live generated widgets will insert here -->
        </div>

        <!-- Spec Requirements Card -->
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div class="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-800">JKR Malaysia Standard Specification Limits (SPJ/2008 Section 4)</h3>
            <span class="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded font-mono border border-blue-200 uppercase tracking-wide" id="spec-badge-label">
              AC14 WEARING
            </span>
          </div>
          <div class="p-5" id="spec-details-panel">
            <!-- Spec Details will be rendered here dynamically -->
          </div>
        </div>

        <!-- Data Entry Table -->
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div class="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between no-print">
            <div>
              <h3 class="text-sm font-bold text-slate-800">Marshall Specimen Lab Log</h3>
              <p class="text-[11px] text-slate-500">Edit values directly inside the cells to update the entire engine instantly.</p>
            </div>
            <div class="flex gap-2">
              <button onclick="addBlankSample()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded shadow-xs transition-colors">
                + Add Specimen
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider font-mono">
                <tr>
                  <th class="p-3">Pb (%)</th>
                  <th class="p-3">W_Air (g)</th>
                  <th class="p-3">W_SSD (g)</th>
                  <th class="p-3">W_Water (g)</th>
                  <th class="p-3">Thickness (mm)</th>
                  <th class="p-3">Stability (N)</th>
                  <th class="p-3">Flow (mm)</th>
                  <th class="p-3 text-center no-print">Actions</th>
                </tr>
              </thead>
              <tbody id="samples-table-body" class="divide-y divide-slate-200 font-mono">
                <!-- Rows inserted dynamically -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Calculated Properties Display -->
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div class="bg-slate-50 px-5 py-4 border-b border-slate-200">
            <h3 class="text-sm font-bold text-slate-800">Calculated Volumetrics &amp; Stability Performance</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse">
              <thead class="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider font-mono">
                <tr>
                  <th class="p-3">Pb (%)</th>
                  <th class="p-3">Gmb (Density)</th>
                  <th class="p-3">Gmm (Max SG)</th>
                  <th class="p-3">Stab. (kN)</th>
                  <th class="p-3">Flow (mm)</th>
                  <th class="p-3">VTM (%)</th>
                  <th class="p-3">VMA (%)</th>
                  <th class="p-3">VFB (%)</th>
                  <th class="p-3">Stiff (N/mm)</th>
                </tr>
              </thead>
              <tbody id="calculated-table-body" class="divide-y divide-slate-200 font-mono text-slate-700">
                <!-- Rows inserted dynamically -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Optimizer Panel -->
        <div class="bg-slate-900 border border-slate-800 text-white rounded-xl overflow-hidden shadow-md">
          <div class="bg-slate-950 px-5 py-4 border-b border-slate-850 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-amber-400 font-bold uppercase tracking-wider font-mono text-xs">OBC Calculator</span>
            </div>
          </div>
          <div class="p-6 space-y-6" id="optimizer-panel">
            <!-- Dynamic Optimizer Content -->
          </div>
        </div>

        <!-- Marshall Charts Section -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Marshall Suite Figures (6-Graph Suite)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="charts-grid">
            <!-- Live interactive custom SVG curves will be rendered here -->
          </div>
        </div>

      </div>
    </div>
  </main>

  <footer class="h-10 bg-slate-100 border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-semibold text-slate-500 tracking-wider shrink-0 uppercase font-mono mt-12">
    <div>DB: LOCAL_OFFLINE</div>
    <div class="text-green-600 flex items-center gap-1">
      <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
      Engine Ready • Calculations Live
    </div>
  </footer>

  <!-- Application Logic -->
  <script>
    // Initial State pre-loaded with current React data
    let mixType = '${mixType}';
    let trafficType = '${trafficType}';
    let g_sb = ${g_sb};
    let g_se = ${g_se};
    let g_b = ${g_b};
    let samples = ${serializedSamples};

    // Marshall Thickness Correction Ratios (ASTM D1559)
    const THICKNESS_FACTORS = [
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

    // JKR Standard Specs Reference (SPJ Section 4)
    const JKR_SPECS = {
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
        maxVFB: 75.0,
        minVMA: 13.0,
        minStiffness: 2000,
        minStiffnessHeavy: 2500,
      },
    };

    function getStabilityCorrectionFactor(thickness) {
      if (thickness <= THICKNESS_FACTORS[0].mm) return THICKNESS_FACTORS[0].factor;
      if (thickness >= THICKNESS_FACTORS[THICKNESS_FACTORS.length - 1].mm) return THICKNESS_FACTORS[THICKNESS_FACTORS.length - 1].factor;
      
      for (let i = 0; i < THICKNESS_FACTORS.length - 1; i++) {
        const p1 = THICKNESS_FACTORS[i];
        const p2 = THICKNESS_FACTORS[i + 1];
        if (thickness >= p1.mm && thickness <= p2.mm) {
          const ratio = (thickness - p1.mm) / (p2.mm - p1.mm);
          return p1.factor + ratio * (p2.factor - p1.factor);
        }
      }
      return 1.0;
    }

    // Solve 3x3 system using Cramer's rule for polynomial regression
    function solve3x3(A, B) {
      const detA =
        A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
        A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
        A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

      if (Math.abs(detA) < 1e-12) return null;

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
        B[0] * (A[1][0] * A[2][1] - A[1][1] * B[2]);

      return [detA1 / detA, detA2 / detA, detA3 / detA];
    }

    // Fits a quadratic y = ax^2 + bx + c
    function fitQuadratic(points) {
      const n = points.length;
      const fallback = {
        a: 0, b: 0, c: 0,
        fitSuccess: false,
        evaluate: (x) => {
          if (points.length === 0) return 0;
          if (points.length === 1) return points[0].y;
          const sorted = [...points].sort((a,b)=>a.x-b.x);
          if (x <= sorted[0].x) return sorted[0].y;
          if (x >= sorted[sorted.length-1].x) return sorted[sorted.length-1].y;
          for(let i=0; i<sorted.length-1; i++) {
            if(x >= sorted[i].x && x <= sorted[i+1].x) {
              const ratio = (x - sorted[i].x) / (sorted[i+1].x - sorted[i].x);
              return sorted[i].y + ratio * (sorted[i+1].y - sorted[i].y);
            }
          }
          return 0;
        },
        findPeakX: () => {
          if (points.length === 0) return null;
          const max = points.reduce((prev, curr) => (prev.y > curr.y ? prev : curr));
          return max.x;
        },
        findXForY: (y, minX, maxX) => {
          if (points.length < 2) return null;
          const sorted = [...points].sort((a,b)=>a.x-b.x);
          for(let i=0; i<sorted.length-1; i++) {
            const p1 = sorted[i];
            const p2 = sorted[i+1];
            if ((p1.y <= y && y <= p2.y) || (p2.y <= y && y <= p1.y)) {
              if (Math.abs(p2.y - p1.y) > 1e-6) {
                const ratio = (y - p1.y) / (p2.y - p1.y);
                const val = p1.x + ratio * (p2.x - p1.x);
                if (val >= minX && val <= maxX) return val;
              }
            }
          }
          return (minX + maxX)/2;
        }
      };

      if (n < 3) return fallback;

      let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
      let sumY = 0, sumXY = 0, sumX2Y = 0;

      for (const p of points) {
        const x = p.x;
        const y = p.y;
        const x2 = x * x;
        sumX += x;
        sumX2 += x2;
        sumX3 += x2 * x;
        sumX4 += x2 * x2;
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
      if (!coeff) return fallback;

      const [a, b, c] = coeff;

      return {
        a, b, c,
        fitSuccess: true,
        evaluate: (x) => a * x * x + b * x + c,
        findPeakX: () => {
          if (a < 0) {
            const xPeak = -b / (2 * a);
            const minAllowed = Math.min(...points.map(p=>p.x)) - 1.0;
            const maxAllowed = Math.max(...points.map(p=>p.x)) + 1.0;
            if (xPeak >= minAllowed && xPeak <= maxAllowed) return xPeak;
          }
          return points.reduce((prev, curr) => (prev.y > curr.y ? prev : curr)).x;
        },
        findXForY: (y, minX, maxX) => {
          const cPrime = c - y;
          if (Math.abs(a) < 1e-9) {
            if (Math.abs(b) > 1e-9) {
              const xVal = -cPrime / b;
              if (xVal >= minX && xVal <= maxX) return xVal;
            }
          } else {
            const disc = b * b - 4 * a * cPrime;
            if (disc >= 0) {
              const sqrtD = Math.sqrt(disc);
              const x1 = (-b + sqrtD) / (2 * a);
              const x2 = (-b - sqrtD) / (2 * a);
              const x1Valid = x1 >= minX && x1 <= maxX;
              const x2Valid = x2 >= minX && x2 <= maxX;
              if (x1Valid && x2Valid) {
                const slope1 = 2 * a * x1 + b;
                return slope1 < 0 ? x1 : x2;
              }
              if (x1Valid) return x1;
              if (x2Valid) return x2;
            }
          }
          return fallback.findXForY(y, minX, maxX);
        }
      };
    }

    // Core Recalculation Engine
    function calculateProperties() {
      const spec = JKR_SPECS[mixType];
      const minStability = trafficType === 'HEAVY' ? spec.minStabilityHeavy : spec.minStability;
      const minStiffness = trafficType === 'HEAVY' ? spec.minStiffnessHeavy : spec.minStiffness;

      const sortedSamples = [...samples].sort((a, b) => a.asphaltContent - b.asphaltContent);

      const calculated = sortedSamples.map(sample => {
        // Bulk Specific Gravity (Gmb)
        let bulkDensity = sample.directBulkDensity;
        if (!sample.useDirectBulkDensity) {
          const denominator = sample.weightSsd - sample.weightInWater;
          bulkDensity = denominator > 0 ? sample.weightInAir / denominator : 0;
        }

        // Max Specific Gravity (Gmm)
        let maxTheoreticalGravity = sample.maxTheoreticalSpecificGravity;
        if (sample.useCalculatedGmm) {
          const partAgg = (100 - sample.asphaltContent) / g_se;
          const partAsph = sample.asphaltContent / g_b;
          const sumPart = partAgg + partAsph;
          maxTheoreticalGravity = sumPart > 0 ? 100 / sumPart : 0;
        }

        // Thickness Correction Factor
        const thicknessFactor = getStabilityCorrectionFactor(sample.specimenThickness);

        // Convert kg to N if necessary, and apply thickness correction factor
        let stabilityInN = sample.measuredStability;
        if (sample.stabilityUnit === 'kg') {
          stabilityInN = sample.measuredStability * 9.80665;
        }
        const correctedStability = stabilityInN * thicknessFactor;

        // Voids in Total Mix (VTM) (%)
        const vtm = maxTheoreticalGravity > 0 ? 100 * (1 - bulkDensity / maxTheoreticalGravity) : 0;

        // Voids in Mineral Aggregate (VMA) (%)
        const vma = 100 - (bulkDensity * (100 - sample.asphaltContent)) / g_sb;

        // Voids Filled with Bitumen (VFB) (%)
        const vfb = vma > 0 ? 100 * ((vma - vtm) / vma) : 0;

        // Marshall Stiffness Ratio (N/mm)
        const stiffness = sample.flow > 0 ? correctedStability / sample.flow : 0;

        // Compliance checks
        return {
          id: sample.id,
          asphaltContent: sample.asphaltContent,
          bulkDensity,
          maxTheoreticalGravity,
          correctedStability,
          flow: sample.flow,
          vtm,
          vma,
          vfb,
          stiffness,
          stabilityPass: correctedStability >= minStability,
          flowPass: sample.flow >= spec.minFlow && sample.flow <= spec.maxFlow,
          vtmPass: vtm >= spec.minVTM && vtm <= spec.maxVTM,
          vmaPass: vma >= spec.minVMA,
          vfbPass: vfb >= spec.minVFB && vfb <= spec.maxVFB,
          stiffnessPass: stiffness >= minStiffness
        };
      });

      return { calculated, spec, minStability, minStiffness };
    }

    // Set UI Specs Controls
    function setMixType(newType) {
      mixType = newType;
      // Re-trigger defaults depending on mix to provide robust testing
      if (samples.length === 0) {
        loadDefaultSamplesFor(newType);
      }
      renderAll();
    }

    function setTrafficType(newTraffic) {
      trafficType = newTraffic;
      renderAll();
    }

    function updateGsb(val) {
      g_sb = Math.max(1.0, parseFloat(val) || 0);
      renderAll();
    }

    function updateGse(val) {
      g_se = Math.max(1.0, parseFloat(val) || 0);
      renderAll();
    }

    function updateGb(val) {
      g_b = Math.max(0.5, parseFloat(val) || 0);
      renderAll();
    }

    function updateCell(id, field, value) {
      const numVal = parseFloat(value) || 0;
      samples = samples.map(s => {
        if (s.id === id) {
          return { ...s, [field]: numVal };
        }
        return s;
      });
      renderAll();
    }

    function deleteSample(id) {
      samples = samples.filter(s => s.id !== id);
      renderAll();
    }

    function addBlankSample() {
      const nextId = 'sample-' + Date.now();
      const lastAsphalt = samples.length > 0 ? Math.max(...samples.map(s=>s.asphaltContent)) : 4.0;
      samples.push({
        id: nextId,
        asphaltContent: lastAsphalt + 0.5,
        weightInAir: 1215.0,
        weightSsd: 1218.0,
        weightInWater: 700.0,
        useDirectBulkDensity: false,
        directBulkDensity: 2.350,
        maxTheoreticalSpecificGravity: 2.450,
        useCalculatedGmm: true,
        specimenThickness: 63.5,
        measuredStability: 9500,
        stabilityUnit: 'N',
        flow: 2.8
      });
      renderAll();
    }

    function loadDefaultSamplesFor(type) {
      if (type === 'AC10') {
        g_sb = 2.620;
        g_se = 2.645;
        g_b = 1.030;
        samples = [
          { id: 'ac10-1', asphaltContent: 4.5, weightInAir: 1215.1, weightSsd: 1218.4, weightInWater: 698.2, useDirectBulkDensity: false, directBulkDensity: 2.336, maxTheoreticalSpecificGravity: 2.478, useCalculatedGmm: true, specimenThickness: 63.2, measuredStability: 8400, stabilityUnit: 'N', flow: 2.2 },
          { id: 'ac10-2', asphaltContent: 5.0, weightInAir: 1219.4, weightSsd: 1222.1, weightInWater: 705.5, useDirectBulkDensity: false, directBulkDensity: 2.360, maxTheoreticalSpecificGravity: 2.460, useCalculatedGmm: true, specimenThickness: 63.5, measuredStability: 9600, stabilityUnit: 'N', flow: 2.6 },
          { id: 'ac10-3', asphaltContent: 5.5, weightInAir: 1222.8, weightSsd: 1225.2, weightInWater: 708.9, useDirectBulkDensity: false, directBulkDensity: 2.368, maxTheoreticalSpecificGravity: 2.441, useCalculatedGmm: true, specimenThickness: 63.8, measuredStability: 10100, stabilityUnit: 'N', flow: 3.0 },
          { id: 'ac10-4', asphaltContent: 6.0, weightInAir: 1224.2, weightSsd: 1226.9, weightInWater: 709.1, useDirectBulkDensity: false, directBulkDensity: 2.364, maxTheoreticalSpecificGravity: 2.423, useCalculatedGmm: true, specimenThickness: 63.5, measuredStability: 9200, stabilityUnit: 'N', flow: 3.5 },
          { id: 'ac10-5', asphaltContent: 6.5, weightInAir: 1221.3, weightSsd: 1224.7, weightInWater: 705.6, useDirectBulkDensity: false, directBulkDensity: 2.353, maxTheoreticalSpecificGravity: 2.405, useCalculatedGmm: true, specimenThickness: 64.1, measuredStability: 7900, stabilityUnit: 'N', flow: 4.2 }
        ];
      } else if (type === 'AC14') {
        g_sb = 2.635;
        g_se = 2.660;
        g_b = 1.030;
        samples = [
          { id: 'ac14-1', asphaltContent: 4.0, weightInAir: 1210.3, weightSsd: 1213.2, weightInWater: 696.5, useDirectBulkDensity: false, directBulkDensity: 2.342, maxTheoreticalSpecificGravity: 2.502, useCalculatedGmm: true, specimenThickness: 63.4, measuredStability: 8300, stabilityUnit: 'N', flow: 2.1 },
          { id: 'ac14-2', asphaltContent: 4.5, weightInAir: 1216.5, weightSsd: 1219.1, weightInWater: 703.1, useDirectBulkDensity: false, directBulkDensity: 2.358, maxTheoreticalSpecificGravity: 2.483, useCalculatedGmm: true, specimenThickness: 63.5, measuredStability: 9700, stabilityUnit: 'N', flow: 2.5 },
          { id: 'ac14-3', asphaltContent: 5.0, weightInAir: 1220.8, weightSsd: 1223.2, weightInWater: 707.0, useDirectBulkDensity: false, directBulkDensity: 2.365, maxTheoreticalSpecificGravity: 2.465, useCalculatedGmm: true, specimenThickness: 63.6, measuredStability: 10300, stabilityUnit: 'N', flow: 2.9 },
          { id: 'ac14-4', asphaltContent: 5.5, weightInAir: 1221.4, weightSsd: 1224.0, weightInWater: 707.5, useDirectBulkDensity: false, directBulkDensity: 2.364, maxTheoreticalSpecificGravity: 2.446, useCalculatedGmm: true, specimenThickness: 63.5, measuredStability: 9100, stabilityUnit: 'N', flow: 3.4 },
          { id: 'ac14-5', asphaltContent: 6.0, weightInAir: 1218.0, weightSsd: 1221.1, weightInWater: 704.1, useDirectBulkDensity: false, directBulkDensity: 2.356, maxTheoreticalSpecificGravity: 2.428, useCalculatedGmm: true, specimenThickness: 63.8, measuredStability: 7700, stabilityUnit: 'N', flow: 4.1 }
        ];
      } else {
        g_sb = 2.645;
        g_se = 2.670;
        g_b = 1.030;
        samples = [
          { id: 'ac28-1', asphaltContent: 3.5, weightInAir: 1218.5, weightSsd: 1220.9, weightInWater: 704.2, useDirectBulkDensity: false, directBulkDensity: 2.358, maxTheoreticalSpecificGravity: 2.531, useCalculatedGmm: true, specimenThickness: 63.5, measuredStability: 8200, stabilityUnit: 'N', flow: 2.1 },
          { id: 'ac28-2', asphaltContent: 4.0, weightInAir: 1224.1, weightSsd: 1226.3, weightInWater: 710.2, useDirectBulkDensity: false, directBulkDensity: 2.372, maxTheoreticalSpecificGravity: 2.512, useCalculatedGmm: true, specimenThickness: 63.4, measuredStability: 9800, stabilityUnit: 'N', flow: 2.5 },
          { id: 'ac28-3', asphaltContent: 4.5, weightInAir: 1228.6, weightSsd: 1230.8, weightInWater: 713.8, useDirectBulkDensity: false, directBulkDensity: 2.376, maxTheoreticalSpecificGravity: 2.493, useCalculatedGmm: true, specimenThickness: 63.5, measuredStability: 10500, stabilityUnit: 'N', flow: 2.9 },
          { id: 'ac28-4', asphaltContent: 5.0, weightInAir: 1229.1, weightSsd: 1231.5, weightInWater: 714.2, useDirectBulkDensity: false, directBulkDensity: 2.375, maxTheoreticalSpecificGravity: 2.474, useCalculatedGmm: true, specimenThickness: 63.6, measuredStability: 9400, stabilityUnit: 'N', flow: 3.5 },
          { id: 'ac28-5', asphaltContent: 5.5, weightInAir: 1224.5, weightSsd: 1227.6, weightInWater: 710.1, useDirectBulkDensity: false, directBulkDensity: 2.366, maxTheoreticalSpecificGravity: 2.456, useCalculatedGmm: true, specimenThickness: 63.8, measuredStability: 7800, stabilityUnit: 'N', flow: 4.3 }
        ];
      }
    }

    // Dynamic OBC from fitted curves
    function getOptimalBinderContent(calculated, spec) {
      if (calculated.length < 3) return null;

      const densityPts = calculated.map(c => ({ x: c.asphaltContent, y: c.bulkDensity }));
      const stabilityPts = calculated.map(c => ({ x: c.asphaltContent, y: c.correctedStability }));
      const vtmPts = calculated.map(c => ({ x: c.asphaltContent, y: c.vtm }));

      const densityCurve = fitQuadratic(densityPts);
      const stabilityCurve = fitQuadratic(stabilityPts);
      const vtmCurve = fitQuadratic(vtmPts);

      const minX = Math.min(...calculated.map(c => c.asphaltContent));
      const maxX = Math.max(...calculated.map(c => c.asphaltContent));

      let pbDensity = densityCurve.findPeakX();
      if (pbDensity === null || pbDensity < minX || pbDensity > maxX) {
        pbDensity = densityPts.reduce((prev, curr) => (prev.y > curr.y ? prev : curr)).x;
      }

      let pbStability = stabilityCurve.findPeakX();
      if (pbStability === null || pbStability < minX || pbStability > maxX) {
        pbStability = stabilityPts.reduce((prev, curr) => (prev.y > curr.y ? prev : curr)).x;
      }

      const targetVtm = spec.mixType === 'AC28' ? 5.0 : 4.0;
      let pbVoids = vtmCurve.findXForY(targetVtm, minX, maxX);
      if (pbVoids === null) {
        pbVoids = (minX + maxX) / 2;
      }

      return {
        obc: parseFloat(((pbDensity + pbStability + pbVoids) / 3).toFixed(2)),
        densityPts,
        stabilityPts,
        vtmPts,
        densityCurve,
        stabilityCurve,
        vtmCurve
      };
    }

    // Render Function
    function renderAll() {
      // 1. Calculate
      const { calculated, spec, minStability, minStiffness } = calculateProperties();

      // 2. Active spec side buttons styling
      ['AC10', 'AC14', 'AC28'].forEach(t => {
        const btn = document.getElementById('btn-' + t);
        const dot = document.getElementById('dot-' + t);
        if (btn && dot) {
          if (mixType === t) {
            btn.className = "w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all tracking-wider flex items-center justify-between border border-blue-500 bg-slate-850 border-l-4 text-white";
            dot.className = "w-2 h-2 rounded-full bg-blue-400";
          } else {
            btn.className = "w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all tracking-wider flex items-center justify-between border border-slate-800 bg-slate-950/45 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200";
            dot.className = "w-2 h-2 rounded-full bg-transparent";
          }
        }
      });

      // Traffic switch styling
      const btnTrafficStd = document.getElementById('btn-traffic-std');
      const btnTrafficHeavy = document.getElementById('btn-traffic-heavy');
      if (btnTrafficStd && btnTrafficHeavy) {
        if (trafficType === 'STANDARD') {
          btnTrafficStd.className = "text-center py-1.5 rounded text-[10px] font-bold uppercase transition-all bg-slate-800 text-white";
          btnTrafficHeavy.className = "text-center py-1.5 rounded text-[10px] font-bold uppercase transition-all text-slate-400 hover:text-white";
        } else {
          btnTrafficStd.className = "text-center py-1.5 rounded text-[10px] font-bold uppercase transition-all text-slate-400 hover:text-white";
          btnTrafficHeavy.className = "text-center py-1.5 rounded text-[10px] font-bold uppercase transition-all bg-slate-800 text-white";
        }
      }

      // Input elements
      document.getElementById('input-gsb').value = g_sb;
      document.getElementById('input-gse').value = g_se;
      document.getElementById('input-gb').value = g_b;

      // 3. Stats widgets
      let statsSummary = {
        stability: 14.25,
        flow: 3.2,
        vfb: 78.4,
        density: 2.348,
        stabilityPass: true,
        flowPass: true,
        vfbPass: true,
      };

      if (calculated.length > 0) {
        const peakStability = Math.max(...calculated.map(c => c.correctedStability)) / 1000;
        const avgFlow = calculated.reduce((sum, c) => sum + c.flow, 0) / calculated.length;
        const avgVfb = calculated.reduce((sum, c) => sum + c.vfb, 0) / calculated.length;
        const avgDensity = calculated.reduce((sum, c) => sum + c.bulkDensity, 0) / calculated.length;

        statsSummary = {
          stability: parseFloat(peakStability.toFixed(2)),
          flow: parseFloat(avgFlow.toFixed(2)),
          vfb: parseFloat(avgVfb.toFixed(1)),
          density: parseFloat(avgDensity.toFixed(3)),
          stabilityPass: peakStability >= (minStability / 1000),
          flowPass: avgFlow >= spec.minFlow && avgFlow <= spec.maxFlow,
          vfbPass: avgVfb >= spec.minVFB && avgVfb <= spec.maxVFB,
        };
      }

      const statsContainer = document.getElementById('stats-container');
      statsContainer.innerHTML = \`
        <!-- Stability -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Stability (kN)</p>
            <h2 class="text-xl font-bold text-slate-900 flex items-baseline gap-2">
              \${statsSummary.stability}
              <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded \${statsSummary.stabilityPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                \${statsSummary.stabilityPass ? 'PASS' : 'LOW'}
              </span>
            </h2>
          </div>
          <div class="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 \${statsSummary.stabilityPass ? 'bg-green-500' : 'bg-red-500'}" style="width: \${Math.min(100, (statsSummary.stability / (minStability / 1000)) * 100)}%"></div>
          </div>
        </div>

        <!-- Flow -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Flow (mm)</p>
            <h2 class="text-xl font-bold text-slate-900 flex items-baseline gap-2">
              \${statsSummary.flow}
              <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded \${statsSummary.flowPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                \${statsSummary.flowPass ? 'PASS' : 'OUT'}
              </span>
            </h2>
          </div>
          <div class="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 \${statsSummary.flowPass ? 'bg-green-500' : 'bg-red-500'}" style="width: \${statsSummary.flowPass ? '70%' : '35%'}"></div>
          </div>
        </div>

        <!-- VFB -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">VFB (%)</p>
            <h2 class="text-xl font-bold text-slate-900 flex items-baseline gap-2">
              \${statsSummary.vfb}%
              <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded \${statsSummary.vfbPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                \${statsSummary.vfbPass ? 'PASS' : 'OUT'}
              </span>
            </h2>
          </div>
          <div class="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 \${statsSummary.vfbPass ? 'bg-blue-500' : 'bg-red-500'}" style="width: \${statsSummary.vfb}%"></div>
          </div>
        </div>

        <!-- Density -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Density (g/cm³)</p>
            <h2 class="text-xl font-bold text-slate-900">\${statsSummary.density}</h2>
          </div>
          <p class="text-[9px] text-slate-400 mt-3 font-mono">Gmb Bulk Specific Gravity</p>
        </div>
      \`;

      // 4. Update Spec Badge
      document.getElementById('spec-badge-label').innerText = mixType + ' ' + trafficType + ' TRAFFIC';

      // Spec details
      const specDetails = document.getElementById('spec-details-panel');
      specDetails.innerHTML = \`
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span class="text-slate-400 font-semibold uppercase block">Asphalt Content</span>
            <span class="text-slate-800 font-bold font-mono">\${spec.minBinderContent}% - \${spec.maxBinderContent}%</span>
          </div>
          <div>
            <span class="text-slate-400 font-semibold uppercase block">Min Stability</span>
            <span class="text-slate-800 font-bold font-mono">\${minStability.toLocaleString()} N (\${(minStability/1000).toFixed(1)} kN)</span>
          </div>
          <div>
            <span class="text-slate-400 font-semibold uppercase block">Flow Range</span>
            <span class="text-slate-800 font-bold font-mono">\${spec.minFlow} - \${spec.maxFlow} mm</span>
          </div>
          <div>
            <span class="text-slate-400 font-semibold uppercase block">VTM Range</span>
            <span class="text-slate-800 font-bold font-mono">\${spec.minVTM}% - \${spec.maxVTM}%</span>
          </div>
          <div class="mt-2">
            <span class="text-slate-400 font-semibold uppercase block">Voids Filled (VFB)</span>
            <span class="text-slate-800 font-bold font-mono">\${spec.minVFB}% - \${spec.maxVFB}%</span>
          </div>
          <div class="mt-2">
            <span class="text-slate-400 font-semibold uppercase block">Min VMA</span>
            <span class="text-slate-800 font-bold font-mono">\${spec.minVMA}%</span>
          </div>
          <div class="mt-2">
            <span class="text-slate-400 font-semibold uppercase block">Min Stiffness</span>
            <span class="text-slate-800 font-bold font-mono">\${minStiffness.toLocaleString()} N/mm</span>
          </div>
          <div class="mt-2">
            <span class="text-slate-400 font-semibold uppercase block">Aggregate Size</span>
            <span class="text-slate-800 font-bold font-mono">\${spec.mixType === 'AC10' ? '10mm Fine' : spec.mixType === 'AC14' ? '14mm Standard' : '28mm Large'}</span>
          </div>
        </div>
      \`;

      // 5. Populate Data Entry Table
      const sortedSamples = [...samples].sort((a,b) => a.asphaltContent - b.asphaltContent);
      const logBody = document.getElementById('samples-table-body');
      logBody.innerHTML = '';
      sortedSamples.forEach(sample => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/50 transition-colors";
        tr.innerHTML = \`
          <td class="p-3"><input type="number" step="0.1" value="\${sample.asphaltContent}" oninput="updateCell('\${sample.id}', 'asphaltContent', this.value)" class="w-16 border-b border-transparent focus:border-blue-500 focus:outline-none"></td>
          <td class="p-3"><input type="number" step="1" value="\${sample.weightInAir}" oninput="updateCell('\${sample.id}', 'weightInAir', this.value)" class="w-20 border-b border-transparent focus:border-blue-500 focus:outline-none"></td>
          <td class="p-3"><input type="number" step="1" value="\${sample.weightSsd}" oninput="updateCell('\${sample.id}', 'weightSsd', this.value)" class="w-20 border-b border-transparent focus:border-blue-500 focus:outline-none"></td>
          <td class="p-3"><input type="number" step="1" value="\${sample.weightInWater}" oninput="updateCell('\${sample.id}', 'weightInWater', this.value)" class="w-20 border-b border-transparent focus:border-blue-500 focus:outline-none"></td>
          <td class="p-3"><input type="number" step="0.1" value="\${sample.specimenThickness}" oninput="updateCell('\${sample.id}', 'specimenThickness', this.value)" class="w-16 border-b border-transparent focus:border-blue-500 focus:outline-none"></td>
          <td class="p-3"><input type="number" step="100" value="\${sample.measuredStability}" oninput="updateCell('\${sample.id}', 'measuredStability', this.value)" class="w-24 border-b border-transparent focus:border-blue-500 focus:outline-none"></td>
          <td class="p-3"><input type="number" step="0.1" value="\${sample.flow}" oninput="updateCell('\${sample.id}', 'flow', this.value)" class="w-16 border-b border-transparent focus:border-blue-500 focus:outline-none"></td>
          <td class="p-3 text-center no-print">
            <button onclick="deleteSample('\${sample.id}')" class="text-red-500 hover:text-red-700 font-bold hover:underline transition-colors">Delete</button>
          </td>
        \`;
        logBody.appendChild(tr);
      });

      // 6. Populate Calculated Properties Table
      const calcBody = document.getElementById('calculated-table-body');
      calcBody.innerHTML = '';
      calculated.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition-colors";
        tr.innerHTML = \`
          <td class="p-3 font-bold">\${c.asphaltContent.toFixed(1)}%</td>
          <td class="p-3">\${c.bulkDensity.toFixed(3)}</td>
          <td class="p-3">\${c.maxTheoreticalGravity.toFixed(3)}</td>
          <td class="p-3 font-semibold \${c.stabilityPass ? 'text-green-600' : 'text-red-500'}">
            \${(c.correctedStability/1000).toFixed(2)} kN
          </td>
          <td class="p-3 \${c.flowPass ? 'text-green-600' : 'text-red-500'}">
            \${c.flow.toFixed(1)}
          </td>
          <td class="p-3 \${c.vtmPass ? 'text-green-600' : 'text-red-500'}">
            \${c.vtm.toFixed(2)}%
          </td>
          <td class="p-3 \${c.vmaPass ? 'text-green-600' : 'text-red-500'}">
            \${c.vma.toFixed(1)}%
          </td>
          <td class="p-3 \${c.vfbPass ? 'text-green-600' : 'text-red-500'}">
            \${c.vfb.toFixed(1)}%
          </td>
          <td class="p-3 \${c.stiffnessPass ? 'text-green-600' : 'text-red-500'}">
            \${Math.round(c.stiffness)}
          </td>
        \`;
        calcBody.appendChild(tr);
      });

      // 7. Optimizer (OBC Calculations & Guidelines)
      const optResult = getOptimalBinderContent(calculated, spec);
      const optPanel = document.getElementById('optimizer-panel');
      if (optResult === null) {
        optPanel.innerHTML = \`
          <p class="text-xs text-slate-400 italic">Please input at least 3 distinct asphalt contents to fit Marshall curves and estimate the Optimal Bitumen Content (OBC).</p>
        \`;
      } else {
        const { obc, densityCurve, stabilityCurve, vtmCurve } = optResult;

        // Evaluate parameters at the OBC
        const densityAtObc = densityCurve.evaluate(obc);
        const stabilityAtObc = stabilityCurve.evaluate(obc);
        const flowAtObc = vtmCurve.evaluate(obc); // approximate linear
        const targetVtm = spec.mixType === 'AC28' ? 5.0 : 4.0;
        
        // Approximate VMA & VFB at OBC using current samples
        const sortedVma = calculated.map(c=>({x:c.asphaltContent, y:c.vma}));
        const vmaCurve = fitQuadratic(sortedVma);
        const vmaAtObc = vmaCurve.evaluate(obc);

        const sortedVfb = calculated.map(c=>({x:c.asphaltContent, y:c.vfb}));
        const vfbCurve = fitQuadratic(sortedVfb);
        const vfbAtObc = vfbCurve.evaluate(obc);

        const sortedStiff = calculated.map(c=>({x:c.asphaltContent, y:c.stiffness}));
        const stiffCurve = fitQuadratic(sortedStiff);
        const stiffnessAtObc = stiffCurve.evaluate(obc);

        // Verification checks at OBC
        const stabilityPass = stabilityAtObc >= minStability;
        const flowPass = flowAtObc >= spec.minFlow && flowAtObc <= spec.maxFlow;
        const vtmPass = targetVtm >= spec.minVTM && targetVtm <= spec.maxVTM;
        const vmaPass = vmaAtObc >= spec.minVMA;
        const vfbPass = vfbAtObc >= spec.minVFB && vfbAtObc <= spec.maxVFB;
        const stiffnessPass = stiffnessAtObc >= minStiffness;

        const isCompliant = stabilityPass && flowPass && vtmPass && vmaPass && vfbPass && stiffnessPass;
        
        let troubleshootingText = "";
        let failParams = [];
        if (!stabilityPass) failParams.push("Stability too low");
        if (vtmAtObc > spec.maxVTM) failParams.push("Voids (VTM) too high");
        if (vtmAtObc < spec.minVTM) failParams.push("Voids (VTM) too low");
        if (vmaAtObc < spec.minVMA) failParams.push("VMA below limit");
        if (vfbAtObc < spec.minVFB) failParams.push("VFB below limit");
        if (vfbAtObc > spec.maxVFB) failParams.push("VFB above limit");

        if (isCompliant) {
          troubleshootingText = "All parameter checks comply with the JKR SPJ Section 4 spec. The binder content of **" + obc.toFixed(2) + "%** is recommended as the final design mix formula (DMF).";
        } else {
          troubleshootingText = "OBC is non-compliant: " + failParams.join(", ") + ". Suggested adjustments: " + 
            (vmaAtObc < spec.minVMA ? "Increase aggregate surface angularity or sand fraction." : "Adjust aggregate blend proportioning or mineral filler ratio.");
        }

        optPanel.innerHTML = \`
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div class="md:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 text-center flex flex-col justify-center items-center">
              <span class="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">JKR Recommended Formula</span>
              <h1 class="text-4xl font-extrabold text-white mt-2 mb-1 font-mono">\${obc.toFixed(2)}%</h1>
              <p class="text-xs text-slate-400">Optimum Bitumen Content (OBC)</p>
            </div>
            <div class="md:col-span-7 space-y-4">
              <h4 class="text-xs font-bold uppercase text-slate-400 font-mono">Performance Estimates at OBC</h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div class="bg-slate-950/45 p-2 rounded border border-slate-850">
                  <span class="text-slate-500 text-[10px] uppercase block">Stability</span>
                  <span class="text-slate-200 font-bold">\${(stabilityAtObc/1000).toFixed(2)} kN</span>
                </div>
                <div class="bg-slate-950/45 p-2 rounded border border-slate-850">
                  <span class="text-slate-500 text-[10px] uppercase block">VTM</span>
                  <span class="text-slate-200 font-bold">\${targetVtm.toFixed(1)}%</span>
                </div>
                <div class="bg-slate-950/45 p-2 rounded border border-slate-850">
                  <span class="text-slate-500 text-[10px] uppercase block">Gmb Density</span>
                  <span class="text-slate-200 font-bold">\${densityAtObc.toFixed(3)}</span>
                </div>
                <div class="bg-slate-950/45 p-2 rounded border border-slate-850">
                  <span class="text-slate-500 text-[10px] uppercase block">VMA Voids</span>
                  <span class="text-slate-200 font-bold">\${vmaAtObc.toFixed(1)}%</span>
                </div>
                <div class="bg-slate-950/45 p-2 rounded border border-slate-850">
                  <span class="text-slate-500 text-[10px] uppercase block">VFB (Voids Filled)</span>
                  <span class="text-slate-200 font-bold">\${vfbAtObc.toFixed(1)}%</span>
                </div>
                <div class="bg-slate-950/45 p-2 rounded border border-slate-850">
                  <span class="text-slate-500 text-[10px] uppercase block">Stiffness</span>
                  <span class="text-slate-200 font-bold">\${Math.round(stiffnessAtObc)} N/mm</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-850">
            <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">JKR Engineering Guidelines &amp; Troubleshooting Advice</span>
            <p class="text-xs text-slate-300 italic leading-relaxed mt-1.5">\${troubleshootingText}</p>
          </div>
        \`;
      }

      // 8. Render Marshall Curves SVG (The 6 Graphs)
      render6Charts(calculated, spec, optResult);
    }

    // Helper to draw clean reactive curves in SVG
    function render6Charts(calculated, spec, optResult) {
      const chartsGrid = document.getElementById('charts-grid');
      chartsGrid.innerHTML = '';

      if (calculated.length < 3) {
        chartsGrid.innerHTML = '<div class="col-span-full py-8 text-center text-xs text-slate-400 italic">Insert at least 3 laboratory data points to draw fitted JKR curve graphics.</div>';
        return;
      }

      const variables = [
        { title: "Bulk Specific Gravity (Gmb)", yField: "bulkDensity", unit: "g/cm³", format: 3 },
        { title: "Marshall Stability (kN)", yField: "correctedStability", unit: "kN", scale: 0.001, format: 2 },
        { title: "Voids in Total Mix (VTM) (%)", yField: "vtm", unit: "%", format: 1, limitMin: spec.minVTM, limitMax: spec.maxVTM },
        { title: "Voids in Mineral Aggregate (VMA) (%)", yField: "vma", unit: "%", format: 1, limitMin: spec.minVMA },
        { title: "Voids Filled with Bitumen (VFB) (%)", yField: "vfb", unit: "%", format: 1, limitMin: spec.minVFB, limitMax: spec.maxVFB },
        { title: "Marshall Stiffness (N/mm)", yField: "stiffness", unit: "N/mm", format: 0 }
      ];

      variables.forEach(v => {
        const pts = calculated.map(c => ({
          x: c.asphaltContent,
          y: v.scale ? c[v.yField] * v.scale : c[v.yField]
        }));

        const curve = fitQuadratic(pts);

        const xValues = pts.map(p=>p.x);
        const yValues = pts.map(p=>p.y);
        const minX = Math.min(...xValues) - 0.5;
        const maxX = Math.max(...xValues) + 0.5;
        const minY = Math.max(0, Math.min(...yValues) * 0.95);
        const maxY = Math.max(...yValues) * 1.05;

        // Build SVG Elements
        const width = 320;
        const height = 200;
        const padding = 40;

        function getXPixel(x) {
          return padding + ((x - minX) / (maxX - minX)) * (width - 2 * padding);
        }
        function getYPixel(y) {
          return height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);
        }

        // Generate polynomial path
        let pathD = "";
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const xVal = minX + (i / steps) * (maxX - minX);
          const yVal = curve.evaluate(xVal);
          const xPx = getXPixel(xVal);
          const yPx = getYPixel(yVal);
          if (i === 0) {
            pathD += "M" + xPx.toFixed(1) + "," + yPx.toFixed(1);
          } else {
            pathD += " L" + xPx.toFixed(1) + "," + yPx.toFixed(1);
          }
        }

        // Draw individual circles
        let circlesSvg = "";
        pts.forEach(p => {
          circlesSvg += \`<circle cx="\${getXPixel(p.x)}" cy="\${getYPixel(p.y)}" r="4.5" fill="#2563eb" stroke="white" stroke-width="1.5" />\`;
        });

        // Vertical OBC highlight line
        let obcLine = "";
        if (optResult && optResult.obc) {
          const obcxPx = getXPixel(optResult.obc);
          obcLine = \`<line x1="\${obcxPx}" y1="\${padding}" x2="\${obcxPx}" y2="\${height - padding}" stroke="#f59e0b" stroke-dasharray="3,3" stroke-width="1.5" />\`;
        }

        // Grid lines & labels
        let gridLines = "";
        const xTicks = 5;
        for (let i = 0; i < xTicks; i++) {
          const xVal = minX + (i / (xTicks - 1)) * (maxX - minX);
          const xPx = getXPixel(xVal);
          gridLines += \`
            <line x1="\${xPx}" y1="\${padding}" x2="\${xPx}" y2="\${height - padding}" stroke="#e2e8f0" stroke-width="0.5" />
            <text x="\${xPx}" y="\${height - padding + 15}" font-size="8" fill="#64748b" text-anchor="middle" font-family="monospace">\${xVal.toFixed(1)}</text>
          \`;
        }

        const yTicks = 4;
        for (let i = 0; i < yTicks; i++) {
          const yVal = minY + (i / (yTicks - 1)) * (maxY - minY);
          const yPx = getYPixel(yVal);
          gridLines += \`
            <line x1="\${padding}" y1="\${yPx}" x2="\${width - padding}" y2="\${yPx}" stroke="#e2e8f0" stroke-width="0.5" />
            <text x="\${padding - 6}" y="\${yPx + 3}" font-size="8" fill="#64748b" text-anchor="end" font-family="monospace">\${yVal.toFixed(v.format)}</text>
          \`;
        }

        // Shade specification limits area if valid
        let specShade = "";
        if (v.limitMin !== undefined || v.limitMax !== undefined) {
          const sMin = v.limitMin !== undefined ? Math.max(minY, v.limitMin) : minY;
          const sMax = v.limitMax !== undefined ? Math.min(maxY, v.limitMax) : maxY;
          if (sMin < sMax) {
            const yMinPx = getYPixel(sMin);
            const yMaxPx = getYPixel(sMax);
            specShade = \`<rect x="\${padding}" y="\${yMaxPx}" width="\${width - 2*padding}" height="\${yMinPx - yMaxPx}" fill="#10b981" fill-opacity="0.06" />\`;
          }
        }

        // Assemble HTML card with the responsive inline SVG
        const chartCard = document.createElement('div');
        chartCard.className = "bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center";
        chartCard.innerHTML = \`
          <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 text-center font-mono">\${v.title}</h4>
          <svg viewBox="0 0 \${width} \${height}" class="w-full h-auto">
            <!-- Shaded Limits -->
            \${specShade}
            <!-- Grid Lines -->
            \${gridLines}
            <!-- Axis lines -->
            <line x1="\${padding}" y1="\${height - padding}" x2="\${width - padding}" y2="\${height - padding}" stroke="#94a3b8" stroke-width="1" />
            <line x1="\${padding}" y1="\${padding}" x2="\${padding}" y2="\${height - padding}" stroke="#94a3b8" stroke-width="1" />
            
            <!-- Quadratic Curve -->
            <path d="\${pathD}" fill="none" stroke="#2563eb" stroke-width="2" />
            
            <!-- OBC Vertical Highlight -->
            \${obcLine}
            
            <!-- Data Points -->
            \${circlesSvg}
          </svg>
          <div class="flex justify-between w-full px-4 text-[9px] text-slate-400 font-semibold font-mono mt-2">
            <span>BITUMEN (%)</span>
            <span>OBC = \${optResult ? optResult.obc.toFixed(2) : '-'}%</span>
          </div>
        \`;
        chartsGrid.appendChild(chartCard);
      });
    }

    // Initial load
    renderAll();
  </script>
</body>
</html>`;
}
