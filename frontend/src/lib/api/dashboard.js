import { apiClient } from './client';

export const getOverview = async () => {
  const { data } = await apiClient.get('/dashboard/overview');
  return data;
};

export const getChartData = async () => {
  const { data } = await apiClient.get('/dashboard/chart-data');
  return data;
};

export const getCollection = async (resource) => {
  const { data } = await apiClient.get(`/${resource}`);
  return data;
};

export const submitInquiry = async (payload) => {
  const { data } = await apiClient.post('/inquiries', payload);
  return data;
};
