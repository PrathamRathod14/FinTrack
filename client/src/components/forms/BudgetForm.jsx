import { useState } from 'react';
import { CATEGORIES } from '../../utils/constants';
import Button from '../ui/Button';

export default function BudgetForm({ initialData, onSubmit, loading, month, year }) {
  const [form, setForm] = useState({
    category: initialData?.category || CATEGORIES[0],
    monthlyLimit: initialData?.monthlyLimit ? String(initialData.monthlyLimit) : '',
    month: initialData?.month || month,
    year: initialData?.year || year
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.monthlyLimit || Number(form.monthlyLimit) < 1) errs.monthlyLimit = 'Limit must be at least 1';
    if (!form.category) errs.category = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      monthlyLimit: parseFloat(form.monthlyLimit),
      month: parseInt(form.month),
      year: parseInt(form.year)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          value={form.category}
          onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
          className="select-field"
          disabled={!!initialData}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit *</label>
        <input
          type="number"
          step="1"
          min="1"
          value={form.monthlyLimit}
          onChange={(e) => {
            setForm(prev => ({ ...prev, monthlyLimit: e.target.value }));
            if (errors.monthlyLimit) setErrors(prev => ({ ...prev, monthlyLimit: undefined }));
          }}
          className={`input-field ${errors.monthlyLimit ? 'border-red-500' : ''}`}
          placeholder="e.g., 300"
        />
        {errors.monthlyLimit && <p className="text-red-500 text-xs mt-1">{errors.monthlyLimit}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Budget' : 'Create Budget'}
        </Button>
      </div>
    </form>
  );
}
