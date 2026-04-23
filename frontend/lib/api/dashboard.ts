import api from './client';

export interface SensorSummary {
  sensor_id: number;
  sensor_type: string;
  device_name: string;
  last_value: any;
  updated_at: string;
  error?: string;
}

export interface AdafruitData {
  value: string;
  created_at: string;
  id: string;
}

export const dashboardService = {
  getSummary: async (homeId: number): Promise<SensorSummary[]> => {
    const response = await api.get(`/dashboard/summary?home_id=${homeId}`);
    return response.data;
  },
  
  getHistory: async (sensorId: number, date: string): Promise<AdafruitData[]> => {
    const response = await api.get(`/dashboard/sensors/history?sensor_id=${sensorId}&date=${date}`);
    return response.data;
  }
};
