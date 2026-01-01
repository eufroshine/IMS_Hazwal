// ===== src/services/truckService.ts =====
import api from './api';
import { ENDPOINTS } from './endpoints';

export interface Truck {
  id: string;
  truckNumber: string;
  capacity: number;
  capacityUnit: string;
  driver: string;
  driverPhone: string;
  status: 'Available' | 'InUse' | 'Maintenance';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTruckInput {
  truckNumber: string;
  capacity: number;
  capacityUnit: string;
  driver: string;
  driverPhone: string;
}

export const truckService = {
  getAll: async (): Promise<Truck[]> => {
    const response = await api.get(ENDPOINTS.TRUCKS.LIST);
    return response.data;
  },

  getById: async (id: string): Promise<Truck> => {
    const response = await api.get(ENDPOINTS.TRUCKS.GET(id));
    return response.data;
  },

  create: async (data: CreateTruckInput): Promise<Truck> => {
    const response = await api.post(ENDPOINTS.TRUCKS.CREATE, data);
    return response.data;
  },

  update: async (id: string, data: CreateTruckInput): Promise<Truck> => {
    const response = await api.put(ENDPOINTS.TRUCKS.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.TRUCKS.DELETE(id));
  },

  getAvailable: async (): Promise<Truck[]> => {
    const response = await api.get(ENDPOINTS.TRUCKS.AVAILABLE);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Truck> => {
    const response = await api.patch(ENDPOINTS.TRUCKS.UPDATE_STATUS(id), { status });
    return response.data;
  },
};