// ===== src/services/reportService.ts =====
import api from './api';
import { ENDPOINTS } from './endpoints';

export const reportService = {
  downloadChemicalsPDF: async (): Promise<void> => {
    try {
      const response = await api.get(ENDPOINTS.REPORTS.CHEMICALS_PDF, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      downloadFile(response.data, 'Laporan-Stok-Kimia.pdf', 'application/pdf');
    } catch (error) {
      console.error('Error downloading chemicals PDF:', error);
      throw error;
    }
  },

  downloadDeliveriesPDF: async (): Promise<void> => {
    try {
      const response = await api.get(ENDPOINTS.REPORTS.DELIVERIES_PDF, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      downloadFile(response.data, 'Laporan-Pengiriman.pdf', 'application/pdf');
    } catch (error) {
      console.error('Error downloading deliveries PDF:', error);
      throw error;
    }
  },

  downloadTrucksPDF: async (): Promise<void> => {
    try {
      const response = await api.get(ENDPOINTS.REPORTS.TRUCKS_PDF, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      downloadFile(response.data, 'Laporan-Status-Kendaraan.pdf', 'application/pdf');
    } catch (error) {
      console.error('Error downloading trucks PDF:', error);
      throw error;
    }
  },
};

const downloadFile = (data: Blob | ArrayBuffer, filename: string, mimeType: string): void => {
  // Ensure we have a proper Blob
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
};