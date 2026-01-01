// ===== src/services/deliveryService.ts =====
import api from './api';
import { ENDPOINTS } from './endpoints';

export interface Delivery {
  id: string;
  deliveryNumber: string;
  deliveryDate: string;
  chemicalStockId: string;
  chemicalName: string;
  quantity: number;
  unit: string;
  truckAssignments: TruckAssignment[];
  destination: string;
  status: 'Scheduled' | 'OnDelivery' | 'Completed' | 'Cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TruckAssignment {
  truckId: string;
  truckNumber: string;
  driver: string;
  assignmentDate: string;
  status: string;
}

export interface CreateDeliveryInput {
  deliveryDate: string;
  chemicalStockId: string;
  quantity: number;
  destination: string;
  truckIds: string[];
  notes: string;
}

export const deliveryService = {
  getAll: async (): Promise<Delivery[]> => {
    const response = await api.get(ENDPOINTS.DELIVERIES.LIST);
    return response.data;
  },

  getById: async (id: string): Promise<Delivery> => {
    const response = await api.get(ENDPOINTS.DELIVERIES.GET(id));
    return response.data;
  },

  create: async (data: CreateDeliveryInput): Promise<Delivery> => {
    const response = await api.post(ENDPOINTS.DELIVERIES.CREATE, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Delivery> => {
    const response = await api.patch(ENDPOINTS.DELIVERIES.UPDATE_STATUS(id), { status });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.DELIVERIES.DELETE(id));
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Delivery[]> => {
    const response = await api.get(ENDPOINTS.DELIVERIES.DATE_RANGE, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};