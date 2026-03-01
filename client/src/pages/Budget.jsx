import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, AlertTriangle, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import MonthYearPicker from '../components/ui/MonthYearPicker';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import BudgetForm from '../components/forms/BudgetForm';
import { useCurrency } from '../context/CurrencyContext';
import { createBudget, updateBudget, deleteBudget } from '../services/budgetService';
import { getBudgetStatus } from '../services/analyticsService';
import { getCurrentMonth, getCurrentYear, getMonthName } from '../utils/helpers';

export default function BudgetPage() {
  const { formatAmount } = useCurrency();
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['budgetStatus', month, year],
    queryFn: () => getBudgetStatus({ month, year })
  });

  const budgets = data?.data || [];

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['budgetStatus'] });
    queryClient.invalidateQueries({ queryKey: ['budgets'] });
  };

  const createMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      invalidateAll();
      setShowAddModal(false);
      toast.success('Budget created');
    },
    onError: (err) => toast.error(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateBudget(id, data),
    onSuccess: () => {
      invalidateAll();
      setEditingBudget(null);
      toast.success('Budget updated');
    },
    onError: (err) => toast.error(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      invalidateAll();
      setDeletingId(null);
      toast.success('Budget deleted');
    },
    onError: (err) => toast.error(err.message)
  });

  const getBarColor = (pct) => {
    if (pct > 100) return 'bg-red-500';
    if (pct > 80) return 'bg-red-400';
    if (pct > 60) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budget</h1>
          <p className="text-gray-500 text-sm">Track spending against your limits</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearPicker
            month={month}
            year={year}
            onChange={(m, y) => { setMonth(m); setYear(y); }}
          />
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Budget
          </Button>
        </div>
      </div>

      {/* Overall budget health */}
      {budgets.length > 0 && (
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="font-semibold text-gray-800">Overall Budget Health — {getMonthName(month)} {year}</h3>
              <p className="text-sm text-gray-500">
                {formatAmount(totalSpent)} spent of {formatAmount(totalLimit)} budgeted
              </p>
            </div>
            <span className={`text-2xl font-bold ${overallPercentage > 80 ? 'text-red-600' : 'text-green-600'}`}>
              {overallPercentage}%
            </span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(overallPercentage)} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </Card>
      )}

      {/* Budget Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : budgets.length === 0 ? (
        <Card>
          <EmptyState
            message="No budgets set for this month"
            description="Add a budget to start tracking your spending against limits."
            icon={Target}
            action={
              <Button onClick={() => setShowAddModal(true)} size="sm">
                <Plus size={16} /> Add Budget
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const pct = Math.min(b.percentage, 100);
            const isOver = b.percentage > 100;
            return (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{b.category}</h4>
                    {isOver && (
                      <Badge color="red" className="mt-1">
                        <AlertTriangle size={12} className="mr-1" /> Over Budget
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingBudget(b)}
                      className="p-1.5 text-gray-400 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingId(b._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Spent</span>
                  <span className="font-semibold text-gray-800">
                    {formatAmount(b.spent)} / {formatAmount(b.limit)}
                  </span>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${getBarColor(b.percentage)} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round(b.percentage)}% used</span>
                  <span className={b.remaining < 0 ? 'text-red-600 font-semibold' : ''}>
                    {b.remaining >= 0
                      ? `${formatAmount(b.remaining)} remaining`
                      : `${formatAmount(Math.abs(b.remaining))} over`
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Budget">
        <BudgetForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          month={month}
          year={year}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingBudget} onClose={() => setEditingBudget(null)} title="Edit Budget">
        {editingBudget && (
          <BudgetForm
            initialData={editingBudget}
            onSubmit={(data) => updateMutation.mutate({ id: editingBudget._id, data })}
            loading={updateMutation.isPending}
            month={month}
            year={year}
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
