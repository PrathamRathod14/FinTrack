import { MONTHS } from './constants';

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateInput(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

export function getMonthName(month) {
  return MONTHS[month - 1] || '';
}

export function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function downloadCSV(data, filename) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function transactionsToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Method', 'Notes'];
  const rows = transactions.map(t => [
    formatDate(t.date),
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.category,
    t.type,
    t.amount,
    t.paymentMethod,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
