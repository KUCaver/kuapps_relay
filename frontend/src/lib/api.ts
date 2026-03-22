import axios from 'axios';
import type { Plant, PlantLog, PlantLogRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  maxBodyLength: 10 * 1024 * 1024,
  maxContentLength: 10 * 1024 * 1024,
});

// ===== Plant API =====
export const getPlants = async (): Promise<Plant[]> => {
  const response = await apiClient.get('/api/plants');
  return response.data;
};

export const getPlantById = async (id: number): Promise<Plant> => {
  const response = await apiClient.get(`/api/plants/${id}`);
  return response.data;
};

export const getPlantLogs = async (id: number): Promise<PlantLog[]> => {
  const response = await apiClient.get(`/api/plants/${id}/logs`);
  return response.data;
};

export const createPlantLog = async (id: number, data: PlantLogRequest): Promise<PlantLog> => {
  const response = await apiClient.post(`/api/plants/${id}/logs`, data);
  return response.data;
};

export const getLogById = async (id: number): Promise<PlantLog> => {
  const response = await apiClient.get(`/api/logs/${id}`);
  return response.data;
};

// ===== Admin API =====
export const createPlant = async (data: Partial<Plant>): Promise<Plant> => {
  const response = await apiClient.post('/api/admin/plants', data);
  return response.data;
};

export const updatePlant = async (id: number, data: Partial<Plant>): Promise<Plant> => {
  const response = await apiClient.put(`/api/admin/plants/${id}`, data);
  return response.data;
};

export const deletePlant = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/admin/plants/${id}`);
};

export const changePlantStatus = async (id: number, status: string): Promise<Plant> => {
  const response = await apiClient.patch(`/api/admin/plants/${id}/status`, { status });
  return response.data;
};

export const deleteLog = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/admin/logs/${id}`);
};

export const validateLog = async (id: number, status: string): Promise<PlantLog> => {
  const response = await apiClient.patch(`/api/admin/logs/${id}/validation`, { status });
  return response.data;
};
