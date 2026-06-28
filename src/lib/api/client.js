import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl.replace(/\/$/, '')}/api`;

export const apiClient = axios.create({
  baseURL: normalizedApiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getApiError = (error) => {
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};
