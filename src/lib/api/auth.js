import { apiClient } from './client';

export const signupUser = async (payload) => {
  const { data } = await apiClient.post('/auth/signup', payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
};

export const requestPasswordResetOtp = async (payload) => {
  const { data } = await apiClient.post('/auth/forgot-password/request-otp', payload);
  return data;
};

export const resetPasswordWithOtp = async (payload) => {
  const { data } = await apiClient.post('/auth/forgot-password/reset', payload);
  return data;
};

export const logoutUser = async () => {
  const { data } = await apiClient.post('/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};
