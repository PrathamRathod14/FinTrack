import api from './api';

export const getTransactions = async (params = {}) => {
  const { data } = await api.get('/transactions', { params });
  return data;
};

export const getTransaction = async (id) => {
  const { data } = await api.get(`/transactions/${id}`);
  return data;
};

export const createTransaction = async (transaction) => {
  const { data } = await api.post('/transactions', transaction);
  return data;
};

export const updateTransaction = async (id, transaction) => {
  const { data } = await api.put(`/transactions/${id}`, transaction);
  return data;
};

export const deleteTransaction = async (id) => {
  const { data } = await api.delete(`/transactions/${id}`);
  return data;
};

export const deleteAllTransactions = async () => {
  const { data } = await api.delete('/transactions?confirm=true');
  return data;
};
