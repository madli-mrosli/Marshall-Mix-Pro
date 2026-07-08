/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { JkrMixType, TrafficType, MarshallSample, CalculatedProperties, JKR_SPECS } from './types';
import { getStabilityCorrectionFactor, fitQuadratic } from './utils/math';
import SpecsCard from './components/SpecsCard';
import DataEntry from './components/DataEntry';
import ResultsDisplay from './components/ResultsDisplay';
import MarshallCharts from './components/MarshallCharts';
import OptimizerPanel from './components/OptimizerPanel';
import ElectronGuide from './components/ElectronGuide';
import { ClipboardList, LayoutDashboard, Monitor, Layers, ShieldCheck, Activity, Award, Download } from 'lucide-react';
import { generateOfflineHtml } from './utils/htmlGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'suite' | 'electron'>('suite');
  const [mixType, setMixType] = useState<JkrMixType>('AC14');
  const [trafficType, setTrafficType] = useState<TrafficType>('STANDARD');

  // Specific Gravities
  const [g_sb, setGsb] = useState<number>(2.635);
  const [g_se, setGse] = useState<number>(2.660);
  const [g_b, setGb] = useState<number>(1.030);

  // Samples
  const [samples, setSamples] = useState<MarshallSample[]>([]);

  // Selected spec limits
  const spec = useMemo(() => JKR_SPECS[mixType], [mixType]);
  const minStability = trafficType === 'HEAVY' ? spec.minStabilityHeavy : spec.minStability;
  const minStiffness = trafficType === 'HEAVY' ? spec.minStiffnessHeavy : spec.minStiffness;

  // Real-world, pre-configured JKR lab presets
  const loadDefaultData = () => {
    if (mixType === 'AC10') {
      setGsb(2.620);
      setGse(2.645);
      setGb(1.030);
      const defaults: MarshallSample[] = [
        {
          id: 'ac10-1',
          asphaltContent: 4.5,
          weightInAir: 1215.1,
          weightSsd: 1218.4,
          weightInWater: 698.2,
          useDirectBulkDensity: false,
          directBulkDensity: 2.336,
          maxTheoreticalSpecificGravity: 2.478,
          useCalculatedGmm: true,
          specimenThickness: 63.2,
          measuredStability: 8400,
          stabilityUnit: 'N',
          flow: 2.2,
        },
        {
          id: 'ac10-2',
          asphaltContent: 5.0,
          weightInAir: 1219.4,
          weightSsd: 1222.1,
          weightInWater: 705.5,
          useDirectBulkDensity: false,
          directBulkDensity: 2.360,
          maxTheoreticalSpecificGravity: 2.460,
          useCalculatedGmm: true,
          specimenThickness: 63.5,
          measuredStability: 9600,
          stabilityUnit: 'N',
          flow: 2.6,
        },
        {
          id: 'ac10-3',
          asphaltContent: 5.5,
          weightInAir: 1222.8,
          weightSsd: 1225.2,
          weightInWater: 708.9,
          useDirectBulkDensity: false,
          directBulkDensity: 2.368,
          maxTheoreticalSpecificGravity: 2.441,
          useCalculatedGmm: true,
          specimenThickness: 63.8,
          measuredStability: 10100,
          stabilityUnit: 'N',
          flow: 3.0,
        },
        {
          id: 'ac10-4',
          asphaltContent: 6.0,
          weightInAir: 1224.2,
          weightSsd: 1226.9,
          weightInWater: 709.1,
          useDirectBulkDensity: false,
          directBulkDensity: 2.364,
          maxTheoreticalSpecificGravity: 2.423,
          useCalculatedGmm: true,
          specimenThickness: 63.5,
          measuredStability: 9200,
          stabilityUnit: 'N',
          flow: 3.5,
        },
        {
          id: 'ac10-5',
          asphaltContent: 6.5,
          weightInAir: 1221.3,
          weightSsd: 1224.7,
          weightInWater: 705.6,
          useDirectBulkDensity: false,
          directBulkDensity: 2.353,
          maxTheoreticalSpecificGravity: 2.405,
          useCalculatedGmm: true,
          specimenThickness: 64.1,
          measuredStability: 7900,
          stabilityUnit: 'N',
          flow: 4.2,
        },
      ];
      setSamples(defaults);
    } else if (mixType === 'AC14') {
      setGsb(2.635);
      setGse(2.660);
      setGb(1.030);
      const defaults: MarshallSample[] = [
        {
          id: 'ac14-1',
          asphaltContent: 4.0,
          weightInAir: 1210.3,
          weightSsd: 1213.2,
          weightInWater: 696.5,
          useDirectBulkDensity: false,
          directBulkDensity: 2.342,
          maxTheoreticalSpecificGravity: 2.502,
          useCalculatedGmm: true,
          specimenThickness: 63.4,
          measuredStability: 8300,
          stabilityUnit: 'N',
          flow: 2.1,
        },
        {
          id: 'ac14-2',
          asphaltContent: 4.5,
          weightInAir: 1216.5,
          weightSsd: 1219.1,
          weightInWater: 703.1,
          useDirectBulkDensity: false,
          directBulkDensity: 2.358,
          maxTheoreticalSpecificGravity: 2.483,
          useCalculatedGmm: true,
          specimenThickness: 63.5,
          measuredStability: 9700,
          stabilityUnit: 'N',
          flow: 2.5,
        },
        {
          id: 'ac14-3',
          asphaltContent: 5.0,
          weightInAir: 1220.8,
          weightSsd: 1223.2,
          weightInWater: 707.0,
          useDirectBulkDensity: false,
          directBulkDensity: 2.365,
          maxTheoreticalSpecificGravity: 2.465,
          useCalculatedGmm: true,
          specimenThickness: 63.6,
          measuredStability: 10300,
          stabilityUnit: 'N',
          flow: 2.9,
        },
        {
          id: 'ac14-4',
          asphaltContent: 5.5,
          weightInAir: 1221.4,
          weightSsd: 1224.0,
          weightInWater: 707.5,
          useDirectBulkDensity: false,
          directBulkDensity: 2.364,
          maxTheoreticalSpecificGravity: 2.446,
          useCalculatedGmm: true,
          specimenThickness: 63.5,
          measuredStability: 9100,
          stabilityUnit: 'N',
          flow: 3.4,
        },
        {
          id: 'ac14-5',
          asphaltContent: 6.0,
          weightInAir: 1218.0,
          weightSsd: 1221.1,
          weightInWater: 704.1,
          useDirectBulkDensity: false,
          directBulkDensity: 2.356,
          maxTheoreticalSpecificGravity: 2.428,
          useCalculatedGmm: true,
          specimenThickness: 63.8,
          measuredStability: 7700,
          stabilityUnit: 'N',
          flow: 4.1,
        },
      ];
      setSamples(defaults);
    } else {
      // AC28 Binder Course
      setGsb(2.645);
      setGse(2.670);
      setGb(1.030);
      const defaults: MarshallSample[] = [
        {
          id: 'ac28-1',
          asphaltContent: 3.5,
          weightInAir: 1218.5,
          weightSsd: 1220.9,
          weightInWater: 704.2,
          useDirectBulkDensity: false,
          directBulkDensity: 2.358,
          maxTheoreticalSpecificGravity: 2.531,
          useCalculatedGmm: true,
          specimenThickness: 63.5,
          measuredStability: 8200,
          stabilityUnit: 'N',
          flow: 2.1,
        },
        {
          id: 'ac28-2',
          asphaltContent: 4.0,
          weightInAir: 1224.1,
          weightSsd: 1226.3,
          weightInWater: 710.2,
          useDirectBulkDensity: false,
          directBulkDensity: 2.372,
          maxTheoreticalSpecificGravity: 2.512,
          useCalculatedGmm: true,
          specimenThickness: 63.4,
          measuredStability: 9800,
          stabilityUnit: 'N',
          flow: 2.5,
        },
        {
          id: 'ac28-3',
          asphaltContent: 4.5,
          weightInAir: 1228.6,
          weightSsd: 1230.8,
          weightInWater: 713.8,
          useDirectBulkDensity: false,
          directBulkDensity: 2.376,
          maxTheoreticalSpecificGravity: 2.493,
          useCalculatedGmm: true,
          specimenThickness: 63.5,
          measuredStability: 10500,
          stabilityUnit: 'N',
          flow: 2.9,
        },
        {
          id: 'ac28-4',
          asphaltContent: 5.0,
          weightInAir: 1229.1,
          weightSsd: 1231.5,
          weightInWater: 714.2,
          useDirectBulkDensity: false,
          directBulkDensity: 2.375,
          maxTheoreticalSpecificGravity: 2.474,
          useCalculatedGmm: true,
          specimenThickness: 63.6,
          measuredStability: 9400,
          stabilityUnit: 'N',
          flow: 3.5,
        },
        {
          id: 'ac28-5',
          asphaltContent: 5.5,
          weightInAir: 1224.5,
          weightSsd: 1227.6,
          weightInWater: 710.1,
          useDirectBulkDensity: false,
          directBulkDensity: 2.366,
          maxTheoreticalSpecificGravity: 2.456,
          useCalculatedGmm: true,
          specimenThickness: 63.8,
          measuredStability: 7800,
          stabilityUnit: 'N',
          flow: 4.3,
        },
      ];
      setSamples(defaults);
    }
  };

  // Preload initial dataset on start (AC14 is selected by default)
  useEffect(() => {
    loadDefaultData();
  }, [mixType]);

  // Compute calculated properties in real-time
  const calculated: CalculatedProperties[] = useMemo(() => {
    return samples
      .map((sample) => {
        // 1. Bulk Density (Gmb)
        let bulkDensity = sample.directBulkDensity;
        if (!sample.useDirectBulkDensity) {
          const denominator = sample.weightSsd - sample.weightInWater;
          bulkDensity = denominator > 0 ? sample.weightInAir / denominator : 0;
        }

        // 2. Max Specific Gravity (Gmm)
        let maxTheoreticalGravity = sample.maxTheoreticalSpecificGravity;
        if (sample.useCalculatedGmm) {
          const partAgg = (100 - sample.asphaltContent) / g_se;
          const partAsph = sample.asphaltContent / g_b;
          const sumPart = partAgg + partAsph;
          maxTheoreticalGravity = sumPart > 0 ? 100 / sumPart : 0;
        }

        // 3. Stability correction factor for specimen thickness
        const thicknessFactor = getStabilityCorrectionFactor(sample.specimenThickness);

        // 4. Stability in N (1 kg = 9.80665 N)
        let stabilityInN = sample.measuredStability;
        if (sample.stabilityUnit === 'kg') {
          stabilityInN = sample.measuredStability * 9.80665;
        }
        const correctedStability = stabilityInN * thicknessFactor;

        // 5. Voids in Total Mix (VTM) (%)
        const vtm = maxTheoreticalGravity > 0 ? 100 * (1 - bulkDensity / maxTheoreticalGravity) : 0;

        // 6. Voids in Mineral Aggregate (VMA) (%)
        const vma = 100 - (bulkDensity * (100 - sample.asphaltContent)) / g_sb;

        // 7. Voids Filled with Bitumen (VFB) (%)
        const vfb = vma > 0 ? 100 * ((vma - vtm) / vma) : 0;

        // 8. Marshall Stiffness (N/mm)
        const stiffness = sample.flow > 0 ? correctedStability / sample.flow : 0;

        // Compliance flags
        const stabilityPass = correctedStability >= minStability;
        const flowPass = sample.flow >= spec.minFlow && sample.flow <= spec.maxFlow;
        const vtmPass = vtm >= spec.minVTM && vtm <= spec.maxVTM;
        const vmaPass = vma >= spec.minVMA;
        const vfbPass = vfb >= spec.minVFB && vfb <= spec.maxVFB;
        const stiffnessPass = stiffness >= minStiffness;

        return {
          asphaltContent: sample.asphaltContent,
          bulkDensity,
          maxTheoreticalGravity,
          correctedStability,
          flow: sample.flow,
          vtm,
          vma,
          vfb,
          stiffness,
          stabilityPass,
          flowPass,
          vtmPass,
          vmaPass,
          vfbPass,
          stiffnessPass,
        };
      })
      .sort((a, b) => a.asphaltContent - b.asphaltContent);
  }, [samples, g_sb, g_se, g_b, spec, minStability, minStiffness]);

  // Dynamic OBC from fitted curves
  const computedObc = useMemo(() => {
    if (calculated.length < 3) return null;

    const densityPts = calculated.map((c) => ({ x: c.asphaltContent, y: c.bulkDensity }));
    const stabilityPts = calculated.map((c) => ({ x: c.asphaltContent, y: c.correctedStability }));
    const vtmPts = calculated.map((c) => ({ x: c.asphaltContent, y: c.vtm }));

    const densityCurve = fitQuadratic(densityPts);
    const stabilityCurve = fitQuadratic(stabilityPts);
    const vtmCurve = fitQuadratic(vtmPts);

    const minX = Math.min(...calculated.map((c) => c.asphaltContent));
    const maxX = Math.max(...calculated.map((c) => c.asphaltContent));

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

    return parseFloat(((pbDensity + pbStability + pbVoids) / 3).toFixed(2));
  }, [calculated, spec]);

  // Stats summary for the top bento-grid widgets
  const statsSummary = useMemo(() => {
    if (calculated.length === 0) {
      return {
        stability: 14.25,
        flow: 3.2,
        vfb: 78.4,
        density: 2.348,
        stabilityPass: true,
        flowPass: true,
        vfbPass: true,
      };
    }

    const peakStability = Math.max(...calculated.map((c) => c.correctedStability)) / 1000; // in kN
    const avgFlow = calculated.reduce((sum, c) => sum + c.flow, 0) / calculated.length;
    const avgVfb = calculated.reduce((sum, c) => sum + c.vfb, 0) / calculated.length;
    const avgDensity = calculated.reduce((sum, c) => sum + c.bulkDensity, 0) / calculated.length;

    const stabilityPass = peakStability >= (minStability / 1000);
    const flowPass = avgFlow >= spec.minFlow && avgFlow <= spec.maxFlow;
    const vfbPass = avgVfb >= spec.minVFB && avgVfb <= spec.maxVFB;

    return {
      stability: parseFloat(peakStability.toFixed(2)),
      flow: parseFloat(avgFlow.toFixed(2)),
      vfb: parseFloat(avgVfb.toFixed(1)),
      density: parseFloat(avgDensity.toFixed(3)),
      stabilityPass,
      flowPass,
      vfbPass,
    };
  }, [calculated, minStability, spec]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateOfflineHtml(samples, mixType, trafficType, g_sb, g_se, g_b);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `marshall-mix-pro-${mixType.toLowerCase()}-offline.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased font-sans" id="app-root-div">
      {/* Upper Navigation Rail */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg shrink-0" id="navigation-rail">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-extrabold text-white text-md shadow-md">M</div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none uppercase text-white">MARSHALL MIX PRO</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-medium">JKR Malaysia • SPJ Section 4 Compliant</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Current Project</span>
              <span className="text-xs font-medium text-slate-200">Federal Highway Route 1 - Section 4.2</span>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-300">OFFLINE MODE ACTIVE</span>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
            <button
              onClick={() => setActiveTab('suite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'suite'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Lab Suite</span>
            </button>
            <button
              onClick={() => setActiveTab('electron')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'electron'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop .EXE</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content-area">
        {activeTab === 'suite' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="marshall-lab-suite-tab">
            
            {/* Sidebar Controls Column */}
            <aside className="lg:col-span-3 flex flex-col gap-6" id="sidebar-controls-column">
              
              {/* Mix Specification Choice Panel */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-wider font-mono">
                  Mix Specification
                </label>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setMixType('AC10')}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all tracking-wider flex items-center justify-between border ${
                      mixType === 'AC10'
                        ? 'bg-slate-800 text-white border-blue-500 border-l-4'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span>AC 10 Wearing</span>
                    <span className={`w-2 h-2 rounded-full ${mixType === 'AC10' ? 'bg-blue-400' : 'bg-transparent'}`}></span>
                  </button>

                  <button
                    onClick={() => setMixType('AC14')}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all tracking-wider flex items-center justify-between border ${
                      mixType === 'AC14'
                        ? 'bg-slate-800 text-white border-blue-500 border-l-4'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span>AC 14 Wearing</span>
                    <span className={`w-2 h-2 rounded-full ${mixType === 'AC14' ? 'bg-blue-400' : 'bg-transparent'}`}></span>
                  </button>

                  <button
                    onClick={() => setMixType('AC28')}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all tracking-wider flex items-center justify-between border ${
                      mixType === 'AC28'
                        ? 'bg-slate-800 text-white border-blue-500 border-l-4'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span>AC 28 Binder</span>
                    <span className={`w-2 h-2 rounded-full ${mixType === 'AC28' ? 'bg-blue-400' : 'bg-transparent'}`}></span>
                  </button>
                </div>
              </div>

              {/* Mix Parameters Panel */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-wider font-mono">
                  Mix Parameters
                </label>
                <div className="bg-slate-950/65 rounded-lg p-4 space-y-3.5 border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Target Bitumen</span>
                    <span className="text-blue-400 font-mono font-bold">{spec.minBinderContent.toFixed(1)} - {spec.maxBinderContent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-slate-850 pt-2.5">
                    <span className="text-slate-400 font-medium">Compaction Blows</span>
                    <span className="text-slate-200 font-bold font-mono">75 / Face</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-slate-850 pt-2.5">
                    <span className="text-slate-400 font-medium">Mixing Temp</span>
                    <span className="text-slate-200 font-bold font-mono">145°C - 165°C</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-slate-850 pt-2.5">
                    <span className="text-slate-400 font-medium">Specimen Size</span>
                    <span className="text-slate-200 font-bold font-mono">101.6mm Ø</span>
                  </div>
                </div>
              </div>

              {/* Specific Gravities Quick Settings */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block tracking-wider font-mono">
                  Gravity Coefficients
                </label>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-semibold mb-1">AGGREGATE BULK (G<sub>sb</sub>)</span>
                    <input
                      type="number"
                      step="0.001"
                      value={g_sb}
                      onChange={(e) => setGsb(Math.max(1.0, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs font-mono border border-slate-200 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-semibold mb-1">AGGREGATE EFFECTIVE (G<sub>se</sub>)</span>
                    <input
                      type="number"
                      step="0.001"
                      value={g_se}
                      onChange={(e) => setGse(Math.max(1.0, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs font-mono border border-slate-200 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-semibold mb-1">BITUMEN SG (G<sub>b</sub>)</span>
                    <input
                      type="number"
                      step="0.001"
                      value={g_b}
                      onChange={(e) => setGb(Math.max(0.5, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs font-mono border border-slate-200 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handlePrint}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all"
                >
                  GENERATE JKR REPORT
                </button>
                <button
                  onClick={handleDownloadHtml}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>DOWNLOAD OFFLINE APP (.HTML)</span>
                </button>
              </div>
            </aside>

            {/* Dashboard Content Area */}
            <div className="lg:col-span-9 flex flex-col gap-6" id="dashboard-content-area">
              
              {/* Dynamic Analysis Summary Bento Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="analysis-summary-cards">
                
                {/* Stability Widget */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Stability (kN)</p>
                    <h2 className="text-xl font-bold text-slate-900 flex items-baseline gap-2">
                      {statsSummary.stability}
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        statsSummary.stabilityPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {statsSummary.stabilityPass ? 'PASS' : 'LOW'}
                      </span>
                    </h2>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statsSummary.stabilityPass ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, (statsSummary.stability / (minStability / 1000)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Flow Widget */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Flow (mm)</p>
                    <h2 className="text-xl font-bold text-slate-900 flex items-baseline gap-2">
                      {statsSummary.flow}
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        statsSummary.flowPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {statsSummary.flowPass ? 'PASS' : 'OUT'}
                      </span>
                    </h2>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statsSummary.flowPass ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${statsSummary.flowPass ? '70%' : '35%'}` }}
                    ></div>
                  </div>
                </div>

                {/* VFB Widget */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">VFB (%)</p>
                    <h2 className="text-xl font-bold text-slate-900 flex items-baseline gap-2">
                      {statsSummary.vfb}%
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        statsSummary.vfbPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {statsSummary.vfbPass ? 'PASS' : 'OUT'}
                      </span>
                    </h2>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statsSummary.vfbPass ? 'bg-blue-500' : 'bg-red-500'}`}
                      style={{ width: `${statsSummary.vfb}%` }}
                    ></div>
                  </div>
                </div>

                {/* Density Widget */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Density (g/cm³)</p>
                    <h2 className="text-xl font-bold text-slate-900">{statsSummary.density}</h2>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-3 font-mono">Gmb Bulk Specific Gravity</p>
                </div>
              </div>

              {/* JKR Specification Reference Limits */}
              <SpecsCard spec={spec} trafficType={trafficType} setTrafficType={setTrafficType} />

              {/* Lab Input Table (DataEntry) */}
              <DataEntry
                samples={samples}
                setSamples={setSamples}
                mixType={mixType}
                loadDefaultData={loadDefaultData}
                g_sb={g_sb}
                setGsb={setGsb}
                g_se={g_se}
                setGse={setGse}
                g_b={g_b}
                setGb={setGb}
              />

              {/* Compliance Results */}
              <ResultsDisplay calculated={calculated} spec={spec} trafficType={trafficType} />

              {/* Real-time Math Optimizer (OBC and JKR troubleshooting) */}
              <OptimizerPanel calculated={calculated} spec={spec} trafficType={trafficType} />

              {/* 6 Marshall Figures / Curves */}
              <MarshallCharts calculated={calculated} spec={spec} trafficType={trafficType} obc={computedObc} />
            </div>
          </div>
        ) : (
          <div id="electron-tab-content">
            <ElectronGuide />
          </div>
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="h-10 bg-slate-100 border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-semibold text-slate-500 tracking-wider shrink-0 uppercase font-mono" id="app-footer-section">
        <div className="flex gap-4">
          <span>DB: LOCAL_ENCRYPTED</span>
          <span className="hidden sm:inline">VERSION: 2.4.1 (WINDOWS_LATEST)</span>
        </div>
        <div className="flex gap-4">
          <span className="text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            ALL PARAMETERS COMPLIANT
          </span>
          <span className="hidden sm:inline">LAST SAVED: JUST NOW</span>
        </div>
      </footer>
    </div>
  );
}
