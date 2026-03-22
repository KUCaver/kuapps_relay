import axios from 'axios';

// Ensure the backend URL matches the Spring Boot server port
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions
export const getPlants = async () => {
  const response = await apiClient.get('/api/plants');
  return response.data;
};

export const getPlantById = async (id: number) => {
  const response = await apiClient.get(`/api/plants/${id}`);
  return response.data;
};

export const getPlantLogs = async (id: number) => {
  const response = await apiClient.get(`/api/plants/${id}/logs`);
  return response.data;
};

export const createPlantLog = async (id: number, data: any) => {
  const response = await apiClient.post(`/api/plants/${id}/logs`, data);
  return response.data;
};

export const getLogById = async (id: number) => {
  const response = await apiClient.get(`/api/logs/${id}`);
  return response.data;
};
