import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Hash,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import Card from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { CategoryBadge } from '../components/ui/Badge';
import { useCurrency } from '../context/CurrencyContext';
import { getSummary, getMonthlyTrend, getBudgetStatus } from '../services/analyticsService';
import { getTransactions } from '../services/transactionService';
import { getCurrentMonth, getCurrentYear, formatDate, getMonthName } from '../utils/helpers';

export default function Dashboard() {
  const { formatAmount } = useCurrency();
  const month = getCurrentMonth();
  const year = getCurrentYear();

  const summaryQuery = useQuery({
    queryKey: ['summary', month, year],
    queryFn: () => getSummary({ month, year })
  });

  const trendQuery = useQuery({
    queryKey: ['monthlyTrend', year],
    queryFn: () => getMonthlyTrend({ year })
  });

  const recentQuery = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: () => getTransactions({ limit: 5, page: 1 })
  });

  const budgetQuery = useQuery({
    queryKey: ['budgetStatus', month, year],
    queryFn: () => getBudgetStatus({ month, year })
  });

  const summary = summaryQuery.data?.data;
  const trendData = trendQuery.data?.data || [];
  const recentTransactions = recentQuery.data?.data || [];
  const budgetStatus = budgetQuery.data?.data || [];

  // Get last 6 months of trend data
  const last6Months = trendData
    .filter((_, idx) => idx >= month - 6 && idx < month)
    .slice(-6)
    .map(item => ({
      ...item,
      name: getMonthName(item.month).slice(0, 3)
    }));

  // If we don't have 6 months in current year, handle edge case
  const chartData = last6Months.length > 0 ? last6Months : trendData.slice(0, month).map(item => ({
    ...item,
    name: getMonthName(item.month).slice(0, 3)
  }));

  const summaryCards = [
    {
      label: 'Total Balance',
      value: summary ? formatAmount(summary.totalBalance) : '-',
      icon: Wallet,
      color: 'bg-navy-900',
      textColor: 'text-white'
    },
    {
      label: 'This Month Income',
      value: summary ? formatAmount(summary.totalIncome) : '-',
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-white'
    },
    {
      label: 'This Month Expenses',
      value: summary ? formatAmount(summary.totalExpenses) : '-',
      icon: TrendingDown,
      color: 'bg-red-500',
      textColor: 'text-white'
    },
    {
      label: 'Transactions',
      value: summary ? summary.transactionCount : '-',
      icon: Hash,
      color: 'bg-gold-500',
      textColor: 'text-navy-900'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            {getMonthName(month)} {year} Overview
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : summaryQuery.isError ? (
          <div className="col-span-full">
            <ErrorState
              message={summaryQuery.error?.message}
              onRetry={() => summaryQuery.refetch()}
            />
          </div>
        ) : (
          summaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`${card.color} ${card.textColor} rounded-xl p-5 shadow-md`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm opacity-90 font-medium">{card.label}</span>
                  <Icon size={20} className="opacity-80" />
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <Card title="Income vs Expenses">
          {trendQuery.isLoading ? (
            <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
          ) : trendQuery.isError ? (
            <ErrorState
              message={trendQuery.error?.message}
              onRetry={() => trendQuery.refetch()}
            />
          ) : chartData.length === 0 ? (
            <EmptyState message="No data for this year" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
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

        {/* Budget Overview */}
        <Card
          title="Budget Overview"
          action={
            <Link to="/budget" className="text-sm text-navy-900 hover:text-gold-600 font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          }
        >
          {budgetQuery.isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : budgetQuery.isError ? (
            <ErrorState
              message={budgetQuery.error?.message}
              onRetry={() => budgetQuery.refetch()}
            />
          ) : budgetStatus.length === 0 ? (
            <EmptyState
              message="No budgets set"
              description="Create budgets to track your spending"
              action={
                <Link to="/budget" className="btn-primary text-sm">
                  Set Budget
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {budgetStatus.slice(0, 5).map((b) => {
                const pct = Math.min(b.percentage, 100);
                const barColor =
                  b.percentage > 100 ? 'bg-red-500' :
                  b.percentage > 80 ? 'bg-red-400' :
                  b.percentage > 60 ? 'bg-yellow-400' : 'bg-green-500';
                return (
                  <div key={b.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{b.category}</span>
                      <span className="text-gray-500">
                        {formatAmount(b.spent)} / {formatAmount(b.limit)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card
        title="Recent Transactions"
        action={
          <Link to="/transactions" className="text-sm text-navy-900 hover:text-gold-600 font-medium flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        }
      >
        {recentQuery.isLoading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : recentQuery.isError ? (
          <ErrorState
            message={recentQuery.error?.message}
            onRetry={() => recentQuery.refetch()}
          />
        ) : recentTransactions.length === 0 ? (
          <EmptyState message="No transactions yet" description="Add your first transaction to get started" />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-600">{formatDate(t.date)}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{t.description}</td>
                    <td className="px-6 py-3">
                      <CategoryBadge category={t.category} />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{t.paymentMethod}</td>
                    <td className={`px-6 py-3 text-sm font-semibold text-right ${
                      t.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
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
