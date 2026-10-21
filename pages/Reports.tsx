import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, Printer, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { MOCK_CHART_DATA } from '../constants';

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('weekly');

  const PAYMENT_DATA = [
    { name: 'Telebirr', value: 45000, color: '#3B82F6' }, // Blue
    { name: 'M-Pesa', value: 25000, color: '#EF4444' },   // Red
    { name: 'Cash', value: 15000, color: '#10B981' },     // Green
    { name: 'Banks', value: 10000, color: '#8B5CF6' },    // Purple
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className="text-sm font-bold text-slate-900">
            ETB {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-ethiopic">Financial Reports / ሪፖርቶች</h1>
          <p className="text-slate-500">Comprehensive sales analytics and tax reports.</p>
        </div>
        <div className="flex gap-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                <Calendar size={16} className="text-slate-400 mr-2" />
                <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                >
                    <option value="daily">Today</option>
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                    <option value="yearly">This Year</option>
                </select>
            </div>
            <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                <Download size={16} className="mr-2" /> Export PDF
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600"><DollarSign size={20} /></div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+12.5%</span>
              </div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Gross Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">ETB 95,000</h3>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CreditCard size={20} /></div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">84%</span>
              </div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Digital Payments</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">ETB 80,000</h3>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><TrendingUp size={20} /></div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">15% Tax</span>
              </div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">VAT Collected</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">ETB 14,250</h3>
          </div>

           <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingDown size={20} /></div>
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">-2.4%</span>
              </div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Discounts/Refunds</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">ETB 1,200</h3>
          </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-6">Sales Trends</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#F8FAFC'}} />
                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
              <h3 className="font-bold text-slate-900 text-lg mb-2">Payment Methods</h3>
              <div className="flex-1 min-h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                            data={PAYMENT_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {PAYMENT_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                      </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="text-center">
                          <span className="block text-2xl font-bold text-slate-900">84%</span>
                          <span className="text-xs text-slate-500">Digital</span>
                      </div>
                  </div>
              </div>
              <div className="space-y-3 mt-4">
                  {PAYMENT_DATA.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                              <span className="text-slate-600">{item.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">{Math.round((item.value / 95000) * 100)}%</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Top Performing Tills */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Top Performing Tills</h3>
          </div>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Till Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Transactions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Efficiency</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">Main Counter (ዋና)</td>
                    <td className="px-6 py-4 text-sm text-slate-600">145</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">ETB 45,200</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">98%</td>
                </tr>
                <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">Cafe Window (መስኮት)</td>
                    <td className="px-6 py-4 text-sm text-slate-600">89</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">ETB 21,500</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">92%</td>
                </tr>
            </tbody>
          </table>
      </div>
    </div>
  );
};