import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import Card from '../components/ui/Card';
import MonthYearPicker from '../components/ui/MonthYearPicker';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { useCurrency } from '../context/CurrencyContext';
import { getMonthlyTrend, getByCategory, getDailyTrend } from '../services/analyticsService';
import { getCurrentMonth, getCurrentYear, getMonthName } from '../utils/helpers';
import { CATEGORY_COLORS } from '../utils/constants';

const PIE_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7BC8A4', '#4CAF50', '#E91E63', '#607D8B'];

export default function Analytics() {
  const { formatAmount } = useCurrency();
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());

  const trendQuery = useQuery({
    queryKey: ['monthlyTrend', year],
    queryFn: () => getMonthlyTrend({ year })
  });

  const categoryQuery = useQuery({
    queryKey: ['byCategory', month, year],
    queryFn: () => getByCategory({ month, year })
  });

  const dailyQuery = useQuery({
    queryKey: ['dailyTrend', month, year],
    queryFn: () => getDailyTrend({ month, year })
  });

  const trendData = (trendQuery.data?.data || []).map(item => ({
    ...item,
    name: getMonthName(item.month).slice(0, 3)
  }));
  const categoryData = categoryQuery.data?.data || [];
  const dailyData = dailyQuery.data?.data || [];

  const hasAnyDailySpending = dailyData.some(d => d.total > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-500 text-sm">Insights into your spending</p>
        </div>
        <MonthYearPicker
          month={month}
          year={year}
          onChange={(m, y) => { setMonth(m); setYear(y); }}
        />
      </div>

      {/* Monthly Trend - Bar Chart */}
      <Card title={`Monthly Income vs Expenses — ${year}`}>
        {trendQuery.isLoading ? (
          <div className="h-72 animate-pulse bg-gray-100 rounded-lg" />
        ) : trendQuery.isError ? (
          <ErrorState message={trendQuery.error?.message} onRetry={() => trendQuery.refetch()} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatAmount(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="income" fill="#4CAF50" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Donut Chart */}
        <Card title={`Expenses by Category — ${getMonthName(month)}`}>
          {categoryQuery.isLoading ? (
            <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
          ) : categoryQuery.isError ? (
            <ErrorState message={categoryQuery.error?.message} onRetry={() => categoryQuery.refetch()} />
          ) : categoryData.length === 0 ? (
            <EmptyState message="No transactions for this period" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="total"
                  nameKey="category"
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  labelLine={true}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category] || PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatAmount(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Daily Trend - Line/Area */}
        <Card title={`Daily Spending — ${getMonthName(month)}`}>
          {dailyQuery.isLoading ? (
            <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
          ) : dailyQuery.isError ? (
            <ErrorState message={dailyQuery.error?.message} onRetry={() => dailyQuery.refetch()} />
          ) : !hasAnyDailySpending ? (
            <EmptyState message="No spending data for this month" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A237E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1A237E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatAmount(value)} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#1A237E"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  name="Spending"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Category Breakdown Table */}
      <Card title="Category Breakdown">
        {categoryQuery.isLoading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : categoryQuery.isError ? (
          <ErrorState message={categoryQuery.error?.message} onRetry={() => categoryQuery.refetch()} />
        ) : categoryData.length === 0 ? (
          <EmptyState message="No expense data for this period" />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-center">Transactions</th>
                  <th className="px-6 py-3 text-right">Total</th>
                  <th className="px-6 py-3 text-right">% of Expenses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categoryData.map((c) => (
                  <tr key={c.category} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[c.category] || '#607D8B' }}
                        />
                        <span className="text-sm font-medium text-gray-800">{c.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-600">
                      {c.transactionCount}
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-semibold text-gray-800">
                      {formatAmount(c.total)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.percentage}%`,
                              backgroundColor: CATEGORY_COLORS[c.category] || '#607D8B'
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{c.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
