import { apiClient } from './client';

export const getClients = async () => {
  const { data } = await apiClient.get('/clients');
  return data;
};

export const createClient = async (payload) => {
  const { data } = await apiClient.post('/clients', payload);
  return data;
};

export const getClient = async (id) => {
  const { data } = await apiClient.get(`/clients/${id}`);
  return data;
};

export const updateClient = async (id, payload) => {
  const { data } = await apiClient.put(`/clients/${id}`, payload);
  return data;
};

export const deleteClient = async (id) => {
  const { data } = await apiClient.delete(`/clients/${id}`);
  return data;
};
