/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculatedProperties, JkrSpecification, TrafficType } from '../types';
import { CheckCircle2, AlertCircle, TrendingUp, Info } from 'lucide-react';

interface ResultsDisplayProps {
  calculated: CalculatedProperties[];
  spec: JkrSpecification;
  trafficType: TrafficType;
}

export default function ResultsDisplay({ calculated, spec, trafficType }: ResultsDisplayProps) {
  const minStability = trafficType === 'HEAVY' ? spec.minStabilityHeavy : spec.minStability;
  const minStiffness = trafficType === 'HEAVY' ? spec.minStiffnessHeavy : spec.minStiffness;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in" id="results-display-container">
      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between" id="results-display-header">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Calculated Marshall Mix Properties &amp; JKR Compliance
          </h3>
          <p className="text-xs text-slate-500">
            Automated analysis of density, voids, corrected stability, flow, and stiffness relative to SPJ Section 4.
          </p>
        </div>
        <div className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200/60 font-semibold">
          {calculated.length} Specimens
        </div>
      </div>

      <div className="overflow-x-auto" id="results-table-container">
        {calculated.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm">No analysis available. Input data to run JKR compliance checks.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/60 font-semibold text-slate-600 text-xs">
              <tr>
                <th className="px-4 py-3 border-b border-slate-100 text-center font-mono font-bold">Asphalt P<sub>b</sub> (%)</th>
                <th className="px-4 py-3 border-b border-slate-100">Density G<sub>mb</sub> (g/cm³)</th>
                <th className="px-4 py-3 border-b border-slate-100">Theo. Max G<sub>mm</sub></th>
                <th className="px-4 py-3 border-b border-slate-100">Corrected Stability (kN)</th>
                <th className="px-4 py-3 border-b border-slate-100">Flow (mm)</th>
                <th className="px-4 py-3 border-b border-slate-100">Voids VTM (%)</th>
                <th className="px-4 py-3 border-b border-slate-100">Voids VMA (%)</th>
                <th className="px-4 py-3 border-b border-slate-100">Filled VFB (%)</th>
                <th className="px-4 py-3 border-b border-slate-100">Stiffness (N/mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {calculated.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40 transition">
                  <td className="px-4 py-3 align-middle text-center font-mono font-bold text-slate-800 text-sm bg-slate-50/30">
                    {row.asphaltContent.toFixed(1)}%
                  </td>
                  
                  {/* Bulk Density */}
                  <td className="px-4 py-3 align-middle font-mono text-slate-700 font-medium">
                    {row.bulkDensity.toFixed(3)}
                  </td>

                  {/* Gmm */}
                  <td className="px-4 py-3 align-middle font-mono text-slate-500">
                    {row.maxTheoreticalGravity.toFixed(3)}
                  </td>

                  {/* Corrected Stability */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {(row.correctedStability / 1000).toFixed(2)}
                      </span>
                      {row.stabilityPass ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Pass
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-0.5 font-medium">
                          <AlertCircle className="w-2.5 h-2.5 text-red-600" /> Low
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {Math.round(row.correctedStability)} N
                    </span>
                  </td>

                  {/* Flow */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {row.flow.toFixed(2)}
                      </span>
                      {row.flowPass ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Pass
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-0.5 font-medium">
                          <AlertCircle className="w-2.5 h-2.5 text-red-600" /> Out
                        </span>
                      )}
                    </div>
                  </td>

                  {/* VTM */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {row.vtm.toFixed(2)}%
                      </span>
                      {row.vtmPass ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Pass
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-0.5 font-medium">
                          <AlertCircle className="w-2.5 h-2.5 text-red-600" /> Out
                        </span>
                      )}
                    </div>
                  </td>

                  {/* VMA */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {row.vma.toFixed(2)}%
                      </span>
                      {row.vmaPass ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Pass
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-0.5 font-medium">
                          <AlertCircle className="w-2.5 h-2.5 text-red-600" /> Low
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono block">
                      Min {spec.minVMA}%
                    </span>
                  </td>

                  {/* VFB */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {row.vfb.toFixed(2)}%
                      </span>
                      {row.vfbPass ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Pass
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-0.5 font-medium">
                          <AlertCircle className="w-2.5 h-2.5 text-red-600" /> Out
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stiffness */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {Math.round(row.stiffness)}
                      </span>
                      {row.stiffnessPass ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Pass
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-0.5 font-medium">
                          <AlertCircle className="w-2.5 h-2.5 text-red-600" /> Low
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono block">
                      Min {minStiffness} N/mm
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
