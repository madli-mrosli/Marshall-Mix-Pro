/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { CalculatedProperties, JkrSpecification, TrafficType } from '../types';
import { fitQuadratic, QuadraticCurve } from '../utils/math';
import { LineChart, HelpCircle, Activity } from 'lucide-react';

interface MarshallChartsProps {
  calculated: CalculatedProperties[];
  spec: JkrSpecification;
  trafficType: TrafficType;
  obc: number | null;
}

interface SingleChartProps {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  points: { x: number; y: number }[];
  curve: QuadraticCurve;
  minYLimit?: number;
  maxYLimit?: number;
  minXLimit?: number;
  maxXLimit?: number;
  obc: number | null;
  yFormat?: (v: number) => string;
}

function SingleSVGChart({
  title,
  xAxisLabel,
  yAxisLabel,
  points,
  curve,
  minYLimit,
  maxYLimit,
  minXLimit,
  maxXLimit,
  obc,
  yFormat = (v) => v.toFixed(2),
}: SingleChartProps) {
  const width = 340;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 35;

  // Determine limits for the viewport
  const xs = useMemo(() => {
    const vals = points.map((p) => p.x);
    if (obc !== null) vals.push(obc);
    if (minXLimit !== undefined) vals.push(minXLimit);
    if (maxXLimit !== undefined) vals.push(maxXLimit);
    if (vals.length === 0) return { min: 3, max: 7 };
    return { min: Math.min(...vals) - 0.4, max: Math.max(...vals) + 0.4 };
  }, [points, obc, minXLimit, maxXLimit]);

  const ys = useMemo(() => {
    const vals = points.map((p) => p.y);
    // Include some evaluations of the curve to make sure we fit the peak/troughs
    if (points.length >= 3) {
      for (let x = xs.min; x <= xs.max; x += 0.1) {
        vals.push(curve.evaluate(x));
      }
    }
    if (minYLimit !== undefined && minYLimit !== null) vals.push(minYLimit);
    if (maxYLimit !== undefined && maxYLimit !== null) vals.push(maxYLimit);
    if (vals.length === 0) return { min: 0, max: 100 };
    const rawMin = Math.min(...vals);
    const rawMax = Math.max(...vals);
    const margin = (rawMax - rawMin) * 0.15 || 1.0;
    return { min: Math.max(0, rawMin - margin), max: rawMax + margin };
  }, [points, curve, xs, minYLimit, maxYLimit]);

  // Coordinate converters
  const toSvgX = (x: number) => {
    const pct = (x - xs.min) / (xs.max - xs.min || 1.0);
    return paddingLeft + pct * (width - paddingLeft - paddingRight);
  };

  const toSvgY = (y: number) => {
    const pct = (y - ys.min) / (ys.max - ys.min || 1.0);
    return height - paddingBottom - pct * (height - paddingTop - paddingBottom);
  };

  // Generate gridlines & ticks
  const xTicks = useMemo(() => {
    const ticks = [];
    const step = 0.5;
    const start = Math.ceil(xs.min * 2) / 2;
    for (let t = start; t <= xs.max; t += step) {
      ticks.push(t);
    }
    return ticks;
  }, [xs]);

  const yTicks = useMemo(() => {
    const ticks = [];
    const step = (ys.max - ys.min) / 4;
    for (let i = 0; i <= 4; i++) {
      ticks.push(ys.min + i * step);
    }
    return ticks;
  }, [ys]);

  // Generate path for the fitted curve
  const curvePath = useMemo(() => {
    if (points.length < 2) return '';
    let path = '';
    const resolution = 50;
    const step = (xs.max - xs.min) / resolution;
    for (let i = 0; i <= resolution; i++) {
      const x = xs.min + i * step;
      const y = curve.evaluate(x);
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      if (i === 0) {
        path += `M ${sx} ${sy}`;
      } else {
        path += ` L ${sx} ${sy}`;
      }
    }
    return path;
  }, [points, curve, xs, ys]);

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between" id={`chart-wrapper-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="mb-2" id="chart-header">
        <h4 className="text-xs font-semibold text-slate-700 tracking-tight flex items-center justify-between">
          <span>{title}</span>
          {points.length < 3 && (
            <span className="text-[10px] text-slate-400 font-normal italic">Jagged lines (Need &ge;3 points for curve)</span>
          )}
        </h4>
      </div>

      <div className="relative w-full overflow-hidden" id="chart-svg-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Background Grid */}
          <g className="opacity-40">
            {xTicks.map((xVal, i) => (
              <line
                key={`x-grid-${i}`}
                x1={toSvgX(xVal)}
                y1={paddingTop}
                x2={toSvgX(xVal)}
                y2={height - paddingBottom}
                stroke="#cbd5e1"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            ))}
            {yTicks.map((yVal, i) => (
              <line
                key={`y-grid-${i}`}
                x1={paddingLeft}
                y1={toSvgY(yVal)}
                x2={width - paddingRight}
                y2={toSvgY(yVal)}
                stroke="#cbd5e1"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            ))}
          </g>

          {/* JKR Specification Shaded Boundary Ranges */}
          {minYLimit !== undefined && maxYLimit !== undefined && (
            <rect
              x={toSvgX(xs.min)}
              y={toSvgY(maxYLimit)}
              width={toSvgX(xs.max) - toSvgX(xs.min)}
              height={Math.max(0, toSvgY(minYLimit) - toSvgY(maxYLimit))}
              fill="#10b981"
              fillOpacity="0.06"
              stroke="#10b981"
              strokeOpacity="0.15"
              strokeWidth="1"
              strokeDasharray="1 1"
            />
          )}

          {minYLimit !== undefined && maxYLimit === undefined && (
            <rect
              x={toSvgX(xs.min)}
              y={paddingTop}
              width={toSvgX(xs.max) - toSvgX(xs.min)}
              height={Math.max(0, toSvgY(minYLimit) - paddingTop)}
              fill="#10b981"
              fillOpacity="0.05"
              stroke="#10b981"
              strokeOpacity="0.15"
              strokeWidth="1"
              strokeDasharray="1 1"
            />
          )}

          {/* JKR Asphalt Content Vertical Limits */}
          {minXLimit !== undefined && maxXLimit !== undefined && (
            <rect
              x={toSvgX(minXLimit)}
              y={paddingTop}
              width={toSvgX(maxXLimit) - toSvgX(minXLimit)}
              height={height - paddingBottom - paddingTop}
              fill="#3b82f6"
              fillOpacity="0.02"
              stroke="#3b82f6"
              strokeOpacity="0.1"
              strokeWidth="0.8"
              strokeDasharray="4 4"
            />
          )}

          {/* X Axis Line */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#94a3b8"
            strokeWidth="1.2"
          />

          {/* Y Axis Line */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="#94a3b8"
            strokeWidth="1.2"
          />

          {/* X-Axis Ticks & Labels */}
          {xTicks.map((xVal, i) => (
            <g key={`x-tick-${i}`}>
              <line
                x1={toSvgX(xVal)}
                y1={height - paddingBottom}
                x2={toSvgX(xVal)}
                y2={height - paddingBottom + 4}
                stroke="#64748b"
                strokeWidth="1"
              />
              <text
                x={toSvgX(xVal)}
                y={height - paddingBottom + 14}
                className="text-[9px] font-mono fill-slate-500 font-medium"
                textAnchor="middle"
              >
                {xVal.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Y-Axis Ticks & Labels */}
          {yTicks.map((yVal, i) => (
            <g key={`y-tick-${i}`}>
              <line
                x1={paddingLeft - 4}
                y1={toSvgY(yVal)}
                x2={paddingLeft}
                y2={toSvgY(yVal)}
                stroke="#64748b"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 7}
                y={toSvgY(yVal) + 3}
                className="text-[9px] font-mono fill-slate-500 font-medium"
                textAnchor="end"
              >
                {yFormat(yVal)}
              </text>
            </g>
          ))}

          {/* Fitted Curve Line */}
          {curvePath && (
            <path
              d={curvePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          )}

          {/* Optimum Bitumen Content vertical dashed marker */}
          {obc !== null && obc >= xs.min && obc <= xs.max && (
            <g>
              <line
                x1={toSvgX(obc)}
                y1={paddingTop}
                x2={toSvgX(obc)}
                y2={height - paddingBottom}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
              <circle
                cx={toSvgX(obc)}
                cy={toSvgY(curve.evaluate(obc))}
                r="4.5"
                fill="#ef4444"
                stroke="#white"
                strokeWidth="1"
              />
              <text
                x={toSvgX(obc) + 5}
                y={paddingTop + 10}
                className="text-[9px] fill-red-600 font-bold font-mono"
              >
                OBC {obc.toFixed(2)}%
              </text>
            </g>
          )}

          {/* Actual Experimental Scatter Data Points */}
          {points.map((p, i) => (
            <g key={`pt-${i}`} className="group cursor-pointer">
              <circle
                cx={toSvgX(p.x)}
                cy={toSvgY(p.y)}
                r="4"
                fill="#1e293b"
                stroke="#fff"
                strokeWidth="1.5"
                className="hover:scale-150 transition-all duration-200"
              />
              {/* Simple tooltip box */}
              <title>{`Asphalt: ${p.x.toFixed(2)}%, Value: ${yFormat(p.y)}`}</title>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400 font-medium font-mono px-1">
        <span>{xAxisLabel}</span>
        <span>{yAxisLabel}</span>
      </div>
    </div>
  );
}

export default function MarshallCharts({ calculated, spec, trafficType, obc }: MarshallChartsProps) {
  const minStability = trafficType === 'HEAVY' ? spec.minStabilityHeavy : spec.minStability;

  // 1. Density Chart
  const densityPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.bulkDensity })), [calculated]);
  const densityCurve = useMemo(() => fitQuadratic(densityPoints), [densityPoints]);

  // 2. Stability Chart (in kN)
  const stabilityPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.correctedStability / 1000 })), [calculated]);
  const stabilityCurve = useMemo(() => fitQuadratic(stabilityPoints), [stabilityPoints]);

  // 3. Flow Chart
  const flowPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.flow })), [calculated]);
  const flowCurve = useMemo(() => fitQuadratic(flowPoints), [flowPoints]);

  // 4. VTM Chart
  const vtmPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.vtm })), [calculated]);
  const vtmCurve = useMemo(() => fitQuadratic(vtmPoints), [vtmPoints]);

  // 5. VFB Chart
  const vfbPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.vfb })), [calculated]);
  const vfbCurve = useMemo(() => fitQuadratic(vfbPoints), [vfbPoints]);

  // 6. VMA Chart
  const vmaPoints = useMemo(() => calculated.map((c) => ({ x: c.asphaltContent, y: c.vma })), [calculated]);
  const vmaCurve = useMemo(() => fitQuadratic(vmaPoints), [vmaPoints]);

  if (calculated.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 shadow-sm">
        <LineChart className="w-12 h-12 text-slate-300 stroke-[1.5] mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-600">No figures developed yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Developed figures corresponding to JKR SPJ Section 4 specs will appear here when you enter sample data.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4" id="marshall-charts-section">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3" id="charts-main-header">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Marshall Parameter Visualizer (6-Curve Method)</h3>
          <p className="text-xs text-slate-500">
            Interactive mathematical fitting of lab data. The <span className="text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">green zones</span> represent SPJ Section 4 compliant criteria.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="charts-grid">
        {/* 1. Density Curve */}
        <SingleSVGChart
          title="Bulk Density vs. Asphalt Content"
          xAxisLabel="Asphalt Content (%)"
          yAxisLabel="Bulk Density Gmb (g/cm³)"
          points={densityPoints}
          curve={densityCurve}
          obc={obc}
          minXLimit={spec.minBinderContent}
          maxXLimit={spec.maxBinderContent}
          yFormat={(v) => v.toFixed(3)}
        />

        {/* 2. Stability Curve */}
        <SingleSVGChart
          title="Stability vs. Asphalt Content"
          xAxisLabel="Asphalt Content (%)"
          yAxisLabel="Marshall Stability (kN)"
          points={stabilityPoints}
          curve={stabilityCurve}
          minYLimit={minStability / 1000}
          obc={obc}
          minXLimit={spec.minBinderContent}
          maxXLimit={spec.maxBinderContent}
          yFormat={(v) => v.toFixed(1)}
        />

        {/* 3. Flow Curve */}
        <SingleSVGChart
          title="Flow vs. Asphalt Content"
          xAxisLabel="Asphalt Content (%)"
          yAxisLabel="Marshall Flow (mm)"
          points={flowPoints}
          curve={flowCurve}
          minYLimit={spec.minFlow}
          maxYLimit={spec.maxFlow}
          obc={obc}
          minXLimit={spec.minBinderContent}
          maxXLimit={spec.maxBinderContent}
          yFormat={(v) => v.toFixed(1)}
        />

        {/* 4. Air Voids (VTM) Curve */}
        <SingleSVGChart
          title="Air Voids (VTM) vs. Asphalt Content"
          xAxisLabel="Asphalt Content (%)"
          yAxisLabel="Air Voids VTM (%)"
          points={vtmPoints}
          curve={vtmCurve}
          minYLimit={spec.minVTM}
          maxYLimit={spec.maxVTM}
          obc={obc}
          minXLimit={spec.minBinderContent}
          maxXLimit={spec.maxBinderContent}
          yFormat={(v) => `${v.toFixed(1)}%`}
        />

        {/* 5. VFB Curve */}
        <SingleSVGChart
          title="Voids Filled with Binder (VFB)"
          xAxisLabel="Asphalt Content (%)"
          yAxisLabel="VFB / VFA (%)"
          points={vfbPoints}
          curve={vfbCurve}
          minYLimit={spec.minVFB}
          maxYLimit={spec.maxVFB}
          obc={obc}
          minXLimit={spec.minBinderContent}
          maxXLimit={spec.maxBinderContent}
          yFormat={(v) => `${Math.round(v)}%`}
        />

        {/* 6. VMA Curve */}
        <SingleSVGChart
          title="Voids in Mineral Aggregate (VMA)"
          xAxisLabel="Asphalt Content (%)"
          yAxisLabel="VMA (%)"
          points={vmaPoints}
          curve={vmaCurve}
          minYLimit={spec.minVMA}
          obc={obc}
          minXLimit={spec.minBinderContent}
          maxXLimit={spec.maxBinderContent}
          yFormat={(v) => `${v.toFixed(1)}%`}
        />
      </div>

      <div className="flex gap-2 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 leading-normal border border-slate-100/60" id="charts-legend">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Graph reading notes:</strong> Horizontal <span className="text-emerald-600 font-semibold">green zones</span> highlight JKR JKR specification parameters. Vertical dashed boundaries outline standard design ranges of asphalt contents (e.g. 4.5% - 6.5% for AC10). The vertical <span className="text-red-500 font-semibold">red line</span> indicates the computed Optimum Binder Content (OBC).
        </span>
      </div>
    </div>
  );
}
