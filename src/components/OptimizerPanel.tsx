/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { CalculatedProperties, JkrSpecification, TrafficType } from '../types';
import { fitQuadratic } from '../utils/math';
import { Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Settings, Activity } from 'lucide-react';

interface OptimizerPanelProps {
  calculated: CalculatedProperties[];
  spec: JkrSpecification;
  trafficType: TrafficType;
}

export default function OptimizerPanel({ calculated, spec, trafficType }: OptimizerPanelProps) {
  const minStability = trafficType === 'HEAVY' ? spec.minStabilityHeavy : spec.minStability;
  const minStiffness = trafficType === 'HEAVY' ? spec.minStiffnessHeavy : spec.minStiffness;

  // Fit curves
  const densityPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.bulkDensity })), [calculated]);
  const stabilityPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.correctedStability })), [calculated]);
  const flowPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.flow })), [calculated]);
  const vtmPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.vtm })), [calculated]);
  const vfbPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.vfb })), [calculated]);
  const vmaPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.vma })), [calculated]);

  const densityCurve = useMemo(() => fitQuadratic(densityPoints), [densityPoints]);
  const stabilityCurve = useMemo(() => fitQuadratic(stabilityPoints), [stabilityPoints]);
  const flowCurve = useMemo(() => fitQuadratic(flowPoints), [flowPoints]);
  const vtmCurve = useMemo(() => fitQuadratic(vtmPoints), [vtmPoints]);
  const vfbCurve = useMemo(() => fitQuadratic(vfbPoints), [vfbPoints]);
  const vmaCurve = useMemo(() => fitQuadratic(vmaPoints), [vmaPoints]);

  const minX = useMemo(() => {
    if (calculated.length === 0) return 3.0;
    return Math.min(...calculated.map((c) => c.asphaltContent));
  }, [calculated]);

  const maxX = useMemo(() => {
    if (calculated.length === 0) return 7.0;
    return Math.max(...calculated.map((c) => c.asphaltContent));
  }, [calculated]);

  // JKR OBC solver:
  // 1. Binder at maximum bulk density (Pb_density)
  // 2. Binder at maximum stability (Pb_stability)
  // 3. Binder at midpoint VTM (Pb_voids)
  const obcSolve = useMemo(() => {
    if (calculated.length < 3) return null;

    // 1. Pb_density
    let pbDensity = densityCurve.findPeakX();
    if (pbDensity === null || pbDensity < minX || pbDensity > maxX) {
      // fallback
      const maxPt = densityPoints.reduce((prev, curr) => (prev.y > curr.y ? prev : curr));
      pbDensity = maxPt.x;
    }

    // 2. Pb_stability
    let pbStability = stabilityCurve.findPeakX();
    if (pbStability === null || pbStability < minX || pbStability > maxX) {
      // fallback
      const maxPt = stabilityPoints.reduce((prev, curr) => (prev.y > curr.y ? prev : curr));
      pbStability = maxPt.x;
    }

    // 3. Pb_voids (midpoint of VTM: e.g. midpoint of 3.0 - 5.0 is 4.0% for wearing courses. AC28 midpoint is 5.0%)
    const targetVtm = spec.mixType === 'AC28' ? 5.0 : 4.0;
    let pbVoids = vtmCurve.findXForY(targetVtm, minX, maxX);
    if (pbVoids === null) {
      pbVoids = (minX + maxX) / 2;
    }

    const calculatedObc = parseFloat(((pbDensity + pbStability + pbVoids) / 3).toFixed(2));

    // Calculate parameters at OBC
    const densityAtObc = densityCurve.evaluate(calculatedObc);
    const stabilityAtObc = stabilityCurve.evaluate(calculatedObc);
    const flowAtObc = flowCurve.evaluate(calculatedObc);
    const vtmAtObc = vtmCurve.evaluate(calculatedObc);
    const vfbAtObc = vfbCurve.evaluate(calculatedObc);
    const vmaAtObc = vmaCurve.evaluate(calculatedObc);
    const stiffnessAtObc = flowAtObc > 0 ? stabilityAtObc / flowAtObc : 0;

    // Evaluate compliance
    const stabilityPass = stabilityAtObc >= minStability;
    const flowPass = flowAtObc >= spec.minFlow && flowAtObc <= spec.maxFlow;
    const vtmPass = vtmAtObc >= spec.minVTM && vtmAtObc <= spec.maxVTM;
    const vfbPass = vfbAtObc >= spec.minVFB && vfbAtObc <= spec.maxVFB;
    const vmaPass = vmaAtObc >= spec.minVMA;
    const stiffnessPass = stiffnessAtObc >= minStiffness;
    const binderContentPass = calculatedObc >= spec.minBinderContent && calculatedObc <= spec.maxBinderContent;

    const failingParams: string[] = [];
    if (!stabilityPass) failingParams.push('Marshall Stability');
    if (!flowPass) failingParams.push('Marshall Flow');
    if (!vtmPass) failingParams.push('Air Voids (VTM)');
    if (!vfbPass) failingParams.push('Voids Filled w/ Bitumen (VFB)');
    if (!vmaPass) failingParams.push('Voids in Mineral Aggregate (VMA)');
    if (!stiffnessPass) failingParams.push('Stiffness Ratio (Stability/Flow)');
    if (!binderContentPass) failingParams.push('JKR Target Binder Content Range');

    const isCompliant = failingParams.length === 0;

    return {
      obc: calculatedObc,
      pbDensity,
      pbStability,
      pbVoids,
      densityAtObc,
      stabilityAtObc,
      flowAtObc,
      vtmAtObc,
      vfbAtObc,
      vmaAtObc,
      stiffnessAtObc,
      isCompliant,
      failingParams,
    };
  }, [calculated, spec, trafficType, densityCurve, stabilityCurve, flowCurve, vtmCurve, vfbCurve, vmaCurve, minX, maxX, minStability, minStiffness]);

  if (calculated.length < 3) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed p-6 text-center text-slate-500" id="optimizer-empty-state">
        <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
        <h4 className="font-semibold text-slate-700">Dynamic Optimizer Locked</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Input at least 3 distinct asphalt contents to fit Marshall polynomial curves and calculate the Optimum Binder Content (OBC).
        </p>
      </div>
    );
  }

  const solver = obcSolve!;

  return (
    <div className="space-y-6" id="optimizer-panel-container">
      {/* 1. Optimum Binder Content Summary */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-md p-6 border border-slate-700/50" id="obc-calculator-card">
        <div className="flex items-center justify-between mb-4" id="obc-header">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold tracking-tight">OBC Solver JKR SPJ 2008</h3>
          </div>
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Malaysian Highway Standards
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main big display */}
          <div className="lg:col-span-5 bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 text-center flex flex-col justify-center h-full">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Optimum Binder Content (OBC)</span>
            <div className="mt-2 text-4xl lg:text-5xl font-extrabold text-blue-400 tracking-tight font-mono">
              {solver.obc.toFixed(2)}%
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Target JKR {spec.mixType} spec limits: <span className="text-white font-semibold">{spec.minBinderContent}% - {spec.maxBinderContent}%</span>
            </p>
            <div className="mt-3 flex justify-center">
              {solver.isCompliant ? (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fully JKR Compliant
                </span>
              ) : (
                <span className="bg-red-500/10 text-red-400 border border-red-500/30 rounded-full px-3 py-1 text-[11px] font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Fails JKR Criteria
                </span>
              )}
            </div>
          </div>

          {/* Mathematical derivation split */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">OBC Tri-Parameter Calculation:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-mono">1. Max Density Peak</span>
                <span className="text-base font-bold text-white font-mono">{solver.pbDensity.toFixed(2)}%</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Asphalt at Gmb Max</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-mono">2. Max Stability Peak</span>
                <span className="text-base font-bold text-white font-mono">{solver.pbStability.toFixed(2)}%</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Asphalt at Peak Stability</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-mono">3. Median Air Voids</span>
                <span className="text-base font-bold text-white font-mono">{solver.pbVoids.toFixed(2)}%</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Asphalt at {spec.mixType === 'AC28' ? '5.0%' : '4.0%'} VTM</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950/20 border border-slate-800/60 rounded-lg p-3 font-mono leading-relaxed">
              <span className="text-slate-300 font-bold block mb-1">Formula Applied:</span>
              OBC = (Pb_density + Pb_stability + Pb_voids) / 3 <br/>
              OBC = ({solver.pbDensity.toFixed(2)}% + {solver.pbStability.toFixed(2)}% + {solver.pbVoids.toFixed(2)}%) / 3 = <span className="text-blue-400 font-bold">{solver.obc.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Parameters Evaluation at OBC */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm" id="properties-at-obc-card">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Activity className="w-4 h-4 text-slate-500" />
          Predicted Mixture Properties at OBC ({solver.obc.toFixed(2)}% Binder)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Stability */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Stability at OBC</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">{(solver.stabilityAtObc / 1000).toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">kN</span>
            </div>
            <div className="mt-1">
              {solver.stabilityAtObc >= minStability ? (
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Pass (&ge;{minStability/1000}kN)</span>
              ) : (
                <span className="text-[9px] text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded">Low (&ge;{minStability/1000}kN)</span>
              )}
            </div>
          </div>

          {/* Flow */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Flow at OBC</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">{solver.flowAtObc.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">mm</span>
            </div>
            <div className="mt-1">
              {solver.flowAtObc >= spec.minFlow && solver.flowAtObc <= spec.maxFlow ? (
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Pass ({spec.minFlow}-{spec.maxFlow})</span>
              ) : (
                <span className="text-[9px] text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded">Out ({spec.minFlow}-{spec.maxFlow})</span>
              )}
            </div>
          </div>

          {/* VTM */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Air Voids (VTM)</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">{solver.vtmAtObc.toFixed(2)}%</span>
            </div>
            <div className="mt-1">
              {solver.vtmAtObc >= spec.minVTM && solver.vtmAtObc <= spec.maxVTM ? (
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Pass ({spec.minVTM}-{spec.maxVTM}%)</span>
              ) : (
                <span className="text-[9px] text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded">Out ({spec.minVTM}-{spec.maxVTM}%)</span>
              )}
            </div>
          </div>

          {/* VFB */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Voids Filled (VFB)</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">{solver.vfbAtObc.toFixed(1)}%</span>
            </div>
            <div className="mt-1">
              {solver.vfbAtObc >= spec.minVFB && solver.vfbAtObc <= spec.maxVFB ? (
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Pass ({spec.minVFB}-{spec.maxVFB}%)</span>
              ) : (
                <span className="text-[9px] text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded">Out ({spec.minVFB}-{spec.maxVFB}%)</span>
              )}
            </div>
          </div>

          {/* VMA */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">VMA at OBC</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">{solver.vmaAtObc.toFixed(2)}%</span>
            </div>
            <div className="mt-1">
              {solver.vmaAtObc >= spec.minVMA ? (
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Pass (&ge;{spec.minVMA}%)</span>
              ) : (
                <span className="text-[9px] text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded">Low (&ge;{spec.minVMA}%)</span>
              )}
            </div>
          </div>

          {/* Stiffness */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/50 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Stiffness at OBC</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">{Math.round(solver.stiffnessAtObc)}</span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">N/mm</span>
            </div>
            <div className="mt-1">
              {solver.stiffnessAtObc >= minStiffness ? (
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Pass (&ge;{minStiffness})</span>
              ) : (
                <span className="text-[9px] text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded">Low (&ge;{minStiffness})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Compliance Warnings & Mix Optimization Advisor */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="optimizer-advisor-panel">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between" id="advisor-header">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-800">Mix Optimization &amp; Potential Corrections</h3>
          </div>
          <span className="text-xs text-slate-400">JKR Laboratory Technical Advisor</span>
        </div>

        <div className="p-6 space-y-5" id="advisor-body">
          {solver.isCompliant ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex gap-3 text-emerald-800" id="compliance-success-banner">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Design Asphalt Content Validated!</h4>
                <p className="text-xs mt-1 leading-relaxed">
                  Your Marshall specimen calculations correspond perfectly to **JKR SPJ Section 4 Flexible Pavement** criteria. The calculated Optimum Binder Content of **{solver.obc.toFixed(2)}%** is fully compliant across all key Marshall curves. This recipe is ready for production mix design submissions (Job Mix Formula).
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 flex gap-3 text-amber-900" id="compliance-fail-banner">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Compliance Corrections Required</h4>
                <p className="text-xs mt-1 leading-relaxed">
                  The optimum bitumen content **{solver.obc.toFixed(2)}%** does not meet all criteria. Failures detected: <span className="font-bold text-red-600 underline">{solver.failingParams.join(', ')}</span>. Modify the aggregate gradings or bitumen parameters following the technical corrections below.
                </p>
              </div>
            </div>
          )}

          {/* Technical Correction Cards */}
          <div className="space-y-4" id="corrections-advisor-list">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Engineering Troubleshooting Guidelines (JKR SPJ):</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Correction 1: Low Stability */}
              <div className={`p-4 rounded-xl border transition-all ${
                !solver.isCompliant && solver.failingParams.includes('Marshall Stability')
                  ? 'bg-red-50/40 border-red-200/60 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h5 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Troubleshooting Low Stability</h5>
                </div>
                <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
                  <li>Ensure aggregate shape is highly angular (use 100% crushed quarry rock).</li>
                  <li>Increase aggregate friction by checking coarse aggregate crushing Index (&gt;80% as per JKR Section 4.1.2.4).</li>
                  <li>Use stiffer asphalt binder class (e.g., PG76 polymer-modified bitumen).</li>
                  <li>Verify lab compaction temperature matches specific binder viscosity limits.</li>
                </ul>
              </div>

              {/* Correction 2: Low VTM / Rutting risk */}
              <div className={`p-4 rounded-xl border transition-all ${
                !solver.isCompliant && solver.failingParams.includes('Air Voids (VTM)') && solver.vtmAtObc < spec.minVTM
                  ? 'bg-red-50/40 border-red-200/60 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h5 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Troubleshooting Low VTM (Bleeding/Rutting)</h5>
                </div>
                <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
                  <li>Highly dangerous: mix will bleed asphalt and deform plastically under Malaysian heavy vehicle wheel loads.</li>
                  <li>Reduce the fine sand fraction in the aggregate grading curve.</li>
                  <li>Shift aggregate distribution away from the 0.45 power maximum density line.</li>
                  <li>Verify and reduce binder percentage slightly if aggregate structure is too dense.</li>
                </ul>
              </div>

              {/* Correction 3: High VTM / Durability risk */}
              <div className={`p-4 rounded-xl border transition-all ${
                !solver.isCompliant && solver.failingParams.includes('Air Voids (VTM)') && solver.vtmAtObc > spec.maxVTM
                  ? 'bg-red-50/40 border-red-200/60 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h5 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Troubleshooting High VTM (Durability/Water Stripping)</h5>
                </div>
                <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
                  <li>Pavement will be permeable, leading to severe moisture damage and oxidation.</li>
                  <li>Increase mineral filler content (cement/hydrated lime as per JKR) to plug small air voids.</li>
                  <li>Increase fine aggregate fraction to increase interlocking density.</li>
                  <li>Increase bitumen content to create thicker aggregate coating films.</li>
                </ul>
              </div>

              {/* Correction 4: Low VMA */}
              <div className={`p-4 rounded-xl border transition-all ${
                !solver.isCompliant && solver.failingParams.includes('Voids in Mineral Aggregate (VMA)')
                  ? 'bg-red-50/40 border-red-200/60 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h5 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Troubleshooting Low VMA</h5>
                </div>
                <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
                  <li>Indicates aggregate interlock has no space for bitumen, leading to dry/fragile pavement.</li>
                  <li>Modify aggregate grading toward a more &ldquo;gap-graded&rdquo; blend.</li>
                  <li>Increase percentage of coarse aggregates to create larger air pockets.</li>
                  <li>Ensure quarry dust/mineral filler does not exceed the maximum allowable limits.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
