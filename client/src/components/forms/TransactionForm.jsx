import { useState } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import Button from '../ui/Button';

const defaultForm = {
  type: 'expense',
  amount: '',
  category: 'Food',
  description: '',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'Cash',
  notes: ''
};

export default function TransactionForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0],
        amount: String(initialData.amount)
      };
    }
    return { ...defaultForm };
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Amount must be greater than 0';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      amount: parseFloat(form.amount)
    });
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              form.type === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => handleChange('type', 'expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              form.type === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => handleChange('type', 'income')}
          >
            Income
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={form.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          className={`input-field ${errors.amount ? 'border-red-500 ring-red-200' : ''}`}
          placeholder="0.00"
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="select-field"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`input-field ${errors.description ? 'border-red-500 ring-red-200' : ''}`}
          placeholder="e.g., Grocery shopping"
          maxLength={200}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={`input-field ${errors.date ? 'border-red-500 ring-red-200' : ''}`}
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <select
          value={form.paymentMethod}
          onChange={(e) => handleChange('paymentMethod', e.target.value)}
          className="select-field"
        >
          {PAYMENT_METHODS.map(pm => (
            <option key={pm} value={pm}>{pm}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="input-field"
          rows={3}
          placeholder="Any additional notes..."
          maxLength={500}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
}
