import api from './api';

export const getBudgets = async (params = {}) => {
  const { data } = await api.get('/budgets', { params });
  return data;
};

export const getBudget = async (id) => {
  const { data } = await api.get(`/budgets/${id}`);
  return data;
};

export const createBudget = async (budget) => {
  const { data } = await api.post('/budgets', budget);
  return data;
};

export const updateBudget = async (id, budget) => {
  const { data } = await api.put(`/budgets/${id}`, budget);
  return data;
};

export const deleteBudget = async (id) => {
  const { data } = await api.delete(`/budgets/${id}`);
  return data;
};

export const deleteAllBudgets = async (params = {}) => {
  const { data } = await api.delete('/budgets', { params: { ...params, confirm: 'true' } });
  return data;
};
