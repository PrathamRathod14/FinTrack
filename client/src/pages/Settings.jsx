import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Trash2, AlertTriangle, Globe, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useCurrency } from '../context/CurrencyContext';
import { deleteAllTransactions, getTransactions } from '../services/transactionService';
import { deleteAllBudgets } from '../services/budgetService';
import { CURRENCIES } from '../utils/constants';
import {
  transactionsToCSV,
  downloadCSV,
  downloadJSON,
  getCurrentMonth,
  getCurrentYear,
  getMonthName
} from '../utils/helpers';

export default function Settings() {
  const { currency, currencySymbol, updateCurrency } = useCurrency();
  const queryClient = useQueryClient();

  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [showResetBudgets, setShowResetBudgets] = useState(false);
  const [exporting, setExporting] = useState(false);

  const currencyMutation = useMutation({
    mutationFn: ({ code, symbol }) => updateCurrency(code, symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Currency updated');
    },
    onError: (err) => toast.error(err.message)
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries();
      setShowDeleteAll(false);
      toast.success('All transactions deleted');
    },
    onError: (err) => toast.error(err.message)
  });

  const resetBudgetsMutation = useMutation({
    mutationFn: () => deleteAllBudgets({ month: getCurrentMonth(), year: getCurrentYear() }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setShowResetBudgets(false);
      toast.success('Budgets reset for current month');
    },
    onError: (err) => toast.error(err.message)
  });

  const handleCurrencyChange = (code) => {
    const cur = CURRENCIES.find(c => c.code === code);
    if (cur) {
      currencyMutation.mutate({ code: cur.code, symbol: cur.symbol });
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const result = await getTransactions({ limit: 100000, page: 1 });
      const csv = transactionsToCSV(result.data);
      const month = getMonthName(getCurrentMonth()).toLowerCase().slice(0, 3);
      downloadCSV(csv, `fintrack-transactions-${month}-${getCurrentYear()}.csv`);
      toast.success('CSV exported');
    } catch {
      toast.error('Failed to export');
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const result = await getTransactions({ limit: 100000, page: 1 });
      downloadJSON(result.data, `fintrack-transactions-${getCurrentYear()}.json`);
      toast.success('JSON exported');
    } catch {
      toast.error('Failed to export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your app preferences</p>
      </div>

      {/* Currency Settings */}
      <Card title="Currency" action={<Globe size={18} className="text-gray-400" />}>
        <p className="text-sm text-gray-500 mb-4">
          Choose your preferred currency. This will update all amounts across the app.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CURRENCIES.map((cur) => (
            <button
              key={cur.code}
              onClick={() => handleCurrencyChange(cur.code)}
              disabled={currencyMutation.isPending}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                currency === cur.code
                  ? 'border-navy-900 bg-navy-50 text-navy-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <span className="text-xl block mb-1">{cur.symbol}</span>
              <span className="text-xs font-medium">{cur.code}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Currently using: <strong>{currencySymbol} {currency}</strong>
        </p>
      </Card>

      {/* Export Data */}
      <Card title="Export Data" action={<Download size={18} className="text-gray-400" />}>
        <p className="text-sm text-gray-500 mb-4">
          Download all your transactions in your preferred format.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExportCSV} loading={exporting}>
            <Download size={16} />
            Export as CSV
          </Button>
          <Button variant="secondary" onClick={handleExportJSON} loading={exporting}>
            <Download size={16} />
            Export as JSON
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-red-500" />
          <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="font-medium text-gray-800">Delete All Transactions</p>
              <p className="text-xs text-gray-500">Permanently remove all transactions from the database.</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteAll(true)}>
              <Trash2 size={14} />
              Delete All
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="font-medium text-gray-800">Reset Current Month Budgets</p>
              <p className="text-xs text-gray-500">Remove all budgets for {getMonthName(getCurrentMonth())} {getCurrentYear()}.</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowResetBudgets(true)}>
              <Trash2 size={14} />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card title="About" action={<Info size={18} className="text-gray-400" />}>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>FinTrack</strong> — Personal Expense Tracker</p>
          <p>Version: 1.0.0</p>
          <p>Tech Stack: React, Vite, Tailwind CSS, Node.js, Express, MongoDB</p>
          <p>Charts: Recharts</p>
          <p>State Management: React Query (TanStack Query)</p>
        </div>
      </Card>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteAll}
        onClose={() => setShowDeleteAll(false)}
        onConfirm={() => deleteAllMutation.mutate()}
        title="Delete All Transactions"
        message="This will permanently delete ALL transactions from your database. Are you absolutely sure?"
        loading={deleteAllMutation.isPending}
      />
      <ConfirmDialog
        isOpen={showResetBudgets}
        onClose={() => setShowResetBudgets(false)}
        onConfirm={() => resetBudgetsMutation.mutate()}
        title="Reset Budgets"
        message={`This will delete all budgets for ${getMonthName(getCurrentMonth())} ${getCurrentYear()}. Are you sure?`}
        loading={resetBudgetsMutation.isPending}
      />
    </div>
  );
}
