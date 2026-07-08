/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarshallSample, JkrMixType } from '../types';
import { Plus, Trash2, RotateCcw, HelpCircle, Eye, Calculator } from 'lucide-react';

interface DataEntryProps {
  samples: MarshallSample[];
  setSamples: (samples: MarshallSample[]) => void;
  mixType: JkrMixType;
  loadDefaultData: () => void;
  g_sb: number;
  setGsb: (val: number) => void;
  g_se: number;
  setGse: (val: number) => void;
  g_b: number;
  setGb: (val: number) => void;
}

export default function DataEntry({
  samples,
  setSamples,
  mixType,
  loadDefaultData,
  g_sb,
  setGsb,
  g_se,
  setGse,
  g_b,
  setGb,
}: DataEntryProps) {
  
  const handleAddRow = () => {
    // Determine next reasonable binder content
    let nextPb = 5.0;
    if (samples.length > 0) {
      const maxPb = Math.max(...samples.map((s) => s.asphaltContent));
      nextPb = parseFloat((maxPb + 0.5).toFixed(1));
    }

    const newRow: MarshallSample = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      asphaltContent: nextPb,
      weightInAir: 1200,
      weightSsd: 1205,
      weightInWater: 690,
      useDirectBulkDensity: false,
      directBulkDensity: 2.33,
      maxTheoreticalSpecificGravity: 2.45,
      useCalculatedGmm: true,
      specimenThickness: 63.5,
      measuredStability: 9500,
      stabilityUnit: 'N',
      flow: 2.8,
    };
    setSamples([...samples, newRow]);
  };

  const handleUpdateRow = (id: string, field: keyof MarshallSample, value: any) => {
    setSamples(
      samples.map((sample) => {
        if (sample.id === id) {
          return { ...sample, [field]: value };
        }
        return sample;
      })
    );
  };

  const handleDeleteRow = (id: string) => {
    setSamples(samples.filter((s) => s.id !== id));
  };

  const handleClear = () => {
    setSamples([]);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="data-entry-container">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="data-entry-header">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-600" />
            Marshall Lab Testing Data Input
          </h3>
          <p className="text-xs text-slate-500">
            Enter test measurements for each binder content. Use the preloader for authentic JKR project values.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadDefaultData}
            className="text-xs px-3 py-1.5 font-medium border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Preload JKR {mixType} Demo
          </button>
          <button
            onClick={handleClear}
            className="text-xs px-3 py-1.5 font-medium border border-red-200/60 text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear Table
          </button>
        </div>
      </div>

      {/* Specific Gravities Panel */}
      <div className="p-6 border-b border-slate-100 bg-blue-50/10 grid grid-cols-1 sm:grid-cols-3 gap-4" id="gravities-config">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Bulk Sp. Gr. of Aggregate (G<sub>sb</sub>)
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              step="0.001"
              value={g_sb}
              onChange={(e) => setGsb(Math.max(1.0, parseFloat(e.target.value) || 0))}
              className="w-full text-sm font-mono border border-slate-200 rounded-md px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Used to compute VMA voids.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Effective Sp. Gr. of Aggregate (G<sub>se</sub>)
          </label>
          <input
            type="number"
            step="0.001"
            value={g_se}
            onChange={(e) => setGse(Math.max(1.0, parseFloat(e.target.value) || 0))}
            className="w-full text-sm font-mono border border-slate-200 rounded-md px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">Used to compute theoretical Max Sp. Gr. (G<sub>mm</sub>)</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Specific Gravity of Asphalt (G<sub>b</sub>)
          </label>
          <input
            type="number"
            step="0.001"
            value={g_b}
            onChange={(e) => setGb(Math.max(0.5, parseFloat(e.target.value) || 0))}
            className="w-full text-sm font-mono border border-slate-200 rounded-md px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">Typically 1.02 - 1.04 for bitumen grade 80/100 or 60/70.</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto" id="samples-table-container">
        {samples.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Calculator className="w-12 h-12 text-slate-300 stroke-[1.5] mb-2" />
            <p className="text-sm">No sample rows added yet.</p>
            <p className="text-xs text-slate-400 mt-1">Click below to add a row or load standard testing presets.</p>
            <button
              onClick={loadDefaultData}
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition"
            >
              Preload Demo Data
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100 text-left border-collapse">
            <thead className="bg-slate-50 font-semibold text-slate-600 text-xs">
              <tr>
                <th className="px-4 py-3 border-b border-slate-100 text-center w-24">Binder P<sub>b</sub> (%)</th>
                <th className="px-4 py-3 border-b border-slate-100 min-w-[280px]">Bulk Density (G<sub>mb</sub>) mode</th>
                <th className="px-4 py-3 border-b border-slate-100 min-w-[140px]">Max Gravity (G<sub>mm</sub>)</th>
                <th className="px-4 py-3 border-b border-slate-100 min-w-[110px]">Thickness (mm)</th>
                <th className="px-4 py-3 border-b border-slate-100 min-w-[180px]">Measured Stability</th>
                <th className="px-4 py-3 border-b border-slate-100 min-w-[100px]">Flow (mm)</th>
                <th className="px-4 py-3 border-b border-slate-100 text-center w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {samples.map((sample, idx) => (
                <tr key={sample.id} className="hover:bg-slate-50/50 transition">
                  {/* Asphalt content */}
                  <td className="px-4 py-3 align-middle text-center">
                    <input
                      type="number"
                      step="0.1"
                      value={sample.asphaltContent}
                      onChange={(e) => handleUpdateRow(sample.id, 'asphaltContent', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-16 text-center font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* Bulk Density calculations */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={sample.useDirectBulkDensity}
                            onChange={(e) => handleUpdateRow(sample.id, 'useDirectBulkDensity', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="relative w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ms-2 font-medium text-slate-500 text-[11px]">Direct G<sub>mb</sub> input</span>
                        </label>
                      </div>

                      {sample.useDirectBulkDensity ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400 font-mono">G<sub>mb</sub>:</span>
                          <input
                            type="number"
                            step="0.001"
                            value={sample.directBulkDensity}
                            onChange={(e) => handleUpdateRow(sample.id, 'directBulkDensity', parseFloat(e.target.value) || 0)}
                            className="w-24 text-sm font-mono border border-slate-200 rounded px-2 py-0.5"
                          />
                          <span className="text-[10px] text-slate-400">g/cm³</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <span className="block text-[9px] text-slate-400 uppercase font-mono">Air Wt (A)</span>
                            <input
                              type="number"
                              step="0.1"
                              value={sample.weightInAir}
                              onChange={(e) => handleUpdateRow(sample.id, 'weightInAir', parseFloat(e.target.value) || 0)}
                              className="w-full text-xs font-mono border border-slate-200 rounded px-1.5 py-0.5"
                            />
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 uppercase font-mono">SSD Wt (B)</span>
                            <input
                              type="number"
                              step="0.1"
                              value={sample.weightSsd}
                              onChange={(e) => handleUpdateRow(sample.id, 'weightSsd', parseFloat(e.target.value) || 0)}
                              className="w-full text-xs font-mono border border-slate-200 rounded px-1.5 py-0.5"
                            />
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 uppercase font-mono">Water Wt (C)</span>
                            <input
                              type="number"
                              step="0.1"
                              value={sample.weightInWater}
                              onChange={(e) => handleUpdateRow(sample.id, 'weightInWater', parseFloat(e.target.value) || 0)}
                              className="w-full text-xs font-mono border border-slate-200 rounded px-1.5 py-0.5"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Max gravity Gmm */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex flex-col gap-1">
                      <label className="inline-flex items-center cursor-pointer text-[10px] mb-1">
                        <input
                          type="checkbox"
                          checked={!sample.useCalculatedGmm}
                          onChange={(e) => handleUpdateRow(sample.id, 'useCalculatedGmm', !e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="relative w-6 h-3 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:start-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-1.5 font-medium text-slate-500 text-[10px]">Override G<sub>mm</sub></span>
                      </label>

                      {sample.useCalculatedGmm ? (
                        <div className="text-xs text-slate-500 font-mono py-1">
                          Auto: <span className="font-bold">
                            {(
                              100 /
                              ((100 - sample.asphaltContent) / g_se + sample.asphaltContent / g_b)
                            ).toFixed(3)}
                          </span>
                        </div>
                      ) : (
                        <input
                          type="number"
                          step="0.001"
                          value={sample.maxTheoreticalSpecificGravity}
                          onChange={(e) => handleUpdateRow(sample.id, 'maxTheoreticalSpecificGravity', parseFloat(e.target.value) || 0)}
                          className="w-24 text-xs font-mono border border-slate-200 rounded px-1.5 py-0.5"
                        />
                      )}
                    </div>
                  </td>

                  {/* Specimen Thickness */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={sample.specimenThickness}
                        onChange={(e) => handleUpdateRow(sample.id, 'specimenThickness', parseFloat(e.target.value) || 0)}
                        className="w-16 text-center font-mono border border-slate-200 rounded px-1.5 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </td>

                  {/* Stability inputs */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="1"
                        value={sample.measuredStability}
                        onChange={(e) => handleUpdateRow(sample.id, 'measuredStability', parseFloat(e.target.value) || 0)}
                        className="w-24 text-right font-mono border border-slate-200 rounded px-1.5 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <select
                        value={sample.stabilityUnit}
                        onChange={(e) => handleUpdateRow(sample.id, 'stabilityUnit', e.target.value)}
                        className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded px-1 py-1"
                      >
                        <option value="N">N</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </td>

                  {/* Flow */}
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="number"
                      step="0.1"
                      value={sample.flow}
                      onChange={(e) => handleUpdateRow(sample.id, 'flow', parseFloat(e.target.value) || 0)}
                      className="w-16 text-center font-mono border border-slate-200 rounded px-1.5 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* Delete button */}
                  <td className="px-4 py-3 align-middle text-center">
                    <button
                      onClick={() => handleDeleteRow(sample.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add row button */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between" id="data-entry-footer">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4" /> Add Sample Row
        </button>
        <span className="text-xs text-slate-400 font-mono">
          Total rows: {samples.length}
        </span>
      </div>
    </div>
  );
}
