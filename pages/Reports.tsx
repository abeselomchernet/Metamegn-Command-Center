import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useTranslation } from '../src/i18n/I18nContext';
import { formatETB } from '../src/domain/money';
import { BarChart3, TrendingUp, AlertTriangle, Clock, Layers, Download } from 'lucide-react';

const MATCH_RATE_TREND = [
  { day: 'Mon', matchRate: 98.4, exceptions: 3 },
  { day: 'Tue', matchRate: 96.1, exceptions: 7 },
  { day: 'Wed', matchRate: 97.8, exceptions: 4 },
  { day: 'Thu', matchRate: 95.2, exceptions: 9 },
  { day: 'Fri', matchRate: 98.9, exceptions: 2 },
  { day: 'Sat', matchRate: 94.7, exceptions: 11 },
  { day: 'Sun', matchRate: 96.5, exceptions: 5 },
];

const RAIL_MIX_DATA = [
  { name: 'Wallet Rail A', value: 38, amountCents: 4500000, color: '#3B82F6' },
  { name: 'Bank Rail B', value: 27, amountCents: 3200000, color: '#10B981' },
  { name: 'Interoperable QR', value: 18, amountCents: 2100000, color: '#8B5CF6' },
  { name: 'Card Tap (SoftPOS)', value: 11, amountCents: 1300000, color: '#F59E0B' },
  { name: 'Cash', value: 6, amountCents: 750000, color: '#64748B' },
];

const AGEING_BREAKDOWN = [
  { range: '< 15 mins (Real-time)', count: 8, severity: 'nominal' },
  { range: '15 - 60 mins', count: 4, severity: 'warning' },
  { range: '1 - 4 hours', count: 2, severity: 'elevated' },
  { range: '> 4 hours (SLA breach)', count: 1, severity: 'critical' },
];

const TILL_DISCREPANCIES = [
  { till: 'Till 01 (Main Counter)', totalCaptured: 142, exceptions: 3, discrepancyRate: '2.1%' },
  { till: 'Till 02 (Express Register)', totalCaptured: 198, exceptions: 6, discrepancyRate: '3.0%' },
  { till: 'Till 03 (Patio / Bar)', totalCaptured: 87, exceptions: 4, discrepancyRate: '4.6%' },
];

export const Reports: React.FC = () => {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.reportsTitle}</h1>
            <EvidenceChip status="Sample data" detail="Aggregated metrics" />
          </div>
          <p className="text-xs text-slate-500">
            Acceptance layer analytics: Match rate performance, discrepancy ageing, and payment rail distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days (Sample)</option>
            <option value="30d">Last 30 Days (Sample)</option>
          </select>
        </div>
      </div>

      {/* 2. Top Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Rate Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">7-Day Match Rate Trend</h2>
              <p className="text-xs text-slate-500">Percentage of events matched within report SLA</p>
            </div>
            <EvidenceChip status="Sample data" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MATCH_RATE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[90, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg font-mono">
                          <p className="font-sans font-bold text-slate-200">{data.day}</p>
                          <p className="text-emerald-400">Match rate: {data.matchRate}%</p>
                          <p className="text-slate-400">Open exceptions: {data.exceptions}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="matchRate"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10B981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Rail Mix */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t.railMix}</h2>
              <p className="text-xs text-slate-500">Volume share across neutral acceptance channels</p>
            </div>
            <EvidenceChip status="Sample data" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-6 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RAIL_MIX_DATA}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {RAIL_MIX_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs font-mono">
                            <p className="font-sans font-bold">{data.name}</p>
                            <p>{data.value}% of captures</p>
                            <p className="text-slate-400">{formatETB(data.amountCents)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-6 space-y-2 text-xs">
              {RAIL_MIX_DATA.map((rail) => (
                <div key={rail.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: rail.color }} />
                    <span className="text-slate-700 font-medium">{rail.name}</span>
                  </div>
                  <div className="text-right font-mono tabular-nums text-slate-900 font-semibold">
                    {rail.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Grid: Exception Ageing & Discrepancies by Till */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exception Ageing Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t.exceptionAgeing}</h2>
              <p className="text-xs text-slate-500">Duration open exceptions have awaited statement resolution</p>
            </div>
            <EvidenceChip status="Assumption" detail="Batch frequency" />
          </div>

          <div className="space-y-2 pt-2">
            {AGEING_BREAKDOWN.map((row) => (
              <div
                key={row.range}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Clock
                    size={15}
                    className={
                      row.severity === 'critical'
                        ? 'text-rose-600'
                        : row.severity === 'warning'
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }
                  />
                  <span className="font-medium text-slate-800">{row.range}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900">{row.count} open</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      row.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : row.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {row.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discrepancies by Till */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t.tillDiscrepancies}</h2>
              <p className="text-xs text-slate-500">Cross-terminal reconciliation exception frequency</p>
            </div>
            <EvidenceChip status="Sample data" />
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <th className="pb-2">Terminal</th>
                  <th className="pb-2 text-right">Captured</th>
                  <th className="pb-2 text-right">Exceptions</th>
                  <th className="pb-2 text-right">Discrepancy %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {TILL_DISCREPANCIES.map((row) => (
                  <tr key={row.till} className="hover:bg-slate-50">
                    <td className="py-2.5 font-medium text-slate-800">{row.till}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">
                      {row.totalCaptured}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-rose-600 font-semibold">
                      {row.exceptions}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums font-bold text-slate-900">
                      {row.discrepancyRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};