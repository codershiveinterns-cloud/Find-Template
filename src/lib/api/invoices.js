import { apiClient } from './client';

export const getInvoices = async () => {
  const { data } = await apiClient.get('/invoices');
  return data;
};

export const createInvoice = async (payload) => {
  const { data } = await apiClient.post('/invoices', payload);
  return data;
};

export const updateInvoice = async (id, payload) => {
  const { data } = await apiClient.put(`/invoices/${id}`, payload);
  return data;
};

export const deleteInvoice = async (id) => {
  const { data } = await apiClient.delete(`/invoices/${id}`);
  return data;
};
