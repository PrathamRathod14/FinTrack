import api from './api';

export const getSummary = async (params) => {
  const { data } = await api.get('/analytics/summary', { params });
  return data;
};

export const getByCategory = async (params) => {
  const { data } = await api.get('/analytics/by-category', { params });
  return data;
};

export const getMonthlyTrend = async (params) => {
  const { data } = await api.get('/analytics/monthly-trend', { params });
  return data;
};

export const getDailyTrend = async (params) => {
  const { data } = await api.get('/analytics/daily-trend', { params });
  return data;
};

export const getBudgetStatus = async (params) => {
  const { data } = await api.get('/analytics/budget-status', { params });
  return data;
};
