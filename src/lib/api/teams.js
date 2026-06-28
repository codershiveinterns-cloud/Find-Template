import { apiClient } from './client';

export const getTeamMembers = async () => {
  const { data } = await apiClient.get('/teams');
  return data;
};

export const createTeamMember = async (payload) => {
  const { data } = await apiClient.post('/teams', payload);
  return data;
};

export const getTeamMember = async (id) => {
  const { data } = await apiClient.get(`/teams/${id}`);
  return data;
};

export const updateTeamMember = async (id, payload) => {
  const { data } = await apiClient.put(`/teams/${id}`, payload);
  return data;
};

export const deleteTeamMember = async (id) => {
  const { data } = await apiClient.delete(`/teams/${id}`);
  return data;
};
