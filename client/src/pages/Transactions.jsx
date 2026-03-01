import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Download, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { CategoryBadge } from '../components/ui/Badge';
import { SkeletonTable } from '../components/ui/SkeletonLoader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import MonthYearPicker from '../components/ui/MonthYearPicker';
import TransactionForm from '../components/forms/TransactionForm';
import { useCurrency } from '../context/CurrencyContext';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../services/transactionService';
import { CATEGORIES } from '../utils/constants';
import {
  formatDate,
  getCurrentMonth,
  getCurrentYear,
  transactionsToCSV,
  downloadCSV,
  getMonthName
} from '../utils/helpers';

export default function Transactions() {
  const { formatAmount } = useCurrency();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    month: getCurrentMonth(),
    year: getCurrentYear()
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const queryParams = {
    page,
    limit: 20,
    ...(filters.search && { search: filters.search }),
    ...(filters.type && { type: filters.type }),
    ...(filters.category && { category: filters.category }),
    month: filters.month,
    year: filters.year
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['transactions', queryParams],
    queryFn: () => getTransactions(queryParams),
    keepPreviousData: true
  });

  const transactions = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      setShowAddModal(false);
      toast.success('Transaction added successfully');
    },
    onError: (err) => toast.error(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      setEditingTransaction(null);
      toast.success('Transaction updated successfully');
    },
    onError: (err) => toast.error(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      setDeletingId(null);
      toast.success('Transaction deleted');
    },
    onError: (err) => toast.error(err.message)
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleExportCSV = async () => {
    try {
      const allData = await getTransactions({
        ...queryParams,
        limit: 10000,
        page: 1
      });
      const csv = transactionsToCSV(allData.data);
      const monthName = getMonthName(filters.month).toLowerCase().slice(0, 3);
      downloadCSV(csv, `fintrack-transactions-${monthName}-${filters.year}.csv`);
      toast.success('CSV downloaded');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const showingFrom = transactions.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const showingTo = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-500 text-sm">Manage your income and expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <Download size={16} />
            Export CSV
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="select-field"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="select-field"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="sm:col-span-2">
            <MonthYearPicker
              month={filters.month}
              year={filters.year}
              onChange={(m, y) => {
                setFilters(prev => ({ ...prev, month: m, year: y }));
                setPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <SkeletonTable rows={8} cols={6} />
        ) : isError ? (
          <ErrorState message={error?.message} onRetry={refetch} />
        ) : transactions.length === 0 ? (
          <EmptyState
            message="No transactions found"
            description="Try adjusting your filters or add a new transaction"
            action={
              <Button onClick={() => setShowAddModal(true)} size="sm">
                <Plus size={16} /> Add Transaction
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Payment</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm font-medium text-gray-800">{t.description}</p>
                        {t.notes && (
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{t.notes}</p>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <CategoryBadge category={t.category} />
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{t.paymentMethod}</td>
                      <td className={`px-6 py-3 text-sm font-semibold text-right whitespace-nowrap ${
                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingTransaction(t)}
                            className="p-1.5 text-gray-400 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingId(t._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {showingFrom}–{showingTo} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 px-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaction"
      >
        {editingTransaction && (
          <TransactionForm
            initialData={editingTransaction}
            onSubmit={(data) => updateMutation.mutate({ id: editingTransaction._id, data })}
            loading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
