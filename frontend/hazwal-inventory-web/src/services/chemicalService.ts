// ===== src/services/chemicalService.ts =====
import api from './api';
import { ENDPOINTS } from './endpoints';

export interface Chemical {
  id: string;
  name: string;
  formula: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  minQuantity: number;
  supplier: string;
  category: string;
  lastRestockDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChemicalInput {
  name: string;
  formula: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  minQuantity: number;
  supplier: string;
  category: string;
}

export const chemicalService = {
  getAll: async (): Promise<Chemical[]> => {
    const response = await api.get(ENDPOINTS.CHEMICALS.LIST);
    return response.data;
  },

  getById: async (id: string): Promise<Chemical> => {
    const response = await api.get(ENDPOINTS.CHEMICALS.GET(id));
    return response.data;
  },

  create: async (data: CreateChemicalInput): Promise<Chemical> => {
    const response = await api.post(ENDPOINTS.CHEMICALS.CREATE, data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateChemicalInput>): Promise<Chemical> => {
    const response = await api.put(ENDPOINTS.CHEMICALS.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.CHEMICALS.DELETE(id));
  },

  getLowStock: async (): Promise<Chemical[]> => {
    const response = await api.get(ENDPOINTS.CHEMICALS.LOW_STOCK);
    return response.data;
  },
};