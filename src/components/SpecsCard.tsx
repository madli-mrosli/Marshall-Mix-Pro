/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { JkrSpecification, TrafficType } from '../types';
import { ShieldCheck, Info, Award, Settings } from 'lucide-react';

interface SpecsCardProps {
  spec: JkrSpecification;
  trafficType: TrafficType;
  setTrafficType: (type: TrafficType) => void;
}

export default function SpecsCard({ spec, trafficType, setTrafficType }: SpecsCardProps) {
  const minStability = trafficType === 'HEAVY' ? spec.minStabilityHeavy : spec.minStability;
  const minStiffness = trafficType === 'HEAVY' ? spec.minStiffnessHeavy : spec.minStiffness;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden" id="specs-card-container">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between" id="specs-card-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-xs font-mono text-blue-400 tracking-widest font-semibold uppercase">JKR Standard Spec</span>
            <h2 className="text-lg font-semibold text-white tracking-tight">{spec.name}</h2>
          </div>
        </div>
        <div className="bg-blue-900/40 text-blue-300 text-xs px-2.5 py-1 rounded-full font-mono font-medium border border-blue-800/60">
          SPJ Section 4
        </div>
      </div>

      <div className="p-6 space-y-5" id="specs-card-body">
        <p className="text-sm text-slate-500 leading-relaxed italic">
          &ldquo;{spec.description}&rdquo;
        </p>

        {/* Traffic Category Selector */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">Traffic Category:</span>
          </div>
          <div className="flex bg-slate-200/60 p-1 rounded-md">
            <button
              onClick={() => setTrafficType('STANDARD')}
              className={`text-xs px-3 py-1.5 rounded-sm font-medium transition-all ${
                trafficType === 'STANDARD'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard (&lt; 1M ESAL)
            </button>
            <button
              onClick={() => setTrafficType('HEAVY')}
              className={`text-xs px-3 py-1.5 rounded-sm font-medium transition-all ${
                trafficType === 'HEAVY'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Heavy Traffic (&gt; 1M ESAL)
            </button>
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Stability</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">
                &ge; {(minStability / 1000).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">kN</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1">Min {minStability} N</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Flow Limit</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">
                {spec.minFlow.toFixed(1)} - {spec.maxFlow.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">mm</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1">Marshall Flow</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Air Voids (VTM)</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">
                {spec.minVTM.toFixed(1)} - {spec.maxVTM.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">%</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1">Voids in Total Mix</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">VFA / VFB</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">
                {spec.minVFB.toFixed(1)} - {spec.maxVFB.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">%</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1">Voids Filled w/ Bitumen</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Min VMA</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">
                &ge; {spec.minVMA.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">%</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1">Voids in Min Aggregate</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Stiffness</span>
            <div className="mt-1">
              <span className="text-base font-bold text-slate-800">
                &ge; {minStiffness}
              </span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">N/mm</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1">Stability / Flow Ratio</span>
          </div>
        </div>

        {/* Note block */}
        <div className="flex gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/60 text-xs text-blue-800 leading-normal" id="specs-card-note">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            <strong>OBC Standard (JKR SPJ Section 4):</strong> The Optimum Bitumen Content is designed by averaging binder percentages yielding maximum bulk density, peak stability, and standard median air voids (4.0% for wearing courses, 5.0% for AC28 binder course).
          </span>
        </div>
      </div>
    </div>
  );
}
