import axios from 'axios';
import type { Plant, PlantLog, PlantLogRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
  maxBodyLength: 10 * 1024 * 1024,
  maxContentLength: 10 * 1024 * 1024,
});

// Render 무료 플랜 콜드스타트 대비 자동 재시도 (최대 2회)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config.__retryCount >= 2) return Promise.reject(error);

    // 네트워크 에러 또는 타임아웃일 때만 재시도
    const isRetryable =
      !error.response || // 네트워크 에러 (서버 슬립 중)
      error.code === 'ECONNABORTED' || // 타임아웃
      error.response?.status >= 500; // 서버 에러

    if (!isRetryable) return Promise.reject(error);

    config.__retryCount = (config.__retryCount || 0) + 1;
    console.log(`[API] 재시도 ${config.__retryCount}/2: ${config.url}`);

    // 재시도 전 2초 대기 (서버 깨어나는 시간)
    await new Promise((r) => setTimeout(r, 2000));
    return apiClient(config);
  }
);

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
